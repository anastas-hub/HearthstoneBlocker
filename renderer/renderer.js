const skipBtn = document.getElementById('skip-button');
const ledRed = document.getElementById('led-red');
const ledGreen = document.getElementById('led-green');

skipBtn.addEventListener('click', () => {
  // Allumer la LED rouge, éteindre la verte
  ledRed.classList.add('on');
  ledGreen.classList.remove('on');

  // Demander au main de bloquer le firewall
  window.api.startBlock();

  // Écouter la fin du blocage pour rétablir LED verte
  window.api.onBlockEnded(() => {
    ledRed.classList.remove('on');
    ledGreen.classList.add('on');
  });
});
