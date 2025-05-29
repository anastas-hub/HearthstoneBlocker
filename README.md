# 🎮 Hearthstone Blocker

---

## 🔧 Main Features

- 🛑 **Full blocking** of Hearthstone.exe in Windows Firewall (inbound + outbound).
- ⏳ **Automatic unblock** after a configurable delay (in seconds).
- 🎛️ Simple and elegant interface:
  - 🔴 **Red LED**: blocking active.
  - 🟢 **Green LED**: blocking inactive.
  - A big **"Skip"** button to activate the block.
- 🌙 Modern dark theme.
- 🖼️ Customizable icon.

---

## ⚙️ Configuration

The `config.json` file allows you to adjust the block duration.

It contains a value called `duration` which represents how many seconds Hearthstone will be blocked when you press **Skip**.

---

## 🧰 Technical Details

- The program **must be run as administrator** (elevated) to modify firewall rules.
- Uses Windows commands (PowerShell or netsh) to manage firewall rules.
- On **Skip** click:
  - Blocks Hearthstone.exe inbound and outbound.
  - LED switches to red.
  - After the configured time, unblock occurs.
  - LED returns to green.

---

## 🖥️ User Interface

- Compact window positioned at the bottom-left of the screen.
- Centered blue **Skip** button with hover effect.
- Two LEDs indicating status.
- Close button at the top-right corner.
- Clear and dark design to minimize distraction.

---

## 📦 Packaging & Distribution

### Tools used

- [Electron](https://www.electronjs.org/) for the desktop app.
- [electron-builder](https://www.electron.build/) to compile into `.exe`.

### Generated version

- **Installable version**: `.exe` file with installer.

### Key commands

- Install dependencies:  
  `npm install`

- Build the installable version:  
  `npm run dist`

The generated file will be inside the `dist/` folder.

---

## 🚨 Important prerequisites

- Running the app **as administrator** is mandatory for blocking to work.
- The default path to Hearthstone.exe is hardcoded and may need adjustment.
- Multi-monitor setups are not supported yet.

---

## 🤝 Contribution

- Pull requests, suggestions, and bug reports are welcome on GitHub.
- Please respect project structure and code style.

---

## 📄 License

Open source project under the MIT license.

---

## 🎉 Thanks for using Hearthstone Blocker!

---
