const STORAGE_KEY = 'startpage_data';
const DEFAULT_DATA = {
  activeTab: 'dev',
  city: 'London',
  groups: {
    dev: [
      { name: 'GitHub', url: 'https://github.com', icon: 'bi-github' },
      { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'bi-stack-overflow' },
      { name: 'MDN', url: 'https://developer.mozilla.org', icon: 'bi-file-earmark-code' },
      { name: 'npm', url: 'https://npmjs.com', icon: 'bi-box-seam' },
    ],
    education: [
      { name: 'Khan Academy', url: 'https://khanacademy.org', icon: 'bi-book' },
      { name: 'Coursera', url: 'https://coursera.org', icon: 'bi-mortarboard' },
      { name: 'edX', url: 'https://edx.org', icon: 'bi-journal-code' },
      { name: 'Duolingo', url: 'https://duolingo.com', icon: 'bi-translate' },
    ],
    social: [
      { name: 'Reddit', url: 'https://reddit.com', icon: 'bi-reddit' },
      { name: 'YouTube', url: 'https://youtube.com', icon: 'bi-youtube' },
      { name: 'Twitter', url: 'https://twitter.com', icon: 'bi-twitter-x' },
    ],
    tools: [
      { name: 'Gmail', url: 'https://gmail.com', icon: 'bi-envelope' },
      { name: 'Drive', url: 'https://drive.google.com', icon: 'bi-cloud' },
      { name: 'Calendar', url: 'https://calendar.google.com', icon: 'bi-calendar3' },
    ]
  }
};

const SEARCH_ENGINES = [
  { prefix: '', url: 'https://google.com/search?q=' },
  { prefix: '!', url: 'https://duckduckgo.com/?q=' },
  { prefix: 'y', url: 'https://youtube.com/results?search_query=' },
  { prefix: 'r', url: 'https://reddit.com/search/?q=' },
  { prefix: 'g', url: 'https://github.com/search?q=' },
];

const ICONS = [
  'bi-link-45deg', 'bi-github', 'bi-youtube', 'bi-twitter-x', 'bi-reddit',
  'bi-spotify', 'bi-discord', 'bi-slack', 'bi-telegram', 'bi-whatsapp',
  'bi-envelope', 'bi-cloud', 'bi-calendar3', 'bi-book', 'bi-bookmark',
  'bi-translate', 'bi-globe', 'bi-code-slash', 'bi-terminal', 'bi-braces',
  'bi-brackets', 'bi-hdd', 'bi-cpu', 'bi-memory', 'bi-display',
  'bi-phone', 'bi-tablet', 'bi-laptop', 'bi-watch', 'bi-camera',
  'bi-music-note', 'bi-play-btn', 'bi-film', 'bi-controller', 'bi-joystick',
  'bi-cart', 'bi-bag', 'bi-credit-card', 'bi-cash', 'bi-currency-dollar',
  'bi-graph-up', 'bi-pie-chart', 'bi-bar-chart', 'bi-table', 'bi-folder',
  'bi-file-earmark', 'bi-file-text', 'bi-image', 'bi-palette', 'bi-brush',
  'bi-emoji-smile', 'bi-heart', 'bi-star', 'bi-flag', 'bi-bookmark-star',
  'bi-bell', 'bi-chat-dots', 'bi-people', 'bi-person', 'bi-house',
  'bi-gear', 'bi-tools', 'bi-wrench', 'bi-hammer', 'bi-lightning',
  'bi-battery-full', 'bi-wifi', 'bi-bluetooth', 'bi-search', 'bi-zoom-in',
  'bi-zoom-out', 'bi-arrows', 'bi-arrows-fullscreen', 'bi-box-seam',
  'bi-stack-overflow', 'bi-file-earmark-code', 'bi-journal-code',
  'bi-journal-text', 'bi-mortarboard', 'bi-award', 'bi-trophy',
  'bi-check-circle', 'bi-x-circle', 'bi-exclamation-circle', 'bi-info-circle',
  'bi-question-circle', 'bi-plus', 'bi-dash', 'bi-x', 'bi-arrow-right',
  'bi-arrow-left', 'bi-arrow-up', 'bi-arrow-down', 'bi-arrow-counterclockwise',
  'bi-play-fill', 'bi-pause-fill', 'bi-stop-fill', 'bi-skip-forward',
  'bi-skip-backward', 'bi-shuffle', 'bi-repeat', 'bi-speaker', 'bi-volume-up',
  'bi-volume-mute', 'bi-cloud-sun', 'bi-cloud-rain', 'bi-sun', 'bi-moon',
  'bi-stars', 'bi-tree', 'bi-flower1', 'bi-droplet', 'bi-fire', 'bi-lightning-fill',
  'bi-easel', 'bi-paint-bucket', 'bi-mask', 'bi-joystick', 'bi-diagram-3',
  'bi-gear-wide', 'bi-sliders', 'bi-list', 'bi-grid', 'bi-layout-text-window',
  'bi-layoutColumns', 'bi-layoutSidebar', 'bi-columns', 'bi-arrows-angle-contract',
  'bi-arrows-angle-expand', 'bi-fullscreen', 'bi-fullscreen-exit'
];

