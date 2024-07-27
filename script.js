let coins = 0;

function updateCoinCount() {
    document.getElementById('coin-count').textContent = coins;
    localStorage.setItem('coins', coins);
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') return;

    const taskList = document.getElementById('task-list');
    const newTask = document.createElement('li');
    newTask.textContent = taskText;

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.onclick = function() {
        completeTask(newTask);
    };

    newTask.appendChild(completeButton);
    taskList.appendChild(newTask);

    taskInput.value = '';
    saveTasks();
}

function completeTask(taskElement) {
    if (!taskElement.classList.contains('completed')) {
        taskElement.classList.add('completed');
        coins += 10; // Award 10 coins for each completed task
        updateCoinCount();
        saveTasks();
    }
}

function buyItem(item, cost) {
    if (coins >= cost) {
        coins -= cost;
        updateCoinCount();
        alert(`You bought ${item} for ${cost} coins!`);
    } else {
        alert(`You need ${cost} coins to buy ${item}.`);
    }
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(task => {
        tasks.push({
            text: task.firstChild.textContent,
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        const taskList = document.getElementById('task-list');
        tasks.forEach(task => {
            const newTask = document.createElement('li');
            newTask.textContent = task.text;

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.onclick = function() {
                completeTask(newTask);
            };

            newTask.appendChild(completeButton);
            if (task.completed) {
                newTask.classList.add('completed');
            }

            taskList.appendChild(newTask);
        });
    }
}

function loadCoins() {
    const savedCoins = localStorage.getItem('coins');
    if (savedCoins) {
        coins = parseInt(savedCoins, 10);
    }
    updateCoinCount();
}

function navigateTo(url) {
    window.location.href = url;
}

function resetTasks() {
    // Clear the task list in the DOM
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    // Remove the saved tasks from localStorage
    localStorage.removeItem('tasks');
}

// Initialize coin count and tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCoins();
    if (document.getElementById('task-list')) {
        loadTasks();
    }

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
});
