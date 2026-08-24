const todoForm = document.getElementById("todoForm");
const todoInputControl = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const updateTodoBtn = document.getElementById("updateTodoBtn");
const todoList = document.getElementById("todoList");
const deleteAllTodosBtn = document.getElementById("deleteAllBtn");


let defaultTodos = [
  {
    todoItem: "CSS",
    todoId: "101",
    
  },
  {
    todoItem: "Bootstrap",
    todoId: "102",
  },
  {
    todoItem: "Tailwind",
    todoId: "103",
  },
];

let getData = localStorage.getItem("todosArr");
let todosArr;
if(getData){
  todosArr = JSON.parse(getData);
}else{
  todosArr = defaultTodos;
  localStorage.setItem("todosArr", JSON.stringify(todosArr));
}

function saveToLocalStorage(){
  localStorage.setItem("todosArr", JSON.stringify(todosArr));

}

//read
function showTodos(todoarr){
  let res = ``;
  todoarr.forEach(el => {
    res += `    <li class="list-group-item d-flex justify-content-between align-items-center" id="${el.todoId}">
              <strong>${el.todoItem}</strong>
              <div>
                <button onclick="onTodoEditHandler(this)" class="btn btn-sm btn-warning mr-2">Edit</button>
                <button onclick="onTodoDeleteHandler(this)" class="btn btn-sm btn-danger">Delete</button>
              </div>
            </li>`
  });
  todoList.innerHTML = res;
}

showTodos(todosArr);


//create
function onTodoSubmitHandler(event){
  event.preventDefault();
  let todoObj = {
    todoItem : todoInputControl.value,
    todoId : Date.now().toString()
  }
  todoForm.reset();
  todosArr.push(todoObj);
  saveToLocalStorage();

  let newLi = document.createElement("li");
  newLi.className = "list-group-item d-flex justify-content-between align-items-center";
  newLi.id = todoObj.todoId;
  newLi.innerHTML = ` <strong>${todoObj.todoItem}</strong>
              <div>
                <button onclick="onTodoEditHandler(this)" class="btn btn-sm btn-warning mr-2">Edit</button>
                <button onclick="onTodoDeleteHandler(this)" class="btn btn-sm btn-danger">Delete</button>
              </div>`
  todoList.append(newLi);
   Swal.fire({
      text : `Todo ${todoObj.todoItem} added successfully.`,
      icon : "success",
      timer : 2000
    })
}

//edit
function onTodoEditHandler(ele){
  const editId = ele.closest("li").id;
  localStorage.setItem("updateId", editId);
  const editObj = todosArr.find(el => el.todoId === editId);
  //path 
  todoInputControl.value = editObj.todoItem;
  addTodoBtn.classList.add("d-none");
  updateTodoBtn.classList.remove("d-none");  
}

//update
function onTodoUpdateHandler(){
  const updateId = localStorage.getItem("updateId");
  localStorage.removeItem("updateId");
  const updatedObj = {
    todoItem : todoInputControl.value,
    todoId : updateId
  }
  const updateIndex = todosArr.findIndex(el => el.todoId === updateId);
  todosArr[updateIndex] = updatedObj;
  saveToLocalStorage();
  document.getElementById(updateId).querySelector("strong").innerText = updatedObj.todoItem;
  updateTodoBtn.classList.add("d-none");
  addTodoBtn.classList.remove("d-none")
  todoForm.reset();
     Swal.fire({
      text : `Todo ${updatedObj.todoItem} updated successfully.`,
      icon : "success",
      timer : 2000
    })

  
}




//delete
function onTodoDeleteHandler(ele){
  const deleteId = ele.closest("li").id;
  let isConfirm = confirm(`Are you sure you wanna delete this todo with id : ${deleteId}`);
  if(isConfirm){
    const deleteIndex = todosArr.find(el => el.todoId === deleteId);
    todosArr.splice(deleteIndex,1);
    saveToLocalStorage();
    ele.closest("li").remove();
    Swal.fire({
      text : `Todo with id : ${deleteId} deleted successfully.`,
      icon : "success",
      timer : 2000
    })
  }
}

function deleteAllHandler(){
  let isConfirm = confirm("are you sure you want to delete all todos") ;
  if(isConfirm){
    todosArr.splice(0);
  saveToLocalStorage();
  todoList.remove();
    Swal.fire({
      text : `All todos deleted successfully.`,
      icon : "success",
      timer : 2000
    })
  }
  
}




deleteAllTodosBtn.addEventListener("click" , deleteAllHandler);
todoForm.addEventListener("submit", onTodoSubmitHandler);
updateTodoBtn.addEventListener("click", onTodoUpdateHandler)