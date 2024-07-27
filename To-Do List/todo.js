// Main Selectors
const list = document.querySelector("#todo-list");
const completedList = document.querySelector("#completed-list");
const input = document.querySelector("#todo-input");
const addBtn = document.querySelector("#todo-btn");
const error = document.querySelector("#input-error");
const deleteBtn = document.querySelector(".delete");
const noCompletedTasksMessage = document.querySelector("#no-completed-tasks");
const deleteAllTodoBtn = document.querySelector("#delete-all-todo");
const deleteAllCompletedBtn = document.querySelector("#delete-all-completed");

// Date Selectors
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1; // Months are zero-based, so add 1
const day = today.getDate();
const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

// Confirmation Modal Selectors
const modal = document.querySelector("#warning-modal");
const confirmDeleteBtn = document.querySelector("#confirm-delete");
const cancelDeleteBtn = document.querySelector("#cancel-delete");

// Function to create a To-Do component
function createToDoItem(text, date) {
    // Create list item
    const newLi = document.createElement('li');

    // Insert text span to the item
    const span = document.createElement('span');
    span.innerText = text;
    newLi.appendChild(span);

    // Dynamically create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    const trashIcon = document.createElement('i');
    trashIcon.className = 'fas fa-trash trash-icon';
    deleteBtn.appendChild(trashIcon);

    deleteBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        newLi.remove();
        updateLocalStorage();
        toggleNoCompletedTasksMessage();
        toggleDeleteAllVisibility();
    });
    newLi.appendChild(deleteBtn);

    return newLi;
}

function toggleDeleteAllVisibility() {
    // 'Delete All' button should only show when there is 1+ items in the lists
    if (list.children.length > 0) {
        deleteAllTodoBtn.style.display = 'block';
    } else {
        deleteAllTodoBtn.style.display = 'none';
    }

    if (completedList.children.length > 0) {
        deleteAllCompletedBtn.style.display = 'block';
    } else {
        deleteAllCompletedBtn.style.display = 'none';
    }
}

addBtn.addEventListener('click', function(){
    if (input.value.trim() !== '') {
        // Add the todo item
        list.appendChild(createToDoItem(input.value));

        // Reset input box and error msg
        input.value = '';
        error.innerText = '';

        updateLocalStorage();    
        toggleDeleteAllVisibility();
    }
    else {
        // Display error
        error.innerText = 'Please enter a value';
    }
})

input.addEventListener('click', function(){
    error.innerText = '';
})

// Listen for Enter key press on the input field
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addBtn.click();
    }
});

// Move item to Completed List when clicked
list.addEventListener('click', function(event) {
    const target = event.target;
    if (target) {
        const li = target.closest('li');
        if (li) {
            li.classList.remove('todo-item'); // Remove class to prevent hover effect
            completedList.appendChild(li);

            updateLocalStorage();
            toggleNoCompletedTasksMessage();
            toggleDeleteAllVisibility();
        }
    }
});

function toggleNoCompletedTasksMessage() {
    if (completedList.children.length === 0) {
        noCompletedTasksMessage.style.display = 'block';
    } else {
        noCompletedTasksMessage.style.display = 'none';
    }
}

deleteAllTodoBtn.addEventListener('click', function() {
    deleteTarget = 'todo';
    showModal();
});

deleteAllCompletedBtn.addEventListener('click', function() {
    deleteTarget = 'completed';
    showModal();
});

confirmDeleteBtn.addEventListener('click', function() {
    if (deleteTarget === 'todo') {
        list.innerHTML = '';
    } else if (deleteTarget === 'completed') {
        completedList.innerHTML = '';
        toggleNoCompletedTasksMessage();
    }
    updateLocalStorage();
    toggleDeleteAllVisibility();
    closeModal();
});

cancelDeleteBtn.addEventListener('click', function() {
    closeModal();
});

function showModal() {
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// Function to update localStorage with current state of to-do and completed lists
function updateLocalStorage() {
    const todoItems = [];
    const completedItems = [];

    list.querySelectorAll('li').forEach(li => {
        todoItems.push(li.querySelector('span').innerText);
    });

    completedList.querySelectorAll('li').forEach(li => {
        completedItems.push(li.querySelector('span').innerText);
    });

    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    localStorage.setItem('completedItems', JSON.stringify(completedItems));
}

// Function to load data from localStorage
function loadFromLocalStorage() {
    const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    const completedItems = JSON.parse(localStorage.getItem('completedItems')) || [];

    todoItems.forEach(item => {
        list.appendChild(createToDoItem(item));
    });
    completedItems.forEach(item => {
        completedList.appendChild(createToDoItem(item));
    });

    toggleNoCompletedTasksMessage();
    toggleDeleteAllVisibility();
}

// Load data from localStorage when the page loads
window.addEventListener('load', loadFromLocalStorage);