// Task Manager Application with Description, Date, and Time

let tasks = [];
let currentFilter = 'all';

// DOM Elements
const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const taskDate = document.getElementById('taskDate');
const taskTime = document.getElementById('taskTime');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterAll = document.getElementById('filterAll');
const filterActive = document.getElementById('filterActive');
const filterCompleted = document.getElementById('filterCompleted');

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    render();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format date for display
function formatDateTime(dateStr, timeStr) {
    if (!dateStr && !timeStr) return '';
    if (dateStr && !timeStr) return `📅 ${dateStr}`;
    if (!dateStr && timeStr) return `⏰ ${timeStr}`;
    return `📅 ${dateStr} at ${timeStr}`;
}

// Add a new task
function addTask() {
    const title = taskTitle.value.trim();
    if (title === '') {
        alert('Please enter a task title');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        title: title,
        description: taskDesc.value.trim(),
        dueDate: taskDate.value,
        dueTime: taskTime.value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    // Clear form
    taskTitle.value = '';
    taskDesc.value = '';
    taskDate.value = '';
    taskTime.value = '';
    
    saveTasks();
    render();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        render();
    }
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
}

// Get filtered tasks
function getFilteredTasks() {
    if (currentFilter === 'active') {
        return tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed);
    } else {
        return tasks;
    }
}

// Set current filter
function setFilter(filter) {
    currentFilter = filter;
    
    filterAll.classList.remove('active');
    filterActive.classList.remove('active');
    filterCompleted.classList.remove('active');
    
    if (filter === 'all') filterAll.classList.add('active');
    else if (filter === 'active') filterActive.classList.add('active');
    else if (filter === 'completed') filterCompleted.classList.add('active');
    
    render();
}

// Render task list
function render() {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">✨ No tasks here. Add one above!</div>';
        taskCount.textContent = tasks.filter(t => !t.completed).length;
        return;
    }
    
    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        if (task.completed) card.classList.add('completed');
        
        // Header with title and delete button
        const header = document.createElement('div');
        header.className = 'task-header';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'task-title';
        titleSpan.textContent = task.title;
        titleSpan.onclick = () => toggleTask(task.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id);
        
        header.appendChild(titleSpan);
        header.appendChild(deleteBtn);
        
        // Description (if exists)
        let descDiv = null;
        if (task.description) {
            descDiv = document.createElement('div');
            descDiv.className = 'task-desc';
            descDiv.textContent = `📝 ${task.description}`;
        }
        
        // Date/Time meta
        const metaDiv = document.createElement('div');
        metaDiv.className = 'task-meta';
        
        const dateTimeStr = formatDateTime(task.dueDate, task.dueTime);
        if (dateTimeStr) {
            const dateSpan = document.createElement('span');
            dateSpan.textContent = dateTimeStr;
            metaDiv.appendChild(dateSpan);
        }
        
        // Assemble card
        card.appendChild(header);
        if (descDiv) card.appendChild(descDiv);
        if (dateTimeStr) card.appendChild(metaDiv);
        
        taskList.appendChild(card);
    });
    
    const activeCount = tasks.filter(task => !task.completed).length;
    taskCount.textContent = activeCount;
}

// Event Listeners
addBtn.addEventListener('click', addTask);

// Allow Enter key to add task from title field
taskTitle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

filterAll.addEventListener('click', () => setFilter('all'));
filterActive.addEventListener('click', () => setFilter('active'));
filterCompleted.addEventListener('click', () => setFilter('completed'));

// Initialize
loadTasks();
