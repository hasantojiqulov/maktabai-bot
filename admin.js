const token = prompt("Admin tokenni kiriting:");

async function fetchData() {
  const res = await fetch('/api/data', { headers: { 'X-Admin-Token': token } });
  const data = await res.json();
  document.getElementById('dataTextarea').value = JSON.stringify(data, null, 2);
}

async function saveData() {
  const newData = JSON.parse(document.getElementById('dataTextarea').value);
  await fetch('/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token
    },
    body: JSON.stringify(newData)
  });
  alert('Saqlash muvaffaqiyatli!');
}

async function fetchAnalytics() {
  const res = await fetch('/api/analytics', { headers: { 'X-Admin-Token': token } });
  const analytics = await res.json();
  const tbody = document.querySelector('#analyticsTable tbody');
  tbody.innerHTML = '';
  analytics.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.userId}</td><td>${a.query}</td><td>${a.answeredBy}</td><td>${a.snippet}</td><td>${new Date(a.timestamp).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });
}

document.getElementById('saveBtn').addEventListener('click', saveData);
fetchData();
fetchAnalytics();
