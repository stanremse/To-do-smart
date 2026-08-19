// Get elements from HTML
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('taskCount');
const clearCompleted = document.getElementById('clearCompleted');
const dateDisplay = document.getElementById('date');

// Show today's date
const today = new Date();
dateDisplay.textContent = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});

// Load tasks from browser storage (or start empty)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        priority: priorityInput.value,
        dueDate: dateInput.value,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    
    // Clear inputs
    taskInput.value = '';
    dateInput.value = '';
}

// Save to browser's local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle complete/incomplete
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Show tasks on screen
function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${task.id})">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-meta">
                <span class="priority ${task.priority}">${task.priority}</span>
                ${task.dueDate ? `<span class="due-date">Due: ${task.dueDate}</span>` : ''}
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
        `;

        taskList.appendChild(li);
    });

    // Update count
    const activeCount = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;
}

// Prevent hackers from adding code in task text
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Clear all completed tasks
clearCompleted.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});

// Click "Add" button
addBtn.addEventListener('click', addTask);

// Press "Enter" key to add
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Show tasks when page loads
renderTasks();