let data = JSON.parse(JSON.stringify(DEFAULT_DATA));
let timerInterval = null;
let timerRunning = false;
let timerSeconds = 25 * 60;
let isBreak = false;

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      data = { ...DEFAULT_DATA, ...parsed };
    }
  } catch (e) {}
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${mins}`;
  document.getElementById('date').textContent = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function renderTabs() {
  const tabsEl = document.getElementById('tabs');
  const groups = Object.keys(data.groups);
  tabsEl.innerHTML = groups.map(g => `
    <button class="tab ${g === data.activeTab ? 'active' : ''}" data-tab="${g}">
      ${g}
      ${groups.length > 1 ? `<span class="remove" data-remove-group="${g}">×</span>` : ''}
    </button>
  `).join('') + `<button class="add-tab-btn" id="addTabBtn">+</button>`;
  
  tabsEl.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', e => {
      if (e.target.classList.contains('remove')) {
        e.stopPropagation();
        removeGroup(e.target.dataset.removeGroup);
      } else {
        switchTab(tab.dataset.tab);
      }
    });
  });
  document.getElementById('addTabBtn').addEventListener('click', openAddGroupModal);
}

function renderBookmarks() {
  const container = document.getElementById('bookmarks');
  const bookmarks = data.groups[data.activeTab] || [];
  
  container.innerHTML = bookmarks.map((b, i) => `
    <a href="${b.url}" class="bookmark" target="_blank" data-bookmark-index="${i}">
      <span class="remove" data-remove-bookmark="${i}">×</span>
      <span class="edit" data-edit-bookmark="${i}">✎</span>
      <i class="bi ${b.icon}"></i>
      <span>${b.name}</span>
    </a>
  `).join('') + `
    <div class="add-bookmark" id="addBookmarkBtn">
      <i class="bi bi-plus-lg"></i>
      <span>Add</span>
    </div>
  `;
  
  container.querySelectorAll('.bookmark').forEach(link => {
    link.addEventListener('click', e => {
      if (e.target.classList.contains('remove')) {
        e.preventDefault();
        e.stopPropagation();
        removeBookmark(parseInt(e.target.dataset.removeBookmark));
      } else if (e.target.classList.contains('edit')) {
        e.preventDefault();
        e.stopPropagation();
        editBookmark(parseInt(e.target.dataset.editBookmark));
      }
    });
  });
  document.getElementById('addBookmarkBtn').addEventListener('click', () => openAddBookmarkModal());
}

function switchTab(tab) {
  data.activeTab = tab;
  saveData();
  renderTabs();
  renderBookmarks();
}

let editingBookmarkIndex = null;
let selectedIcon = 'bi-link-45deg';

function renderIconPicker(filter = '') {
  const picker = document.getElementById('iconPicker');
  const filtered = ICONS.filter(i => i.toLowerCase().includes(filter.toLowerCase()));
  picker.innerHTML = filtered.map(icon => `
    <span class="icon-option ${icon === selectedIcon ? 'selected' : ''}" data-icon="${icon}">
      <i class="bi ${icon}"></i>
    </span>
  `).join('');
  
  picker.querySelectorAll('.icon-option').forEach(opt => {
    opt.addEventListener('click', () => {
      selectedIcon = opt.dataset.icon;
      document.getElementById('bmIconPreview').className = `bi ${selectedIcon}`;
      renderIconPicker(document.getElementById('iconSearch').value);
    });
  });
}

function openAddBookmarkModal(index = null) {
  editingBookmarkIndex = index;
  document.getElementById('addBookmarkModal').classList.add('visible');
  
  if (index !== null) {
    const bookmark = data.groups[data.activeTab][index];
    document.getElementById('bmName').value = bookmark.name;
    document.getElementById('bmUrl').value = bookmark.url;
    selectedIcon = bookmark.icon || 'bi-link-45deg';
    document.querySelector('#addBookmarkModal h3').textContent = 'Edit Bookmark';
  } else {
    document.getElementById('bmName').value = '';
    document.getElementById('bmUrl').value = '';
    selectedIcon = 'bi-link-45deg';
    document.querySelector('#addBookmarkModal h3').textContent = 'Add Bookmark';
  }
  
  document.getElementById('bmIconPreview').className = `bi ${selectedIcon}`;
  document.getElementById('iconSearch').value = '';
  document.getElementById('iconSearch').style.display = 'none';
  document.getElementById('iconPicker').classList.remove('visible');
  renderIconPicker();
  document.getElementById('bmName').focus();
}

function editBookmark(index) {
  openAddBookmarkModal(index);
}

function closeModal(id) {
  document.getElementById(id).classList.remove('visible');
}

function saveBookmark() {
  const name = document.getElementById('bmName').value.trim();
  const url = document.getElementById('bmUrl').value.trim();
  const icon = selectedIcon;
  
  if (name && url) {
    if (!data.groups[data.activeTab]) data.groups[data.activeTab] = [];
    if (editingBookmarkIndex !== null) {
      data.groups[data.activeTab][editingBookmarkIndex] = { name, url, icon };
    } else {
      data.groups[data.activeTab].push({ name, url, icon });
    }
    saveData();
    renderBookmarks();
    closeModal('addBookmarkModal');
    editingBookmarkIndex = null;
  }
}

function removeBookmark(index) {
  data.groups[data.activeTab].splice(index, 1);
  saveData();
  renderBookmarks();
}

function openAddGroupModal() {
  document.getElementById('addGroupModal').classList.add('visible');
  document.getElementById('groupName').value = '';
  document.getElementById('groupName').focus();
}

function saveGroup() {
  const name = document.getElementById('groupName').value.trim().toLowerCase();
  if (name && !data.groups[name]) {
    data.groups[name] = [];
    data.activeTab = name;
    saveData();
    renderTabs();
    renderBookmarks();
    closeModal('addGroupModal');
  }
}

function removeGroup(group) {
  if (Object.keys(data.groups).length > 1) {
    delete data.groups[group];
    data.activeTab = Object.keys(data.groups)[0];
    saveData();
    renderTabs();
    renderBookmarks();
  }
}

function search(query) {
  if (!query) return;
  let engine = SEARCH_ENGINES[0];
  for (const e of SEARCH_ENGINES) {
    if (query.startsWith(e.prefix)) {
      engine = e;
      query = query.slice(e.prefix.length);
      break;
    }
  }
  window.open(engine.url + encodeURIComponent(query), '_blank');
}

document.getElementById('search').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    search(e.target.value);
    e.target.value = '';
  }
});

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  document.getElementById('timerTime').textContent = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  document.getElementById('timerLabel').textContent = isBreak ? 'Break' : 'Focus';
  document.getElementById('timerTime').style.color = isBreak ? '#98c379' : '#e5c07b';
}

function toggleTimer() {
  const btn = document.getElementById('timerToggle');
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    btn.innerHTML = '<i class="bi bi-play-fill"></i>';
  } else {
    if (timerSeconds === 0) timerSeconds = 25 * 60;
    timerInterval = setInterval(() => {
      if (--timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        isBreak = !isBreak;
        timerSeconds = isBreak ? 5 * 60 : 25 * 60;
        new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
      }
      updateTimerDisplay();
    }, 1000);
    timerRunning = true;
    btn.innerHTML = '<i class="bi bi-pause-fill"></i>';
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  isBreak = false;
  timerSeconds = 25 * 60;
  document.getElementById('timerToggle').innerHTML = '<i class="bi bi-play-fill"></i>';
  updateTimerDisplay();
}

async function fetchWeather() {
  const city = data.city || 'London';
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();
    if (!geoData.results || !geoData.results[0]) {
      document.getElementById('weather').textContent = 'City not found';
      return;
    }
    const { latitude, longitude, name, country } = geoData.results[0];
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weather = await weatherRes.json();
    const temp = Math.round(weather.current_weather.temperature);
    document.getElementById('weather').innerHTML = `<i class="bi bi-cloud-sun"></i> ${temp}°C <span style="font-size:0.7rem;color:var(--muted)">${name}</span>`;
  } catch (e) {
    document.getElementById('weather').textContent = '--';
  }
}

function openSettingsModal() {
  document.getElementById('settingsModal').classList.add('visible');
  document.getElementById('cityInput').value = data.city || '';
  document.getElementById('cityInput').focus();
}

function saveSettings() {
  const city = document.getElementById('cityInput').value.trim();
  if (city) {
    data.city = city;
    saveData();
    fetchWeather();
    closeModal('settingsModal');
  }
}

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') {
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  if (e.key === 's') document.getElementById('search').focus();
  if (e.key === 't') document.getElementById('timerBar').classList.toggle('visible');
  if (e.key === ',') openSettingsModal();
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.visible').forEach(m => m.classList.remove('visible'));
  }
  if (e.key >= '1' && e.key <= '9') {
    const idx = parseInt(e.key) - 1;
    const links = data.groups[data.activeTab];
    if (links && links[idx]) window.open(links[idx].url, '_blank');
  }
});

clock();
setInterval(clock, 1000);
loadData();
renderTabs();
renderBookmarks();
updateTimerDisplay();
fetchWeather();

window.switchTab = switchTab;
window.removeGroup = removeGroup;
window.removeBookmark = removeBookmark;
window.openAddBookmarkModal = openAddBookmarkModal;
window.closeModal = closeModal;
window.saveBookmark = saveBookmark;
window.openAddGroupModal = openAddGroupModal;
window.saveGroup = saveGroup;
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.openSettingsModal = openSettingsModal;
window.saveSettings = saveSettings;

document.getElementById('timerToggle').addEventListener('click', toggleTimer);
document.getElementById('timerReset').addEventListener('click', resetTimer);
document.getElementById('timerSettings').addEventListener('click', openSettingsModal);

document.querySelectorAll('.modal .btn-cancel, .modal .btn-save').forEach(btn => {
  btn.addEventListener('click', e => {
    const modal = btn.closest('.modal-overlay');
    if (btn.classList.contains('btn-cancel')) {
      modal.classList.remove('visible');
    } else if (btn.classList.contains('btn-save')) {
      if (modal.id === 'addBookmarkModal') saveBookmark();
      else if (modal.id === 'addGroupModal') saveGroup();
      else if (modal.id === 'settingsModal') saveSettings();
    }
  });
});

document.getElementById('toggleIconPicker').addEventListener('click', () => {
  const picker = document.getElementById('iconPicker');
  const search = document.getElementById('iconSearch');
  const isVisible = picker.classList.contains('visible');
  if (isVisible) {
    picker.classList.remove('visible');
    search.style.display = 'none';
  } else {
    picker.classList.add('visible');
    search.style.display = 'block';
    search.focus();
  }
});

document.getElementById('iconSearch').addEventListener('input', e => {
  renderIconPicker(e.target.value);
});
