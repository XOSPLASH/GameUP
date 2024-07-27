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

// Add a task
function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskList = document.getElementById('task-list');
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            ${taskText}
            <button onclick="completeTask(this)">Complete</button>
        `;
        taskList.appendChild(taskItem);
        taskInput.value = '';
        saveTasks();
    }
}

// Complete a task
function completeTask(button) {
    const taskItem = button.parentElement;
    taskItem.classList.add('completed');
    button.disabled = true; // Disable the button to prevent re-completion
    updateCoins(10); // Increase coins by 10 for each completed task
    saveTasks();
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = Array.from(document.getElementById('task-list').children).map(taskItem => ({
        text: taskItem.childNodes[0].textContent,
        completed: taskItem.classList.contains('completed')
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
        taskItem.innerHTML = `
            ${task.text}
            <button onclick="completeTask(this)" ${task.completed ? 'disabled' : ''}>Complete</button>
        `;
        if (task.completed) {
            taskItem.classList.add('completed');
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
        itemElement.textContent = item;
        itemElement.classList.add('inventory-item');
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
function buyItem(itemName, itemCost) {
    let coins = parseInt(localStorage.getItem('coins')) || 0;
    if (coins >= itemCost) {
        coins -= itemCost;
        saveCoins(coins);
        addToInventory(itemName);
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
