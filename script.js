const $ = (selector) => document.querySelector(selector);
const levelValue = $('#levelValue');
const coinValue = $('#coinValue');
const powerValue = $('#powerValue');
const armorValue = $('#armorValue');
const heroHpBar = $('#heroHpBar');
const bossHpBar = $('#bossHpBar');
const bossName = $('#bossName');
const bossAvatar = $('#bossAvatar');
const missionText = $('#missionText');
const typedText = $('#typedText');
const statusEl = $('#status');
const missionHint = $('#missionHint');
const stageBadge = $('#stageBadge');
const toggleSpeakBtn = $('#toggleSpeak');
const toggleSoundBtn = $('#toggleSound');
const toggleDictationBtn = $('#toggleDictation');
const toggleShopBtn = $('#toggleShop');
const startQuestBtn = $('#startQuest');
const specialWeaponBtn = $('#specialWeapon');
const heroFighter = $('#heroFighter');
const heroName = $('#heroName');
const catArt = $('.cat-art');
const projectile = $('#projectile');
const rhythmStage = $('#rhythmStage');
const comboValue = $('#comboValue');
const rewardPanel = $('#rewardPanel');
const rewardOptions = $('#rewardOptions');
const shopPanel = $('#shopPanel');
const shopCoins = $('#shopCoins');
const shopOptions = $('#shopOptions');
const difficultySelect = $('#difficultySelect');
const heroEquipment = $('#heroEquipment');
const bossStyle = $('#bossStyle');
const weaponCharge = $('#weaponCharge');
const victoryScene = $('#victoryScene');
const victoryTitle = $('#victoryTitle');
const victoryMessage = $('#victoryMessage');
const nextChapterBtn = $('#nextChapter');
const restartVictoryBtn = $('#restartVictory');
const defeatScene = $('#defeatScene');
const restartDefeatBtn = $('#restartDefeat');

const difficultySettings = {
  easy: { label: 'Легка', wordPause: 900, letterStep: 1150, bossAttackEvery: 7000, speed: 0.9, hitWindow: 32 },
  normal: { label: 'Нормальна', wordPause: 700, letterStep: 950, bossAttackEvery: 5600, speed: 1.05, hitWindow: 27 },
  hard: { label: 'Важка', wordPause: 500, letterStep: 760, bossAttackEvery: 4400, speed: 1.2, hitWindow: 22 }
};
const savedDifficulty = (() => {
  try {
    return window.localStorage.getItem('cat-key-quest-difficulty');
  } catch {
    return null;
  }
})();

const bosses = [
  { name: 'Мурчик-Гігант', avatar: '👹', style: 'Штурмовий стиль', pattern: 'burst', words: ['paws', 'slash', 'mew', 'claw', 'storm', 'impact'], color: '#ff8268' },
  { name: 'Лісний Тиран', avatar: '🐺', style: 'Лісова стрімка атака', pattern: 'swift', words: ['rapid', 'dash', 'flash', 'pounce', 'swift', 'blink'], color: '#ffbf69' },
  { name: 'Клубок Тіней', avatar: '🦊', style: 'Нічний лікоть', pattern: 'shadow', words: ['shadow', 'whisper', 'black', 'night', 'dodge', 'mask'], color: '#9c8cff' },
  { name: 'Нічний Лев', avatar: '🦁', style: 'Високий фокус', pattern: 'laser', words: ['glow', 'lion', 'flare', 'hiss', 'flash', 'rage'], color: '#ff668a' },
  { name: 'КОРОЛЬ КОТІВ', avatar: '🐲', style: 'Кінцева буря', pattern: 'final', words: ['royal', 'thunder', 'ember', 'striker', 'storm', 'catnap'], color: '#7de2d1', final: true }
];

