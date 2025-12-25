const tbody = document.querySelector("#rankings tbody");
const filter = document.getElementById("confFilter");

let rankings = [];
let confs = {};

function render() {
  const selected = filter.value;
  tbody.innerHTML = "";

  rankings.forEach(team => {
    const conf = confs[team.team] || "UNKNOWN";
    if (selected !== "ALL" && conf !== selected) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${team.rank}</td>
      <td>${team.team}</td>
      <td>${team.points}</td>
      <td>${conf}</td>
    `;
    tbody.appendChild(tr);
  });
}

Promise.all([
  fetch("./data/rankings.json").then(r => r.json()),
  fetch("./data/confederations.json").then(r => r.json())
])
.then(([rankData, confData]) => {
  rankings = rankData;
  confs = confData;
  render();
})
.catch(err => {
  console.error("Failed to load data:", err);
});

filter.addEventListener("change", render);