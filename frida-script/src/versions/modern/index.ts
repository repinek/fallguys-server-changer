// Based on code from Fall Guys Frida Mod Menu (Open Source): https://github.com/repinek/fallguys-frida-modmenu

// TODO: hook telemetry (later)
// TODO: Epic Games error

// Tested on: 10.1.0, 10.2.0, 10.3.0, 10.4.0, 10.8.1, 21.0.0 - 21.1.1
// Should work: 10.1.0 - latest / Any build that uses "Mediatonic.Catapult.ClientSdk.Runtime" with login as HTTP
// Not working on: <10.1.0 / Any build that uses "Catapult.ClientSdk" / Any build that uses "Mediatonic.Catapult.ClientSdk.Runtime" with login as WebSocket

// In this script version:
// Gateway and Analytics is WebSocket
// Login is HTTP

import "frida-il2cpp-bridge"
import { CONFIG } from "../../data/config"
import { webSocketHook } from "../../shared-logic/websocket-hook"
import { Logger } from "../../utils/logger"

function main(): void {
    // === Assemblies ===
    const CatapultClientSDk = Il2Cpp.domain.tryAssembly("Mediatonic.Catapult.ClientSdk.Runtime")
    if (!CatapultClientSDk) {
        throw new Error("FATAL! Mediatonic.Catapult.ClientSdk.Runtime assembly not found!\nThe game version is unsupported, did you run right script?")
    }
    const CatapultClientSDkImage = CatapultClientSDk.image

    const AssemblyCSharp = Il2Cpp.domain.assembly("Assembly-CSharp").image
    const MTFGClient = Il2Cpp.domain.assembly("MT.FGClient").image

    // === Classes and Methods ===
    const EOSManagerFG = AssemblyCSharp.class("EOSManagerFG")
    const CatapultServicesManager = MTFGClient.class("FGClient.CatapultServices.CatapultServicesManager")

    const HttpNetworkHost = CatapultClientSDkImage.tryClass("Catapult.Network.Connections.Config.HttpNetworkHost")
    if (!HttpNetworkHost) {
        throw new Error(
            "FATAL! Catapult.Network.Connections.Config.HttpNetworkHost class not found!\nThe game version is unsupported, did you run right script?"
        )
    }
    const WebSocketNetworkHost = CatapultClientSDkImage.class("Catapult.Network.Connections.Config.WebSocketNetworkHost")

    const OnCheckToTriggerMissingFilesPopup = EOSManagerFG.tryMethod("OnCheckToTriggerMissingFilesPopup", 1)
    const BuildCatapultConfig = CatapultServicesManager.method<Il2Cpp.Object>("BuildCatapultConfig")
    const WebSocketNetworkHostCtor = WebSocketNetworkHost.method<void>(".ctor", 3)

    // === Hooks ===
    //@ts-ignore
    WebSocketNetworkHostCtor.implementation = webSocketHook

    /**
     * Triggers a popup with Missing Files. <=11.0 patch
     *
     * How it's works:
     * bool flag = Environment.GetEnvironmentVariable("EOS_SESSION_GUID") != null;
     * if (!flag) popup.show(...);
     */
    if (OnCheckToTriggerMissingFilesPopup) {
        OnCheckToTriggerMissingFilesPopup.implementation = function (): void {
            Logger.hook("OnCheckToTriggerMissingFilesPopup called")
            return
        }
    }

    /** You can also change other variables here */
    BuildCatapultConfig.implementation = function (): Il2Cpp.Object {
        Logger.hook("BuildCatapultConfig called")
        const catapultConfig = this.method<Il2Cpp.Object>("BuildCatapultConfig").invoke() // <--- OnLeave

        const LoginServerHost = HttpNetworkHost.alloc()
        const GatewayServerHost = WebSocketNetworkHost.alloc()

        LoginServerHost.method(".ctor").invoke(Il2Cpp.string(CONFIG.LOGIN_HTTP.CUSTOM_LOGIN_URL), CONFIG.LOGIN_HTTP.CUSTOM_LOGIN_PORT)
        GatewayServerHost.method(".ctor").invoke(Il2Cpp.string(CONFIG.CUSTOM_GATEWAY_URL), CONFIG.CUSTOM_GATEWAY_PORT, CONFIG.IS_GATEWAY_SECURE)

        catapultConfig.field("LoginServerHost").value = LoginServerHost
        catapultConfig.field("GatewayServerHost").value = GatewayServerHost

        return catapultConfig
    }
}

Il2Cpp.perform(main)
