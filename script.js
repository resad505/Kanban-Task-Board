/**
 * Checkpoint-1: Dynamic rendering of tasks from a JS array (DOM manipulation)
 */

// Global State - Task Array
let tasks = [

];

// Helper: Format Priority Display Text
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

// Create Task Card Element
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-id', task.id);
    card.setAttribute('draggable', 'true');

    // Priority Tag
    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header';

    const badge = document.createElement('span');
    badge.className = `priority-badge ${task.priority}`;
    badge.textContent = getPriorityLabel(task.priority);
    headerDiv.appendChild(badge);

    // Title
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = task.title;

    // Description (if present)
    let desc = null;
    if (task.description && task.description.trim() !== '') {
        desc = document.createElement('p');
        desc.className = 'card-desc';
        desc.textContent = task.description;
    }

    // Card Footer
    const footerDiv = document.createElement('div');
    footerDiv.className = 'card-footer';

    // Time Indicator with Ionicons
    const timeDiv = document.createElement('div');
    timeDiv.className = 'card-time';
    timeDiv.innerHTML = `
        <ion-icon name="time-outline"></ion-icon>
        <span>${task.createdAt || 'MƏT 15'}</span>
    `;

    // Action Buttons with Ionicons (Edit / Delete)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'card-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.setAttribute('title', 'Redaktə et');
    editBtn.innerHTML = `<ion-icon name="pencil-outline"></ion-icon>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.setAttribute('title', 'Sil');
    deleteBtn.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`;

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

// Render Kanban Board dynamically from JS array
function renderBoard() {
    const statuses = ['gozlamada', 'icra_olunur', 'tamamlandi'];

    statuses.forEach(status => {
        const listEl = document.getElementById(`list-${status}`);
        const countEl = document.getElementById(`count-${status}`);

        if (!listEl || !countEl) return;

        // Clear existing items
        listEl.innerHTML = '';

        // Filter tasks for current column
        const columnTasks = tasks.filter(task => task.status === status);

        // Update column count badge
        countEl.textContent = columnTasks.length;

        // If no tasks, show empty state message
        if (columnTasks.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty-state';
            emptyEl.textContent = 'Burada tapşırıq yoxdur';
            listEl.appendChild(emptyEl);
        } else {
            // Append card elements
            columnTasks.forEach(task => {
                const cardEl = createTaskCard(task);
                listEl.appendChild(cardEl);
            });
        }
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
});
