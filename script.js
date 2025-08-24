// DOM elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// load tasks from the local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// add tasks
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, completed: false });
    saveTasks();
    renderTasks();
    //popup();
    taskInput.value = "";
  }

  console.log("the add btn was clicked.");
});

// Toggle complete and remove task
taskList.addEventListener("click", (e) => {
  const index = e.target.parentElement.dataset.index;
  if (e.target.classList.contains("removeBtn")) {
    tasks.splice(index, 1);
  } else if (e.target.tagName === "LI") {
    tasks[index].completed = !tasks[index].completed;
  }

  saveTasks();
  renderTasks();
});

// toggle the popup menu.
function popup() {
  const modal = document.createElement("div");
  modal.className = "modal";

  const content = document.createElement("div");
  content.className = "modal-content";

  const h1 = document.createElement("h1");
  h1.textContent = "Do you want to set the date?";
  content.appendChild(h1);

  const h2 = document.createElement("h2");
  h2.textContent = "If not just click that x in the corner.";
  content.appendChild(h2);

  const p = document.createElement("p");
  p.textContent = "Click confirm to set the date.";
  content.appendChild(p);

  const dateInput = document.createElement("input");
  dateInput.textContent = "The date is: ";
  content.appendChild(dateInput);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });
  content.appendChild(closeBtn);

  modal.appendChild(content);
  document.body.appendChild(modal);
}

function isDateValid(dateStr) {
  return !isNaN(new Date(dateStr));
}

function renderTasks() {
  taskList.innerHTML = "";
  var li = null;
  var resourceDiv = null;

  tasks.forEach((task, i) => {
    resourceDiv = document.createElement("div");
    resourceDiv.classList.add("resource")

    li = document.createElement("li");
    li.textContent = task.text;
    li.dataset.index = i;

    if (task.completed) li.classList.add("completed");

    taskList.appendChild(resourceDiv);
    taskList.appendChild(li);
  });

  if (li) {
    input = document.createElement("input");
    input.classList.add("input");
    input.placeholder = "0/0/0000";
    input.type = "text";

    li.appendChild(input);

    input.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    input.addEventListener("focus", () => {
      console.log("The player attempted to input!");
    });

    input.addEventListener("focusout", () => {
      let dateInput = input.value;
      let dateObj = new Date(dateInput);

      let currentDate = new Date();

      if (currentDate > dateObj) {
        console.log("the current date is greater than the date you inputted");
        input.value = input.placeholder;
        input.classList.remove("set");
      } else {
        console.log("The date you inputted is good enough to be valid.");
        input.classList.add("set");
      }
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.classList.add("removeBtn");
    li.appendChild(removeBtn);
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
