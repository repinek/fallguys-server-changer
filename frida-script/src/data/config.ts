// secure true: wss://
// secure false: ws://

/** Global URLs Configuration */
export const CONFIG = {
    /** Specific for Modern builds (>10.0.0) */
    LOGIN_HTTP: {
        CUSTOM_LOGIN_URL: "https://login.fallguys.oncatapult.com/api/v1",
        CUSTOM_LOGIN_PORT: -1 // -1 will not include port to the url
    },

    /** Specific for Legacy builds (<10.1.0) */
    LOGIN_WS: {
        CUSTOM_LOGIN_URL: "login.fallguys.oncatapult.com",
        CUSTOM_LOGIN_PORT: 443,
        IS_LOGIN_SECURE: true
    },

    CUSTOM_GATEWAY_URL: "gateway.fallguys.oncatapult.com",
    CUSTOM_GATEWAY_PORT: 443,
    IS_GATEWAY_SECURE: true,

    CUSTOM_ANALYTICS_URL: "analytics-gateway.fallguys.oncatapult.com",
    CUSTOM_ANALYTICS_PORT: 443,
    IS_ANALYTICS_SECURE: true
} as const
