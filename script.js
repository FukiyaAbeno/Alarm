
let countdownInterval;
let skipped = false;
let startTimestamp = null;

let played30 = false;
let played3min = false;

// 事前にAudioを生成
let audioStart = new Audio('audio/start.m4a');
let audio2min30 = new Audio('audio/2min30sec.m4a');
let audio3min = new Audio('audio/3min.m4a');
let audio3minHaneya = new Audio('audio/3min_haneya.m4a');
let audioFinish = new Audio('audio/finish.m4a');

function preloadAudios() {
  audioStart.load();
  audio2min30.load();
  audio3min.load();
  audio3minHaneya.load();
  audioFinish.load();
}

function updateTimerDisplay(secondsLeft) {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
}

function resetButtonStates() {
  document.getElementById('startButton').classList.remove('active');
  document.getElementById('skipButton').classList.remove('active');
  document.getElementById('pauseButton').classList.remove('disabled')
  document.getElementById('resumeButton').classList.remove('enabled')
}

function resetTimer() {
  clearInterval(countdownInterval);
  skipped = false;
  startTimestamp = null;
  played30 = false;
  played3min = false;
  pauseTimestamp = null;
  isPaused = false;
  updateTimerDisplay(180);
  resetButtonStates();
  document.getElementById('skipButton').disabled = true;
}

function startTimer() {
  startTimestamp = Date.now();
  pauseTimestamp = Date.now();
  document.getElementById('skipButton').disabled = false;
  paused = 0;
  countdownInterval = setInterval(() => {
    elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
    // console.log("elapsed: ", elapsed, " paused: ", paused, "remain: ", remaining);
    if (isPaused) {
      paused = Math.floor((Date.now() - pauseTimestamp) / 1000);
    } else {
      remaining = 180 - elapsed + paused;
      updateTimerDisplay(Math.max(remaining, 0));
      if (!played30 && elapsed >= 150) {
        audio2min30.play().catch(e => {
          console.log("30秒前再生失敗", e);
          const debugEl = document.getElementById("debug");
          if (debugEl) {
            debugEl.textContent = "30秒前エラー: " + e.message;
          }
        });
        played30 = true;
      }

      if (!played3min && elapsed >= 180) {
        played3min = true;
        document.getElementById('skipButton').disabled = true;
        clearInterval(countdownInterval);
        if (skipped) {
          audio3minHaneya.play().catch(e => console.log("3分(跳ね矢)再生失敗", e));
        } else {
          audio3min.play().catch(e => console.log("3分再生失敗", e));
          setTimeout(() => {
            audioFinish.play().catch(e => console.log("終了再生失敗", e));
            resetTimer();
          }, 3000); // 3秒待ってから終了音とリセット（音声長に合わせて調整）
        }
      }
    }
  }, 500);
}

function pauseTimer() {
  isPaused = true;
  pauseTimestamp = Date.now();
}

function resumeTimer() {
  isPaused = false;
}

document.getElementById('startButton').addEventListener('click', () => {
  resetTimer();
  preloadAudios();
  document.getElementById('startButton').classList.add('active');
  audioStart.play().catch(e => console.log("開始再生失敗", e));

  setTimeout(() => {
    startTimer();
  }, 4000);
});

document.getElementById('skipButton').addEventListener('click', () => {
  skipped = true;
  document.getElementById('skipButton').classList.add('active');
  document.getElementById('skipButton').disabled = true;
});

document.getElementById('endButton').addEventListener('click', () => {
  audioFinish.play().catch(e => console.log("終了再生失敗", e));
  resetTimer();
});

document.getElementById('pauseButton').addEventListener('click', () => {
  pauseTimer();
  document.getElementById('pauseButton').disabled = true;
  document.getElementById('pauseButton').classList.remove('enabled');
  document.getElementById('pauseButton').classList.add('disabled');
  document.getElementById('resumeButton').disabled = false;
  document.getElementById('resumeButton').classList.remove('disabled');
  document.getElementById('resumeButton').classList.add('enabled');
});

document.getElementById('resumeButton').addEventListener('click', () => {
  resumeTimer();
  document.getElementById('pauseButton').disabled = false;
  document.getElementById('pauseButton').classList.remove('disabled');
  document.getElementById('pauseButton').classList.add('enabled');
  document.getElementById('resumeButton').disabled = true;
  document.getElementById('resumeButton').classList.remove('enabled');
  document.getElementById('resumeButton').classList.add('disabled');
});

document.getElementById('agreeButton').addEventListener('click', () => {
  location.replace('pwd.html');
});
