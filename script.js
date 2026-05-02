const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');
const progressEl = document.getElementById('progress');
const streakEl = document.getElementById('streak');
const fuelEl = document.getElementById('fuel-level');

let habits = JSON.parse(localStorage.getItem('habits')) || [];
let streak = parseInt(localStorage.getItem('streak')) || 0;
let lastDate = localStorage.getItem('lastDate') || '';

function saveData() {
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('streak', streak);
  localStorage.setItem('lastDate', new Date().toDateString());
}

function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${habit.name}</span>
      <input type="checkbox" ${habit.done ? 'checked' : ''} data-index="${index}">
    `;
    if (habit.done) li.classList.add('completed');
    habitList.appendChild(li);
  });
  updateProgress();
}

function updateProgress() {
  const completed = habits.filter(h => h.done).length;
  const total = habits.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  progressEl.textContent = `${progress}%`;
  fuelEl.textContent = `${progress}%`;

  if (progress === 100) streak++;
  streakEl.textContent = streak;
  saveData();
}

addBtn.addEventListener('click', () => {
  const name = habitInput.value.trim();
  if (!name) return;
  habits.push({ name, done: false });
  habitInput.value = '';
  renderHabits();
  saveData();
});

habitList.addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    const index = e.target.dataset.index;
    habits[index].done = e.target.checked;
    renderHabits();
    saveData();
  }
});

function dailyReset() {
  const today = new Date().toDateString();
  if (lastDate && lastDate !== today) {
    const allDone = habits.every(h => h.done);
    if (!allDone) streak = 0;
    habits.forEach(h => h.done = false);
    renderHabits();
    saveData();
  }
}

document.getElementById('reset-btn').addEventListener('click', () => {
  habits = [];
  streak = 0;
  localStorage.clear();
  renderHabits();
  streakEl.textContent = 0;
  fuelEl.textContent = '0%';
});

dailyReset();
renderHabits();
