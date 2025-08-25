// DOM elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// variables

var open = false

let priority = [
  // Set acceptable flags
  { id: 1, emoji: "⭕" },
  { id: 2, emoji: "🟨" },
  { id: 3, emoji: "🟩" },
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // load tasks from the local storage
renderTasks();

// load settings -TODO

let settings = JSON.parse(localStorage.getItem("settings")) || [];

// add tasks
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({
      text: taskText,
      completed: false,
      dateInputted: false,
      _p: 0,
    });
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
  if (
    e.target.classList.contains("removeBtn") ||
    e.target.classList.contains("input")
  ) {
    tasks.splice(index, 1);
  } else if (e.target.tagName === "LI") {
    tasks[index].completed = !tasks[index].completed;
  } else if (e.target.tagName === "set") {
    tasks[index].dateInputted = !tasks[index].dateInputted;
  } else if (e.target.tagName === "priority") {
    tasks[index].priority = !tasks[index].priority;
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

function renderSettings() {
  // might use the same stylesheet from the popup modal for the settings interface.
}

function setPriority() {

  const mainFrame = document.createElement("div");
  mainFrame.classList.add("main_p")

  const subFrame = document.createElement("div")
  subFrame.classList.add("sub_p")

  const emojiFrame = document.createElement("div")
  emojiFrame.classList.add("content_p")

  const x_button = document.createElement("button");
  x_button.textContent = "❌";

  x_button.addEventListener("click", () => {
    mainFrame.remove();

    open = false
  });

  priority.forEach((text, i) => {
    const emoji = document.createElement("button")
    emoji.textContent = text.emoji 
    emoji.classList.add("emoji")

    emojiFrame.appendChild(emoji)
  });

  if (!open) {
    mainFrame.appendChild(subFrame)
    subFrame.appendChild(x_button);
    subFrame.appendChild(emojiFrame);
    document.body.appendChild(mainFrame); 
  }

  open = true;
}

function renderTasks() {
  // this function loads and sets the to-do inputs from the client using the local storage native to visual studio code.
  taskList.innerHTML = "";

  tasks.forEach((task, i) => {
    // tasks is an array [] it is searching this array and takes two args i = index task = nameOfTask
    const li = document.createElement("li"); // "li" is a list element
    li.dataset.index = i; // set the index from the dataset...
    li.textContent = task.text; // Whatever the player inputted from the input box.

    const flag = document.createElement("button");

    priority.map((emoji, i) => {
      if (task._p == i) {
        flag.textContent = emoji.emoji;
        return;
      }
    });

    flag.addEventListener("click", () => {
      setPriority();
    });

    if (task.completed) li.classList.add("completed");

    const resourceDiv = document.createElement("div"); // the resource div is where all the "elements" live.
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

      if (
        dateInput === "" ||
        isNaN(dateObj.getTime()) ||
        currentDate > dateObj
      ) {
        console.log("Invalid or past date entered");
        input.classList.remove("set");
        task.dateInputted = false;
        input.value = "!invalid date";
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
    resourceDiv.appendChild(flag);

    li.appendChild(input);
    taskList.appendChild(resourceDiv);
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
