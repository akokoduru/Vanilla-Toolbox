
// Function to create a To-Do component
function createToDoItem(text) {
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
    });
    newLi.appendChild(deleteBtn);

    return newLi;
}

const list = document.querySelector("#todo-list");
const completedList = document.querySelector("#completed-list");
const input = document.querySelector("#todo-input");
const addBtn = document.querySelector("#todo-btn");
const error = document.querySelector("#input-error");
const deleteBtn = document.querySelector(".delete");

addBtn.addEventListener('click', function(){
    if (input.value.trim() !== '') {
        // Add the todo item
        list.appendChild(createToDoItem(input.value));

        // Reset input box and error msg
        input.value = '';
        error.innerText = '';
    }
    else {
        // Display error
        error.innerText = 'Please enter a value';
    }
    // TO-DO: Add code to store data in local storage
})

input.addEventListener('click', function(){
    error.innerText = '';
})

// Remove item when clicked
list.addEventListener('click', function(event) {
    if (event.target && (event.target.nodeName === 'LI' || event.target.nodeName === 'SPAN')) {
        event.target.remove(); // Remove the clicked item
        const liTest = event.target.nodeName === 'LI' ? event.target : event.target.closest('li');
        if (liTest) {
            completedList.appendChild(liTest);
        }
    }
});
