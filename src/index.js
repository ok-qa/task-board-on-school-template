import { toggleModal } from './js/modal.js';
import { initDragAndDrop, addDragListenersToTask } from './js/drag.js';
import createCardHTML from './js/createCardHTML.js';
import {
  saveTaskToStorage, removeTaskFromStorage, getTasksFromStorage, updateDescriptionInStorage,
} from './js/storage.js';

const form = document.getElementById('todo-form');
const nameInput = document.getElementById('form-input');
const descriptionInput = document.getElementById('description');
const todoColumn = document.getElementById('todo-column');
const inProgressColumn = document.getElementById('inProgress-column');
const doneColumn = document.getElementById('done-column');
const statusSelect = document.getElementById('status');

function insertTaskToHTML({
  name, description, status, id,
}) {
  const taskHTMLTemplate = createCardHTML(name, description, id);
  const tasksContainer = document.createElement('div');
  tasksContainer.insertAdjacentHTML('beforeend', taskHTMLTemplate);
  if (status === 'To Do') {
    todoColumn.appendChild(tasksContainer);
  } else if (status === 'In Progress') {
    inProgressColumn.appendChild(tasksContainer);
  } else {
    doneColumn.appendChild(tasksContainer);
  }
}

function removeTask(id) {
  document.getElementById(id).remove();
  removeTaskFromStorage(id);
}

function saveDescriptionAfterChanges(descriptionElement, itemId) {
  const { innerText: textContent } = descriptionElement;
  updateDescriptionInStorage(textContent, itemId);
}

function updateTask(itemId, item) {
  const descriptionElement = document.getElementById(
    `task-description-${itemId}`,
  );
  const contentEditState = descriptionElement.isContentEditable;
  descriptionElement.setAttribute('contentEditable', !contentEditState);
  const itemLinkCopy = item;
  if (!contentEditState) {
    itemLinkCopy.innerHTML = '<svg aria-hidden="true" style="display: flex; width: 28px; height: 25px; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M22 14.531v4.969c0 2.484-2.016 4.5-4.5 4.5h-13c-2.484 0-4.5-2.016-4.5-4.5v-13c0-2.484 2.016-4.5 4.5-4.5h13c0.625 0 1.25 0.125 1.828 0.391 0.141 0.063 0.25 0.203 0.281 0.359 0.031 0.172-0.016 0.328-0.141 0.453l-0.766 0.766c-0.094 0.094-0.234 0.156-0.359 0.156-0.047 0-0.094-0.016-0.141-0.031-0.234-0.063-0.469-0.094-0.703-0.094h-13c-1.375 0-2.5 1.125-2.5 2.5v13c0 1.375 1.125 2.5 2.5 2.5h13c1.375 0 2.5-1.125 2.5-2.5v-3.969c0-0.125 0.047-0.25 0.141-0.344l1-1c0.109-0.109 0.234-0.156 0.359-0.156 0.063 0 0.125 0.016 0.187 0.047 0.187 0.078 0.313 0.25 0.313 0.453zM25.609 6.891l-12.719 12.719c-0.5 0.5-1.281 0.5-1.781 0l-6.719-6.719c-0.5-0.5-0.5-1.281 0-1.781l1.719-1.719c0.5-0.5 1.281-0.5 1.781 0l4.109 4.109 10.109-10.109c0.5-0.5 1.281-0.5 1.781 0l1.719 1.719c0.5 0.5 0.5 1.281 0 1.781z"></path></svg>';
  } else {
    itemLinkCopy.innerHTML = '<svg aria-hidden="true" style="display: flex; width: 28px; height: 25px; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M13.875 18.5l1.813-1.813-2.375-2.375-1.813 1.813v0.875h1.5v1.5h0.875zM20.75 7.25c-0.141-0.141-0.375-0.125-0.516 0.016l-5.469 5.469c-0.141 0.141-0.156 0.375-0.016 0.516s0.375 0.125 0.516-0.016l5.469-5.469c0.141-0.141 0.156-0.375 0.016-0.516zM22 16.531v2.969c0 2.484-2.016 4.5-4.5 4.5h-13c-2.484 0-4.5-2.016-4.5-4.5v-13c0-2.484 2.016-4.5 4.5-4.5h13c0.625 0 1.25 0.125 1.828 0.391 0.141 0.063 0.25 0.203 0.281 0.359 0.031 0.172-0.016 0.328-0.141 0.453l-0.766 0.766c-0.141 0.141-0.328 0.187-0.5 0.125-0.234-0.063-0.469-0.094-0.703-0.094h-13c-1.375 0-2.5 1.125-2.5 2.5v13c0 1.375 1.125 2.5 2.5 2.5h13c1.375 0 2.5-1.125 2.5-2.5v-1.969c0-0.125 0.047-0.25 0.141-0.344l1-1c0.156-0.156 0.359-0.187 0.547-0.109s0.313 0.25 0.313 0.453zM20.5 5l4.5 4.5-10.5 10.5h-4.5v-4.5zM27.438 7.063l-1.437 1.437-4.5-4.5 1.437-1.437c0.578-0.578 1.547-0.578 2.125 0l2.375 2.375c0.578 0.578 0.578 1.547 0 2.125z"></path></svg>';
    saveDescriptionAfterChanges(descriptionElement, itemId);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { value: nameValue } = nameInput;
  const { value: descriptionValue } = descriptionInput;
  const { value: statusValue } = statusSelect;

  const currentDate = new Date();
  const task = {
    id: +currentDate,
    name: nameValue,
    description: descriptionValue,
    status: statusValue,
  };

  insertTaskToHTML(task);
  saveTaskToStorage(task);
  const taskHTMLElement = document.getElementById(task.id);
  addDragListenersToTask(taskHTMLElement);

  const taskDeleteElement = document.getElementById(`removeTask-${task.id}`);
  taskDeleteElement.onclick = () => removeTask(task.id);

  const taskUpdateElement = document.getElementById(`editTask-${task.id}`);
  taskUpdateElement.onclick = () => updateTask(task.id, taskUpdateElement);

  nameInput.value = '';
  descriptionInput.value = '';
  statusSelect.options[0].selected = true;

  toggleModal();
});

function showTasks() {
  getTasksFromStorage().forEach((item) => {
    insertTaskToHTML(item);
  });
}

function addTaskRemoveHandler() {
  const deleteBtnElements = document.getElementsByClassName('task-remove');
  if (!deleteBtnElements || !deleteBtnElements.length) {
    return;
  }
  [...deleteBtnElements].forEach((item) => {
    const itemId = item.id.replace('removeTask-', '');
    const itemLinkCopy = item;
    itemLinkCopy.onclick = () => removeTask(+itemId);
  });
}

function addTaskUpdateHandler() {
  const editButtons = document.getElementsByClassName('task-edit');
  if (!editButtons || !editButtons.length) {
    return;
  }
  [...editButtons].forEach((item) => {
    const itemId = item.id.replace('editTask-', '');
    const itemLinkCopy = item;
    itemLinkCopy.onclick = () => updateTask(+itemId, item);
  });
}

showTasks();

addTaskUpdateHandler();
addTaskRemoveHandler();

initDragAndDrop();
