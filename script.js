const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const total = document.getElementById('total');
const searchTitle = document.getElementById('search-title');
const searchDate = document.getElementById('search-date');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function updateUI() {
  list.innerHTML = '';
  let sum = 0;

  const titleFilter = searchTitle.value.trim().toLowerCase();
  const dateFilter = searchDate.value;

  // Group expenses by date
  const grouped = {};
  expenses.forEach((exp, index) => {
    const matchesTitle = exp.title.toLowerCase().includes(titleFilter);
    const matchesDate = !dateFilter || exp.date === dateFilter;

    if (matchesTitle && matchesDate) {
      sum += parseFloat(exp.amount);
      if (!grouped[exp.date]) {
        grouped[exp.date] = [];
      }
      grouped[exp.date].push({ ...exp, index });
    }
  });

  // Render grouped expenses
  Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a)) // latest date first
    .forEach(date => {
      const dateHeader = document.createElement('h3');
      dateHeader.textContent = {date};
      list.appendChild(dateHeader);

      grouped[date].forEach(({ title, amount, date, index }) => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${title} - ₹${parseFloat(amount).toFixed(2)}
          <span class="delete-btn" title="Delete">❌</span>
        `;

        li.querySelector('.delete-btn').onclick = () => {
          expenses.splice(index, 1);
          saveExpenses();
        };

        list.appendChild(li);
      });
    });

  total.textContent = sum.toFixed(2);
}

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateUI();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const amount = document.getElementById('amount').value.trim();
  const date = document.getElementById('date').value;

  if (!title || !amount || !date || isNaN(amount)) {
    alert('Please fill all fields correctly!');
    return;
  }

  expenses.push({ title, amount, date });
  saveExpenses();
  form.reset();
});

searchTitle.addEventListener('input', updateUI);
searchDate.addEventListener('input', updateUI);

updateUI();
