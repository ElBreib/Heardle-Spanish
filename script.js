const songs = [
  { title: "Diabólica", artist: "Cris MJ", file: "diabolica.mp3" },
  { title: "Una Noche en Medellín", artist: "Cris MJ", file: "medellin.mp3" },
  { title: "Vista Al Mar", artist: "Quevedo", file: "vista al mar.mp3" },
  { title: "Pepas", artist: "Farruko", file: "pepas.mp3" }
];

let currentSong = null;
let currentSegmentIndex = 0;
let playSegments = [1, 2, 5, 10, 15];  // Segmentos de reproducción en segundos
let totalDuration = 15;
let accumulatedTime = 0;

const audioPlayer = document.getElementById("audio-player");
const playButton = document.getElementById("play-button");
const guessInput = document.getElementById("guess-input");
const submitGuess = document.getElementById("submit-guess");
const feedback = document.getElementById("feedback");
const nextSongButton = document.getElementById("next-song");
const progressBar = document.getElementById("progress-bar");
const suggestionBox = document.getElementById("suggestion-box");
const timeDisplay = document.getElementById("time-display");

// Función para obtener una canción aleatoria
function getRandomSong() {
  const randomIndex = Math.floor(Math.random() * songs.length);
  return songs[randomIndex];
}

// Función para cargar una canción aleatoria
function loadRandomSong() {
  currentSong = getRandomSong();
  audioPlayer.src = currentSong.file;
  feedback.textContent = "";
  guessInput.value = "";
  currentSegmentIndex = 0;
  accumulatedTime = 0;
  nextSongButton.hidden = true;
  submitGuess.disabled = false;
  playButton.disabled = false;
  progressBar.style.width = "0%";
  suggestionBox.innerHTML = "";
  timeDisplay.textContent = "0s";
}

// Función para reproducir el segmento actual
function playSegment() {
  if (currentSegmentIndex >= playSegments.length) {
    feedback.textContent = "Perdiste. La respuesta era: " + currentSong.title;
    feedback.style.color = "red";
    playButton.disabled = true;
    submitGuess.disabled = true;
    nextSongButton.hidden = false;
    return;
  }

  const duration = playSegments[currentSegmentIndex];
  audioPlayer.currentTime = 0;
  audioPlayer.play();

  progressBar.style.width = "0%";
  timeDisplay.textContent = "0s";

  let elapsedTime = 0;

  const interval = setInterval(() => {
    elapsedTime++;
    const progress = (elapsedTime / totalDuration) * 100;
    progressBar.style.width = `${progress}%`;

    timeDisplay.textContent = `${elapsedTime}s`;

    if (elapsedTime >= duration) {
      clearInterval(interval);
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
  }, 1000);
}

// Función para verificar la respuesta
function checkGuess() {
  const userGuess = guessInput.value.trim().toLowerCase();
  const correctAnswer = currentSong.title.toLowerCase();

  // Si la respuesta es incorrecta
  if (userGuess !== correctAnswer) {
    feedback.textContent = "Incorrecto. Escucha más.";
    feedback.style.color = "orange";
    currentSegmentIndex++;
    accumulatedTime += playSegments[currentSegmentIndex];
    progressBar.style.width = "0%";
    playSegment();
  } else {
    feedback.textContent = "¡Correcto!";
    feedback.style.color = "green";
    nextSongButton.hidden = false;
    submitGuess.disabled = true;
    playButton.disabled = true;
  }
}

// Función para pasar a la siguiente canción
function nextSong() {
  loadRandomSong();
}

// Función para mostrar sugerencias mientras el usuario escribe
function showSuggestions() {
  const query = guessInput.value.toLowerCase();
  suggestionBox.innerHTML = ""; // Limpiar sugerencias anteriores

  if (query.length > 0) {
    const filteredSongs = songs.filter(song =>
      song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
    );

    filteredSongs.forEach(song => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("suggestion");  // Asegurarse de que la clase "suggestion" esté presente
      suggestionItem.textContent = `${song.title} - ${song.artist}`;

      // Añadir un evento para cuando el usuario haga clic en una sugerencia
      suggestionItem.addEventListener("click", () => {
        guessInput.value = song.title; // Rellenar el campo de texto con la sugerencia
        suggestionBox.innerHTML = ""; // Limpiar sugerencias
      });

      suggestionBox.appendChild(suggestionItem);
    });
  }
}

guessInput.addEventListener("input", showSuggestions); // Mostrar sugerencias cuando se escribe
playButton.addEventListener("click", playSegment);
submitGuess.addEventListener("click", checkGuess);
nextSongButton.addEventListener("click", nextSong);

// Cargar una canción aleatoria al iniciar el juego
loadRandomSong();
