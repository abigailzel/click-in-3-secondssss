const GOAL_TIME = 3.0;
let startTime, endTime;
let attemptHistory = [];

const btn = document.getElementById("clickBtn");
const result = document.getElementById("result");
const historyDiv = document.getElementById("history");
const chartCanvas = document.getElementById("resultChart").getContext("2d");

let started = false;

btn.addEventListener("click", () => {
  if (!started) {
    startTime = new Date();
    btn.textContent = "Stop";
    result.textContent = "";
    started = true;
  } else {
    endTime = new Date();
    const elapsed = (endTime - startTime) / 1000;
    displayResult(elapsed);
    updateHistory(elapsed);
    btn.textContent = "Start";
    started = false;
  }
});

function displayResult(time) {
  const diff = Math.abs(time - GOAL_TIME);
  let colorClass = "red";
  if (diff === 0) colorClass = "green";
  else if (diff <= 0.2) colorClass = "blue";
  else if (diff <= 0.5) colorClass = "yellow";

  result.className = colorClass;
  result.textContent = `You clicked in ${time.toFixed(3)} seconds.`;
}

function updateHistory(time) {
  const attemptNum = attemptHistory.length + 1;
  attemptHistory.push(time);
  const min = Math.min(...attemptHistory).toFixed(3);
  const max = Math.max(...attemptHistory).toFixed(3);
  const avg = (attemptHistory.reduce((a, b) => a + b, 0) / attemptHistory.length).toFixed(3);

  historyDiv.innerHTML = `
    <h3>Attempts</h3>
    <ul>
      ${attemptHistory.map((t, i) => `<li>Attempt ${i + 1}: ${t.toFixed(3)}s</li>`).join('')}
    </ul>
    <p><strong>Total:</strong> ${attemptHistory.length} |
       <strong>Min:</strong> ${min}s |
       <strong>Max:</strong> ${max}s |
       <strong>Avg:</strong> ${avg}s</p>
  `;

  renderChart();
}

let chart;
function renderChart() {
  if (chart) chart.destroy();
  chart = new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: attemptHistory.map((_, i) => `Attempt ${i + 1}`),
      datasets: [{
        label: 'Elapsed Time (s)',
        data: attemptHistory,
        borderColor: 'blue',
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: GOAL_TIME + 1
        }
      }
    }
  });
}