const nextChapterBosses = [
  { name: 'Комета Кігтик', avatar: '☄️', style: 'Кометний розгін', pattern: 'swift', words: ['comet', 'orbit', 'meteor', 'nova', 'cosmo', 'lunar'], color: '#ffbf69' },
  { name: 'Павук Невагомості', avatar: '🕷️', style: 'Пастки без тяжіння', pattern: 'shadow', words: ['float', 'drift', 'space', 'gravity', 'web', 'void'], color: '#9c8cff' },
  { name: 'Механічний Мур', avatar: '🤖', style: 'Залізний натиск', pattern: 'burst', words: ['metal', 'gears', 'robot', 'laser', 'spark', 'servo'], color: '#7de2d1' },
  { name: 'Дракон Зорепаду', avatar: '🐉', style: 'Зоряний шквал', pattern: 'laser', words: ['comet', 'shard', 'flare', 'meteor', 'blaze', 'orbit'], color: '#ff668a' },
  { name: 'ІМПЕРАТОР МІСЯЦЯ', avatar: '🌙', style: 'Місячна буря', pattern: 'final', words: ['eclipse', 'silver', 'cosmic', 'moonlight', 'starlord', 'lunar'], color: '#7de2d1', final: true }
];
const loot = [
  { id: 'pistol', icon: '🔫', name: 'Котячий бластер', description: 'Плюс 2 урон за влучання', apply: (game) => { game.power += 2; } },
  { id: 'armor', icon: '🛡️', name: 'Панцир Маркіза', description: 'Броня +1 і оберігає від ударів', apply: (game) => { game.armor += 1; game.heroHp = Math.min(game.maxHp, game.heroHp + 10); } },
  { id: 'fish', icon: '🐟', name: 'Золота рибка', description: 'Відновлює 35 здоров’я', apply: (game) => { game.heroHp = Math.min(game.maxHp, game.heroHp + 35); } },
  { id: 'boots', icon: '🥾', name: 'Чоботи-ракети', description: 'Розширює кільце влучання', apply: (game) => { game.windowBonus += 12; } },
  { id: 'heart', icon: '💖', name: 'Запасне життя', description: '+20 максимуму здоров’я', apply: (game) => { game.maxHp += 20; game.heroHp = Math.min(game.maxHp, game.heroHp + 20); } },
  { id: 'coins', icon: '🪙', name: 'Мішечок монет', description: '+40 монет', apply: (game) => { game.coins += 40; } },
  { id: 'focus', icon: '✨', name: 'Комбо-фокус', description: 'Комбо дає більше шкоди', apply: (game) => { game.comboBonus += 1; } },
  { id: 'drone', icon: '🤖', name: 'Голубий дрон', description: 'Побічні удари після кожного влучання', apply: (game) => { game.sideAttack += 1; } }
];

const shopStock = [
  { id: 'armor', icon: '🛡️', name: 'Панцир', description: '+1 броня', price: 18, apply: (game) => { game.armor += 1; } },
  { id: 'fish', icon: '🐟', name: 'Рибка', description: '+35 здоров’я', price: 15, apply: (game) => { game.heroHp = Math.min(game.maxHp, game.heroHp + 35); } },
  { id: 'cloak', icon: '🧥', name: 'Тіньовий плащ', description: 'Меньше шкоди від пропусків', price: 24, apply: (game) => { game.armor += 1; } },
  { id: 'medkit', icon: '🩹', name: 'Мед-комплект', description: '+20 здоров’я', price: 10, apply: (game) => { game.heroHp = Math.min(game.maxHp, game.heroHp + 20); } },
  { id: 'saber', icon: '🗡️', name: 'Котячий клинок', description: 'Удар вбиває сильніше', price: 30, apply: (game) => { game.power += 2; } }
];

const nextChapterLoot = [
  { id: 'nova-blaster', icon: '🌠', name: 'Бластер наднової', description: 'Сила +4', apply: (game) => { game.power += 4; } },
  { id: 'moon-armor', icon: '🌙', name: 'Місячна броня', description: 'Броня +2 і здоров’я +25', apply: (game) => { game.armor += 2; game.heroHp = Math.min(game.maxHp, game.heroHp + 25); } },
  { id: 'star-drone', icon: '🛰️', name: 'Зоряний дрон', description: 'Подвійний побічний удар', apply: (game) => { game.sideAttack += 2; } },
  { id: 'comet-boots', icon: '🚀', name: 'Чоботи комети', description: 'Кільце влучання +20', apply: (game) => { game.windowBonus += 20; } },
  { id: 'eclipse-heart', icon: '💜', name: 'Серце затемнення', description: 'Максимум здоров’я +40', apply: (game) => { game.maxHp += 40; game.heroHp = Math.min(game.maxHp, game.heroHp + 40); } },
  { id: 'nova-focus', icon: '✨', name: 'Фокус наднової', description: 'Комбо дає більше шкоди', apply: (game) => { game.comboBonus += 3; } }
];

const nextChapterShopStock = [
  { id: 'moon-armor', icon: '🌙', name: 'Місячна броня', description: '+2 броня', price: 42, apply: (game) => { game.armor += 2; } },
  { id: 'moon-fish', icon: '🐟', name: 'Космічна рибка', description: '+55 здоров’я', price: 34, apply: (game) => { game.heroHp = Math.min(game.maxHp, game.heroHp + 55); } },
  { id: 'star-drone', icon: '🛰️', name: 'Зоряний дрон', description: 'Посилює побічні удари', price: 52, apply: (game) => { game.sideAttack += 2; } },
  { id: 'eclipse-heart', icon: '💜', name: 'Серце затемнення', description: '+35 максимуму здоров’я', price: 46, apply: (game) => { game.maxHp += 35; game.heroHp = Math.min(game.maxHp, game.heroHp + 35); } },
  { id: 'nova-focus', icon: '✨', name: 'Фокус наднової', description: 'Сильніше комбо', price: 44, apply: (game) => { game.comboBonus += 2; } },
  { id: 'comet-saber', icon: '⚔️', name: 'Клинок комети', description: '+4 сила', price: 58, apply: (game) => { game.power += 4; } }
];

