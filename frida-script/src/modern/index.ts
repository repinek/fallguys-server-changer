// Based on code from Fall Guys Frida Mod Menu (Open Source): https://github.com/repinek/fallguys-frida-modmenu

// TODO: hook telemetry (later)
// TODO: Epic Games error

// Tested on: 10.1.0, 10.2.0, 10.3.0, 10.4.0, 10.8.1, 21.0.0 - 21.1.1
// Should work: 10.1.0 - latest / Any build that uses "Mediatonic.Catapult.ClientSdk.Runtime" with login as HTTP
// Not working on: <=10.0.0 / Any build that uses "Catapult.ClientSdk" / Any build that uses "Mediatonic.Catapult.ClientSdk.Runtime" with login as WebSocket

// In this script version:
// Gateway and Analytics is WebSocket
// Login is HTTP

import "frida-il2cpp-bridge";

// Change the variables here!
const Config = {
    CUSTOM_LOGIN_URL: "https://login.fallguys.oncatapult.com/api/v1",
    CUSTOM_LOGIN_PORT: -1,

    CUSTOM_GATEWAY_URL: "gateway.fallguys.oncatapult.com",
    CUSTOM_GATEWAY_PORT: 443,
    IS_GATEWAY_SECURE: true, // false: ws://, true: wss://

    CUSTOM_ANALYTICS_URL: "analytics-gateway.fallguys.oncatapult.com",
    CUSTOM_ANALYTICS_PORT: 443,
    IS_ANALYTICS_SECURE: true
} as const;

function main(): void {
    console.log(
        `Il2Cpp Loaded!\nGame Version: ${Il2Cpp.application.version}\nUnity Version: ${Il2Cpp.unityVersion}\nProccess name: ${Il2Cpp.application.identifier}`
    );

    // === Assemblies ===
    let CatapultClientSDk = Il2Cpp.domain.tryAssembly("Mediatonic.Catapult.ClientSdk.Runtime");

    if (!CatapultClientSDk) {
        throw new Error("FATAL! Mediatonic.Catapult.ClientSdk.Runtime assembly not found!\nThe game version is unsupported, did you run right script?");
    }

    const CatapultClientSDkImage = CatapultClientSDk.image;

    const AssemblyCSharp = Il2Cpp.domain.assembly("Assembly-CSharp").image;
    const MTFGClient = Il2Cpp.domain.assembly("MT.FGClient").image;

    // === Classes and Methods ===
    const EOSManagerFG = AssemblyCSharp.class("EOSManagerFG");
    const CatapultServicesManager = MTFGClient.class("FGClient.CatapultServices.CatapultServicesManager");

    const HttpNetworkHost = CatapultClientSDkImage.tryClass("Catapult.Network.Connections.Config.HttpNetworkHost");
    if (!HttpNetworkHost) {
        throw new Error(
            "FATAL! Catapult.Network.Connections.Config.HttpNetworkHost class not found!\nThe game version is unsupported, did you run right script?"
        );
    }

    const WebSocketNetworkHost = CatapultClientSDkImage.class("Catapult.Network.Connections.Config.WebSocketNetworkHost");

    const OnCheckToTriggerMissingFilesPopup = EOSManagerFG.tryMethod("OnCheckToTriggerMissingFilesPopup", 1);
    const BuildCatapultConfig = CatapultServicesManager.method<Il2Cpp.Object>("BuildCatapultConfig");
    const WebSocketNetworkHostCtor = WebSocketNetworkHost.method<void>(".ctor", 3);

    // === Hooks ===

    // For some reason http .ctor not hooked for me, idk...
    // //@ts-ignore
    // HttpNetworkHostCtor.implementation = function (host: Il2Cpp.String, port: number): void {
    //     console.log("HttpNetworkHost::.ctor called with args", host, port);
    //     return this.method<void>(".ctor", 2).invoke(host, port);
    // }

    /**
     * Triggers a popup with Missing Files. <=10.8 (or more) patch
     * They removed it in newest versions
     *
     * bool flag = Environment.GetEnvironmentVariable("EOS_SESSION_GUID") != null;
     * if (!flag) popup.show(...);
     */
    if (OnCheckToTriggerMissingFilesPopup) {
        OnCheckToTriggerMissingFilesPopup.implementation = function (event): void {
            console.log("OnCheckToTriggerMissingFilesPopup called");
            return;
        };
    }

    /** You can also change other variables here */
    BuildCatapultConfig.implementation = function (): Il2Cpp.Object {
        console.log("BuildCatapultConfig called");
        const catapultConfig = this.method<Il2Cpp.Object>("BuildCatapultConfig").invoke(); // <--- OnLeave

        const LoginServerHost = HttpNetworkHost.alloc();
        const GatewayServerHost = WebSocketNetworkHost.alloc();

        LoginServerHost.method(".ctor").invoke(Il2Cpp.string(Config.CUSTOM_LOGIN_URL), Config.CUSTOM_LOGIN_PORT);
        GatewayServerHost.method(".ctor").invoke(Il2Cpp.string(Config.CUSTOM_GATEWAY_URL), Config.CUSTOM_GATEWAY_PORT, Config.IS_GATEWAY_SECURE);

        catapultConfig.field("LoginServerHost").value = LoginServerHost;
        catapultConfig.field("GatewayServerHost").value = GatewayServerHost;

        console.log("Spoofed Gateway and Login server");
        return catapultConfig;
    };

    //@ts-ignore
    WebSocketNetworkHostCtor.implementation = function (host: Il2Cpp.String, port: number, isSecure: boolean): void {
        console.log("WebSocketNetworkHostCtor::.ctor called with args", host, port, isSecure);
        // Analytics spoof
        if (host.content == "analytics-gateway.fallguys.oncatapult.com") {
            host = Il2Cpp.string(Config.CUSTOM_ANALYTICS_URL);
            port = Config.CUSTOM_ANALYTICS_PORT;
            isSecure = Config.IS_ANALYTICS_SECURE;

            console.log("Spoofed Analytics server");
        }

        return this.method<void>(".ctor", 3).invoke(host, port, isSecure);
    };
}

Il2Cpp.perform(main);
