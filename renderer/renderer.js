const greenLed = document.getElementById('led-green');
const orangeLed = document.getElementById('led-orange');
const skipBtn = document.getElementById('skip-btn');

let ledBlinking = false;

// LED orange sombre (éteinte) au démarrage
orangeLed.style.backgroundColor = '#444';

function updatePhase(phase) {
  // Pas d'affichage de texte de phase, logique seulement pour le bouton
  if (phase === 'lobby' || phase === 'unknown' || phase === 'tavern') {
    skipBtn.disabled = true;
    skipBtn.textContent = 'Skip Battle';
  } else {
    skipBtn.disabled = false;
    skipBtn.textContent = 'Skip Battle';
  }
}

function blinkOrangeLed(times = 3, interval = 200) {
  if (ledBlinking) return;
  ledBlinking = true;
  let count = 0;
  const blink = setInterval(() => {
    orangeLed.style.opacity = orangeLed.style.opacity === '1' ? '0.2' : '1';
    count++;
    if (count >= times * 2) {
      clearInterval(blink);
      orangeLed.style.opacity = '1';
      ledBlinking = false;
    }
  }, interval);
}

skipBtn.addEventListener('click', () => {
  console.log("🖱️ Bouton 'Skip Battle' cliqué");
  window.electronAPI.blockHearthstone(4000);
  greenLed.classList.add('red');
  skipBtn.disabled = true;
  setTimeout(() => {
    greenLed.classList.remove('red');
    skipBtn.disabled = false;
  }, 4000);
});

window.api.onPhaseChanged((phase) => {
  updatePhase(phase);
});

window.api.onLogStatus((status) => {
  if (status === 'found') {
    orangeLed.style.backgroundColor = 'orange';
  } else if (status === 'not-found') {
    orangeLed.style.backgroundColor = '#444'; // sombre/éteint
  } else if (status === 'new-folder') {
    blinkOrangeLed();
  }
});

// Barre custom : fermeture sur la croix
const closeBtn = document.getElementById('close-btn');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    if (window.api && window.api.close) window.api.close();
  });
}
