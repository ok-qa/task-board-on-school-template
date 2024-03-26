const taskStorageKey = 'tasks';

export function getTasksFromStorage() {
  const savedTasks = localStorage.getItem(taskStorageKey);
  let parsedTasks;
  if (savedTasks) {
    parsedTasks = JSON.parse(savedTasks);
  }
  return parsedTasks;
}

export function saveTaskToStorage(task) {
  let newTask;
  const currentTasks = localStorage.getItem(taskStorageKey);
  if (currentTasks) {
    const parsedTasks = JSON.parse(currentTasks);
    newTask = JSON.stringify([...parsedTasks, task]);
  } else {
    newTask = JSON.stringify([task]);
  }
  localStorage.setItem(taskStorageKey, newTask);
}

export function removeTaskFromStorage(id) {
  const newTasks = getTasksFromStorage().filter((task) => task.id !== id);
  localStorage.setItem(taskStorageKey, JSON.stringify(newTasks));
}

export function updateDescriptionInStorage(newDescription, itemId) { 
    const updatedTasks = getTasksFromStorage().map((item) => {
      if (item.id === itemId) {
        const tempItem = { ...item, description: newDescription };
        return tempItem;
      }
      return item;
    });

    const editedTasks = JSON.stringify([...updatedTasks]);

    localStorage.setItem(taskStorageKey, editedTasks);
}