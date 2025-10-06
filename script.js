const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');

const hInput = $('h'), mInput = $('m'), sInput = $('s');
const hfInput = $('hf'), mfInput = $('mf'), sfInput = $('sf');
const display = $('display');
const startBtn = $('start'), pauseBtn = $('pause'), resetBtn = $('reset');
const mensaje = $('mensaje');
const titulo = $('titulo');

let hora = 0, minuto = 0, segundo = 0;
let horaFin = 0, minutoFin = 0, segundoFin = 0;
let timerId = null;
let running = false;

// 🎵 Config sonido
const audio = new Audio('alarma.mp3');
audio.volume = 1.0;

// 🕓 Actualiza display
function updateDisplay() {
  display.textContent = `${pad(hora)}:${pad(minuto)}:${pad(segundo)}`;
}

// 🧮 Leer inputs
function readInputsToState() {
  hora = Number(hInput.value) || 0;
  minuto = Number(mInput.value) || 0;
  segundo = Number(sInput.value) || 0;
  horaFin = Number(hfInput.value) || 0;
  minutoFin = Number(mfInput.value) || 0;
  segundoFin = Number(sfInput.value) || 0;
  updateDisplay();
}

// 🧩 Validar
function validarEntradas() {
  const totalInicio = hora * 3600 + minuto * 60 + segundo;
  const totalFin = horaFin * 3600 + minutoFin * 60 + segundoFin;
  if (totalFin <= totalInicio) {
    mensaje.textContent = "⚠️ La hora final debe ser mayor a la inicial.";
    mensaje.style.color = "red";
    return false;
  }
  mensaje.textContent = "⏱ Temporizador corriendo...";
  mensaje.style.color = "lime";
  return true;
}

// ⏰ Reloj corre
function tick() {
  if (!running) return;
  segundo++;
  if (segundo >= 60) { segundo = 0; minuto++; }
  if (minuto >= 60) { minuto = 0; hora++; }
  if (hora >= 24) hora = 0;
  updateDisplay();

  // Cuando llega al tiempo final
  if (hora === horaFin && minuto === minutoFin && segundo === segundoFin) {
    onTargetReached();
  }
}

// 🎯 Al llegar a la hora final
function onTargetReached() {
  stopTimer();
  display.classList.add('blink');
  audio.play();

  // 🌟 Easter Egg #1 — Hora mágica
  if (horaFin === 11 && minutoFin === 11 && segundoFin === 11) {
    mensaje.innerHTML = "🌟 ¡Hora mágica 11:11:11! Pide un deseo.";
    mensaje.style.color = "gold";
  } else {
    mensaje.innerHTML = `⏰ Se alcanzó la hora indicada: ${pad(horaFin)}:${pad(minutoFin)}:${pad(segundoFin)}`;
  }
}

// ▶️ Iniciar
function startTimer() {
  if (running) return;
  readInputsToState();
  if (!validarEntradas()) return;
  running = true;
  timerId = setInterval(tick, 1000);
  startBtn.disabled = true;
}

// ⏸️ Pausar / Reanudar
function stopTimer() {
  clearInterval(timerId);
  running = false;
  startBtn.disabled = false;
}

// 🔄 Reset
resetBtn.addEventListener('click', () => {
  stopTimer();
  display.classList.remove('blink');
  hInput.value = mInput.value = sInput.value = 0;
  hfInput.value = mfInput.value = sfInput.value = 0;
  mensaje.textContent = "";
  readInputsToState();
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', () => {
  if (running) stopTimer(); else startTimer();
  pauseBtn.textContent = running ? "Pausa" : "Reanudar";
});

readInputsToState();


// 🥚 Easter Egg #2 → 5 clics rápidos en el título
let clickCount = 0;
titulo.addEventListener('click', () => {
  clickCount++;
  if (clickCount === 5) {
    const comboDiv = document.createElement('div');
    comboDiv.id = 'konami';
    comboDiv.innerHTML = '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️';
    comboDiv.style.fontSize = '28px';
    comboDiv.style.marginTop = '10px';
    comboDiv.style.textAlign = 'center';
    document.body.appendChild(comboDiv);
  }
  setTimeout(() => clickCount = 0, 1000);
});

// 🎮 Easter Egg #3 → Código Konami
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let buffer = [];

window.addEventListener('keydown', (e) => {
  buffer.push(e.key);
  if (buffer.slice(-konami.length).join('') === konami.join('')) {
    activarGatito();
  }
});

