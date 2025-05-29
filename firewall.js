const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, 'config.json');
const hearthstonePath = `"C:\\Program Files (x86)\\Hearthstone\\Hearthstone.exe"`; // chemin par défaut

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    return { duration: 4 };
  }
  const content = fs.readFileSync(configPath);
  return JSON.parse(content);
}

function blockFirewall() {
  try {
    execSync(`netsh advfirewall firewall add rule name="HearthstoneBlock" program=${hearthstonePath} dir=in action=block`);
    execSync(`netsh advfirewall firewall add rule name="HearthstoneBlock" program=${hearthstonePath} dir=out action=block`);
  } catch (err) {
    console.error("Erreur blocage pare-feu :", err.message);
  }
}

function unblockFirewall() {
  try {
    execSync(`netsh advfirewall firewall delete rule name="HearthstoneBlock"`);
  } catch (err) {
    console.error("Erreur déblocage pare-feu :", err.message);
  }
}

module.exports = {
  loadConfig,
  blockFirewall,
  unblockFirewall
};
