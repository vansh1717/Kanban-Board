const todo =document.querySelector("#todo")
const progress =document.querySelector("#progress")
const done =document.querySelector("#done")
const toggleModalBtn = document.querySelector("#toggle-modal")
const modal = document.querySelector(".modal")
const modalBg = document.querySelector(".bg")

const addTaskBtn = document.querySelector("#add-new-task")
const input =document.querySelector(".center input")
const textarea=document.querySelector(".center textarea")
let dragItem=null

// const tasks= document.querySelectorAll(".task")
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// tasks.forEach(task => {
//     task.addEventListener("dragstart", () => {
//         dragItem = task;
//     });

//     task.addEventListener("dragend", () => {
//         dragItem = null;
//     });
// });



toggleModalBtn.addEventListener("click",()=>{
    // e.preventDefault()
    console.log("btn clicked");
    
    modal.classList.toggle("active")

})
modalBg.addEventListener("click",()=>{
    modal.classList.toggle("active")
})

// save task
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function createTask(taskData) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("draggable", "true");

    // Connect the DOM card to its data object
    task.dataset.id = taskData.id;

    const heading = document.createElement("h3");
    heading.textContent = taskData.title;

    const para = document.createElement("p");
    para.textContent = taskData.description;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    task.append(heading, para, deleteBtn);

    task.addEventListener("dragstart", () => {
        dragItem = task;
    });

    task.addEventListener("dragend", () => {
        dragItem = null;
    });

    deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== taskData.id);
        saveTasks();
        renderTasks();
    });

    return task;
}



addTaskBtn.addEventListener("click", () => {
    const head = input.value.trim();
    const description = textarea.value.trim();

    if (head === "") {
        alert("Please enter a task title");
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        title: head,
        description: description,
        status: "todo"
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    input.value = "";
    textarea.value = "";

    modal.classList.remove("active");
});

function renderTasks() {
    // Remove existing task cards from all columns
    document.querySelectorAll(".task-clm .task").forEach(task => {
        task.remove();
    });

    // Recreate cards from the saved data array
    tasks.forEach(taskData => {
        const task = createTask(taskData);

        const column = document.querySelector(
            `#${taskData.status}`
        );

        if (column) {
            column.appendChild(task);
        }
    });
    updateCounts();
}

function updateCounts() {
    document.querySelector("#todo-count").textContent =
        tasks.filter(task => task.status === "todo").length;

    document.querySelector("#progress-count").textContent =
        tasks.filter(task => task.status === "progress").length;

    document.querySelector("#done-count").textContent =
        tasks.filter(task => task.status === "done").length;
}



// progress.addEventListener("dragenter",(e)=>{
//     progress.classList.add("hover-over")
// })
// progress.addEventListener("dragleave",(e)=>{
//     progress.classList.remove("hover-over")
// })
function addEventsOnClm(clm){
    clm.addEventListener("dragenter",(e)=>{
        e.preventDefault()
        clm.classList.add("hover-over")
    })
    clm.addEventListener("dragleave",(e)=>{
        e.preventDefault()
        clm.classList.remove("hover-over")
    })

    clm.addEventListener("dragover",(e)=>{
        e.preventDefault()
    })

    
clm.addEventListener("drop", (e) => {
    e.preventDefault();

    if (!dragItem) return;

    const taskId = dragItem.dataset.id;

    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return {
                ...task,
                status: clm.id
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();

    clm.classList.remove("hover-over");
});

}

addEventsOnClm(todo)
addEventsOnClm(progress)
addEventsOnClm(done)
renderTasks();