let rankings = [];
let confMap = {};

function render() {
  const filter = document.getElementById('confFilter').value;
  const tbody = document.querySelector('#rankings tbody');
  tbody.innerHTML = '';

  const filtered = rankings.filter(t => {
    const conf = confMap[t.team] || 'UNKNOWN';
    return filter === 'ALL' ? true : conf === filter;
  });

  filtered.forEach(team => {
    const conf = confMap[team.team] || 'UNKNOWN';
    const tr = document.createElement('tr');
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
  fetch('data/rankings.json').then(r => r.json()),
  fetch('data/confederations.json').then(r => r.json())
]).then(([rankData, confData]) => {
  rankings = rankData;
  confMap = confData;

  // Add a header column for confederation
  const theadRow = document.querySelector('#rankings thead tr');
  if (!document.getElementById('confHeader')) {
    const th = document.createElement('th');
    th.id = 'confHeader';
    th.textContent = 'Conf';
    theadRow.appendChild(th);
  }

  document.getElementById('confFilter').addEventListener('change', render);
  render();
});