const state = {
  chapter: 1,
  level: 1,
  coins: 0,
  power: 1,
  armor: 0,
  maxHp: 100,
  heroHp: 100,
  bossHp: 100,
  bossMaxHp: 100,
  combo: 0,
  comboBonus: 0,
  sideAttack: 0,
  windowBonus: 0,
  difficulty: difficultySettings[savedDifficulty] ? savedDifficulty : 'normal',
  inventory: [],
  activeNote: null,
  nextNoteAt: 0,
  noteDuration: 1200,
  animationFrame: null,
  transitionTimeout: null,
  shopReturnMode: null,
  shopPausedAt: null,
  mission: null,
  choices: [],
  mode: 'ready',
  isFinalWin: false,
  speakEnabled: true,
  soundEnabled: true,
  audioContext: null,
  recognition: null,
  isListening: false,
  notes: [],
  wordProgress: 0,
  specialWeaponCharge: 0,
  nextBossAttackAt: 0,
  activeWord: '',
  difficultyMultiplier: 1,
  noteCounter: 0
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const randomFrom = (items) => items[Math.floor(Math.random() * items.length)];

const setStatus = (message) => { statusEl.textContent = message; };

const renderHeroEquipment = () => {
  heroEquipment.replaceChildren();
  const visibleItems = state.inventory.slice(-3);
  const hiddenCount = state.inventory.length - visibleItems.length;

  if (hiddenCount > 0) {
    const count = document.createElement('span');
    count.className = 'equipment-count';
    count.textContent = `+${hiddenCount}`;
    heroEquipment.append(count);
  }

  visibleItems.forEach((item) => {
    const token = document.createElement('span');
    token.className = 'equipment-token';
    token.textContent = item.icon;
    token.title = item.name;
    token.setAttribute('aria-label', item.name);
    heroEquipment.append(token);
  });

  heroEquipment.hidden = state.inventory.length === 0;
};

const applyHeroVisuals = () => {
  heroFighter.classList.toggle('armored', state.armor > 0);
  heroFighter.classList.toggle('dead', state.heroHp <= 0);
  renderHeroEquipment();
};

const updateWeaponUI = () => {
  const charge = clamp(state.specialWeaponCharge, 0, 100);
  weaponCharge.textContent = `Заряд: ${charge}%`;
  specialWeaponBtn.textContent = `1: Урановий снаряд · ${charge}%`;
  specialWeaponBtn.disabled = charge < 100 || state.mode !== 'fighting';
  if (charge >= 100) specialWeaponBtn.classList.add('ready');
  else specialWeaponBtn.classList.remove('ready');
};

const speak = (message) => {
  if (!state.speakEnabled || !('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'uk-UA';
  utterance.rate = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const enableAudio = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!state.audioContext) state.audioContext = new AudioContextClass();
  if (state.audioContext.state === 'suspended') state.audioContext.resume();
};

const playKeySound = (key, isHit = false) => {
  if (!state.soundEnabled) return;
  enableAudio();
  if (!state.audioContext) return;

  const letters = [523.25, 587.33, 659.25, 783.99, 880];
  const index = Math.max(0, key.toLowerCase().charCodeAt(0) - 97);
  const frequency = isHit ? letters[(index + state.combo + state.level) % letters.length] : letters[index % letters.length] * 0.75;
  const start = state.audioContext.currentTime;
  const osc = state.audioContext.createOscillator();
  const gain = state.audioContext.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(isHit ? 0.08 : 0.03, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + (isHit ? 0.22 : 0.12));
  osc.connect(gain);
  gain.connect(state.audioContext.destination);
  osc.start(start);
  osc.stop(start + (isHit ? 0.24 : 0.14));
};

const renderShop = () => {
  shopOptions.replaceChildren();
  const stock = state.chapter > 1 ? nextChapterShopStock : shopStock;
  stock.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = 'shop-item';
    button.type = 'button';
    button.disabled = state.coins < item.price;
    button.innerHTML = `<span class="shop-number">${index + 1} · ${item.icon}</span><strong>${item.name}</strong><p>${item.description}</p><span class="shop-price">${item.price} монет</span>`;
    button.addEventListener('click', () => buyShopItem(index));
    shopOptions.append(button);
  });
};

