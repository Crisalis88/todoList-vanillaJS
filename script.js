const main = document.getElementById("main");
const nav = document.getElementById("nav");
const addSign = document.getElementById("addSign");
const addTodoWindow = document.getElementById("addTodoWindow");
const taskNameField = document.getElementById("taskNameField");
const taskDescriptionField = document.getElementById("taskDescriptionField");
const doneButton = document.getElementById("doneButton");


let boxBorder = "solid 1px #22BBCC";
let boxScale = "scale(1.01)";

// functions for highlighting
function reset(element) {
    element.style.border = "";
    element.style.transform = "";
}

function highlight(element) {
    element.style.border = boxBorder;
    element.style.transform = boxScale;
}

// using them
main.addEventListener("mouseover", () => {
    reset(nav);
    highlight(main);
});

nav.addEventListener("mouseover", () => {
    reset(main);
    highlight(nav);
});

// function to show or hide todoWindow 
// where user will write forms for todos
let showTodoWindow = false;
function toggleTodoWindow() {
    showTodoWindow = !showTodoWindow;

    if (showTodoWindow) {
        addTodoWindow.style.display = "block"
    } else {
        addTodoWindow.style.display = "none"
    }
}

addSign.addEventListener('click', toggleTodoWindow);

function makeDraggable(elem) {
    elem.addEventListener("touchstart", (event) => {
        let startPointX = event.changedTouches[0].clientX;
        let startPointY = event.changedTouches[0].clientY;

        let elementsCorrdinates = elem.getBoundingClientRect();

        let deltaX = startPointX - elementsCorrdinates.left;
        let deltaY = startPointY - elementsCorrdinates.top

        const touchMoveHandler = function (event) {
            let x = event.changedTouches[0].clientX;
            let y = event.changedTouches[0].clientY;

            elem.style.left = `${x - deltaX}px`;
            elem.style.top = `${y - deltaY}px`;

            if (y > main.getBoundingClientRect().top) {
                reset(nav);
                highlight(main);
            } else {
                reset(main);
                highlight(nav);
            }
        }

        elem.addEventListener("touchmove", touchMoveHandler);

        const endTouchHandler = function () {
            elem.addEventListener("touchend", () => {
                elem.removeEventListener('touchmove', touchMoveHandler);
                elem.removeEventListener('touchend', endTouchHandler);
            });
        }

        endTouchHandler()
    });
}

makeDraggable(addTodoWindow);

const todosColumn = document.getElementById("todosColumn");

function removeTodo(event) {
    //reaching grandparent of img that is todo div and removing this todo
    event.target.parentElement.parentElement.remove();
}

let forTgBot = [];
function createTodo(todoName, taskDescription) {
    //creating new todo
    const todoElement = document.createElement('div');
    todoElement.highlight = false;

    todoElement.addEventListener("click", () => {
        todoElement.highlight = !todoElement.highlight;

        if (todoElement.highlight) {
            highlight(todoElement)
        } else {
            reset(todoElement)
        }
    })

    todoElement.classList.add("w-100", "todo");
    todoElement.innerHTML = `
        <div class = "d-flex flex-column">
            <h3>${todoName}</h3> 
            <h5 class = "text-secondary">${taskDescription}</h5>
        </div> 
        <div><img onclick = "removeTodo(event)" width="26px" height="26px" src="./assets/thrash-bin.png" alt="trash bin"></div>`;

    //adding this new todo to todos column
    todosColumn.append(todoElement);

    forTgBot.push(todoName);
    Telegram.WebApp.sendData(forTgBot);
}

// handle "done" button from addTodoWindow
doneButton.addEventListener("click", (event) => {
    event.preventDefault();

    let taskName = taskNameField.value;
    let taskDescription = taskDescriptionField.value;

    if (taskName == "" || taskDescription == "") {
        alert("please fill all the fields");
        return;
    }

    createTodo(taskName, taskDescription);
    toggleTodoWindow();
});





