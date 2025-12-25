const tbody = document.querySelector("#rankings tbody");
const filter = document.getElementById("confFilter");

function showDebug(msg) {
  let box = document.getElementById("debugBox");
  if (!box) {
    box = document.createElement("pre");
    box.id = "debugBox";
    box.style.padding = "12px";
    box.style.margin = "12px 0";
    box.style.background = "#fff3cd";
    box.style.border = "1px solid #ffeeba";
    box.style.whiteSpace = "pre-wrap";
    box.style.fontSize = "14px";
    document.body.insertBefore(box, document.body.children[2] || document.body.firstChild);
  }
  box.textContent = msg;
}

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

  showDebug(
    `Loaded rankings: ${rankings.length}\n` +
    `Loaded conf map entries: ${Object.keys(confs).length}\n` +
    `Rows shown (after filter): ${count}\n` +
    `Filter: ${selected}\n` +
    `rankings.json URL: ${new URL("./data/rankings.json", location.href)}\n` +
    `confederations.json URL: ${new URL("./data/confederations.json", location.href)}`
  );
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