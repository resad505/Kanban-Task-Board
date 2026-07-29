/**
 * Checkpoint-1, Checkpoint-2 & Checkpoint-3 Implementation
 * Checkpoint-1: Dynamic rendering of tasks from a JS array (DOM manipulation)
 * Checkpoint-2: Add / edit / delete task functionality
 * Checkpoint-3: Cross-column drag-and-drop (HTML5 Drag and Drop API)
 */

// Global State
let tasks = [];

let editingTaskId = null;
let draggedTaskId = null;

// DOM Elements
let taskModal, modalTitle, taskForm, taskTitleInput, taskDescInput, taskPriorityInput;
let openModalBtn, closeModalBtn, cancelModalBtn;

// Helper: Format Priority Label
function getPriorityLabel(priority) {
    switch (priority) {
        case 'low':
            return 'AŞAĞI';
        case 'medium':
            return 'ORTA';
        case 'high':
            return 'YÜKSƏK';
        default:
            return priority.toUpperCase();
    }
}

// Create Task Card Element (BEM Naming & Drag-and-Drop)
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-id', task.id);
    card.setAttribute('draggable', 'true');

    // Drag and Drop Event Handlers (HTML5 Drag API)
    card.addEventListener('dragstart', (e) => {
        draggedTaskId = task.id;
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            card.classList.add('task-card--dragging');
        }, 0);
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('task-card--dragging');
        draggedTaskId = null;
        document.querySelectorAll('.kanban-column').forEach(col => {
            col.classList.remove('kanban-column--drag-over');
        });
    });

    // Header & Priority Badge
    const headerDiv = document.createElement('div');
    headerDiv.className = 'task-card__header';

    const badge = document.createElement('span');
    badge.className = `priority-badge priority-badge--${task.priority}`;
    badge.textContent = getPriorityLabel(task.priority);
    headerDiv.appendChild(badge);

    // Title
    const title = document.createElement('h3');
    title.className = 'task-card__title';
    title.textContent = task.title;

    // Description (if present)
    let desc = null;
    if (task.description && task.description.trim() !== '') {
        desc = document.createElement('p');
        desc.className = 'task-card__desc';
        desc.textContent = task.description;
    }

    // Card Footer
    const footerDiv = document.createElement('div');
    footerDiv.className = 'task-card__footer';

    // Time Indicator
    const timeDiv = document.createElement('div');
    timeDiv.className = 'task-card__time';
    timeDiv.innerHTML = `
        <ion-icon name="time-outline"></ion-icon>
        <span>${task.createdAt || 'MƏT 15'}</span>
    `;

    // Actions (Edit & Delete)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-card__actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'task-card__btn task-card__btn--edit';
    editBtn.setAttribute('title', 'Redaktə et');
    editBtn.innerHTML = `<ion-icon name="pencil-outline"></ion-icon>`;
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(task);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-card__btn task-card__btn--delete';
    deleteBtn.setAttribute('title', 'Sil');
    deleteBtn.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`;
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    footerDiv.appendChild(timeDiv);
    footerDiv.appendChild(actionsDiv);

    // Assemble Card
    card.appendChild(headerDiv);
    card.appendChild(title);
    if (desc) {
        card.appendChild(desc);
    }
    card.appendChild(footerDiv);

    return card;
}

// Render Kanban Board
function renderBoard() {
    const statuses = ['gozlamada', 'icra_olunur', 'tamamlandi'];

    statuses.forEach(status => {
        const listEl = document.getElementById(`list-${status}`);
        const countEl = document.getElementById(`count-${status}`);

        if (!listEl || !countEl) return;

        listEl.innerHTML = '';
        const columnTasks = tasks.filter(task => task.status === status);

        countEl.textContent = columnTasks.length;

        if (columnTasks.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'kanban-column__empty';
            emptyEl.textContent = 'Burada tapşırıq yoxdur';
            listEl.appendChild(emptyEl);
        } else {
            columnTasks.forEach(task => {
                const cardEl = createTaskCard(task);
                listEl.appendChild(cardEl);
            });
        }
    });
}

// Setup Column Drag and Drop Handlers
function setupColumnDragAndDrop() {
    const columns = document.querySelectorAll('.kanban-column');

    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            column.classList.add('kanban-column--drag-over');
        });

        column.addEventListener('dragleave', (e) => {
            // Remove highlight only if leaving column container
            if (!column.contains(e.relatedTarget)) {
                column.classList.remove('kanban-column--drag-over');
            }
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('kanban-column--drag-over');

            const targetStatus = column.getAttribute('data-status');
            const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;

            if (!taskId || !targetStatus) return;

            const task = tasks.find(t => t.id === taskId);
            if (task && task.status !== targetStatus) {
                task.status = targetStatus;
                renderBoard();
            }
        });
    });
}

// Open Modal (Add or Edit Mode)
function openModal(taskToEdit = null) {
    if (taskToEdit) {
        editingTaskId = taskToEdit.id;
        modalTitle.textContent = 'Tapşırığı Redaktə Et';
        taskTitleInput.value = taskToEdit.title;
        taskDescInput.value = taskToEdit.description || '';
        taskPriorityInput.value = taskToEdit.priority;
    } else {
        editingTaskId = null;
        modalTitle.textContent = 'Yeni Tapşırıq';
        taskForm.reset();
        taskPriorityInput.value = 'low';
    }
    taskModal.classList.remove('task-modal--hidden');
    taskTitleInput.focus();
}

// Close Modal
function closeModal() {
    taskModal.classList.add('task-modal--hidden');
    taskForm.reset();
    editingTaskId = null;
}

// Form Submit Handler (Add / Edit Task)
function handleFormSubmit(e) {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();
    const priority = taskPriorityInput.value;

    if (!title) return;

    if (editingTaskId !== null) {
        // Edit existing task
        const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].title = title;
            tasks[taskIndex].description = description;
            tasks[taskIndex].priority = priority;
        }
    } else {
        // Create new task
        const newTask = {
            id: Date.now().toString(),
            title: title,
            description: description,
            priority: priority,
            status: 'gozlamada',
            createdAt: 'MƏT 15'
        };
        tasks.push(newTask);
    }

    closeModal();
    renderBoard();
}

// Delete Task with Browser Confirm Prompt
function deleteTask(id) {
    const isConfirmed = confirm('Bu tapşırığı silmək istədiyinizdən əminsiniz?');
    if (isConfirmed) {
        tasks = tasks.filter(task => task.id !== id);
        renderBoard();
    }
}

// Initialize Event Listeners & Board
document.addEventListener('DOMContentLoaded', () => {
    // Bind DOM elements
    taskModal = document.getElementById('taskModal');
    modalTitle = document.getElementById('modalTitle');
    taskForm = document.getElementById('taskForm');
    taskTitleInput = document.getElementById('taskTitleInput');
    taskDescInput = document.getElementById('taskDescInput');
    taskPriorityInput = document.getElementById('taskPriorityInput');

    openModalBtn = document.getElementById('openModalBtn');
    closeModalBtn = document.getElementById('closeModalBtn');
    cancelModalBtn = document.getElementById('cancelModalBtn');

    // Bind Event Listeners
    if (openModalBtn) openModalBtn.addEventListener('click', () => openModal());
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (taskModal) {
        taskModal.addEventListener('click', (e) => {
            if (e.target === taskModal) {
                closeModal();
            }
        });
    }

    if (taskForm) {
        taskForm.addEventListener('submit', handleFormSubmit);
    }

    // Setup Drag and Drop
    setupColumnDragAndDrop();

    // Initial render
    renderBoard();
});
