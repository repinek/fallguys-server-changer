// Based on code from Fall Guys Frida Mod Menu (Open Source): https://github.com/repinek/fallguys-frida-modmenu

// TODO: hook telemetry (later)

// Tested on: 9.0.0, 9.0.4
// Should work: unknown - 9.0.4
// Not working on: unknown

// In this script version:
// Gateway, Analytics and Login is WebSocket

import "frida-il2cpp-bridge"
import { webSocketHook } from "../../shared-logic/websocket-hook"
import { Logger } from "../../utils/logger"

function main(): void {
    console.log(
        `Il2Cpp Loaded!\nGame Version: ${Il2Cpp.application.version}\nUnity Version: ${Il2Cpp.unityVersion}\nProccess name: ${Il2Cpp.application.identifier}`
    )

    // === Assemblies ===
    const CatapultClientSdk = Il2Cpp.domain.assembly("Catapult.ClientSdk").image
    const AssemblyCSharp = Il2Cpp.domain.assembly("Assembly-CSharp").image

    // === Classes and Methods ===
    const EOSManagerFG = AssemblyCSharp.class("EOSManagerFG")
    const WebSocketNetworkHost = CatapultClientSdk.class("Catapult.Services.WebSocketNetworkHost")
    const TriggerMissingFilesPopup = EOSManagerFG.method("TriggerMissingFilesPopup")
    const WebSocketNetworkHostCtor = WebSocketNetworkHost.method<void>(".ctor", 3)

    // === Hooks ===
    //@ts-ignore
    WebSocketNetworkHostCtor.implementation = webSocketHook
    TriggerMissingFilesPopup.implementation = function () {
        Logger.hook("TriggerMissingFilesPopup called")
        return
    }
}

Il2Cpp.perform(main)
