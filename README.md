# Fall Guys Server Changer

This repository contains scripts to redirect Fall Guys network traffic to a private server.

> [!WARNING]  
> **THIS IS NOT PRIVATE SERVER OR READY-TO-GO SOLUTION. You need to configure it yourself.**


## Available Methods

### Frida Script
A [Frida](https://frida.re/) script powered by [frida-il2cpp-bridge](https://github.com/vfsfitvnm/frida-il2cpp-bridge) that redirects traffic by replacing target URIs.  
**Android, Linux, Windows, iOS, macOS** is supported. However, only Android and Windows have been tested.

#### Game Version Support
| Game Version | Support | Note |
| --- | --- | --- |
| Alpha - 0.9.10 | ❌ | Might work with `legacy-s3` |
| 0.9.10 (tested on ls3.5) | ✅ | Use `legacy-s3` |
| 0.9.10 - 8.2.0 | ⚠️ | Untested, likely works with `legacy-s3` or `ss3` | 
| 9.0.0 - 9.0.4 | ✅ | Use `ss3` | 
| 10.0.0 | ⚠️ | Login as websocket, likely works with `ss3` | 
| 10.1.0 - 21.1.1 | ✅ | Use `modern` |

Check [Building and Installation](./frida-script/README.md)

### BepInEx mod 
TODO

## Contribution
Pull requests are welcome!

## License
This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

# Disclaimer
This project is **NOT** affiliated with Mediatonic or Epic Games.

**Fall Guys** is a trademark of **Mediatonic Limited**.