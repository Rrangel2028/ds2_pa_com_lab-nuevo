document.addEventListener('DOMContentLoaded', () => {
    const resourceTypes = [
        { type: 'file', title: 'Subir Archivo', icon: 'fa-file-upload', color: '#4A90E2' },
        { type: 'lesson', title: 'Área de texto y medios', icon: 'fa-file-alt', color: '#50E3C2' },
        { type: 'activity', title: 'Actividad', icon: 'fa-tasks', color: '#F5A623' }
    ];

    const resourceModal = document.getElementById('add-resource-modal');
    const resourceGrid = document.getElementById('resource-grid-container');
    const addResourceBtn = document.getElementById('add-resource-btn');
    const closeResourceModalBtn = document.getElementById('close-resource-modal-btn');

    if (!resourceModal || !resourceGrid || !addResourceBtn || !closeResourceModalBtn) {
        console.warn("Resource handler: elementos del DOM no encontrados, se omite la inicialización.");
        return;
    }

    // Rellenar el grid con tarjetas de opción
    resourceGrid.innerHTML = resourceTypes.map(res => `
        <button class="resource-item" data-type="${res.type}" style="background:transparent; border:0; cursor:pointer; padding:18px; text-align:center;">
            <i class="fas ${res.icon} resource-icon" style="color: ${res.color}; font-size:36px; display:block; margin:0 auto 8px;"></i>
            <span class="resource-title" style="display:block; font-weight:600; color:#1f2d3d;">${res.title}</span>
        </button>
    `).join('');

    // Mostrar modal al pulsar el botón principal
    addResourceBtn.addEventListener('click', () => {
        resourceModal.style.display = 'flex';
    });

    const closeModal = () => resourceModal.style.display = 'none';
    closeResourceModalBtn.addEventListener('click', closeModal);
    resourceModal.addEventListener('click', (e) => {
        if (e.target === resourceModal) closeModal();
    });

    // Delegado para clicks en el grid
    resourceGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.resource-item');
        if (!item) return;

        const resourceType = item.dataset.type;
        closeModal();

        // debug: indicar qué tipo se despacha
        console.log('[resource-handler] dispatch add-resource', resourceType);

        const event = new CustomEvent('add-resource', {
            detail: { type: resourceType }
        });
        document.dispatchEvent(event);
    });
});