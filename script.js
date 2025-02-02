//Generate the data
const emojis = [
  '🐶',
  '🐶',
  '🐱',
  '🐱',
  '🐭',
  '🐭',
  '🐹',
  '🐹',
  '🐰',
  '🐰',
  '🦊',
  '🦊',
  '🐻',
  '🐻',
  '🐷',
  '🐷',
];

// Randomize the emojis
var shuffle_emojis = emojis.sort(() => (Math.random() > 0.5 ? 2 : -1));

// Add moves counter
let moves = 0;
const movesDisplay = document.getElementById('moves');

// Timer functionality
var sec = 0;
let firstFlip = true;

function pad(val) {
  return val > 9 ? val : '0' + val;
}

function startTimer() {
  timerInterval = setInterval(function () {
    document.getElementById('seconds').innerHTML = pad(++sec % 60);
    document.getElementById('minutes').innerHTML = pad(parseInt(sec / 60, 10));
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function flipCard() {
  moves++;
  movesDisplay.textContent = moves;
}

// Get the flip sound element
const flipSound = document.getElementById('flip-sound');

function playFlipSound() {
  flipSound.currentTime = 0; // Reset the sound to the start
  flipSound.play();
  flipSound.volume = 0.3;
}

const victorySound = document.getElementById('victory-sound');

function playVictorySound() {
  victorySound.currentTime = 0;
  victorySound.play();
  victorySound.volume = 0.5;
}

for (var i = 0; i < emojis.length; i++) {
  let box = document.createElement('div');
  box.className = 'item';
  box.innerHTML = shuffle_emojis[i];

  box.onclick = function () {
    if (
      !this.classList.contains('boxOpen') &&
      !this.classList.contains('boxMatch')
    ) {
      this.classList.add('boxOpen');

      playFlipSound();

      // Start timer on first flip
      if (firstFlip) {
        startTimer();
        firstFlip = false; // Set flag to false after the first flip
      }

      if (document.querySelectorAll('.boxOpen').length === 2) {
        flipCard();

        setTimeout(function () {
          const openCards = document.querySelectorAll('.boxOpen');
          if (openCards[0].innerHTML === openCards[1].innerHTML) {
            openCards[0].classList.add('boxMatch');
            openCards[1].classList.add('boxMatch');
            openCards[0].classList.remove('boxOpen');
            openCards[1].classList.remove('boxOpen');

            if (
              document.querySelectorAll('.boxMatch').length === emojis.length
            ) {
              playVictorySound();
              stopTimer();
              alert('YOU WIN!!');
            }
          } else {
            openCards[0].classList.remove('boxOpen');
            openCards[1].classList.remove('boxOpen');
          }
        }, 500);
      }
    }
  };

  document.querySelector('.game').appendChild(box);
}

// Select the audio element and button
const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

// Start music automatically and set volume
backgroundMusic.volume = 0.3; // Adjust volume

backgroundMusic.play(); // Autoplay music when the game starts

// Handle toggle button click
musicToggle.onclick = function () {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    musicToggle.textContent = 'Pause Music';
  } else {
    backgroundMusic.pause();
    musicToggle.textContent = 'Play Music';
  }
};
