import { CONFIG } from "../data/config"
import { Logger } from "../utils/logger"

export function webSocketHook(this: Il2Cpp.Object, host: Il2Cpp.String, port: number, isSecure: boolean): void {
    Logger.hook("WebSocketNetworkHostCtor::.ctor called with args", host, port, isSecure)

    // Login WS spoof
    if (host.content === "login.fallguys.oncatapult.com") {
        host = Il2Cpp.string(CONFIG.LOGIN_WS.CUSTOM_LOGIN_URL)
        port = CONFIG.LOGIN_WS.CUSTOM_LOGIN_PORT
        isSecure = CONFIG.LOGIN_WS.IS_LOGIN_SECURE

        Logger.infoGreen(`Spoofed Login server to: ${host}:${port}/ws`)
    }

    // Gateway spoof
    else if (host.content === "gateway.fallguys.oncatapult.com") {
        host = Il2Cpp.string(CONFIG.CUSTOM_GATEWAY_URL)
        port = CONFIG.CUSTOM_GATEWAY_PORT
        isSecure = CONFIG.IS_GATEWAY_SECURE

        Logger.infoGreen(`Spoofed Gateway server to: ${host}:${port}/ws`)
    }

    // Analytics spoof
    else if (host.content === "analytics-gateway.fallguys.oncatapult.com") {
        host = Il2Cpp.string(CONFIG.CUSTOM_ANALYTICS_URL)
        port = CONFIG.CUSTOM_ANALYTICS_PORT
        isSecure = CONFIG.IS_ANALYTICS_SECURE

        Logger.infoGreen(`Spoofed Analytics server to: ${host}:${port}/ws`)
    }

    this.method<void>(".ctor", 3).invoke(host, port, isSecure)
}
