// app.js — FIFA rankings viewer (GitHub Pages static)

const RANKINGS_URL = "data/rankings.json";
const CONFED_URL = "data/confederations.json";

const els = {
  confFilter: document.getElementById("confFilter"),
  tableBody: document.querySelector("#rankings tbody"),
  badgeTotal: document.getElementById("badgeTotal"),
  badgeShown: document.getElementById("badgeShown"),
};

let rankings = [];
let confMap = {};

// --- Helpers ---
function normalizeTeamName(name) {
  // Keep it simple: trim only. (Your keys already match exactly now.)
  return String(name || "").trim();
}

function safeText(text) {
  // Prevent weird HTML injection if a team name had special chars
  const span = document.createElement("span");
  span.textContent = text;
  return span.innerHTML;
}

function formatPoints(p) {
  // FIFA points usually shown with 2 decimals (but keep integers clean)
  const num = Number(p);
  if (!Number.isFinite(num)) return "";
  // Keep 2 decimals but remove trailing zeros like 1870.00 -> 1870
  const s = num.toFixed(2);
  return s.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function getConf(teamName) {
  const key = normalizeTeamName(teamName);
  return confMap[key] || "UNKNOWN";
}

function setBadge(el, value) {
  if (!el) return;
  el.textContent = String(value);
}

// --- Rendering ---
function render() {
  if (!els.tableBody) return;

  const selected = (els.confFilter?.value || "ALL").toUpperCase();

  // Filter
  const rows = rankings.filter((t) => {
    const conf = getConf(t.team);
    if (selected === "ALL") return true;
    return conf === selected;
  });

  // Clear table
  els.tableBody.innerHTML = "";

  // Render rows
  for (const t of rows) {
    const conf = getConf(t.team);

    const tr = document.createElement("tr");
    if (Number(t.rank) <= 10) tr.classList.add("top10");

    tr.innerHTML = `
      <td><span class="rank-pill">${safeText(String(t.rank))}</span></td>
      <td>${safeText(String(t.team))}</td>
      <td class="points">${safeText(formatPoints(t.points))}</td>
      <td><span class="conf-tag">${safeText(conf)}</span></td>
    `;

    els.tableBody.appendChild(tr);
  }

  // Badges (optional)
  setBadge(els.badgeTotal, rankings.length);
  setBadge(els.badgeShown, rows.length);
}

// --- Loading ---
async function loadJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  return await res.json();
}

async function init() {
  try {
    // Load both files
    const [rankingsData, confData] = await Promise.all([
      loadJson(RANKINGS_URL),
      loadJson(CONFED_URL),
    ]);

    // Basic validation
    if (!Array.isArray(rankingsData)) {
      throw new Error("rankings.json must be an array");
    }
    if (typeof confData !== "object" || confData === null || Array.isArray(confData)) {
      throw new Error("confederations.json must be an object map");
    }

    // Normalize rankings
    rankings = rankingsData
      .map((x) => ({
        rank: Number(x.rank),
        team: normalizeTeamName(x.team),
        points: Number(x.points),
      }))
      .filter((x) => Number.isFinite(x.rank) && x.team && Number.isFinite(x.points))
      .sort((a, b) => a.rank - b.rank);

    // Normalize conf map keys
    confMap = {};
    for (const [k, v] of Object.entries(confData)) {
      confMap[normalizeTeamName(k)] = String(v || "UNKNOWN").toUpperCase();
    }

    // Hook filter
    if (els.confFilter) {
      els.confFilter.addEventListener("change", render);
    }

    render();
  } catch (err) {
    // Show a clean error message on page
    console.error(err);

    if (els.tableBody) {
      els.tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="padding:16px;">
            <strong style="display:block;margin-bottom:6px;">Error loading data</strong>
            <span>${safeText(err.message || String(err))}</span>
          </td>
        </tr>
      `;
    }

    // Badges (optional)
    setBadge(els.badgeTotal, "—");
    setBadge(els.badgeShown, "—");
  }
}

init();