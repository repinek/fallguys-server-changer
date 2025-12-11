// Based on code from Fall Guys Frida Mod Menu (Open Source): https://github.com/repinek/fallguys-frida-modmenu

// TODO: hook telemetry (later)

// Tested on: 0.9.10 (2 February 2021), ...
// Should work: unknown - 0.9.10 - unknown
// Not working on: unknown

// In this script version:
// Gateway, Analytics and Login is WebSocket

import "frida-il2cpp-bridge";

// Change the variables here!
const Config = {
    CUSTOM_LOGIN_URL: "login.fallguys.oncatapult.com",
    CUSTOM_LOGIN_PORT: 443,
    IS_LOGIN_SECURE: true, // false: ws://, true: wss://

    CUSTOM_GATEWAY_URL: "gateway.fallguys.oncatapult.com",
    CUSTOM_GATEWAY_PORT: 443,
    IS_GATEWAY_SECURE: true,

    CUSTOM_ANALYTICS_URL: "analytics-gateway.fallguys.oncatapult.com",
    CUSTOM_ANALYTICS_PORT: 443,
    IS_ANALYTICS_SECURE: true
} as const;

function main(): void {
    console.log(
        `Il2Cpp Loaded!\nGame Version: ${Il2Cpp.application.version}\nUnity Version: ${Il2Cpp.unityVersion}\nProccess name: ${Il2Cpp.application.identifier}`
    );

    // === Assemblies ===
    const CatapultClientSdk = Il2Cpp.domain.assembly("Catapult.ClientSdk").image;

    // === Classes and Methods ===
    const WebSocketNetworkHost = CatapultClientSdk.class("Catapult.Services.WebSocketNetworkHost");
    const WebSocketNetworkHostCtor = WebSocketNetworkHost.method<void>(".ctor", 3);

    // === Hooks ===
    //@ts-ignore
    WebSocketNetworkHostCtor.implementation = function (host: Il2Cpp.String, port: number, isSecure: boolean): void {
        console.log("WebSocketNetworkHostCtor::.ctor called with args", host, port, isSecure);
        // Login spoof
        if (host.content == "login.fallguys.oncatapult.com") {
            host = Il2Cpp.string(Config.CUSTOM_LOGIN_URL);
            port = Config.CUSTOM_LOGIN_PORT;
            isSecure = Config.IS_LOGIN_SECURE;

            console.log("Spoofed Login server");
        }

        // Gateway spoof
        if (host.content == "gateway.fallguys.oncatapult.com") {
            host = Il2Cpp.string(Config.CUSTOM_GATEWAY_URL);
            port = Config.CUSTOM_GATEWAY_PORT;
            isSecure = Config.IS_GATEWAY_SECURE;

            console.log("Spoofed Gateway server");
        }

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