const updateHud = () => {
  levelValue.textContent = String(Math.min(state.level, bosses.length));
  coinValue.textContent = String(state.coins);
  powerValue.textContent = String(state.power);
  armorValue.textContent = String(state.armor);
  heroHpBar.style.width = `${clamp((state.heroHp / state.maxHp) * 100, 0, 100)}%`;
  bossHpBar.style.width = `${clamp((state.bossHp / state.bossMaxHp) * 100, 0, 100)}%`;
  comboValue.textContent = String(state.combo);
  shopCoins.textContent = String(state.coins);
  applyHeroVisuals();
  renderShop();
};

const buyShopItem = (index) => {
  const stock = state.chapter > 1 ? nextChapterShopStock : shopStock;
  const item = stock[index];
  if (state.mode !== 'shop' || !item) return;
  if (state.coins < item.price) {
    setStatus(`Ще потрібно ${item.price - state.coins} монет.`);
    return;
  }
  if (item.id === 'fish' && state.heroHp >= state.maxHp) {
    setStatus('Маркіз уже повний здоров’я, куди ще рибки?');
    return;
  }
  state.coins -= item.price;
  item.apply(state);
  state.inventory.push(item);
  updateHud();
  setStatus(`Куплено: ${item.name}!`);
  speak(`Куплено ${item.name}.`);
};

const openShop = () => {
  if (state.mode === 'shop') return;
  state.shopReturnMode = state.mode;
  if (state.mode === 'fighting' && state.animationFrame !== null) {
    state.shopPausedAt = performance.now();
    cancelAnimationFrame(state.animationFrame);
    state.animationFrame = null;
  }
  state.mode = 'shop';
  shopPanel.hidden = false;
  renderShop();
  setStatus('Крамниця відкрита. Обери номер предмета на екрані.');
};

const closeShop = () => {
  if (state.mode !== 'shop') return;
  shopPanel.hidden = true;
  state.mode = state.shopReturnMode || 'ready';
  state.shopReturnMode = null;
  if (state.mode === 'fighting') {
    const pauseDuration = performance.now() - state.shopPausedAt;
    state.nextNoteAt += pauseDuration;
    state.nextBossAttackAt += pauseDuration;
    state.notes.forEach((note) => { note.spawnAt += pauseDuration; });
    state.shopPausedAt = null;
    state.animationFrame = requestAnimationFrame(gameLoop);
  }
  setStatus(state.mode === 'fighting' ? 'Бій триває!' : 'Крамницю закрито.');
};

const stopGameLoop = () => {
  if (state.animationFrame !== null) cancelAnimationFrame(state.animationFrame);
  state.animationFrame = null;
  state.notes.forEach((note) => note.element.remove());
  state.notes = [];
  clearWordTargets();
};

const showRewards = () => {
  stopGameLoop();
  state.mode = 'reward';
  const availableLoot = state.chapter > 1 ? nextChapterLoot : loot;
  state.choices = [...availableLoot].sort(() => Math.random() - 0.5).slice(0, 3);
  rewardOptions.replaceChildren();
  state.choices.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = 'reward-card';
    button.type = 'button';
    button.innerHTML = `<span class="reward-number">${index + 1} · ${item.icon}</span><strong>${item.name}</strong><p>${item.description}</p>`;
    button.addEventListener('click', () => chooseReward(index));
    rewardOptions.append(button);
  });
  rewardPanel.hidden = false;
  missionHint.textContent = 'Вибери нагороду';
  stageBadge.textContent = state.isFinalWin ? 'ФІНАЛЬНА ПЕРЕМОГА' : `РІВЕНЬ ${state.level} ПРОЙДЕНО`;
  missionText.textContent = state.isFinalWin ? 'Король котів переможений!' : 'Боса переможено!';
  typedText.textContent = 'Вибери одну речі з трьох.';
  setStatus('Перемога! Обери одну нагороду.');
  speak('Перемога. Обери нагороду.');
};

const dieHero = () => {
  stopGameLoop();
  state.mode = 'dead';
  state.heroHp = 0;
  heroFighter.classList.add('dead');
  missionHint.textContent = 'Кінець гри';
  stageBadge.textContent = 'GAME OVER';
  missionText.textContent = 'Маркіз упав у бою!';
  typedText.textContent = 'Натисни «Почати знову», щоб спробувати ще раз.';
  setStatus('Кіт переможений. Почни заново.');
  speak('Маркіз переможений. Гру завершено.');
  updateHud();
  defeatScene.hidden = false;
  defeatScene.classList.remove('victory-celebrate');
  void defeatScene.offsetWidth;
  defeatScene.classList.add('victory-celebrate');
  restartDefeatBtn.focus();
};

