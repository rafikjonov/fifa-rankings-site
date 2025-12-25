fetch('data/rankings.json')
  .then(r => r.json())
  .then(data => {
    const tbody = document.querySelector('#rankings tbody');
    data.forEach(team => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${team.rank}</td>
        <td>${team.team}</td>
        <td>${team.points}</td>
      `;
      tbody.appendChild(tr);
    });
  });