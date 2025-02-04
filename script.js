// Generate the data
const emojis = [
  '🐶', '🐶', '🐱', '🐱', '🐭', '🐭', '🐹', '🐹',
  '🐰', '🐰', '🦊', '🦊', '🐻', '🐻', '🐷', '🐷'
];

// Game state variables
let moves = 0;
let sec = 0;
let firstFlip = true;
let isProcessing = false;
let timerInterval;
let gameCompleted = false;

// DOM elements
const movesDisplay = document.getElementById('moves');
const flipSound = document.getElementById('flip-sound');
const victorySound = document.getElementById('victory-sound');
const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

// Helper functions
function pad(val) {
  return val > 9 ? val : '0' + val;
}

function playFlipSound() {
  flipSound.currentTime = 0;
  flipSound.play();
  flipSound.volume = 0.3;
}

function playVictorySound() {
  victorySound.currentTime = 0;
  victorySound.play();
  victorySound.volume = 0.5;
}

function saveGameState() {
  const gameState = {
    cards: Array.from(document.querySelectorAll('.item')).map(card => ({
      emoji: card.innerHTML,
      isOpen: card.classList.contains('boxOpen'),
      isMatched: card.classList.contains('boxMatch')
    })),
    moves: moves,
    time: sec,
    completed: gameCompleted
  };
  localStorage.setItem('memoryGameState', JSON.stringify(gameState));
}

function loadGameState() {
  const savedState = localStorage.getItem('memoryGameState');
  if (savedState) {
    const gameState = JSON.parse(savedState);
    moves = gameState.moves;
    sec = gameState.time;
    gameCompleted = gameState.completed;
    movesDisplay.textContent = moves;
    document.getElementById('seconds').innerHTML = pad(sec % 60);
    document.getElementById('minutes').innerHTML = pad(parseInt(sec / 60, 10));
    return gameState.cards;
  }
  return null;
}

function startTimer() {
  if (!timerInterval && !gameCompleted) {
    timerInterval = setInterval(function () {
      document.getElementById('seconds').innerHTML = pad(++sec % 60);
      document.getElementById('minutes').innerHTML = pad(parseInt(sec / 60, 10));
      saveGameState();
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function flipCard() {
  moves++;
  movesDisplay.textContent = moves;
  saveGameState();
}

// Initialize game
const savedCards = loadGameState();
let shuffle_emojis;

if (savedCards) {
  shuffle_emojis = savedCards.map(card => card.emoji);
} else {
  shuffle_emojis = emojis.sort(() => (Math.random() > 0.5 ? 2 : -1));
}

for (let i = 0; i < emojis.length; i++) {
  let box = document.createElement('div');
  box.className = 'item';
  box.innerHTML = shuffle_emojis[i];

  if (savedCards) {
    if (savedCards[i].isOpen) box.classList.add('boxOpen');
    if (savedCards[i].isMatched) box.classList.add('boxMatch');
  }

  box.onclick = function () {
    if (
      !isProcessing &&
      !this.classList.contains('boxOpen') &&
      !this.classList.contains('boxMatch') &&
      !gameCompleted
    ) {
      this.classList.add('boxOpen');
      playFlipSound();

      if (firstFlip) {
        startTimer();
        firstFlip = false;
      }

      if (document.querySelectorAll('.boxOpen').length === 2) {
        isProcessing = true;
        flipCard();

        setTimeout(function () {
          const openCards = document.querySelectorAll('.boxOpen');
          if (openCards[0].innerHTML === openCards[1].innerHTML) {
            openCards[0].classList.add('boxMatch');
            openCards[1].classList.add('boxMatch');
            openCards[0].classList.remove('boxOpen');
            openCards[1].classList.remove('boxOpen');

            if (document.querySelectorAll('.boxMatch').length === emojis.length) {
              playVictorySound();
              stopTimer();
              gameCompleted = true;
              saveGameState();
              alert('YOU WIN!!');
            }
          } else {
            openCards[0].classList.remove('boxOpen');
            openCards[1].classList.remove('boxOpen');
          }
          isProcessing = false;
          saveGameState();
        }, 500);
      }
    }
  };

  document.querySelector('.game').appendChild(box);
}

// Start timer if there are already matched or open cards and game is not completed
if (document.querySelectorAll('.boxMatch, .boxOpen').length > 0 && !gameCompleted) {
  startTimer();
  firstFlip = false;
}

// Background music controls
backgroundMusic.volume = 0.3;
backgroundMusic.play();

musicToggle.onclick = function () {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    musicToggle.textContent = 'Pause Music';
  } else {
    backgroundMusic.pause();
    musicToggle.textContent = 'Play Music';
  }
};

function startNewGame() {
  // Clear the saved game state
  localStorage.removeItem('memoryGameState');
  
  // Reset game variables
  moves = 0;
  sec = 0;
  firstFlip = true;
  gameCompleted = false;
  
  // Stop the timer
  stopTimer();
  
  // Reset the timer display
  document.getElementById('seconds').innerHTML = '00';
  document.getElementById('minutes').innerHTML = '00';
  
  // Reset moves display
  movesDisplay.textContent = '0';
  
  // Reshuffle and reset cards
  shuffle_emojis = emojis.sort(() => (Math.random() > 0.5 ? 2 : -1));
  const cards = document.querySelectorAll('.item');
  cards.forEach((card, index) => {
      card.innerHTML = shuffle_emojis[index];
      card.classList.remove('boxOpen', 'boxMatch');
  });
}
