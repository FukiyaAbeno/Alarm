window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('skipButton').classList.add('haneya_wide');
});

let countdownInterval;
let Duration = 180;
let AlartSec = 31;  // 1秒手前から「３０秒前です」音声をスタートさせる
let startTimestamp = null;
let remaining = Duration;
let elapsed = 0;
let started = false;
let skipped = false;
let last30sec = false;
let finished = false;
let ended = true;

// 事前にAudioを生成
let audioStart = new Audio('audio/start.m4a');
let audioLast30sec = new Audio('audio/remain30sec.m4a');
let audioHaneya = new Audio('audio/haneya.m4a');
let audioFinish = new Audio('audio/finish.m4a');
let audio3min = new Audio('audio/3min.m4a');

function preloadAudios() {
  audioStart.load();
  audioLast30sec.load();
  audioHaneya.load();
  audioFinish.load();
  audio3min.load();
}

function updateTimerDisplay(secondsLeft) {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
}

function resetButtonStates() {
  document.getElementById('startButton').classList.remove('active');
  document.getElementById('startButton').disabled = false;
  document.getElementById('endButton').disabled = true;
  document.getElementById('skipButton').classList.remove('haneya_grey');
  document.getElementById('skipButton').disabled = true;
}

function resetTimer() {
  clearInterval(countdownInterval);
  startTimestamp = null;
  elapsed = 0;
  started = false;
  skipped = false;
  last30sec = false;
  finished = false;
  ended = true;
  updateTimerDisplay(Duration);
  resetButtonStates();
}

function startTimer() {
  startTimestamp = Date.now();
  countdownInterval = setInterval(() => {
    elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
    remaining = Duration - elapsed
    updateTimerDisplay(Math.max(remaining, 0));
    if (!last30sec && remaining <= AlartSec) {
      last30sec = true;
      audioLast30sec.play().catch(e => {
        console.log("30秒前再生失敗", e);
        const debugEl = document.getElementById("debug");
        if (debugEl) {
          debugEl.textContent = "30秒前エラー: " + e.message;
        }
      });
    }

    if (!finished && remaining <= 0) {
      finished = true;
      document.getElementById('skipButton').disabled = true;
      clearInterval(countdownInterval);
      audio3min.play().catch(e => console.log("3分経過再生失敗", e));
      setTimeout(() => {
        if (skipped) {
          audioHaneya.play().catch(e => console.log("3分(跳ね矢)再生失敗", e));
        } else {
          audioFinish.play().catch(e => console.log("終了再生失敗", e));
          resetTimer();
        }
      }, 2500); // 3秒待ってから終了音とリセット（3分経過音声長に合わせて調整）
    }
  }, 500);
}

document.getElementById('startButton').addEventListener('click', () => {
  resetTimer();
  preloadAudios();
  started = true;
  document.getElementById('startButton').classList.add('active');
  document.getElementById('startButton').disabled = true;
  document.getElementById('endButton').disabled = false;
  document.getElementById('skipButton').classList.add('haneya_grey');
  document.getElementById('skipButton').disabled = false;
  audioStart.play().catch(e => console.log("開始再生失敗", e));
  setTimeout(() => {
    startTimer();
  }, 4000);
});

document.getElementById('endButton').addEventListener('click', () => {
  document.getElementById('endButton').disabled = true;
  if (!skipped) {
    document.getElementById('skipButton').classList.remove('haneya_grey');
  }
  document.getElementById('skipButton').disabled = true;
  audioFinish.play().catch(e => console.log("終了再生失敗", e));
  resetTimer();
});

document.getElementById('skipButton').addEventListener('click', () => {
  skipped = true;
  document.getElementById('skipButton').classList.remove('haneya_grey');
  document.getElementById('skipButton').disabled = true;
});