const createMission = () => {
  const campaignBosses = state.chapter > 1 ? nextChapterBosses : bosses;
  const boss = campaignBosses[Math.min(state.level - 1, campaignBosses.length - 1)];
  state.mission = boss;
  state.mode = 'fighting';
  state.combo = 0;
  state.notes = [];
  state.activeWord = '';
  state.wordProgress = 0;
  state.isFinalWin = Boolean(boss.final);
  const difficulty = difficultySettings[state.difficulty];
  const bossSpeedMultiplier = 1 + (state.chapter - 1) * 0.28 + (state.level - 1) * 0.08;
  state.difficultyMultiplier = difficulty.speed * bossSpeedMultiplier;
  state.nextNoteAt = performance.now() + 500;
  state.nextBossAttackAt = performance.now() + difficulty.bossAttackEvery;
  state.specialWeaponCharge = Math.min(100, state.specialWeaponCharge + 20);
  state.bossMaxHp = (state.isFinalWin ? 260 : 110 + state.level * 18) * (state.chapter > 1 ? 1.45 : 1);
  state.bossHp = state.bossMaxHp;
  bossName.textContent = boss.name;
  bossAvatar.textContent = boss.avatar;
  bossStyle.textContent = `Стиль: ${boss.style}`;
  stageBadge.textContent = state.isFinalWin ? `ГЛАВА ${state.chapter} · ФІНАЛЬНИЙ БОС` : `ГЛАВА ${state.chapter} · РІВЕНЬ ${state.level}`;
  missionHint.textContent = state.isFinalWin ? 'Фінальна боротьба' : `Бос: ${boss.name}`;
  missionText.textContent = 'Пишіть слова в правильному порядку!';
  typedText.textContent = 'Слідкуй за літерами, що падають у кільця.';
  updateHud();
  setStatus(`Рівень ${state.level}: ${boss.name}.`);
  speak(`Рівень ${state.level}. Бос ${boss.name}.`);
  updateWeaponUI();
  state.animationFrame = requestAnimationFrame(gameLoop);
};

const chooseReward = (index) => {
  if (state.mode !== 'reward' || !state.choices[index]) return;
  const reward = state.choices[index];
  reward.apply(state);
  state.inventory.push(reward);
  rewardPanel.hidden = true;
  state.level += 1;
  updateHud();

  if (state.isFinalWin) {
    state.mode = 'won';
    missionHint.textContent = 'Пригода завершена';
    stageBadge.textContent = 'ПЕРЕМОГА';
    missionText.textContent = 'Маркіз врятував котяче місто!';
    typedText.textContent = `Нагорода: ${reward.name}.`;
    setStatus(`Перемога! Обрана нагорода: ${reward.name}.`);
    speak(`Перемога! ${reward.name}.`);
    victoryTitle.textContent = state.chapter === 1 ? 'Король котів переможений!' : 'Імператор місяця переможений!';
    victoryMessage.textContent = state.chapter === 1
      ? 'Маркіз врятував котяче місто. Попереду нова пригода на Місяці.'
      : 'Маркіз переміг усіх ворогів і став легендою зоряного королівства.';
    nextChapterBtn.hidden = state.chapter !== 1;
    victoryScene.hidden = false;
    victoryScene.classList.remove('victory-celebrate');
    void victoryScene.offsetWidth;
    victoryScene.classList.add('victory-celebrate');
    return;
  }

  state.heroHp = Math.min(state.maxHp, state.heroHp + 12);
  setTimeout(createMission, 800);
  setStatus(`Нагорода: ${reward.name}. Наступний рівень!`);
  speak(`Здобуто ${reward.name}. Готуйся до наступного боса.`);
};

const completeMission = () => {
  if (state.mode !== 'fighting') return;
  state.coins += 25 + state.level * 8;
  updateHud();
  showRewards();
};

const triggerSpecialWeapon = () => {
  if (state.mode !== 'fighting' || state.specialWeaponCharge < 100) return;
  state.specialWeaponCharge = 0;
  updateWeaponUI();
  const damage = 60 + state.power * 20 + state.level * 8;
  state.bossHp = Math.max(0, state.bossHp - damage);
  heroFighter.classList.remove('attacking');
  void heroFighter.offsetWidth;
  heroFighter.classList.add('attacking');
  projectile.classList.remove('firing');
  void projectile.offsetWidth;
  projectile.classList.add('firing');
  setStatus(`Урановий снаряд! -${damage} здоров’я босу.`);
  typedText.textContent = `Урановий снаряд! -${damage} здоров’я.`;
  speak('Урановий снаряд!');
  playKeySound('1', true);
  updateHud();
  if (state.bossHp <= 0) {
    completeMission();
    return;
  }
  setTimeout(() => heroFighter.classList.remove('attacking'), 520);
};

