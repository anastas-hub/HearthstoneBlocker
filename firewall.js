const { exec } = require('child_process');

function blockFirewall() {
  return new Promise((resolve, reject) => {
    const cmd = 'netsh advfirewall firewall add rule name="BlockHearthstone" dir=out action=block program="C:\\Program Files (x86)\\Hearthstone\\Hearthstone.exe" enable=yes';
    console.log("📛 Blocage de Hearthstone demandé...");
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ BLOCK ERROR:", stderr);
        reject(stderr);
      } else {
        console.log("✅ BLOCK OK:", stdout);
        resolve();
      }
    });
  });
}

function unblockFirewall() {
  const cmd = 'netsh advfirewall firewall delete rule name="BlockHearthstone"';
  console.log("🔓 Déblocage de Hearthstone demandé...");
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ UNBLOCK ERROR:", stderr);
    } else {
      console.log("✅ UNBLOCK OK:", stdout);
    }
  });
}

module.exports = {
  blockFirewall,
  unblockFirewall
};
