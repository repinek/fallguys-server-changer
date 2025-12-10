import "frida-il2cpp-bridge";

// TODO: mention mod menu 

// Tested on builds: TODO

const Config = {  
    CUSTOM_LOGIN_URL: "https://login.fallguys.oncatapult.com/api/v1",
    CUSTOM_LOGIN_PORT: -1,
    CUSTOM_GATEWAY_URL: "gateway.fallguys.oncatapult.com",
    CUSTOM_GATEWAY_PORT: 443,
    IS_GATEWAY_SECURE: true,
    CUSTOM_ANALYTICS_URL: "analytics-gateway.fallguys.oncatapult.com",
    CUSTOM_ANALYTICS_PORT: 443,
    IS_ANALYTICS_SECURE: true,
} as const;

// enum version {
//     OLD
// }

function main(): void {
    console.info("Il2Cpp Loaded!");

    // Old versions support
    let CatapultClientSDk = Il2Cpp.domain.tryAssembly("Catapult.ClientSdk");

    if (!CatapultClientSDk) {
        console.warn("Catapult.ClientSdk not found, trying Mediatonic.Catapult.ClientSdk.Runtime...");
        // new version support
        CatapultClientSDk = Il2Cpp.domain.tryAssembly("Mediatonic.Catapult.ClientSdk.Runtime");
    }

    if (!CatapultClientSDk) {
        console.error("FATAL ERROR!\nCatapult SDK assembly not found!\nThe game version might be unsupported\nPlease update the script with the correct assembly name")
        return;
    }

    const CatapultClientSDkImage = CatapultClientSDk.image;

    // TODO: il2cpp: couldn't find class Catapult.Network.Connections.Config.HttpNetworkHost in assembly Catapult.ClientSdk.dll
    // === Classes and Methods ===
    const HttpNetworkHost = CatapultClientSDkImage.class("Catapult.Network.Connections.Config.HttpNetworkHost");
    const WebSocketNetworkHost = CatapultClientSDkImage.class("Catapult.Network.Connections.Config.WebSocketNetworkHost");

    const HttpNetworkHostCtor = HttpNetworkHost.method<void>(".ctor", 2);
    const WebSocketNetworkHostCtor = WebSocketNetworkHost.method<void>(".ctor", 3);

    // === Hooks ===

    //@ts-ignore
    HttpNetworkHostCtor.implementation = function (host: Il2Cpp.String, port: number): void {
        console.info("HttpNetworkHost::.ctor called with args", host, port);
    }

    //@ts-ignore
    WebSocketNetworkHostCtor.implementation = function (host: Il2Cpp.String, port: number, isSecure: boolean): void {
        console.info("WebSocketNetworkHostCtor::.ctor called with args", host, port, isSecure);
    }
}

Il2Cpp.perform(main);