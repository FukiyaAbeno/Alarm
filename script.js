window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('skipButton').classList.add('wide');
});

let countdownInterval;
let skipped = false;
let startTimestamp = null;

let Duration = 180;
let AlartSec = 31;  // 1秒手前で警告音声をスタートさせる
let remaining = Duration;

let last30sec = false;
let finished = false;

let elapsed = 0;
let elapsed_real = 0;
let paused = 0;
let adjtime = 0;
// let run_stat = "stop";
// let keika_1min = false;
// let keika_2min = false;
// let keika_3min = false;
// let keika_4min = false;
// let keika_5min = false;

// 事前にAudioを生成
let audioStart = new Audio('audio/start.m4a');
let audioLast30sec = new Audio('audio/remain30sec.m4a');
let audioHaneya = new Audio('audio/haneya.m4a');
let audioFinish = new Audio('audio/finish.m4a');
let audio3min = new Audio('audio/3min.m4a');
// let audio1min = new Audio('audio/1min_keika.m4a');
// let audio2min = new Audio('audio/2min_keika.m4a');
// let audio3min = new Audio('audio/3min_keika.m4a');
// let audio4min = new Audio('audio/4min_keika.m4a');
// let audio5min = new Audio('audio/5min_keika.m4a');

function preloadAudios() {
  audioStart.load();
  audioLast30sec.load();
  audioHaneya.load();
  audioFinish.load();
  audio3min.load();
  // audio1min.load();
  // audio2min.load();
  // audio3min.load();
  // audio4min.load();
  // audio5min.load();
}

function updateTimerDisplay(secondsLeft) {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
}

function resetButtonStates() {
  document.getElementById('startButton').classList.remove('active');
  document.getElementById('startButton').disabled = false;
  // document.getElementById('pauseButton').classList.remove('enabled');
  // document.getElementById('pauseButton').classList.add('disabled');
  // document.getElementById('pauseButton').disabled = true;
  // document.getElementById('resumeButton').classList.remove('enabled');
  // document.getElementById('resumeButton').classList.add('disabled');
  // document.getElementById('resumeButton').disabled = true;
}

function resetTimer() {
  clearInterval(countdownInterval);
  skipped = false;
  startTimestamp = null;
  last30sec = false;
  finished = false;
  pauseTimestamp = null;
  isPaused = false;
  elapsed = 0;
  elapsed_real = 0;
  paused = 0;
  adjtime = 0;
  // run_stat = "stop";
  updateTimerDisplay(Duration);
  resetButtonStates();
}

function startTimer() {
  startTimestamp = Date.now();
  pauseTimestamp = Date.now();
  document.getElementById('endButton').disabled = false;
  document.getElementById('skipButton').disabled = false;
  // document.getElementById('pauseButton').disabled = false;
  paused = 0;
  adjtime = 0;
  countdownInterval = setInterval(() => {
    elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
    if (isPaused) {
      paused = Math.floor((Date.now() - pauseTimestamp) / 1000);
    } else {
      // elapsed_real = elapsed - paused;
      // remaining = Duration - elapsed_real + adjtime;
      remaining = Duration - elapsed
      updateTimerDisplay(Math.max(remaining, 0));
      // if (!last30sec && Duration > 60 && !keika_1min && elapsed_real >= 60) {
      //   keika_1min = true;
      //   audio1min.play().catche(e => console.log("1分経過音再生失敗"));
      // }
      // if (!last30sec && Duration > 120 && !keika_2min && elapsed_real >= 120) {
      //   keika_2min = true;
      //   audio2min.play().catche(e => console.log("2分経過音再生失敗"));
      // }
      // if (!last30sec && Duration > 180 && !keika_3min && elapsed_real >= 180) {
      //   keika_3min = true;
      //   audio3min.play().catche(e => console.log("3分経過音再生失敗"));
      // }
      // if (!last30sec && Duration > 240 && !keika_4min && elapsed_real >= 240) {
      //   keika_4min = true;
      //   audio4min.play().catche(e => console.log("4分経過音再生失敗"));
      // }
      // if (!last30sec && Duration > 300 && !keika_5min && elapsed_real >= 300) {
      //   keika_5min = true;
      //   audio5min.play().catche(e => console.log("5分経過音再生失敗"));
      // }
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
        // document.getElementById('skipButton').add('red');
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
        }, 3000); // 3秒待ってから終了音とリセット（音声長に合わせて調整）
      }
    }
  }, 500);
}

// function pauseTimer() {
//   isPaused = true;
//   pauseTimestamp = Date.now();
// }

// function resumeTimer() {
//   isPaused = false;
// }

// function adjtimer() {
//   prev_remain = Duration - elapsed_real;
//   let new_remain = prompt('残り時間（秒数）を入力してください', prev_remain);
//   if (new_remain === null) {
//     new_remain = prev_remain;
//   } else if (new_remain === "") {
//     new_remain = prev_remain;
//   } else if (!isFinite(new_remain)) {
//     new_remain = prev_remain;
//   } else if (new_remain > 360) {
//     new_remain = prev_remain;
//   }
//   adjtime = new_remain - prev_remain;
//   updateTimerDisplay(Math.max(new_remain, 0));
// }

document.getElementById('startButton').addEventListener('click', () => {
  resetTimer();
  preloadAudios();
  document.getElementById('startButton').classList.add('active');
  document.getElementById('startButton').disabled = true;
  document.getElementById('endButton').disabled = false;
  document.getElementById('skipButton').classList.add('grey');
  document.getElementById('skipButton').disabled = false;
  // document.getElementById('pauseButton').classList.add('enabled');
  // document.getElementById('pauseButton').disabled = false;
  audioStart.play().catch(e => console.log("開始再生失敗", e));
  setTimeout(() => {
    // run_stat = "start";
    startTimer();
  }, 4000);
});

document.getElementById('endButton').addEventListener('click', () => {
  document.getElementById('endButton').disabled = true;
  if (!skipped) {
    document.getElementById('skipButton').classList.remove('grey');
  }
  document.getElementById('skipButton').disabled = true;
  audioFinish.play().catch(e => console.log("終了再生失敗", e));
  resetTimer();
  run_stat = "stop";
});

document.getElementById('skipButton').addEventListener('click', () => {
  skipped = true;
  document.getElementById('skipButton').classList.remove('grey');
  document.getElementById('skipButton').disabled = true;
});

// document.getElementById('pauseButton').addEventListener('click', () => {
//   pauseTimer();
//   document.getElementById('pauseButton').textContent = '一時停止中'
//   document.getElementById('pauseButton').disabled = true;
//   document.getElementById('pauseButton').classList.remove('enabled');
//   document.getElementById('resumeButton').disabled = false;
//   document.getElementById('resumeButton').classList.add('enabled');
// });

// document.getElementById('resumeButton').addEventListener('click', () => {
//   resumeTimer();
//   document.getElementById('pauseButton').textContent = '一時停止'
//   document.getElementById('pauseButton').disabled = false;
//   document.getElementById('pauseButton').classList.add('enabled');
//   document.getElementById('resumeButton').disabled = true;
//   document.getElementById('resumeButton').classList.remove('enabled');
// });

// document.getElementById('adjtimeButton').addEventListener('click', () => {
//   pauseTimer();
//   adjtimer();
//   if (run_stat === "start") {
//     document.getElementById('pauseButton').disabled = true;
//     document.getElementById('pauseButton').classList.remove('enabled');
//     document.getElementById('resumeButton').disabled = false;
//     document.getElementById('resumeButton').classList.add('enabled');
//   }
// });
