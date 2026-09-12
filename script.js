const users = [
  { name: "Marina Costa", email: "marina.costa", status: "online", ping: "18 ms", connected: "2h 14m" },
  { name: "Rafael Nunes", email: "rafael.nunes", status: "online", ping: "24 ms", connected: "48m" },
  { name: "Caio Mendes", email: "caio.mendes", status: "idle", ping: "31 ms", connected: "5h 02m" },
  { name: "Lia Martins", email: "lia.martins", status: "offline", ping: "—", connected: "ontem" },
  { name: "Bruno Azevedo", email: "bruno.azevedo", status: "online", ping: "21 ms", connected: "16m" }
];

const activities = [
  ["Marina Costa entrou no servidor", "agora"],
  ["Backup automático concluído", "há 12 min"],
  ["Rafael Nunes atualizou o projeto", "há 26 min"],
  ["Novo dispositivo autenticado", "há 41 min"]
];

const metrics = [
  ["Usuários online", "24", "+8,2% hoje", "◌"],
  ["Uso de CPU", "38%", "−4,6% agora", "⌁"],
  ["Memória usada", "6,4 GB", "de 16 GB", "▦"],
  ["Latência média", "22 ms", "−2 ms hoje", "⌁"]
];

const kpiGrid = document.querySelector("#kpi-grid");
kpiGrid.innerHTML = metrics.map(([label, value, trend, icon]) => `
  <article class="metric"><div class="metric-label"><span>${label}</span><span class="metric-icon">${icon}</span></div>
  <div class="metric-value">${value}</div><div class="metric-trend">${trend}</div></article>`).join("");

document.querySelector("#uptime-value").textContent = "18 dias, 04h 32m";
document.querySelector("#chart-hint").textContent = "pico de 31 usuários";

document.querySelector("#resource-list").innerHTML = [["CPU", "38%", 38], ["Memória", "40%", 40], ["Armazenamento", "62%", 62]].map(([name, value, width]) => `
  <div class="resource"><div class="resource-top"><span class="resource-name">${name}</span><span class="resource-value">${value}</span></div><div class="bar"><span style="width:${width}%"></span></div></div>`).join("");

function renderUsers() {
  const query = document.querySelector("#search-input").value.toLowerCase();
  const status = document.querySelector("#status-filter").value;
  const filtered = users.filter(user => (status === "all" || user.status === status) && `${user.name} ${user.email}`.toLowerCase().includes(query));
  const labels = { online: "Online", idle: "Ausente", offline: "Offline" };
  document.querySelector("#user-rows").innerHTML = filtered.length ? filtered.map(user => `
    <tr><td><span class="dot ${user.status === "online" ? "dot-online" : ""}" style="background:${user.status === "online" ? "" : user.status === "idle" ? "#e5af55" : "#a4afa7"}"></span></td>
    <td><div class="user-name">${user.name}</div><div class="user-mail">@${user.email}</div></td><td><span class="user-status">${labels[user.status]}</span></td><td class="ping">${user.ping}</td><td class="connected">${user.connected}</td></tr>`).join("") : `<tr><td colspan="5"><div class="empty">Nenhum usuário encontrado</div></td></tr>`;
}

document.querySelector("#activity-list").innerHTML = activities.map(([text, time]) => `<div class="activity-item"><span class="activity-dot"></span><span class="activity-text">${text}</span><span class="activity-time">${time}</span></div>`).join("");
document.querySelector("#search-input").addEventListener("input", renderUsers);
document.querySelector("#status-filter").addEventListener("change", renderUsers);
renderUsers();

const chart = document.querySelector("#online-chart");
function drawChart() {
  const ratio = window.devicePixelRatio || 1;
  const width = chart.clientWidth;
  const height = chart.clientHeight;
  chart.width = width * ratio; chart.height = height * ratio;
  const context = chart.getContext("2d"); context.scale(ratio, ratio);
  const style = getComputedStyle(document.body); const line = style.getPropertyValue("--line"); const accent = style.getPropertyValue("--accent-dark"); const muted = style.getPropertyValue("--muted");
  const values = [12, 15, 13, 18, 21, 19, 25, 23, 28, 24, 27, 31, 26, 29, 25, 22, 24, 20, 18, 21, 19, 23, 20, 24];
  const left = 10, right = width - 10, top = 18, bottom = height - 28, max = 36;
  context.font = "10px Inter"; context.fillStyle = muted; context.strokeStyle = line; context.lineWidth = 1;
  [0, 12, 24, 36].forEach((tick, index) => { const y = bottom - (tick / max) * (bottom - top); context.beginPath(); context.moveTo(left, y); context.lineTo(right, y); context.stroke(); context.fillText(tick, 0, y + 3); });
  const points = values.map((value, index) => [left + index * ((right - left) / (values.length - 1)), bottom - (value / max) * (bottom - top)]);
  context.beginPath(); points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y)); context.strokeStyle = accent; context.lineWidth = 2.5; context.stroke();
  context.lineTo(right, bottom); context.lineTo(left, bottom); context.closePath(); context.globalAlpha = .16; context.fillStyle = accent; context.fill(); context.globalAlpha = 1;
  context.beginPath(); points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y)); context.strokeStyle = accent; context.lineWidth = 2.5; context.stroke();
  points.forEach(([x, y]) => { context.beginPath(); context.arc(x, y, 2.5, 0, Math.PI * 2); context.fillStyle = accent; context.fill(); });
}
window.addEventListener("resize", drawChart); drawChart();

const savedTheme = localStorage.getItem("server-dashboard-theme");
if (savedTheme === "dark") document.body.dataset.theme = "dark";
document.querySelector("#theme-toggle").addEventListener("click", () => {
  const theme = document.body.dataset.theme === "dark" ? "light" : "dark";
  document.body.dataset.theme = theme;
  localStorage.setItem("server-dashboard-theme", theme);
  document.querySelector("meta[name=theme-color]").setAttribute("content", theme === "dark" ? "#121714" : "#f4f6f1");
  drawChart();
});
