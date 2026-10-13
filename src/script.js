// Logic trong hàm Thêm giữ nguyên từ script.js của bạn.
export default function setupTodo() {
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');

function handleAddClick() {
    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("M chưa nhập công việc kìa");
        return;
    }   
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';

    const taskLabel = document.createElement('label');
    taskLabel.className = 'task-label';
    
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type= 'checkbox';
    taskCheckbox.className = 'task-checkbox';

    const taskNameSpan = document.createElement('span');
    taskNameSpan.className = 'task-text';
    taskNameSpan.textContent = taskName;

    taskLabel.appendChild(taskCheckbox);
    taskLabel.appendChild(taskNameSpan);
    taskItem.appendChild(taskLabel);
    taskList.appendChild(taskItem);

    
    
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Xóa';
    deleteButton.addEventListener("click", function() {
        taskItem.remove();
    });
    taskItem.appendChild(deleteButton);
    

}



const taskList = document.getElementById('task-list');

addButton.addEventListener("click", handleAddClick);

// Gỡ listener khi React tháo giao diện, tránh gắn trùng trong StrictMode.
return function cleanup() {
  addButton.removeEventListener("click", handleAddClick);
};
}
