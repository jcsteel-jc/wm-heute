const formatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
});

const timeFormatter = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit', minute: '2-digit'
});

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function renderMatches(containerId, date) {
  const container = document.getElementById(containerId);
  const games = window.WM_MATCHES
    .map(game => ({ ...game, date: new Date(game.kickoff) }))
    .filter(game => sameDay(game.date, date))
    .sort((a, b) => a.date - b.date);

  if (games.length === 0) {
    container.innerHTML = '<p class="empty">Keine Spiele gefunden.</p>';
    return;
  }

  container.innerHTML = games.map(game => {
    const germany = game.home.includes('Deutschland') || game.away.includes('Deutschland');
    return `
      <article class="match ${germany ? 'germany' : ''}">
        <div class="time">${timeFormatter.format(game.date)}</div>
        <div>
          <div class="teams">${game.home} – ${game.away}</div>
          <div class="meta">${[game.group, game.stage, game.city].filter(Boolean).join(' · ')}</div>
        </div>
      </article>
    `;
  }).join('');
}

function render() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  document.getElementById('todayLabel').textContent = formatter.format(today);
  renderMatches('todayMatches', today);
  renderMatches('tomorrowMatches', tomorrow);
}

document.getElementById('refreshButton').addEventListener('click', render);
render();
