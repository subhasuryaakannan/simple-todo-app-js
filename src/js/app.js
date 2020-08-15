const toDoInput = document.querySelector(".todo-input");
const toDoButton = document.querySelector(".todo-button");
const toDoList = document.querySelector(".todo-list");
const filterTodo = document.querySelector(".filter-todo");

const TODO_LIST_LOCALSTORAGE = "todolist.items";

toDoButton.addEventListener("click", addToDo);
toDoList.addEventListener("click", deleteCheck);
filterTodo.addEventListener("click", filterTodos);
document.addEventListener("DOMContentLoaded", addExistingToDoItems);

function addToDo(event) {
  event.preventDefault();
  const lastItemDiv = document.querySelectorAll(".todo")[0];
  const lastItem = lastItemDiv && lastItemDiv.children;
  const previousId =
    lastItem && lastItem[0].value >= 0 ? lastItem[0].value + 1 : 0;
  const toDoDiv = document.createElement("div");
  toDoDiv.classList.add("todo");
  if (toDoInput.value !== "") {
    const newToDo = document.createElement("li");
    newToDo.classList.add("todo-item");
    newToDo.value = previousId;
    newToDo.innerText = toDoInput.value;
    toDoDiv.appendChild(newToDo);
    saveToDoItems(previousId, toDoInput.value);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    toDoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    toDoDiv.appendChild(trashButton);

    // toDoList.appendChild(toDoDiv);
    toDoList.prepend(toDoDiv);
    toDoInput.value = "";
  }
}

function deleteCheck(event) {
  const item = event.target;
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    const todoItem = todo.children[0].innerText;
    todo.classList.add("fall");
    deleteToDoItems(todoItem, todo.children[0].value);
    todo.addEventListener("transitionend", function() {
      todo.remove();
    });
  }

  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    const todoItem = todo.children[0].value;
    let todos = getStoredTodos();
    if (todo.classList.contains("completed")) {
      todos.map(function(todo) {
        if (todo.id === todoItem) {
          todo.completed = true;
          return todo;
        }
      });
    } else {
      todos.map(function(todo) {
        if (todo.id === todoItem) {
          todo.completed = false;
          return todo;
        }
      });
    }
    localStorage.setItem(TODO_LIST_LOCALSTORAGE, JSON.stringify(todos));
  }
}

function filterTodos(event) {
  const todos = toDoList.childNodes;
  todos.forEach(function(todo) {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function saveToDoItems(id, todo) {
  let todos = getStoredTodos();
  todos.push({ id: id, item: todo, completed: false });
  localStorage.setItem(TODO_LIST_LOCALSTORAGE, JSON.stringify(todos));
}

function deleteToDoItems(todo, id) {
  let todos = getStoredTodos();
  const index = todos.filter(todoItem => todoItem.id === id);
  todos.splice(todos.indexOf(index[0]), 1);
  localStorage.setItem(TODO_LIST_LOCALSTORAGE, JSON.stringify(todos));
}

function addExistingToDoItems() {
  let todos = getStoredTodos();
  // todos.reverse();
  todos.forEach(function(todo) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo");

    const newToDo = document.createElement("li");
    newToDo.value = todo.id;
    newToDo.classList.add("todo-item");
    newToDo.innerText = todo.item;
    toDoDiv.appendChild(newToDo);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    toDoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    toDoDiv.appendChild(trashButton);

    if (todo.completed) {
      toDoDiv.classList.add("completed");
    }
    toDoList.prepend(toDoDiv);
  });
}

function getStoredTodos() {
  let todos;
  if (localStorage.getItem(TODO_LIST_LOCALSTORAGE) === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem(TODO_LIST_LOCALSTORAGE));
  }
  return todos;
}