const hitNote = (note, key) => {
  if (note.index !== state.wordProgress) return;
  state.notes = state.notes.filter((item) => item.id !== note.id);
  note.element.remove();
  state.wordProgress += 1;
  updateWordTargets();
  scheduleNextNote();
  state.combo += 1;
  const comboBonus = state.comboBonus * 3;
  const damage = 15 + state.power * 4 + comboBonus + (state.combo % 5 === 0 ? 8 : 0);
  state.bossHp = Math.max(0, state.bossHp - damage);
  state.coins += 1;
  state.specialWeaponCharge = clamp(state.specialWeaponCharge + 18, 0, 100);
  const boss = $('#bossFighter');
  boss.classList.remove('hit');
  void boss.offsetWidth;
  boss.classList.add('hit');
  heroFighter.classList.remove('attacking');
  void heroFighter.offsetWidth;
  heroFighter.classList.add('attacking');
  setTimeout(() => heroFighter.classList.remove('attacking'), 520);
  rhythmStage.classList.remove('success');
  void rhythmStage.offsetWidth;
  rhythmStage.classList.add('success');
  typedText.textContent = `Влучання! -${damage} здоров’я босу.`;
  setStatus(state.combo % 5 === 0 ? `Суперкомбо x${state.combo}!` : `Влучання! Комбо x${state.combo}`);
  playKeySound(key, true);
  updateHud();
  updateWeaponUI();
  if (state.bossHp <= 0) {
    completeMission();
    return;
  }
};

const updateWordTargets = () => {
  rhythmStage.querySelectorAll('.word-target').forEach((target, index) => {
    target.classList.toggle('current', index === state.wordProgress);
    target.classList.toggle('complete', index < state.wordProgress);
  });
  state.notes.forEach((note) => {
    note.element.classList.toggle('current', note.index === state.wordProgress);
  });
};

const clearWordTargets = () => {
  rhythmStage.querySelectorAll('.word-target').forEach((target) => target.remove());
};

const scheduleNextNote = () => {
  const nextNote = state.notes.find((note) => note.index === state.wordProgress);
  if (!nextNote) return;
  const difficulty = difficultySettings[state.difficulty];
  const progressionSpeed = state.difficultyMultiplier / difficulty.speed;
  nextNote.spawnAt = performance.now() + difficulty.letterStep / progressionSpeed;
};

const takeDamageFromBoss = (amount, message) => {
  const shieldReduction = Math.max(0, state.armor * 2);
  const damage = Math.max(4, amount - shieldReduction);
  state.heroHp = Math.max(0, state.heroHp - damage);
  heroFighter.classList.add('hit');
  setTimeout(() => heroFighter.classList.remove('hit'), 600);
  typedText.textContent = message;
  setStatus(`Бос атакував: -${damage} здоров’я.`);
  updateHud();
  if (state.heroHp <= 0) {
    dieHero();
  }
};

const spawnWordBurst = () => {
  const difficulty = difficultySettings[state.difficulty];
  const bossWords = state.mission.words;
  const word = randomFrom(bossWords).toLowerCase();
  const now = performance.now();
  const targetY = rhythmStage.clientHeight - 70;
  state.activeWord = word;
  state.wordProgress = 0;
  clearWordTargets();
  missionText.textContent = `Слово для атаки: ${word.toUpperCase()}`;

  word.split('').forEach((letter, index) => {
    const xPercent = ((index + 1) / (word.length + 1)) * 100;
    const target = document.createElement('div');
    target.className = 'word-target';
    target.style.left = `${xPercent}%`;
    target.style.top = `${targetY - 3}px`;
    target.setAttribute('aria-hidden', 'true');
    rhythmStage.append(target);

    const note = document.createElement('div');
    note.className = 'note-letter';
    note.textContent = letter.toUpperCase();
    const speed = state.difficultyMultiplier * (0.97 + Math.random() * 0.06);
    const item = {
      id: `${Date.now()}-${Math.random()}-${state.noteCounter++}`,
      letter: letter.toLowerCase(),
      x: xPercent,
      index,
      y: -52,
      spawnAt: index === 0 ? now : Number.POSITIVE_INFINITY,
      targetY,
      speed,
      element: note,
      hitWindow: difficulty.hitWindow + state.windowBonus
    };
    note.style.left = `${item.x}%`;
    note.style.top = `${item.y}px`;
    note.style.transform = 'translateX(-50%)';
    rhythmStage.append(note);
    state.notes.push(item);
  });
  updateWordTargets();
};

