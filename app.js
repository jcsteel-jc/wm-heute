const formatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
});

const shortDateFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short', day: '2-digit', month: '2-digit'
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

function isGermany(game) {
  return game.home.includes('Deutschland') || game.away.includes('Deutschland');
}

function scoreText(game) {
  if (game.homeScore === undefined || game.awayScore === undefined) {
    return timeFormatter.format(game.date);
  }
  return `${game.homeScore}:${game.awayScore}`;
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
    const germany = isGermany(game);
    return `
      <article class="match ${germany ? 'germany' : ''}">
        <div class="time">${scoreText(game)}</div>
        <div>
          <div class="teams">${game.home} – ${game.away}</div>
          <div class="meta">${[game.group, game.stage, game.city].filter(Boolean).join(' · ')}</div>
        </div>
      </article>
    `;
  }).join('');
}

function renderGermanyMatches() {
  const container = document.getElementById('germanyMatches');

  const games = window.WM_MATCHES
    .map(game => ({ ...game, date: new Date(game.kickoff) }))
    .filter(isGermany)
    .sort((a, b) => a.date - b.date);

  container.innerHTML = games.map(game => `
    <article class="match germany">
      <div class="time">${shortDateFormatter.format(game.date)}<br>${scoreText(game)}</div>
      <div>
        <div class="teams">${game.home} – ${game.away}</div>
        <div class="meta">${[game.group, game.stage].filter(Boolean).join(' · ')}</div>
      </div>
    </article>
  `).join('');
}

function calculateGermanyStanding() {
  const groupGames = window.WM_MATCHES.filter(game => game.group === 'Gruppe E');
  const teams = {};

  groupGames.forEach(game => {
    [game.home, game.away].forEach(team => {
      if (!teams[team]) {
        teams[team] = { team, points: 0, played: 0, goalsFor: 0, goalsAgainst: 0 };
      }
    });

    if (game.homeScore === undefined || game.awayScore === undefined) return;

    teams[game.home].played++;
    teams[game.away].played++;
    teams[game.home].goalsFor += game.homeScore;
    teams[game.home].goalsAgainst += game.awayScore;
    teams[game.away].goalsFor += game.awayScore;
    teams[game.away].goalsAgainst += game.homeScore;

    if (game.homeScore > game.awayScore) {
      teams[game.home].points += 3;
    } else if (game.homeScore < game.awayScore) {
      teams[game.away].points += 3;
    } else {
      teams[game.home].points += 1;
      teams[game.away].points += 1;
    }
  });

  const table = Object.values(teams).sort((a, b) =>
    b.points - a.points ||
    (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst) ||
    b.goalsFor - a.goalsFor
  );

  const index = table.findIndex(team => team.team === 'Deutschland');

  if (index === -1) return 'Deutschland nicht in Gruppe E gefunden.';

  const germany = table[index];
  return `${index + 1}. Platz in Gruppe E · ${germany.points} Punkte · ${germany.played} Spiele · ${germany.goalsFor}:${germany.goalsAgainst} Tore`;
}

function render() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  document.getElementById('todayLabel').textContent = formatter.format(today);
  document.getElementById('germanyStanding').textContent = calculateGermanyStanding();

  renderGermanyMatches();
  renderMatches('todayMatches', today);
  renderMatches('tomorrowMatches', tomorrow);
}

document.getElementById('refreshButton').addEventListener('click', render);
render();
