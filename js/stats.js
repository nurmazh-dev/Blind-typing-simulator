// =====================================================================
// stats.js — страница статистики: сводка, график и история
// ---------------------------------------------------------------------
// График рисует библиотека Chart.js (https://www.chartjs.org/).
// Её файл лежит в js/vendor/, поэтому интернет не нужен.
// =====================================================================

const Stats = {
  chart: null,       // текущий график (его нужно удалять перед новым)
  filterLang: 'all', // фильтр по языку: 'all', 'ru' или 'en'

  // Средние и лучшие значения по списку результатов
  summary(history) {
    const count = history.length;
    if (count === 0) return { count: 0, avgWpm: 0, avgAcc: 0, best: 0, totalTime: 0 };
    const sum = (field) => history.reduce((total, r) => total + r[field], 0);
    return {
      count,
      avgWpm: Math.round(sum('wpm') / count),
      avgAcc: Math.round(sum('accuracy') / count),
      best: Math.max(...history.map(r => r.wpm)),
      totalTime: sum('time'),
    };
  },

  statHtml(value, label, extraClass = '') {
    return `<div class="stat ${extraClass}"><span class="stat-value">${value}</span><span class="stat-label">${label}</span></div>`;
  },

  render() {
    const options = [{ value: 'all', label: t('statsPage.all') }, ...langOptions()];
    segmented(document.getElementById('stats-lang'), options, this.filterLang, v => {
      this.filterLang = v;
      this.render();
    });

    const all = Storage.getHistory();
    const history = this.filterLang === 'all' ? all : all.filter(r => r.lang === this.filterLang);
    const empty = history.length === 0;
    document.getElementById('stats-empty').hidden = !empty;
    document.getElementById('stats-content').hidden = empty;
    if (empty) return;

    // ----- Карточки -----
    const s = this.summary(history);
    const langs = this.filterLang === 'all' ? Object.keys(LAYOUTS) : [this.filterLang];
    const learning = langs.map(l => `${l.toUpperCase()} ${Lessons.progressPercent(l)}%`).join('<br>');
    document.getElementById('stats-cards').innerHTML =
      this.statHtml(s.avgWpm, t('statsPage.avgWpm') + ', WPM') +
      this.statHtml(s.avgAcc + '%', t('statsPage.avgAcc')) +
      this.statHtml(s.best, t('statsPage.best') + ', WPM') +
      this.statHtml(s.count, t('statsPage.count')) +
      this.statHtml(formatTime(s.totalTime), t('statsPage.totalTime')) +
      this.statHtml(learning, t('statsPage.learning'), 'small');

    this.renderChart(history.slice(-30));
    this.renderTable(history.slice(-50).reverse());
  },

  renderChart(items) {
    const canvas = document.getElementById('stats-chart');
    const error = document.getElementById('chart-error');
    if (typeof Chart === 'undefined') { // библиотека не загрузилась
      canvas.parentElement.hidden = true;
      error.hidden = false;
      return;
    }
    canvas.parentElement.hidden = false;
    error.hidden = true;
    if (this.chart) this.chart.destroy();

    // Цвета берём из CSS, чтобы график совпадал с темой
    const css = getComputedStyle(document.documentElement);
    const color = name => css.getPropertyValue(name).trim();

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: items.map(r => this.formatDate(r.date)),
        datasets: [
          {
            label: 'WPM', data: items.map(r => r.wpm), yAxisID: 'y',
            borderColor: color('--accent'), backgroundColor: color('--accent'),
            tension: 0.3, pointRadius: 3,
          },
          {
            label: t('stats.accuracy') + ', %', data: items.map(r => r.accuracy), yAxisID: 'y1',
            borderColor: color('--chart-2'), backgroundColor: color('--chart-2'),
            tension: 0.3, pointRadius: 3, borderDash: [5, 4],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: color('--text'), usePointStyle: true, boxHeight: 6 } } },
        scales: {
          x: { ticks: { color: color('--muted'), maxRotation: 0, autoSkip: true, maxTicksLimit: 6 }, grid: { display: false } },
          y: { beginAtZero: true, ticks: { color: color('--muted') }, grid: { color: color('--border') } },
          y1: { position: 'right', min: 0, max: 100, ticks: { color: color('--muted') }, grid: { display: false } },
        },
      },
    });
  },

  renderTable(items) {
    const body = document.getElementById('history-body');
    body.innerHTML = '';
    items.forEach(r => {
      const tr = document.createElement('tr');
      const cells = [
        this.formatDate(r.date, true),
        this.exerciseName(r),
        r.lang.toUpperCase(),
        r.wpm,
        r.accuracy + '%',
        r.errors,
        formatTime(r.time),
      ];
      cells.forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  },

  exerciseName(r) {
    if (r.mode === 'lesson') {
      const lesson = Lessons.find(r.lang, r.lessonId);
      return lesson ? t('learn.lesson', { n: lesson.number }) : t('type.lesson');
    }
    return t('type.' + r.type) + (r.difficulty ? ' · ' + t('diff.' + r.difficulty) : '');
  },

  formatDate(iso, withTime = false) {
    const options = { day: '2-digit', month: '2-digit' };
    if (withTime) Object.assign(options, { hour: '2-digit', minute: '2-digit' });
    return new Date(iso).toLocaleString(currentUiLang === 'ru' ? 'ru-RU' : 'en-GB', options);
  },
};