const gameLoop = (now) => {
  if (state.mode !== 'fighting') return;

  const difficulty = difficultySettings[state.difficulty];

  if (now >= state.nextBossAttackAt) {
    const pattern = state.mission.pattern;
    const message = pattern === 'shadow'
      ? 'Тіньовий удар! Кот повинен рухатись швидше.'
      : pattern === 'final'
        ? 'Король котів випускає вогняний шквал.'
        : 'Бос атакує.';
    const boss = $('#bossFighter');
    boss.classList.remove('attacking');
    void boss.offsetWidth;
    boss.classList.add('attacking');
    window.setTimeout(() => boss.classList.remove('attacking'), 520);
    setStatus(`${message} Уважно стеж за літерами.`);
    state.nextBossAttackAt = now + difficulty.bossAttackEvery;
  }

  if (!state.activeWord && now >= state.nextNoteAt) {
    spawnWordBurst();
  }

  for (const note of [...state.notes]) {
    if (note.index !== state.wordProgress || now < note.spawnAt) {
      continue;
    }

    note.element.classList.add('visible');
    note.y += note.speed * 1.05;
    note.element.style.top = `${note.y}px`;
    note.element.style.left = `${note.x}%`;

    const finish = Math.abs(note.y - note.targetY) <= note.hitWindow;
    if (finish) note.element.classList.add('hit-range');
    else note.element.classList.remove('hit-range');

    if (note.y > note.targetY + 40) {
      note.element.remove();
      state.notes = state.notes.filter((item) => item.id !== note.id);
      if (note.index === state.wordProgress) {
        state.wordProgress += 1;
        updateWordTargets();
        scheduleNextNote();
      }
      state.combo = 0;
      takeDamageFromBoss(9 + state.level, 'Пропущене слово! Далі точніше!');
    }
  }

  if (state.activeWord && state.notes.length === 0) {
    state.activeWord = '';
    clearWordTargets();
    state.nextNoteAt = now + difficulty.wordPause;
    missionText.textContent = 'Слово завершено! Готуйся до наступного.';
  }

  state.animationFrame = requestAnimationFrame(gameLoop);
};

const handleBattleKey = (key) => {
  if (!key || key === 'space') return;
  const candidate = state.notes.find((note) => note.index === state.wordProgress);

  if (!candidate || candidate.letter !== key) {
    setStatus('Не та літера. Пиши правильний порядок.');
    return;
  }

  if (Math.abs(candidate.y - candidate.targetY) > candidate.hitWindow + 14) {
    setStatus('Ще рано або вже пізно. Тримай ритм.');
    return;
  }

  hitNote(candidate, key);
};

const normalizeKey = (event) => {
  if (event.code === 'Space') return 'space';
  if (event.code.startsWith('Key')) return event.code.slice(3).toLowerCase();
  if (event.code.startsWith('Digit')) return event.code.slice(5);
  return (event.key || '').toLowerCase();
};

const initKeyboardLights = () => {
  document.querySelectorAll('.key').forEach((keyEl) => {
    keyEl.addEventListener('transitionend', () => keyEl.classList.remove('active'));
  });
};

document.addEventListener('keydown', (event) => {
  const key = normalizeKey(event);
  const keyEl = document.querySelector(`.key[data-key="${key.toUpperCase()}" ]`);
  if (keyEl) {
    keyEl.classList.add('active');
  }
});

difficultySelect.addEventListener('change', (event) => {
  state.difficulty = event.target.value;
  try {
    window.localStorage.setItem('cat-key-quest-difficulty', state.difficulty);
  } catch {}
  setStatus(`Складність: ${difficultySettings[state.difficulty].label}`);
  speak(`Складність ${difficultySettings[state.difficulty].label}`);
});

toggleSpeakBtn.addEventListener('click', () => {
  state.speakEnabled = !state.speakEnabled;
  toggleSpeakBtn.textContent = `Озвучення: ${state.speakEnabled ? 'увімк.' : 'вимк.'}`;
  setStatus(`Озвучення ${state.speakEnabled ? 'увімкнено' : 'вимкнено'}.`);
});

toggleSoundBtn.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  toggleSoundBtn.textContent = `Звуки: ${state.soundEnabled ? 'увімк.' : 'вимк.'}`;
  setStatus(`Звуки ${state.soundEnabled ? 'увімкнено' : 'вимкнено'}.`);
});

toggleShopBtn.addEventListener('click', () => {
  if (state.mode === 'shop') closeShop();
  else openShop();
});

initKeyboardLights();
difficultySelect.value = state.difficulty;
updateWeaponUI();
updateHud();
missionText.textContent = 'Натисни «Почати знову», щоб увійти в аркаду.';
setStatus('Кіт готовий до пригоди!');

const setupVoiceRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  state.recognition = new SpeechRecognition();
  state.recognition.lang = 'en-US';
  state.recognition.continuous = true;
  state.recognition.interimResults = false;
  state.recognition.onresult = (event) => {
    const result = event.results[event.resultIndex][0].transcript;
    for (const char of result) {
      const key = char.toLowerCase();
      if (/^[a-z]$/.test(key)) handleBattleKey(key);
    }
  };
  state.recognition.onend = () => {
    state.isListening = false;
    toggleDictationBtn.textContent = 'Голосовий ввід';
  };
  state.recognition.onerror = () => setStatus('Не вдалося розпізнати голос. Спробуй ще раз.');
};

