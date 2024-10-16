// Select DOM elements
const newTaskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');
const progressValue = document.getElementById('progress-value');
const prioritySelector = document.getElementById('priority-selector');
const statusMessage = document.getElementById('status-message');
let tasks = [];
let draggedIndex = null;

// Array of motivational messages
const motivationalMessages = [
    "You're doing great! Keep it up!",
    "One task at a time, you'll get there!",
    "Focus on progress, not perfection!",
    "Believe in yourself and keep pushing!",
    "Stay positive! You're closer than you think!",
    "Every step counts, keep going!",
    "You've got this! Don't stop now!",
    "Keep striving for greatness!",
    "Stay focused! You're on the right track!",
    "Success is a series of small wins!",
];

// Function to add task
function addTask() {
    const taskText = newTaskInput.value.trim();
    const taskPriority = prioritySelector.value;
    if (taskText) {
        const task = {
            text: taskText,
            completed: false,
            priority: taskPriority,
        };
        tasks.push(task);
        newTaskInput.value = '';
        renderTasks();
    }
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed);
        li.innerHTML = `
            <div class="checkbox-container" draggable="true" ondragstart="drag(event, ${index})">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                <span>${task.text}</span>
                <div class="priority-dot priority-${task.priority.toLowerCase()}"></div>
            </div>
            <button class="edit-btn" onclick="editTask(${index})">✎</button>
            <button class="delete-btn" onclick="deleteTask(${index})">✖</button>
        `;
        taskList.appendChild(li);
    });
    updateProgress();
}

// Function to edit a task
function editTask(index) {
    const newText = prompt('Edit your task:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText;
        renderTasks();
    }
}

// Function to toggle task completion
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Function to update progress
function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    progressValue.textContent = `${Math.round(progressPercentage)}%`;
    const strokeDasharray = `${progressPercentage}, 100`;
    progressBar.style.strokeDasharray = strokeDasharray;

    // Update status message based on task completion
    if (completedTasks === totalTasks && totalTasks > 0) {
        statusMessage.textContent = "Great job! You've completed all tasks!";
        // Trigger confetti
        confetti();
    } else if (totalTasks === 0) {
        statusMessage.textContent = "Keep adding tasks to accomplish more!";
    } else {
        // Select a random motivational message
        const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
        statusMessage.textContent = motivationalMessages[randomIndex];
    }
}

// Event listener for adding tasks
addTaskBtn.addEventListener('click', addTask);

// Drag and drop functions
function drag(event, index) {
    draggedIndex = index;
}

taskList.addEventListener('dragover', (event) => {
    event.preventDefault();
});

taskList.addEventListener('drop', (event) => {
    const targetIndex = Array.from(taskList.children).indexOf(event.target.closest('li'));
    if (draggedIndex !== null && targetIndex !== -1 && draggedIndex !== targetIndex) {
        const draggedTask = tasks[draggedIndex];
        tasks.splice(draggedIndex, 1);
        tasks.splice(targetIndex, 0, draggedTask);
        renderTasks();
    }
});

// Initialize
renderTasks();
