export function addDragListenersToTask(taskElement) {
  taskElement.addEventListener('dragstart', () => {
    taskElement.classList.add('is-dragging');
  });
  taskElement.addEventListener('dragend', () => {
    taskElement.classList.remove('is-dragging');
  });
}

export function initDragAndDrop() {
  const draggables = document.querySelectorAll('.task-card');
  const droppables = document.querySelectorAll('.kanban-column');

  draggables.forEach((task) => {
    addDragListenersToTask(task);
  });

  const findBottomTask = (zone, mouseY) => {
    const staticTasks = zone.querySelectorAll('.task-card:not(.is-dragging)');

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    staticTasks.forEach((task) => {
      const { top } = task.getBoundingClientRect();

      const offset = mouseY - top;

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestTask = task;
      }
    });

    return closestTask;
  };

  function updateStatusAfterDrop(zoneId, currentTaskId) {
    let taskStatus;
    switch (zoneId) {
      case 'todo-column':
        taskStatus = 'To Do';
        break;
      case 'inProgress-column':
        taskStatus = 'In Progress';
        break;
      case 'done-column':
        taskStatus = 'Done';
        break;
      default:
        taskStatus = 'To Do';
        break;
    }
    const taskStorageKey = 'tasks';
    const allTasks = localStorage.getItem(taskStorageKey);
    const parsedTasks = JSON.parse(allTasks);
    const updatedTasks = parsedTasks.map((item) => {
      if (item.id === +currentTaskId) {
        const tempItem = { ...item, status: taskStatus };
        return tempItem;
      }
      return item;
    });
    localStorage.setItem(taskStorageKey, JSON.stringify(updatedTasks));
  }

  droppables.forEach((zone) => {
    const zoneElementId = zone.id;

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();

      const bottomTask = findBottomTask(zone, e.clientY);
      const currentTask = document.querySelector('.is-dragging');
      const currentTaskId = currentTask.id;

      if (!bottomTask) {
        zone.appendChild(currentTask);
      } else {
        zone.insertBefore(currentTask, bottomTask);
      }

      updateStatusAfterDrop(zoneElementId, currentTaskId);
    });
  });
}
