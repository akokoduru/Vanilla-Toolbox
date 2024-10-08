// Main Selectors
const list = document.querySelector("#todo-list");
const completedList = document.querySelector("#completed-list");
const input = document.querySelector("#todo-input");
const addBtn = document.querySelector("#todo-btn");
const error = document.querySelector("#input-error");
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

    const deleteBtn = createDeleteButton(newLi);
    newLi.appendChild(deleteBtn); 

    if (date) {
        newLi.setAttribute('data-date', date);
    }

    return newLi;
}

// Dynamically Create Delete Button 
function createDeleteButton(parentLi) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    const trashIcon = document.createElement('i');
    trashIcon.className = 'fas fa-trash trash-icon';
    deleteBtn.appendChild(trashIcon);

    deleteBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        parentLi.remove();
        const parentDate = parentLi.getAttribute('data-date');
        checkAndRemoveEmptyDateSpan(parentDate);
        updateLocalStorage();
        toggleNoCompletedTasksMessage();
        toggleDeleteAllVisibility();
    });

    return deleteBtn;
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

function toggleNoCompletedTasksMessage() {
    if (completedList.children.length === 0) {
        noCompletedTasksMessage.style.display = 'block';
    } else {
        noCompletedTasksMessage.style.display = 'none';
    }
}

function checkAndRemoveEmptyDateSpan(date) {
    const itemsUnderDate = Array.from(completedList.children).filter(
        item => item.getAttribute('data-date') === date
    );

    if (itemsUnderDate.length === 0) {
        const dateLi = Array.from(completedList.children).find(
            item => item.querySelector('span') && item.querySelector('span').innerText === date
        );

        if (dateLi) {
            dateLi.remove();
        }
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
            
            // Add date attribute to the item
            if (!li.getAttribute('data-date')) {
                li.setAttribute('data-date', formattedDate);
            }

            // Check if date is already in the completed list
            const existingDateLi = Array.from(completedList.children).find(
                child => child.querySelector('span') && child.querySelector('span').innerText === formattedDate
            );

            if (!existingDateLi) {
                // Add date span in the completed list
                const dateLi = document.createElement('li');
                const dateSpan = document.createElement('span');
                dateSpan.innerText = formattedDate;
                dateLi.appendChild(dateSpan);
                dateLi.classList.add('center-date');
                completedList.appendChild(dateLi);
                // Add item under the date
                completedList.appendChild(li);
            }
            else {
                completedList.appendChild(li);
            }

            updateLocalStorage();
            toggleNoCompletedTasksMessage();
            toggleDeleteAllVisibility();
        }
    }
});

/* -------------------------------
'Delete All' button click events 
------------------------------- */

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

/* -------------------------------
Local Storage Handlers
------------------------------- */

// Function to update localStorage with current state of to-do and completed lists
function updateLocalStorage() {
    const todoItems = [];
    const completedItems = {};

    list.querySelectorAll('li').forEach(li => {
        todoItems.push(li.querySelector('span').innerText);
    });

    completedList.querySelectorAll('li[data-date]').forEach(li => {
        const date = li.getAttribute('data-date');
        const text = li.querySelector('span').innerText;
        if (!completedItems[date]) {
            completedItems[date] = [];
        }
        completedItems[date].push(text);
    });

    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    localStorage.setItem('completedItems', JSON.stringify(completedItems));
}

// Function to load data from localStorage
function loadFromLocalStorage() {
    const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    const completedItems = JSON.parse(localStorage.getItem('completedItems')) || {};

    todoItems.forEach(item => {
        list.appendChild(createToDoItem(item));
    });

    for (const date in completedItems) {  
        const dateLi = document.createElement('li');
        const dateSpan = document.createElement('span');
        dateSpan.innerText = date;
        dateLi.appendChild(dateSpan);
        dateLi.classList.add('center-date');
        completedList.appendChild(dateLi);

        completedItems[date].forEach(text => {
            completedList.appendChild(createToDoItem(text, date));
        });
    }

    toggleNoCompletedTasksMessage();
    toggleDeleteAllVisibility();
}

// Load data from localStorage when the page loads
window.addEventListener('load', loadFromLocalStorage);