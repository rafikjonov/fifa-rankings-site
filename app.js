const tbody = document.querySelector("#rankings tbody");
const filter = document.getElementById("confFilter");

let rankings = [];
let confs = {};

function render() {
  const selected = filter.value;
  tbody.innerHTML = "";

  let count = 0;
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
    count++;
  });

}

async function loadJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

(async () => {
  try {
    rankings = await loadJson("./data/rankings.json");
    confs = await loadJson("./data/confederations.json");
    render();
  } catch (e) {
    showDebug("ERROR loading data:\n" + e.message + "\n\n" + e.stack);
  }
})();

filter.addEventListener("change", render);