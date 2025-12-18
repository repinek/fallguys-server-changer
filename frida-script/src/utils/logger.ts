
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
    } as const;

    private static getTime(): string {
        const date = new Date();
        const hh = date.getHours().toString().padStart(2, "0");
        const mm = date.getMinutes().toString().padStart(2, "0");
        const ss = date.getSeconds().toString().padStart(2, "0");
        const ms = date.getMilliseconds().toString().padStart(3, "0");
        return `${this.Colors.GRAY}[${hh}:${mm}:${ss}.${ms}]${this.Colors.RESET}`;
    }
    
    private static log(type: LogType, ...messages: any[]): void {
        const time = this.getTime()
        switch (type) {
            case LogType.INFO: 
                console.info(`${time} ${this.Colors.BLUE}[INFO]${this.Colors.RESET}`, ...messages);
            case LogType.INFO_GREEN:
                console.info(`${time} ${this.Colors.GREEN}[INFO]`, ...messages, this.Colors.RESET);
            case LogType.WARN: 
                console.warn(`${time} ${this.Colors.YELLOW}[WARN]${this.Colors.RESET}`, ...messages);
            case LogType.ERROR: 
                console.error(`${time} ${this.Colors.RED}[ERROR]${this.Colors.RESET}`, ...messages);
            case LogType.HOOK:
                console.debug(`${this.getTime()} ${this.Colors.GRAY}[HOOK]`, ...messages, this.Colors.RESET);
            default:
                console.log(...messages);
        }       
    }

    static info(...messages: any[]) {
        this.log(LogType.INFO, ...messages);
    }

    static infoGreen(...messages: any[]) {
        this.log(LogType.INFO_GREEN, ...messages);
    }

    static warn(...messages: any[]) {
        this.log(LogType.WARN, ...messages);
    }

    static error(...messages: any[]) {
        this.log(LogType.ERROR, ...messages);
    }

    static hook(...messages: any[]) {
        this.log(LogType.HOOK, ...messages);
    }
}