document.addEventListener('keydown', (event) => {
  const key = normalizeKey(event);
  const keyCode = event.code || '';

  if (keyCode === 'F4') {
    event.preventDefault();
    if (state.mode === 'shop') closeShop();
    else openShop();
    return;
  }

  if (keyCode === 'Escape') {
    event.preventDefault();
    if (state.mode === 'shop') closeShop();
    else if (state.mode === 'fighting') openShop();
    return;
  }

  if (keyCode === 'F2') {
    event.preventDefault();
    if (state.recognition) {
      state.recognition.start();
      toggleDictationBtn.textContent = 'Слухаю...';
    }
    return;
  }

  if (keyCode === 'F3') {
    event.preventDefault();
    toggleSpeakBtn.click();
    return;
  }

  if (keyCode === 'Enter' || keyCode === 'Space') {
    if (state.mode === 'ready' || state.mode === 'dead' || state.mode === 'won') {
      event.preventDefault();
      startQuest();
      return;
    }
  }

  if (event.code === 'Digit1' && state.mode === 'fighting') {
    event.preventDefault();
    triggerSpecialWeapon();
    return;
  }

  if (state.mode === 'shop') {
    const stock = state.chapter > 1 ? nextChapterShopStock : shopStock;
    if (/^[1-9]$/.test(key) && Number(key) <= stock.length) {
      event.preventDefault();
      buyShopItem(Number(key) - 1);
    }
    return;
  }

  if (state.mode === 'reward') {
    if (/^[1-3]$/.test(key)) {
      event.preventDefault();
      chooseReward(Number(key) - 1);
    }
    return;
  }

  if (state.mode === 'fighting') {
    if (key && /^[a-z]$/.test(key)) {
      event.preventDefault();
      handleBattleKey(key);
    }
  }

  const activeKey = document.querySelector(`.key[data-key="${key.toUpperCase()}"]`);
  if (activeKey) {
    activeKey.classList.add('active');
    window.setTimeout(() => activeKey.classList.remove('active'), 180);
  }
});

const startQuest = () => {
  enableAudio();
  stopGameLoop();
  window.clearTimeout(state.transitionTimeout);
  victoryScene.hidden = true;
  victoryScene.classList.remove('victory-celebrate');
  defeatScene.hidden = true;
  defeatScene.classList.remove('victory-celebrate');
  state.chapter = 1;
  state.level = 1;
  state.coins = 0;
  state.power = 1;
  state.armor = 0;
  state.inventory = [];
  state.maxHp = 100;
  state.heroHp = state.maxHp;
  state.windowBonus = 0;
  state.combo = 0;
  state.comboBonus = 0;
  state.sideAttack = 0;
  state.specialWeaponCharge = 0;
  state.mode = 'ready';
  state.isFinalWin = false;
  state.mission = null;
  state.choices = [];
  rewardPanel.hidden = true;
  shopPanel.hidden = true;
  heroFighter.classList.remove('dead');
  catArt.style.opacity = '1';
  catArt.setAttribute('aria-label', 'Кіт Маркіз у повний зріст');
  heroName.textContent = 'Маркіз';
  bossHpBar.style.width = '100%';
  updateHud();
  createMission();
};

const startNextChapter = () => {
  if (state.mode !== 'won' || state.chapter !== 1) return;
  victoryScene.hidden = true;
  victoryScene.classList.remove('victory-celebrate');
  state.chapter = 2;
  state.level = 1;
  state.heroHp = state.maxHp;
  state.specialWeaponCharge = 0;
  state.mode = 'ready';
  setStatus('Місячна фортеця! Нові боси й спорядження чекають.');
  createMission();
};

startQuestBtn.addEventListener('click', startQuest);
nextChapterBtn.addEventListener('click', startNextChapter);
restartVictoryBtn.addEventListener('click', startQuest);
restartDefeatBtn.addEventListener('click', startQuest);
setupVoiceRecognition();

const toggleDictationAction = () => {
  if (!state.recognition) return;
  if (state.isListening) {
    state.recognition.stop();
    state.isListening = false;
    toggleDictationBtn.textContent = 'Голосовий ввід';
    return;
  }
  state.recognition.start();
  state.isListening = true;
  toggleDictationBtn.textContent = 'Слухаю...';
};

toggleDictationBtn.addEventListener('click', toggleDictationAction);

toggleSoundBtn.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  toggleSoundBtn.textContent = `Звуки: ${state.soundEnabled ? 'увімк.' : 'вимк.'}`;
  if (state.soundEnabled) enableAudio();
});

updateHud();
setStatus('Натисни «Почати знову», щоб увійти в аркаду.');