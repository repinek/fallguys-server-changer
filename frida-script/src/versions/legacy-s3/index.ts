// Based on code from Fall Guys Frida Mod Menu (Open Source): https://github.com/repinek/fallguys-frida-modmenu

// TODO: hook telemetry (later)

// Tested on: 0.9.10 (2 February 2021), ...
// Should work: unknown - 0.9.10 - unknown
// Not working on: unknown

// In this script version:
// Gateway, Analytics and Login is WebSocket

import "frida-il2cpp-bridge"
import { webSocketHook } from "../../shared-logic/websocket-hook"

function main(): void {
    console.log(
        `Il2Cpp Loaded!\nGame Version: ${Il2Cpp.application.version}\nUnity Version: ${Il2Cpp.unityVersion}\nProccess name: ${Il2Cpp.application.identifier}`
    )

    // === Assemblies ===
    const CatapultClientSdk = Il2Cpp.domain.assembly("Catapult.ClientSdk").image

    // === Classes and Methods ===
    const WebSocketNetworkHost = CatapultClientSdk.class("Catapult.Services.WebSocketNetworkHost")
    const WebSocketNetworkHostCtor = WebSocketNetworkHost.method<void>(".ctor", 3)

    // === Hooks ===
    //@ts-ignore
    WebSocketNetworkHostCtor.implementation = webSocketHook
}

Il2Cpp.perform(main)
