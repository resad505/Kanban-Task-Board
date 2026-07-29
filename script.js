/**
 * Checkpoint-1 through Checkpoint-6 Implementation
 * Checkpoint-1: Dynamic rendering of tasks from a JS array (DOM manipulation)
 * Checkpoint-2: Add / edit / delete task functionality
 * Checkpoint-3: Cross-column drag-and-drop (HTML5 Drag and Drop API)
 * Checkpoint-4: Storage with localStorage (state is saved when page is refreshed)
 * Checkpoint-5: Search and filter by keyword/priority
 * Checkpoint-6: Safe rendering (XSS protection) + duplicate task prevention
 */

// Storage Key
const STORAGE_KEY = 'kanban_tasks';

// Load tasks from localStorage or initialize empty array
function loadTasksFromStorage() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
            const parsed = JSON.parse(storedTasks);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error('localStorage-dən tapşırıqlar oxunarkən xəta baş verdi:', error);
    }
    return [];
}

// Save tasks to localStorage
function saveTasksToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('localStorage-ə tapşırıqlar yazılarkən xəta baş verdi:', error);
    }
}

// XSS Protection: Sanitize text input by escaping HTML special characters
function sanitizeText(rawText) {
    const tempEl = document.createElement('div');
    tempEl.textContent = rawText;
    return tempEl.innerHTML;
}

// Duplicate Prevention: Check if a task with same title already exists (case-insensitive)
function isDuplicateTask(title, excludeId = null) {
    const normalizedTitle = title.trim().toLowerCase();
    return tasks.some(task => {
        if (excludeId && task.id === excludeId) return false;
        return task.title.trim().toLowerCase() === normalizedTitle;
    });
}

// Global State
let tasks = loadTasksFromStorage();
let editingTaskId = null;
let draggedTaskId = null;

// DOM Elements
let taskModal, modalTitle, taskForm, taskTitleInput, taskDescInput, taskPriorityInput;
let openModalBtn, closeModalBtn, cancelModalBtn;
let searchInput, priorityFilter;

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
// XSS-safe: all user data written via textContent, not innerHTML
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
    badge.textContent = getPriorityLabel(task.priority); // Safe: textContent
    headerDiv.appendChild(badge);

    // Title — XSS safe via textContent
    const title = document.createElement('h3');
    title.className = 'task-card__title';
    title.textContent = task.title; // Safe: textContent

    // Description — XSS safe via textContent
    let desc = null;
    if (task.description && task.description.trim() !== '') {
        desc = document.createElement('p');
        desc.className = 'task-card__desc';
        desc.textContent = task.description; // Safe: textContent
    }

    // Card Footer
    const footerDiv = document.createElement('div');
    footerDiv.className = 'task-card__footer';

    // Time Indicator — XSS safe: icon via innerHTML (static), time via textContent
    const timeDiv = document.createElement('div');
    timeDiv.className = 'task-card__time';

    const timeIcon = document.createElement('ion-icon');
    timeIcon.setAttribute('name', 'time-outline');

    const timeSpan = document.createElement('span');
    timeSpan.textContent = task.createdAt || 'MƏT 15'; // Safe: textContent

    timeDiv.appendChild(timeIcon);
    timeDiv.appendChild(timeSpan);

    // Actions (Edit & Delete)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-card__actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'task-card__btn task-card__btn--edit';
    editBtn.setAttribute('title', 'Redaktə et');
    const editIcon = document.createElement('ion-icon');
    editIcon.setAttribute('name', 'pencil-outline');
    editBtn.appendChild(editIcon);
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(task);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-card__btn task-card__btn--delete';
    deleteBtn.setAttribute('title', 'Sil');
    const deleteIcon = document.createElement('ion-icon');
    deleteIcon.setAttribute('name', 'trash-outline');
    deleteBtn.appendChild(deleteIcon);
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

// Render Kanban Board with Search and Priority Filters
function renderBoard() {
    const statuses = ['gozlamada', 'icra_olunur', 'tamamlandi'];
    
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedPriority = priorityFilter ? priorityFilter.value : 'all';

    statuses.forEach(status => {
        const listEl = document.getElementById(`list-${status}`);
        const countEl = document.getElementById(`count-${status}`);

        if (!listEl || !countEl) return;

        listEl.innerHTML = '';

        // Filter tasks by status, priority, and search keyword
        const columnTasks = tasks.filter(task => {
            if (task.status !== status) return false;

            if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
                return false;
            }

            if (searchQuery !== '') {
                const titleMatch = task.title.toLowerCase().includes(searchQuery);
                const descMatch = (task.description || '').toLowerCase().includes(searchQuery);
                if (!titleMatch && !descMatch) return false;
            }

            return true;
        });

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
                saveTasksToStorage();
                renderBoard();
            }
        });
    });
}

// Show inline error on the title input
function showTitleError(message) {
    let errorEl = document.getElementById('titleErrorMsg');
    if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.id = 'titleErrorMsg';
        errorEl.style.cssText = 'color:#EF4444;font-size:12px;margin-top:4px;';
        taskTitleInput.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

function clearTitleError() {
    const errorEl = document.getElementById('titleErrorMsg');
    if (errorEl) errorEl.textContent = '';
}

// Open Modal (Add or Edit Mode)
function openModal(taskToEdit = null) {
    clearTitleError();
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
    clearTitleError();
}

// Form Submit Handler (Add / Edit Task)
// XSS Protection: sanitizeText() applied; Duplicate Prevention: isDuplicateTask() checked
function handleFormSubmit(e) {
    e.preventDefault();
    clearTitleError();

    const rawTitle = taskTitleInput.value.trim();
    const rawDescription = taskDescInput.value.trim();
    const priority = taskPriorityInput.value;

    if (!rawTitle) return;

    // Checkpoint-6: Sanitize input to prevent XSS
    const title = sanitizeText(rawTitle);
    const description = sanitizeText(rawDescription);

    // Checkpoint-6: Duplicate task prevention (case-insensitive title match)
    if (isDuplicateTask(rawTitle, editingTaskId)) {
        showTitleError('Bu adda tapşırıq artıq mövcuddur. Fərqli bir ad seçin.');
        return;
    }

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

    saveTasksToStorage();
    closeModal();
    renderBoard();
}

// Delete Task with Browser Confirm Prompt
function deleteTask(id) {
    const isConfirmed = confirm('Bu tapşırığı silmək istədiyinizdən əminsiniz?');
    if (isConfirmed) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToStorage();
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

    searchInput = document.getElementById('searchInput');
    priorityFilter = document.getElementById('priorityFilter');

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

    // Search and Priority Filter Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', () => renderBoard());
    }

    if (priorityFilter) {
        priorityFilter.addEventListener('change', () => renderBoard());
    }

    // Setup Drag and Drop
    setupColumnDragAndDrop();

    // Initial render
    renderBoard();
});
