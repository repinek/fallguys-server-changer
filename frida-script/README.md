# Fall Guys Server Changer - Frida script

## Prerequisites
- Python >=3.7 for Frida
- Node.js

## Setup
1. Clone the repository:
```bash
git clone https://github.com/repinek/fallguys-server-changer
cd fallguys-server-changer
cd frida-script
```

2. Install the required version of Frida: 
```bash
pip install -r requirements.txt
```

3. Install Node.js dependencies
```bash
npm install
```

## Available Scripts
**Build the script:**   
Compile the agent into `./dist/agent.js`.  
`npm run build:s3` - Builds a legacy-s3 script.  
`npm run build:modern` - Builds a modern script.  

**Spawn the script:**  
`npm run spawn:windows` - Spawns script on Windows in `FallGuys_client_game.exe`.  
`npm run spawn:windows_old` - Spawns script on Windows in `FallGuys_client.exe` (Beta & Alpha Builds).  
`npm run spawn:android_gadget` - Spawns script on Android in Gadget (required patched apk via frida-gadget).  

> *Note: Since all build commands output to the same `dist/agent.js` file, make sure to run the correct build command before spawning.*

\* from package.json

## Helpful Information / Resources
[Please, refer this](https://github.com/repinek/fallguys-frida-modmenu/blob/main/CONTRIBUTING.md#helpful-information--resources)