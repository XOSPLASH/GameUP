// JavaScript for handling tasks, coins, and inventory

// Clear the inventory
function clearInventory() {
    localStorage.removeItem('inventory');
    loadInventory(); // Refresh the inventory display
}

// Load coins from localStorage
function loadCoins() {
    const coins = localStorage.getItem('coins');
    document.getElementById('coins').innerText = `Coins: ${coins || 0}`;
}

// Save coins to localStorage
function saveCoins(coins) {
    localStorage.setItem('coins', coins);
    document.getElementById('coins').innerText = `Coins: ${coins}`;
}

// Update coins by a certain amount
function updateCoins(amount) {
    let coins = parseInt(localStorage.getItem('coins')) || 0;
    coins += amount;
    saveCoins(coins);
}

// Add a task with difficulty and timer
function addTask() {
    const taskInput = document.getElementById('new-task');
    const difficultySelect = document.getElementById('difficulty');
    const taskText = taskInput.value.trim();
    const difficulty = difficultySelect.value;

    if (taskText) {
        const taskList = document.getElementById('task-list');
        const taskItem = document.createElement('li');
        const timeLimit = getTimeLimit(difficulty);

        taskItem.innerHTML = `
            <div class="task-container">
                <span>${taskText} (${difficulty})</span>
                <span class="timer" id="timer-${Date.now()}">${formatTime(timeLimit)}</span>
                <button onclick="completeTask(this)">Complete</button>
            </div>
        `;
        
        taskItem.dataset.endTime = Date.now() + timeLimit * 1000;
        taskList.appendChild(taskItem);

        startTimer(taskItem);
        taskInput.value = '';
        saveTasks();
    }
}

// Get time limit based on difficulty
function getTimeLimit(difficulty) {
    switch(difficulty) {
        case 'easy': return 60; // 1 minute
        case 'medium': return 120; // 2 minutes
        case 'hard': return 300; // 5 minutes
        default: return 60; // Default to easy
    }
}

// Format time for display
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Start countdown timer
function startTimer(taskItem) {
    const timerElement = taskItem.querySelector('.timer');
    const endTime = taskItem.dataset.endTime;

    function updateTimer() {
        const timeRemaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
        timerElement.textContent = formatTime(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = 'Time Up!';
            taskItem.querySelector('button').disabled = true;
        }
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call to set the timer immediately
}

// Complete a task
function completeTask(button) {
    const taskItem = button.parentElement.parentElement;
    taskItem.classList.add('completed');
    button.disabled = true; // Disable the button to prevent re-completion
    updateCoins(10); // Increase coins by 10 for each completed task
    saveTasks();
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = Array.from(document.getElementById('task-list').children).map(taskItem => ({
        text: taskItem.querySelector('span').textContent,
        completed: taskItem.classList.contains('completed'),
        endTime: taskItem.dataset.endTime
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        const timeRemaining = Math.max(0, Math.round((task.endTime - Date.now()) / 1000));

        taskItem.innerHTML = `
            <div class="task-container">
                <span>${task.text}</span>
                <span class="timer" id="timer-${Date.now()}">${formatTime(timeRemaining)}</span>
                <button onclick="completeTask(this)" ${task.completed ? 'disabled' : ''}>Complete</button>
            </div>
        `;
        
        if (task.completed) {
            taskItem.classList.add('completed');
        } else {
            taskItem.dataset.endTime = task.endTime;
            startTimer(taskItem); // Start timer for existing tasks
        }
        taskList.appendChild(taskItem);
    });
}

// Save purchased items to localStorage
function saveInventory(items) {
    localStorage.setItem('inventory', JSON.stringify(items));
}

// Load purchased items from localStorage
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    inventory.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.innerHTML = `
            <div class="item">
                <img src="${item.icon}" alt="${item.name} Icon" class="item-icon"> ${item.name}
            </div>
        `;
        inventoryList.appendChild(itemElement);
    });
}

// Add item to inventory
function addToInventory(item) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.push(item);
    saveInventory(inventory);
}

// Buy item function
function buyItem(itemName, itemCost, itemIcon) {
    let coins = parseInt(localStorage.getItem('coins')) || 0;
    if (coins >= itemCost) {
        coins -= itemCost;
        saveCoins(coins);
        addToInventory({ name: itemName, icon: itemIcon });
        alert(`You have successfully bought ${itemName}!`);
        loadInventory(); // Update inventory display
    } else {
        alert('Not enough coins to buy this item.');
    }
}

// Reset tasks
function resetTasks() {
    document.getElementById('task-list').innerHTML = '';
    saveTasks();
    localStorage.removeItem('tasks');
}

// Navigate to another page
function navigateTo(url) {
    window.location.href = url;
}

// Initial setup for app and shop pages
window.addEventListener('load', () => {
    if (document.getElementById('coins')) {
        loadCoins();
        loadTasks();
        
        // Add event listener for Enter key press on the task input
        const taskInput = document.getElementById('new-task');
        taskInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addTask();
            }
        });

        // Add event listener for Ctrl + Backspace key press to reset tasks
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 'Backspace') {
                resetTasks();
            }
        });
    } else if (document.getElementById('inventory-list')) {
        loadInventory();
    }
});
