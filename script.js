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
    tasks.push({ text: taskText, completed: false, dateInputted: false });
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
  if (e.target.classList.contains("removeBtn") || e.target.classList.contains("input")) {
    tasks.splice(index, 1);
  } else if (e.target.tagName === "LI") {
    tasks[index].completed = !tasks[index].completed;
  } else if (e.target.tagName === "set") {
     tasks[index].dateInputted = !tasks[index].dateInputted;
  }

  saveTasks();
  renderTasks();
});

// toggle the popup menu. maybe in the future i could use this but for now i don't need the modal.
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

  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.dataset.index = i;
    li.textContent = task.text;

    if (task.completed) li.classList.add("completed");

    const resourceDiv = document.createElement("div");
    resourceDiv.classList.add("resource");

    const input = document.createElement("input");
    input.classList.add("input");
    input.placeholder = "0/0/0000";
    input.type = "text";

    if (task.dateInputted) {
      input.value = task.dateInputted;
      input.classList.add("set");
    }

    input.addEventListener("click", (e) => e.stopPropagation());
    
    input.addEventListener("focusout", () => {
      let dateInput = input.value;
      let dateObj = new Date(dateInput);
      let currentDate = new Date();

      if (dateInput === "" || isNaN(dateObj.getTime()) || currentDate > dateObj) {
        console.log("Invalid or past date entered");
        input.classList.remove("set");
        task.dateInputted = false; 
        input.value = "!invalid date"
      } else {
        console.log("Valid date entered.");
        input.classList.add("set");
        task.dateInputted = dateInput; 
      }

      saveTasks();
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.classList.add("removeBtn");

    resourceDiv.appendChild(removeBtn);

    li.appendChild(input);
    taskList.appendChild(resourceDiv);
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
