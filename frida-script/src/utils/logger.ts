enum LogType {
    INFO = "INFO",
    INFO_GREEN = "INFO_GREEN",
    WARN = "WARN",
    ERROR = "ERROR",
    HOOK = "HOOK"
}

export class Logger {
    private static readonly Colors = {
        RESET: "\x1b[0m",
        GRAY: "\x1b[90m",
        BLUE: "\x1b[34m",
        GREEN: "\x1b[32m",
        CYAN: "\x1b[36m",
        YELLOW: "\x1b[33m",
        RED: "\x1b[31m"
    } as const

    private static getTime(): string {
        const date = new Date()
        const hh = date.getHours().toString().padStart(2, "0")
        const mm = date.getMinutes().toString().padStart(2, "0")
        const ss = date.getSeconds().toString().padStart(2, "0")
        const ms = date.getMilliseconds().toString().padStart(3, "0")
        return `${Logger.Colors.GRAY}[${hh}:${mm}:${ss}.${ms}]${Logger.Colors.RESET}`
    }

    private static log(type: LogType, ...messages: any[]): void {
        const time = Logger.getTime()
        switch (type) {
            case LogType.INFO:
                console.info(`${time} ${Logger.Colors.BLUE}[INFO]${Logger.Colors.RESET}`, ...messages)
                break
            case LogType.INFO_GREEN:
                console.info(`${time} ${Logger.Colors.GREEN}[INFO]`, ...messages, Logger.Colors.RESET)
                break
            case LogType.WARN:
                console.warn(`${time} ${Logger.Colors.YELLOW}[WARN]${Logger.Colors.RESET}`, ...messages)
                break
            case LogType.ERROR:
                console.error(`${time} ${Logger.Colors.RED}[ERROR]${Logger.Colors.RESET}`, ...messages)
                break
            case LogType.HOOK:
                console.debug(`${Logger.getTime()} ${Logger.Colors.GRAY}[HOOK]`, ...messages, Logger.Colors.RESET)
                break
        }
    }

    static info(...messages: any[]) {
        Logger.log(LogType.INFO, ...messages)
    }

    static infoGreen(...messages: any[]) {
        Logger.log(LogType.INFO_GREEN, ...messages)
    }

    static warn(...messages: any[]) {
        Logger.log(LogType.WARN, ...messages)
    }

    static error(...messages: any[]) {
        Logger.log(LogType.ERROR, ...messages)
    }

    static hook(...messages: any[]) {
        Logger.log(LogType.HOOK, ...messages)
    }
}
