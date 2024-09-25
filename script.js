document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Function to add a task to the UI
    function addTaskToUI(task, completed = false) {
        const li = document.createElement('li');
        li.className = completed ? 'completed' : '';
        li.innerHTML = `
            <span class="task-text ${completed ? 'completed' : ''}">${task}</span>
            <div class="task-buttons">
                <button class="complete-btn">${completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.prepend(li);

        // Add event listeners for complete and delete buttons
        li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(li, task));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(li, task));
    }

    // Function to toggle task completion
    function toggleComplete(li, task) {
        const taskText = li.querySelector('.task-text');
        const completeBtn = li.querySelector('.complete-btn');
        taskText.classList.toggle('completed');
        li.classList.toggle('completed');
        completeBtn.textContent = taskText.classList.contains('completed') ? 'Undo' : 'Complete';
        updateTaskInCookie(task);
    }

    // Function to delete a task
    function deleteTask(li, task) {
        li.remove();
        removeTaskFromCookie(task);
    }

    // Function to save a task to cookie
    function saveTaskToCookie(task) {
        let tasks = JSON.parse(Cookies.get('tasks') || '[]');
        tasks.unshift({ text: task, completed: false });
        Cookies.set('tasks', JSON.stringify(tasks), { expires: 365 });
    }

    // Function to update a task in cookie
    function updateTaskInCookie(task) {
        let tasks = JSON.parse(Cookies.get('tasks') || '[]');
        const index = tasks.findIndex(t => t.text === task);
        if (index !== -1) {
            tasks[index].completed = !tasks[index].completed;
            Cookies.set('tasks', JSON.stringify(tasks), { expires: 365 });
        }
    }

    // Function to remove a task from cookie
    function removeTaskFromCookie(task) {
        let tasks = JSON.parse(Cookies.get('tasks') || '[]');
        tasks = tasks.filter(t => t.text !== task);
        Cookies.set('tasks', JSON.stringify(tasks), { expires: 365 });
    }

    // Function to load tasks from cookie
    function loadTasksFromCookie() {
        let tasks = JSON.parse(Cookies.get('tasks') || '[]');
        tasks.forEach(task => addTaskToUI(task.text, task.completed));
    }

    // Load existing tasks when the page loads
    loadTasksFromCookie();

    // Event listener for form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = taskInput.value.trim();

        if (task) {
            // Save task to cookie
            saveTaskToCookie(task);
            
            // Add task to UI
            addTaskToUI(task, false);
            
            // Clear input field
            taskInput.value = '';
        }
    });
});