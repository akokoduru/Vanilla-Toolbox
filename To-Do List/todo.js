const list = document.querySelector("#list");
const input = document.querySelector("#todo-input");
const addBtn = document.querySelector("#todo-btn");
const error = document.querySelector("#input-error");

// 
addBtn.addEventListener('click', function(){
    if (input.value.trim() !== '') {
        // Create new list item
        const newItem = input.value;
        const newLi = document.createElement('div');

        newLi.innerText = newItem;

        // Add checkbox to the list item
        const newCheckBox = document.createElement('input');
        newCheckBox.setAttribute("type", "checkbox");
        newLi.appendChild(newCheckBox);


        // Add delete button to the list item
        const newDelete = document.createElement('button');
        newDelete.innerText = 'Delete';
        newDelete.addEventListener('click', function() {
            newLi.remove();
        })
        newLi.appendChild(newDelete);

        // Append list item to the To-Do List
        list.appendChild(newLi);
        

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