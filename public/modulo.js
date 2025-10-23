
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Módulo.js v28 - Funcionalidad de Edición de Recursos (Preliminar)");

    // --- 1. ESTADO CENTRAL Y AUTENTICACIÓN ---
    let state = {
        curso: null,
        editMode: false,
        currentUnitId: null
    };
    
    function decodeJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) { return null; }
    }

    const token = localStorage.getItem('access_token');
    const decodedToken = decodeJwt(token);
    if (!token || !decodedToken) {
        localStorage.clear();
        window.location.replace('index.html');
        return;
    }

    // ...existing code...
    const userRole = decodedToken.role;
    const userId = decodedToken.sub;
    const isAdmin = userRole === 'admin';
    const cursoId = new URLSearchParams(window.location.search).get('cursoId');
    const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    const authHeadersForFiles = { 'Authorization': `Bearer ${token}` };
    const TINYMCE_API_KEY = 'x47y8wk874ypxcymjqxnrbiromqjh1quzrz0qdkrqvtucz65';
    window.isAdmin = isAdmin;
    window.userId = userId;
    window.authHeaders = authHeaders;
    window.authHeadersForFiles = authHeadersForFiles;

    // --- 2. REFERENCIAS AL DOM ---
    const mainContent = document.querySelector('.main-content');
    const messageContainer = document.getElementById('message-container');
    const welcomeMessage = document.getElementById('welcome-message');
    const settingsButton = document.getElementById('settings-btn');
    const dropdownContent = document.getElementById('dropdown-content');
    const logoutButton = document.getElementById('logout-button');
    const profileLink = document.getElementById('profile-link');
    const moduleTitle = document.getElementById('module-title');
    const unitsListContainer = document.getElementById('units-list-container');
    const unitContentPlaceholder = document.getElementById('unit-content-placeholder');
    const unitContentDisplay = document.getElementById('unit-content-display');
    const lessonsContainer = document.getElementById('lessons-and-activities-container');
    const activityFormModal = document.getElementById('activity-form-modal');
    const activityModalTitle = document.getElementById('activity-modal-title');
    const activityFormContainer = document.getElementById('activity-form-container');
    window.activityFormModal = window.activityFormModal || activityFormModal;
    window.activityModalTitle = window.activityModalTitle || activityModalTitle;
    window.activityFormContainer = window.activityFormContainer || activityFormContainer;
// ...existing code...

    // --- 3. INICIALIZACIÓN PRINCIPAL ---
    if (!cursoId) {
        mainContent.innerHTML = '<h1>Error: No se ha especificado un curso.</h1><a href="main.html" class="btn">Volver</a>';
        return;
    }

    try {
        const response = await fetch(`/cursos/${cursoId}`, { headers: authHeaders });
        if (!response.ok) {
            throw new Error(response.status === 404 ? 'Curso no encontrado' : 'No se pudo cargar el curso');
        }
        state.curso = await response.json();

        const isEnrolled = state.curso.inscritos && state.curso.inscritos.some(estudiante => estudiante._id === userId);
        if (!isAdmin && !isEnrolled) {
            mainContent.innerHTML = '<h1>Acceso Denegado</h1><p>No estás inscrito en este curso.</p><a href="main.html" class="btn">Volver</a>';
            return;
        }
        initializePage(state.curso);
    } catch (error) {
        console.error("Error fatal al cargar la página del módulo:", error);
        mainContent.innerHTML = `<h1>Ha ocurrido un error inesperado.</h1><p>${error.message}</p><a href="main.html" class="btn">Volver</a>`;
    }

    // --- 4. INICIALIZACIÓN DE COMPONENTES ---
    function initializePage(curso) {
        mainContent.classList.add(isAdmin ? 'role-admin' : 'role-student');
        initializeHeader(curso);
        if (isAdmin) {
    //...
    
            initializeAdminFunctionality(curso);
        } else {
            const addUnitBtn = document.getElementById('add-unit-btn');
            if (addUnitBtn) addUnitBtn.style.display = 'none';
        }
        initializeCourseContentView(curso);
    }
    
    function initializeAdminFunctionality(curso) {
        initializeAdminTabs(curso);
        initializeUnitModal();
        
            document.addEventListener('add-resource', (e) => {
            console.log('[modulo] add-resource recibido:', e.detail);
            const { type } = e.detail;
            if (!state.currentUnitId) { showMessage('Selecciona una sección primero.', true); return; }
            openActivityModal(type);
        });

        const closeActivityModalBtn = document.getElementById('close-activity-modal-btn');
        closeActivityModalBtn.addEventListener('click', () => activityFormModal.style.display = 'none');
        activityFormModal.addEventListener('click', e => {
            if (e.target === activityFormModal) activityFormModal.style.display = 'none';
        });
    }

        function openActivityModal(type) {
            if (!activityFormModal || !activityFormContainer || !activityModalTitle) return;

            activityFormModal.style.display = 'flex';
            activityFormModal.style.alignItems = 'center';
            activityFormModal.style.justifyContent = 'center';

            let formHTML = '';

            if (type === 'file') {
                activityModalTitle.textContent = 'Añadiendo un nuevo Archivo';
                formHTML = createFileFormHTML();
            } else if (type === 'lesson') {
                activityModalTitle.textContent = 'Añadiendo una nueva Lección';
                formHTML = createTextAreaFormHTML();
            } else if (type === 'activity') {
                activityModalTitle.textContent = 'Añadiendo una nueva Actividad';
                formHTML = createActivityFormHTML();
            } else {
                activityModalTitle.textContent = 'Añadiendo recurso';
                formHTML = `<div style="padding:18px;">Tipo no soportado.</div>`;
            }

            activityFormContainer.innerHTML = formHTML;

            // Ajustes visuales para que el modal no desborde y tenga scroll interno (si aplica)
            activityFormContainer.style.boxSizing = 'border-box';
            activityFormContainer.style.width = 'min(1000px, 95%)';
            activityFormContainer.style.maxWidth = '1000px';
            activityFormContainer.style.maxHeight = '80vh';
            activityFormContainer.style.overflowY = 'auto';
            activityFormContainer.style.padding = '22px 28px';

            // Inicializar la lógica específica del formulario
            if (type === 'file') {
                setupFileFormLogic();
            } else if (type === 'lesson') {
                setupTextAreaFormLogic();
            } else if (type === 'activity') {
                setupActivityFormLogic();
            }

            // Botón cancel common
            const closeBtn = activityFormContainer.querySelector('#cancel-activity-form') || activityFormContainer.querySelector('#cancel-file-form') || activityFormContainer.querySelector('#cancel-lesson-form');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    activityFormModal.style.display = 'none';
                    // si había TinyMCE, limpiarlo en caso de lección
                    try { if (window.tinymce && window.tinymce.get('lesson-editor')) window.tinymce.get('lesson-editor').remove(); } catch (e) {}
                }, { once: true });
            }
        }

        function createActivityFormHTML() {
        return `
            <form id="activity-form" class="activity-form">
                <div class="form-section">
                    <div class="form-group">
                        <label for="activity-title">Título de la actividad</label>
                        <input type="text" id="activity-title" name="title" placeholder="Ej: Entrega 1 - Proyecto" required>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-group">
                        <label for="activity-description">Descripción (opcional)</label>
                        <textarea id="activity-description" name="description" rows="6" placeholder="Instrucciones, criterios, recursos..."></textarea>
                    </div>
                </div>

                <div class="form-section" style="display:flex; gap:12px; align-items:center;">
                    <div class="form-group" style="flex:1;">
                        <label for="activity-due">Fecha límite</label>
                        <input type="datetime-local" id="activity-due" name="dueDate" />
                    </div>
                    <div class="form-group" style="flex:0 0 180px;">
                        <label for="activity-allow-files">Permitir archivos</label>
                        <div>
                            <input type="checkbox" id="activity-allow-files" name="allowFiles" checked />
                            <label for="activity-allow-files" style="margin-left:6px;">Sí</label>
                        </div>
                    </div>
                </div>

                <div class="form-actions" style="margin-top:12px;">
                    <button type="submit" class="btn btn-primary">Crear Actividad</button>
                    <button type="button" class="btn btn-secondary" id="cancel-activity-form">Cancelar</button>
                </div>
            </form>
        `;
    }

    // ...existing code...
async function setupActivityFormLogic() {
    const form = document.getElementById('activity-form');
    if (!form) return;

    // Cargar e inicializar TinyMCE para la descripción de la actividad
    async function ensureActivityEditor() {
        try {
            try { if (window.tinymce && window.tinymce.get('activity-description')) window.tinymce.get('activity-description').remove(); } catch (e) {}
            if (!window.tinymce) {
                const tinyCdn = `https://cdn.tiny.cloud/1/${TINYMCE_API_KEY}/tinymce/6/tinymce.min.js`;
                await loadScript(tinyCdn);
            }

            window.tinymce.init({
                language: 'es',
                selector: '#activity-description',
                height: 190,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'media', 'table', 'code', 'fullscreen', 'paste', 'help'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | link image media | removeformat | code | fullscreen | help',
                toolbar_sticky: true,
                resize: true,
                branding: false,
                images_upload_handler: async function (blobInfo, success, failure) {
                    try {
                        if (!state.currentUnitId) throw new Error('Selecciona primero una unidad antes de subir imágenes.');
                        const file = blobInfo.blob();
                        const formData = new FormData();
                        formData.append('file', file, blobInfo.filename());
                        formData.append('name', blobInfo.filename());
                        formData.append('description', `Imagen subida desde editor para unidad ${state.currentUnitId}`);
                        formData.append('createContent', 'false');

                        const res = await fetch(`/archivos/unidades/${state.currentUnitId}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': authHeadersForFiles.Authorization
                            },
                            body: formData
                        });
                        if (!res.ok) {
                            const errBody = await res.json().catch(()=>null);
                            throw new Error(errBody?.message || `Error ${res.status}`);
                        }
                        const data = await res.json().catch(()=>null);
                        const returnedUrl = (data && (data.route || data.url || data.path || data.fileUrl)) || null;
                        if (!returnedUrl) throw new Error('No se obtuvo la URL del servidor.');
                        success(returnedUrl);
                    } catch (err) {
                        console.error('Error subiendo imagen TinyMCE (actividad):', err);
                        failure(String(err));
                    }
                },
                file_picker_callback: function (callback, value, meta) {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    if (meta.filetype === 'image') input.setAttribute('accept', 'image/*');
                    else if (meta.filetype === 'media') input.setAttribute('accept', 'video/*,audio/*');
                    input.onchange = async function () {
                        const file = this.files[0];
                        if (!file) return;
                        if (!state.currentUnitId) { showMessage('Selecciona primero una unidad antes de subir archivos.', true); return; }
                        const fd = new FormData();
                        fd.append('file', file, file.name);
                        fd.append('name', file.name);
                        fd.append('description', `Archivo subido desde file_picker para unidad ${state.currentUnitId}`);
                        fd.append('createContent', 'false');
                        try {
                            const res = await fetch(`/archivos/unidades/${state.currentUnitId}`, {
                                method: 'POST',
                                headers: { 'Authorization': authHeadersForFiles.Authorization },
                                body: fd
                            });
                            if (!res.ok) {
                                const errBody = await res.json().catch(()=>null);
                                throw new Error(errBody?.message || `Error ${res.status}`);
                            }
                            const data = await res.json().catch(()=>null);
                            const url = (data && (data.route || data.url || data.path || data.fileUrl)) || null;
                            if (!url) throw new Error('No se obtuvo URL del servidor.');
                            callback(url, { alt: file.name });
                        } catch (err) {
                            console.error('Error subiendo fichero desde file_picker (actividad):', err);
                            showMessage('Error subiendo archivo. Comprueba el servidor.', true);
                        }
                    };
                    input.click();
                },
                setup: function (editor) {
                    editor.on('init', function () {
                        try {
                            if (activityFormContainer && activityFormContainer.clientHeight) {
                                const containerHeight = activityFormContainer.clientHeight;
                                const desiredHeight = Math.max(180, containerHeight - 160);
                                editor.theme.resizeTo('100%', Math.min(520, desiredHeight));
                            }
                        } catch (err) {}
                        editor.focus();
                    });
                }
            });
        } catch (err) {
            console.error('No se pudo inicializar TinyMCE para actividad:', err);
        }
    }

    // Intentamos inicializar el editor sin bloquear (si falla, se usa textarea)
    ensureActivityEditor();

        async function onSubmit(ev) {
            ev.preventDefault();

            const title = (form.querySelector('#activity-title')?.value || '').trim();
            const editorInstance = window.tinymce && window.tinymce.get('activity-description');
            const description = editorInstance ? editorInstance.getContent() : (form.querySelector('#activity-description')?.value || '').trim();
            const dueLocal = form.querySelector('#activity-due')?.value || '';
            const allowFiles = !!form.querySelector('#activity-allow-files')?.checked;

            if (!title) { showMessage('El título es obligatorio.', true); return; }
            if (!state.currentUnitId) { showMessage('Selecciona primero una sección/unidad.', true); return; }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : null;
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Creando...'; }

            try {
                let dueIso = null;
                if (dueLocal) {
                    const d = new Date(dueLocal);
                    if (!isNaN(d)) dueIso = d.toISOString();
                }

                const payload = {
                    name: title,
                    description: description,
                    Unidades: [state.currentUnitId],
                    dueDate: dueIso,
                    allowFiles: allowFiles,
                    createdBy: userId
                };

                const res = await fetch('/actividades', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify(payload)
                });

                const body = await res.json().catch(() => null);
                if (!res.ok) throw new Error(body?.message || `Error ${res.status}`);

                showMessage('Actividad creada con éxito.');
                activityFormModal.style.display = 'none';

                try { if (window.tinymce && window.tinymce.get('activity-description')) window.tinymce.get('activity-description').remove(); } catch (e) {}

                if (typeof loadUnitContent === 'function') await loadUnitContent(state.currentUnitId);
            } catch (err) {
                console.error('Error creando actividad:', err);
                showMessage(err.message || 'Fallo al crear la actividad', true);
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText || 'Crear Actividad'; }
                form.removeEventListener('submit', onSubmit);
            }
        }

        form.addEventListener('submit', onSubmit);

        const cancelBtn = activityFormContainer.querySelector('#cancel-activity-form');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                try { if (window.tinymce && window.tinymce.get('activity-description')) window.tinymce.get('activity-description').remove(); } catch (e) {}
            }, { once: true });
        }
    }

    function createFileFormHTML() {
        return `
            <form id="advanced-file-form" class="activity-form">
                <div class="form-section">
                    <div class="form-group">
                        <label for="file-name">Nombre</label>
                        <input type="text" id="file-name" name="name" placeholder="Ej: Guía de Repaso 1" required>
                    </div>
                    <div class="form-group">
                        <label for="file-description">Descripción</label>
                        <textarea id="file-description" name="description" placeholder="Añade una descripción detallada para este recurso..." rows="4"></textarea>
                    </div>
                </div>
                <div class="form-section">
                     <label>Seleccionar archivos</label>
                    <div id="file-drop-zone" class="file-drop-zone">
                        <div class="file-drop-zone-internal">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Puede arrastrar y soltar archivos aquí para añadirlos.</p>
                            <input type="file" id="file-input-hidden" multiple style="display: none;">
                            <button type="button" id="browse-files-btn" class="btn-secondary">Seleccionar archivos</button>
                        </div>
                    </div>
                    <div id="file-preview-list" class="file-preview-list"></div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Guardar cambios</button>
                    <button type="button" class="btn btn-secondary" id="cancel-file-form">Cancelar</button>
                </div>
            </form>
        `;
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                // Script ya cargado (o en proceso).
                // Esperamos a que window.tinymce exista si es TinyMCE
                const checkInterval = setInterval(() => {
                    if (window.tinymce) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50);
                // Timeout de seguridad
                setTimeout(() => {
                    if (window.tinymce) return;
                    clearInterval(checkInterval);
                    reject(new Error('Timeout cargando script'));
                }, 10000);
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            s.referrerPolicy = 'origin';
            s.onload = () => resolve();
            s.onerror = () => reject(new Error(`Error cargando script: ${src}`));
            document.head.appendChild(s);
        });
    }

    /**
     * Genera el HTML del formulario con título y editor TinyMCE.
     */
    function createTextAreaFormHTML() {
        return `
            <form id="lesson-form" class="activity-form">
                <div class="form-section">
                    <div class="form-group">
                        <label for="lesson-title">Título de la lección</label>
                        <input type="text" id="lesson-title" name="title" placeholder="Ej: Introducción a X" required>
                    </div>
                </div>

                <div class="form-section">
                    <label for="lesson-editor">Contenido (texto enriquecido, imágenes y videos)</label>
                    <textarea id="lesson-editor" name="content" rows="12"></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Guardar lección</button>
                    <button type="button" class="btn btn-secondary" id="cancel-lesson-form">Cancelar</button>
                </div>
            </form>
        `;
    }

        async function setupTextAreaFormLogic() {
        const form = document.getElementById('lesson-form');
        if (!form) return;

        const titleInput = document.getElementById('lesson-title');
        const editorSelector = '#lesson-editor';
        const cancelBtn = document.getElementById('cancel-lesson-form');

        // Asegurarnos de eliminar cualquier instancia previa del editor para este selector
        try {
            if (window.tinymce && window.tinymce.get('lesson-editor')) {
                window.tinymce.get('lesson-editor').remove();
            }
        } catch (e) { /* ignorar si no existe */ }

        // Cargar TinyMCE desde CDN si no está presente
        if (!window.tinymce) {
                const tinyCdn = `https://cdn.tiny.cloud/1/${TINYMCE_API_KEY}/tinymce/6/tinymce.min.js`;            try {
                await loadScript(tinyCdn);
            } catch (err) {
                console.error('No se pudo cargar TinyMCE:', err);
                showMessage('Error cargando el editor de texto. Inténtalo de nuevo más tarde.', true);
                return;
            }
        }

        // Inicializar TinyMCE
        try {
            // Eliminar en caso de que una instancia previa esté en memoria
            if (window.tinymce && window.tinymce.get('lesson-editor')) {
                window.tinymce.get('lesson-editor').remove();
            }

            window.tinymce.init({
                language: 'es',
                selector: editorSelector,
                height: 190, // altura inicial reducida para caber en el modal
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'media', 'table', 'code', 'fullscreen', 'paste', 'help'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | link image media | removeformat | code | fullscreen | help',
                toolbar_sticky: true, // mantiene la barra visible al hacer scroll
                resize: true,
                branding: false,
                /* TinyMCE: handler para subir imágenes desde el editor */
                images_upload_handler: async function (blobInfo, success, failure, progress) {
                    try {
                        if (!state.currentUnitId) {
                            throw new Error('Selecciona primero una unidad antes de subir imágenes.');
                        }
                        const file = blobInfo.blob();
                        const formData = new FormData();
                        formData.append('file', file, blobInfo.filename());
                        // Opcionales: nombre y descripción
                        formData.append('name', blobInfo.filename());
                        formData.append('description', `Imagen subida desde editor para unidad ${state.currentUnitId}`);
                        // Indicar al backend que NO cree un "Contenido" adicional (evita duplicados)
                        formData.append('createContent', 'false');

                        const res = await fetch(`/archivos/unidades/${state.currentUnitId}`, {
                            method: 'POST',
                            headers: {
                                // Solo Authorization; NO establecer Content-Type (fetch lo ajusta correctamente)
                                'Authorization': authHeadersForFiles.Authorization
                            },
                            body: formData
                        });

                        if (!res.ok) {
                            const errBody = await res.json().catch(() => null);
                            const msg = errBody ? (errBody.message || JSON.stringify(errBody)) : `Error ${res.status}`;
                            throw new Error(msg);
                        }

                        const data = await res.json().catch(() => null);
                        const returnedUrl = (data && (data.route || data.url || data.path || data.fileUrl)) || null;
                        const maybeString = (typeof data === 'string') ? data : null;
                        const finalUrl = returnedUrl || maybeString;

                        if (!finalUrl) throw new Error('No se obtuvo la URL del servidor.');

                        success(finalUrl);
                    } catch (err) {
                        console.error('Error subiendo imagen TinyMCE:', err);
                        failure(String(err));
                    }
                },

                /* TinyMCE: selector de ficheros (cuando el usuario elige desde el file picker) */
                file_picker_callback: function (callback, value, meta) {
                    // meta.filetype === 'image' || 'media' || 'file'
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');

                    if (meta.filetype === 'image') {
                        input.setAttribute('accept', 'image/*');
                    } else if (meta.filetype === 'media') {
                        input.setAttribute('accept', 'video/*,audio/*');
                    } else {
                        input.setAttribute('accept', '*/*');
                    }

                    input.onchange = async function () {
                        const file = this.files[0];
                        if (!file) return;

                        if (!state.currentUnitId) {
                            showMessage('Selecciona primero una unidad antes de subir archivos.', true);
                            return;
                        }

                        const fd = new FormData();
                        fd.append('file', file, file.name);
                        fd.append('name', file.name);
                        fd.append('description', `Archivo subido desde file_picker para unidad ${state.currentUnitId}`);
                        // Indicar al backend que NO cree un "Contenido" adicional cuando subimos desde el editor
                        fd.append('createContent', 'false');

                        try {
                            const res = await fetch(`/archivos/unidades/${state.currentUnitId}`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': authHeadersForFiles.Authorization
                                },
                                body: fd
                            });

                            if (!res.ok) {
                                const errBody = await res.json().catch(() => null);
                                throw new Error(errBody ? (errBody.message || JSON.stringify(errBody)) : `Error ${res.status}`);
                            }

                            const data = await res.json().catch(() => null);
                            const returnedUrl = (data && (data.route || data.url || data.path || data.fileUrl)) || null;
                            const maybeString = (typeof data === 'string') ? data : null;
                            const finalUrl = returnedUrl || maybeString;

                            if (!finalUrl) throw new Error('No se obtuvo URL del servidor.');
                            callback(finalUrl, { alt: file.name });
                        } catch (err) {
                            console.error('Error subiendo fichero desde file_picker:', err);
                            showMessage('Error subiendo archivo. Comprueba el servidor.', true);
                        }
                    };

                    input.click();
                },

                paste_as_text: false,
                // Ajustes para que el editor se adapte mejor al modal
                setup: function (editor) {
                    editor.on('init', function () {
                        try {
                            // Ajuste dinámico de altura según el contenedor del modal
                            if (activityFormContainer && activityFormContainer.clientHeight) {
                                const containerHeight = activityFormContainer.clientHeight;
                                // Dejamos espacio para campos encima/abajo (título + botones)
                                const desiredHeight = Math.max(180, containerHeight - 160);
                                editor.theme.resizeTo('100%', Math.min(520, desiredHeight));
                            }
                        } catch (err) {
                            // ignore
                        }
                        editor.focus();
                    });
                }
            });
        } catch (err) {
            console.error('Error inicializando TinyMCE:', err);
            showMessage('No se pudo inicializar el editor.', true);
            return;
        }

                // ...existing code...
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = (titleInput && titleInput.value || '').trim();
            const editorInstance = window.tinymce && window.tinymce.get('lesson-editor');
            const content = editorInstance ? editorInstance.getContent() : document.getElementById('lesson-editor').value;

            if (!title) {
                showMessage('El título es obligatorio.', true);
                return;
            }

            if (!content || content.trim() === '') {
                showMessage('El contenido no puede estar vacío.', true);
                return;
            }

            try {
                const url = `/lecciones`; // POST al endpoint existente
                const payload = {
                    name: title,                       // schema usa "name" para el título
                    content: content,                  // intentamos guardar el HTML (ver nota)
                    Unidades: [state.currentUnitId],   // asociar con la unidad
                    category: 'texto'                  // opcional
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify(payload)
                });

                const resBody = await response.json().catch(() => null);

                if (!response.ok) {
                    const errMsg = resBody ? (resBody.message || JSON.stringify(resBody)) : `Error ${response.status}`;
                    throw new Error(errMsg);
                }

                showMessage('Lección creada con éxito.');
                activityFormModal.style.display = 'none';

                // Limpiar editor para evitar instancias residuales
                try {
                    if (window.tinymce && window.tinymce.get('lesson-editor')) {
                        window.tinymce.get('lesson-editor').remove();
                    }
                } catch (e) { /* ignore */ }

                // Recargar contenido de la unidad para que aparezca la nueva lección
                await loadUnitContent(state.currentUnitId);
            } catch (error) {
                console.error('Error creando lección:', error);
                showMessage(error.message || 'Ocurrió un error al guardar la lección.', true);
            }
        });

        // Botón cancelar: cerrar y limpiar editor
        cancelBtn.addEventListener('click', () => {
            activityFormModal.style.display = 'none';
            try {
                if (window.tinymce && window.tinymce.get('lesson-editor')) {
                    window.tinymce.get('lesson-editor').remove();
                }
            } catch (e) { /* ignore */ }
        });
    }
    function setupFileFormLogic() {
        const form = document.getElementById('advanced-file-form');
        if (!form) return;

        const dropZone = document.getElementById('file-drop-zone');
        const fileInput = document.getElementById('file-input-hidden');
        const browseBtn = document.getElementById('browse-files-btn');
        const previewList = document.getElementById('file-preview-list');
        let selectedFiles = [];

        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        dropZone.addEventListener('drop', (e) => {
            handleFiles(e.dataTransfer.files);
        });
        
        function handleFiles(files) {
            for (const file of files) {
                if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    selectedFiles.push(file);
                }
            }
            renderFilePreviews();
        }
        
        function renderFilePreviews() {
            previewList.innerHTML = '';
            selectedFiles.forEach((file, index) => {
                const fileEl = document.createElement('div');
                fileEl.className = 'file-preview-item';
                fileEl.innerHTML = `<span>${file.name}</span><button type="button" data-index="${index}">&times;</button>`;
                previewList.appendChild(fileEl);
            });
        }

        previewList.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                selectedFiles.splice(e.target.dataset.index, 1);
                renderFilePreviews();
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.elements.name.value;
            const description = form.elements.description.value;

            if (!name) {
                showMessage('El nombre es obligatorio.', true);
                return;
            }
            if (selectedFiles.length === 0) {
                showMessage('Debe seleccionar al menos un archivo.', true);
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('file', selectedFiles[0]); 
            
            try {
                const response = await fetch(`/archivos/unidades/${state.currentUnitId}`, {
                    method: 'POST',
                    headers: authHeadersForFiles,
                    body: formData,
                });

                if (!response.ok) {
                    let errorMessage = `Error del servidor: ${response.status}`;
                    const errData = await response.json().catch(() => null);
                    errorMessage = errData ? (errData.message || JSON.stringify(errData)) : await response.text();
                    throw new Error(errorMessage);
                }
                
                showMessage('Archivo guardado con éxito.');
                activityFormModal.style.display = 'none';
                loadUnitContent(state.currentUnitId);
            } catch (error) {
                console.error("Fallo en la subida del archivo:", error);
                showMessage(error.message, true);
            }
        });

        document.getElementById('cancel-file-form').addEventListener('click', () => {
            activityFormModal.style.display = 'none';
        });
    }

        function initializeHeader(curso) {
            const currentUserEmail = localStorage.getItem('user_email');
            const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
            let username = (userProfileString && JSON.parse(userProfileString).username) || (currentUserEmail ? currentUserEmail.split('@')[0] : 'Usuario');

            if (welcomeMessage) {
                welcomeMessage.innerHTML = `👋🏼 Bienvenido, <strong>${username}</strong>`;
            }
            if (document) {
                document.title = `Módulo: ${curso.nombre}`;
            }
            if (moduleTitle) {
                moduleTitle.textContent = `${curso.nombre.toUpperCase()}`;
            }

            // Listeners protegidos
            if (settingsButton) {
                settingsButton.addEventListener('click', e => {
                    e.stopPropagation();
                    if (dropdownContent) dropdownContent.classList.toggle('show');
                });
            }

            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    localStorage.clear();
                    window.location.href = 'index.html';
                });
            }

            if (profileLink) {
                profileLink.addEventListener('click', e => {
                    e.preventDefault();
                    window.location.href = 'main.html';
                });
            }

            // Listener global para cerrar el dropdown — usamos comprobaciones internas
            window.addEventListener('click', e => {
                if (settingsButton && dropdownContent && !settingsButton.contains(e.target)) {
                    dropdownContent.classList.remove('show');
                }
            });
        }

    function initializeAdminTabs(curso) {
        const tabNav = document.getElementById('admin-tab-nav');
        if (!tabNav) return;
        tabNav.style.display = 'flex';
        tabNav.addEventListener('click', e => {
            if (e.target.classList.contains('tab-link')) {
                document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.toggle('active', pane.id === e.target.dataset.tab));
            }
        });
        renderStudentList(curso.inscritos || []);
        setupEnrollmentForm();
        setupStudentDeletion();
    }
    
    // ...existing code...
async function openSubmissionModal(activity, existingSubmission = null) {
    // elementos modal
    const modalEl = window.activityFormModal || document.getElementById('activity-form-modal');
    const containerEl = window.activityFormContainer || document.getElementById('activity-form-container');
    const titleEl = window.activityModalTitle || document.getElementById('activity-modal-title');
    if (!modalEl || !containerEl || !titleEl) { showMessage('Formulario de entrega no disponible.', true); return; }
    if (!activity || !activity._id) { showMessage('ID de actividad no disponible.', true); return; }

    // intentar obtener la entrega del estudiante si no se pasó
    try {
        if (!existingSubmission) {
            const tokenLocal = localStorage.getItem('access_token') || '';
            const headers = tokenLocal ? { 'Authorization': 'Bearer ' + tokenLocal } : {};
            const q = `/entregas?actividadId=${encodeURIComponent(activity._id)}&studentId=${encodeURIComponent(window.userId || '')}`;
            const r = await fetch(q, { headers, credentials: 'include', cache: 'no-store' });
            if (r.ok) {
                const arr = await r.json().catch(()=>[]);
                if (Array.isArray(arr) && arr.length) existingSubmission = arr[0];
                else if (arr && arr._id) existingSubmission = arr;
            }
        }
    } catch (err) {
        console.warn('No se pudo comprobar entrega existente:', err);
    }

    // mostrar modal
    modalEl.style.display = 'flex';
    modalEl.style.alignItems = 'center';
    modalEl.style.justifyContent = 'center';
    titleEl.textContent = existingSubmission ? 'Editar entrega' : 'Entregar actividad';
    containerEl.innerHTML = '<div style="padding:18px;">Cargando formulario...</div>';

    // Si el servidor ofrece un formulario (API), preferirlo — si no, usar fallback
    try {
        const tokenLocal = localStorage.getItem('access_token') || '';
        const headers = tokenLocal ? { 'Authorization': 'Bearer ' + tokenLocal } : {};
        const resp = await fetch(`/actividades/${activity._id}/entrega/form`, { method: 'GET', headers, credentials: 'include', redirect: 'follow' });
        const text = await resp.text().catch(()=>'');

        const loginIndicators = ['Correo Electrónico','Contraseña','<form','Entrar'];
        const looksLikeLogin = loginIndicators.some(ind => text.includes(ind) && text.indexOf(ind) < 4000);

        if (!resp.ok || looksLikeLogin || (resp.url && (resp.url.includes('/login') || resp.url.endsWith('/index.html')))) {
            // Fallback form (estilizado) que soporta crear o editar y eliminar archivos previos
            const existingFiles = (existingSubmission && Array.isArray(existingSubmission.archivos)) ? existingSubmission.archivos : [];
            const existingFilesHtml = existingFiles.length ? existingFiles.map((f, idx) => {
                const url = f.url || f.path || f.fileUrl || '';
                const name = f.originalname || f.name || f.filename || (url ? url.split('/').pop() : 'archivo');
                const href = url ? (url.startsWith('http') ? url : (window.location.origin + (url.startsWith('/') ? url : '/' + url))) : '#';
                // añadimos data-file-index y data-file-id si existe para identificación
                const fidAttr = f._id ? `data-file-id="${f._id}"` : `data-file-name="${encodeURIComponent(name)}"`;
                return `<div class="existing-file-row" ${fidAttr} data-file-idx="${idx}" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;">
                            <a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>
                            <button type="button" class="btn-remove-existing-file" title="Eliminar archivo" style="background:transparent;border:0;color:#e74c3c;cursor:pointer;">Eliminar</button>
                        </div>`;
            }).join('') : '<div style="color:#666">No hay archivos previos</div>';

            containerEl.innerHTML = `
                <div style="padding:18px 12px; max-width:900px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
                        <div style="flex:1;">
                            <label style="font-weight:600; display:block; margin-bottom:6px;">Comentario (opcional)</label>
                            <textarea id="submission-comment-inline" style="width:100%; min-height:120px; padding:10px; border-radius:8px; border:1px solid #e6e6e6;">${escapeHtml(existingSubmission?.comment || existingSubmission?.comentario || '')}</textarea>
                            <div style="margin-top:10px;">
                                <label style="font-weight:600; display:block; margin-bottom:6px;">Archivos existentes</label>
                                <div id="existing-files-list" style="background:#fafafa; padding:8px; border-radius:6px; border:1px dashed #eee;">${existingFilesHtml}</div>
                            </div>
                        </div>

                        <div style="width:300px; display:flex; flex-direction:column; gap:8px;">
                            <label style="font-weight:600;">Adjuntar archivos (opcional)</label>
                            <input id="submission-files-hidden" type="file" multiple style="display:none" />
                            <button id="submission-files-choose" type="button" style="padding:8px; border-radius:8px; border:1px solid #d0d7de; background:#fff; cursor:pointer;">Elegir archivos</button>
                            <div id="submission-files-list" style="min-height:86px; background:#fff; border:1px dashed #e9e9e9; padding:8px; border-radius:6px; overflow:auto; font-size:0.92rem; color:#333;">
                                <div style="color:#888;">Ningún archivo seleccionado</div>
                            </div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
                        <div id="submission-inline-msg" style="color:#28a745; font-weight:600; display:none;"></div>
                        <div style="display:flex; gap:10px;">
                            <button id="cancel-submission-btn-inline" type="button" class="btn" style="background:#f3f3f3;border:0;padding:10px 16px;border-radius:8px;cursor:pointer;">Cancelar</button>
                            <button id="submit-delivery-btn-inline" type="button" class="btn btn-primary" style="background:#e74c3c;color:#fff;border:0;padding:10px 16px;border-radius:12px;cursor:pointer;">${existingSubmission ? 'Actualizar' : 'Enviar'}</button>
                        </div>
                    </div>
                </div>
            `;

            // hooks
            const fileInputHidden = containerEl.querySelector('#submission-files-hidden');
            const chooseBtn = containerEl.querySelector('#submission-files-choose');
            const filesListEl = containerEl.querySelector('#submission-files-list');
            const existingFilesListEl = containerEl.querySelector('#existing-files-list');
            const commentEl = containerEl.querySelector('#submission-comment-inline');
            const btnCancel = containerEl.querySelector('#cancel-submission-btn-inline');
            const btnSend = containerEl.querySelector('#submit-delivery-btn-inline');
            const msgEl = containerEl.querySelector('#submission-inline-msg');

            let selectedFilesInline = [];
            // archivos marcados para eliminar (puede contener object ids o names)
            let filesToRemove = [];

            function renderFilesList() {
                filesListEl.innerHTML = '';
                if (!selectedFilesInline.length) {
                    filesListEl.innerHTML = '<div style="color:#888;">Ningún archivo seleccionado</div>';
                    return;
                }
                selectedFilesInline.forEach((f, i) => {
                    const row = document.createElement('div');
                    row.style.display = 'flex';
                    row.style.justifyContent = 'space-between';
                    row.style.alignItems = 'center';
                    row.style.padding = '6px 4px';
                    row.innerHTML = `<div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px;">${escapeHtml(f.name)}</div>
                                     <div style="display:flex; gap:8px; align-items:center;">
                                       <div style="color:#888; font-size:0.85rem;">${Math.round(f.size/1024)} KB</div>
                                       <button data-idx="${i}" type="button" style="background:transparent;border:0;color:#e74c3c;cursor:pointer;">✕</button>
                                     </div>`;
                    filesListEl.appendChild(row);
                });
            }

            // eliminar archivo existente (solo en UI y marcar para enviar)
            existingFilesListEl.addEventListener('click', async (ev) => {
                const btn = ev.target.closest('.btn-remove-existing-file');
                if (!btn) return;
                const row = btn.closest('.existing-file-row');
                if (!row) return;
                if (!confirm('¿Eliminar este archivo de la entrega?')) return;

                // obtener identificadores
                const fileId = row.getAttribute('data-file-id');
                const fileNameEnc = row.getAttribute('data-file-name');
                if (fileId) filesToRemove.push({ _id: fileId });
                else if (fileNameEnc) filesToRemove.push({ name: decodeURIComponent(fileNameEnc) });

                // remover del DOM inmediatamente
                row.remove();

                // OPTIONAL: intentar eliminar inmediatamente en backend si hay endpoint /archivos/:id
                if (fileId) {
                    try {
                        const resDel = await fetch(`/archivos/${fileId}`, { method: 'DELETE', headers: (typeof authHeaders !== 'undefined' ? authHeaders : window.authHeaders) });
                        if (!resDel.ok) {
                            // no fatal: mantener en filesToRemove para intentar en submit
                            console.warn('No se pudo borrar archivo inmediato, se intentará al actualizar.', resDel.status);
                        }
                    } catch (err) {
                        console.warn('Error borrando archivo inmediatamente:', err);
                    }
                }
            });

            chooseBtn.addEventListener('click', () => fileInputHidden.click());
            fileInputHidden.addEventListener('change', (e) => {
                const files = Array.from(e.target.files || []);
                for (const f of files) {
                    if (!selectedFilesInline.some(s => s.name === f.name && s.size === f.size)) selectedFilesInline.push(f);
                    if (selectedFilesInline.length >= 20) break;
                }
                renderFilesList();
            });

            filesListEl.addEventListener('click', (ev) => {
                const btn = ev.target.closest('button[data-idx]');
                if (!btn) return;
                const i = Number(btn.getAttribute('data-idx'));
                selectedFilesInline.splice(i, 1);
                renderFilesList();
            });

            btnCancel.addEventListener('click', () => { try { modalEl.style.display = 'none'; } catch(e){} });

            btnSend.addEventListener('click', async () => {
                btnSend.disabled = true;
                const oldText = btnSend.textContent;
                btnSend.textContent = existingSubmission ? 'Actualizando...' : 'Enviando...';
                msgEl.style.display = 'none';
                try {
                    const maxFiles = 5;
                    const maxTotalBytes = 50 * 1024 * 1024;
                    if (selectedFilesInline.length > maxFiles) throw new Error(`Máx ${maxFiles} archivos.`);
                    const total = selectedFilesInline.reduce((s,f)=>s+f.size,0);
                    if (total > maxTotalBytes) throw new Error('Tamaño total excede 50MB.');

                    // Si editing -> PATCH /entregas/:id ; si new -> POST /entregas
                    if (existingSubmission && existingSubmission._id) {
                        // intentamos eliminar archivos marcados via API antes de enviar PATCH si detectamos _id
                        for (const rem of filesToRemove) {
                            if (rem._id) {
                                try {
                                    await fetch(`/archivos/${rem._id}`, { method: 'DELETE', headers: (typeof authHeaders !== 'undefined' ? authHeaders : window.authHeaders) });
                                } catch (err) { /* ignore, se intentará en patch */ }
                            }
                        }

                        const fd = new FormData();
                        fd.append('comment', commentEl.value || '');
                        fd.append('submitAt', new Date().toISOString());
                        // anexar nuevos archivos si el usuario indicó
                        selectedFilesInline.forEach(f => fd.append('files', f, f.name));
                        // si el backend acepta lista de archivos a eliminar como removeFiles, la incluimos
                        if (filesToRemove.length) fd.append('removeFiles', JSON.stringify(filesToRemove));

                        const tokenLocal = localStorage.getItem('access_token') || '';
                        const headersPatch = tokenLocal ? { 'Authorization': 'Bearer ' + tokenLocal } : {};
                        const res = await fetch(`/entregas/${existingSubmission._id}`, {
                            method: 'PATCH',
                            headers: headersPatch,
                            body: fd
                        });
                        const body = await res.json().catch(()=>null);
                        if (!res.ok) throw new Error(body?.message || `Error ${res.status}`);
                    } else {
                        const fd = new FormData();
                        fd.append('actividadId', activity._id);
                        fd.append('studentId', window.userId || '');
                        fd.append('comment', commentEl.value || '');
                        fd.append('submitAt', new Date().toISOString());
                        selectedFilesInline.forEach(f => fd.append('files', f, f.name));

                        const tokenLocal = localStorage.getItem('access_token') || '';
                        const headersPost = tokenLocal ? { 'Authorization': 'Bearer ' + tokenLocal } : {};
                        const res = await fetch('/entregas', {
                            method: 'POST',
                            headers: headersPost,
                            body: fd
                        });
                        const body = await res.json().catch(()=>null);
                        if (!res.ok) throw new Error(body?.message || `Error ${res.status}`);
                    }

                    msgEl.textContent = existingSubmission ? 'Entrega actualizada.' : 'Entrega enviada correctamente.';
                    msgEl.style.display = 'block';
                    // cerrar y recargar lista
                    setTimeout(()=> {
                        try { modalEl.style.display = 'none'; } catch(e){}
                        if (typeof loadUnitContent === 'function') loadUnitContent(state.currentUnitId);
                    }, 700);
                } catch (err) {
                    console.error('Error enviando/actualizando entrega:', err);
                    showMessage(err?.message || 'Fallo al enviar/actualizar entrega', true);
                } finally {
                    btnSend.disabled = false;
                    btnSend.textContent = oldText;
                }
            });

            return;
        }

        // Si el servidor devolvió un formulario, lo inyectamos (como antes)
        containerEl.innerHTML = text;
        containerEl.querySelector('#cancel-submission-btn')?.addEventListener('click', () => { try { modalEl.style.display = 'none'; } catch(e){} });

        // intentar enganchar la lógica del formulario servido (si existe)
        if (typeof setupSubmissionLogic === 'function') setupSubmissionLogic(activity);
    } catch (err) {
        console.error('openSubmissionModal fallo:', err);
        containerEl.innerHTML = `<div style="padding:18px;color:#c0392b;">No se pudo abrir el formulario de entrega.</div>`;
    }
}
// ...existing code...

    function initializeCourseContentView(curso) {
        // Adjuntar handler de lista de unidades solo una vez
        if (unitsListContainer && !unitsListContainer._unitHandlerAttached) {
            unitsListContainer.addEventListener('click', handleUnitListClick);
            unitsListContainer._unitHandlerAttached = true;
        }

        // Adjuntar handler delegado de recursos (único) solo una vez.
        // Preferimos usar handleResourceActionClick si está definido; si no, usamos el fallback ad-hoc.
        if (typeof lessonsContainer !== 'undefined' && lessonsContainer && !lessonsContainer._submissionHandlerAttached) {
            if (typeof handleResourceActionClick === 'function') {
                lessonsContainer.addEventListener('click', handleResourceActionClick);
            } else {
                // Fallback: lógica delegada mínima para acciones principales (abrir entrega / ver entregas / abrir recurso)
                lessonsContainer.addEventListener('click', async (e) => {
                    // detectar botones relevantes
                    const candidate = e.target.closest('.add-submission-btn, .view-submissions-btn, .btn-view-resource, .resource-link, .actividad-preview, .leccion-preview');
                    if (!candidate) return;

                    // resolver contenedor y ids
                    const resourceEl = candidate.closest('.resource-item-list') || candidate.closest('.resource-item-main') || candidate.closest('.resource-item');
                    const explicitActivityId = candidate.dataset.activityId || candidate.getAttribute('data-activity-id') || null;
                    const resourceType = candidate.dataset.resourceType || (resourceEl && (resourceEl.dataset.resourceType || resourceEl.getAttribute('data-resource-type'))) || null;
                    const isActivityButton = !!explicitActivityId || resourceType === 'actividad';

                    // si no parece actividad, no manejamos aquí
                    if (!isActivityButton) {
                        // si es un link de archivo, dejar que su comportamiento por defecto ocurra
                        return;
                    }

                    e.preventDefault();

                    const activityId = explicitActivityId || (resourceEl && (resourceEl.dataset.resourceId || resourceEl.getAttribute('data-resource-id'))) || null;
                    if (!activityId) return showMessage('ID de actividad no disponible.', true);

                    // Si es "Agregar entrega"
                    if (candidate.classList.contains('add-submission-btn')) {
                        try {
                            let activityObj = null;
                            try {
                                const res = await fetch(`/actividades/${activityId}`, { headers: authHeaders });
                                if (res.ok) activityObj = await res.json().catch(() => null);
                            } catch (err) { /* fallback a DOM */ }

                            if (!activityObj) {
                                activityObj = {
                                    _id: activityId,
                                    title: resourceEl?.querySelector('.resource-name, .actividad-title')?.textContent?.trim() || '',
                                    description: resourceEl?.querySelector('.resource-desc, .actividad-body')?.textContent?.trim() || '',
                                    dueDate: resourceEl?.querySelector('.actividad-countdown')?.dataset?.iso || null,
                                    allowFiles: true
                                };
                            }

                            if (typeof openSubmissionModal === 'function') {
                                openSubmissionModal(activityObj);
                            } else {
                                showMessage('Formulario de entrega no disponible.', true);
                            }
                        } catch (err) {
                            console.error('Error al abrir modal de entrega (fallback):', err);
                            showMessage('No se pudo abrir el formulario de entrega.', true);
                        }
                        return;
                    }

                    // Si es "Ver entregas"
                    if (candidate.classList.contains('view-submissions-btn')) {
                        try {
                            if (typeof openViewSubmissionsModal === 'function') {
                                openViewSubmissionsModal(activityId);
                            } else {
                                showMessage('Función para ver entregas no disponible.', true);
                            }
                        } catch (err) {
                            console.error('Error al abrir vista de entregas (fallback):', err);
                            showMessage('No se pudo abrir la vista de entregas.', true);
                        }
                        return;
                    }

                    // Si es botón genérico para actividad, abrimos entrega para estudiantes o lista para admin
                    try {
                        if (isAdmin) {
                            if (typeof openViewSubmissionsModal === 'function') openViewSubmissionsModal(activityId);
                            else showMessage('Función para ver entregas no disponible.', true);
                        } else {
                            if (typeof openSubmissionModal === 'function') openSubmissionModal({ _id: activityId });
                            else showMessage('Formulario de entrega no disponible.', true);
                        }
                    } catch (err) {
                        console.error('Error handling actividad (fallback):', err);
                        showMessage('No se pudo abrir la actividad.', true);
                    }
                });
            }
            lessonsContainer._submissionHandlerAttached = true;
        }

        // Renderizar sidebar y cargar primera unidad si existe
        try {
            renderUnitsSidebar(curso.unidades || []);
        } catch (err) {
            console.warn('renderUnitsSidebar falló:', err);
        }

        if (curso.unidades && curso.unidades.length > 0) {
            const firstUnitId = curso.unidades[0]._id;
            try {
                if (unitsListContainer) {
                    document.querySelectorAll('.unit-item').forEach(item => item.classList.remove('active'));
                    const firstUnitElement = unitsListContainer.querySelector(`[data-unit-id="${firstUnitId}"]`);
                    if (firstUnitElement) firstUnitElement.classList.add('active');
                }
                if (typeof loadUnitContent === 'function') {
                    loadUnitContent(firstUnitId);
                } else {
                    console.warn('loadUnitContent no está definida');
                }
            } catch (err) {
                console.error('Error al seleccionar/cargar la primera unidad:', err);
            }
        } else {
            try {
                if (unitContentDisplay) unitContentDisplay.style.display = 'none';
                if (unitContentPlaceholder) unitContentPlaceholder.style.display = 'block';
            } catch (e) { /* ignore */ }
        }
    }
    // --- 5. LÓGICA DE UNIDADES (CRUD) ---

    function initializeUnitModal() {
        const addUnitBtn = document.getElementById('add-unit-btn');
        const modal = document.getElementById('add-unit-modal');
        const form = document.getElementById('add-unit-form');
        const closeModal = () => {
            modal.style.display = 'none';
            form.reset();
        };

        addUnitBtn.addEventListener('click', () => openUnitModal());
        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', handleUnitFormSubmit);
    }
    
    async function handleUnitFormSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('unit-name-input');
        const name = input.value.trim();
        if (!name) {
            showMessage('El nombre no puede estar vacío.', true);
            return;
        }

        const url = state.editMode ? `/unidades/${state.currentUnitId}` : `/cursos/${cursoId}/unidades`;
        const method = state.editMode ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: authHeaders,
                body: JSON.stringify({ name })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Ocurrió un error.');

            if (state.editMode) {
                const index = state.curso.unidades.findIndex(u => u._id === state.currentUnitId);
                if (index !== -1) {
                    state.curso.unidades[index] = result;
                }
            } else {
                state.curso.unidades.push(result);
            }

            showMessage(`Sección ${state.editMode ? 'actualizada' : 'creada'} con éxito.`);
            renderUnitsSidebar(state.curso.unidades);
            document.getElementById('add-unit-modal').style.display = 'none';
            e.target.reset();

        } catch (error) {
            showMessage(error.message, true);
        }
    }

    async function handleUnitListClick(e) {
        const unitItem = e.target.closest('.unit-item');
        if (!unitItem) return;

        const unitId = unitItem.dataset.unitId;

        if (isAdmin) {
            if (e.target.closest('.btn-edit-unit')) {
                const unitToEdit = state.curso.unidades.find(u => u._id === unitId);
                if (unitToEdit) openUnitModal(unitToEdit);
                return;
            }

            if (e.target.closest('.btn-delete-unit')) {
                if (confirm('¿Estás seguro de que quieres eliminar esta sección? Esto eliminará todo su contenido.')) {
                    try {
                        const response = await fetch(`/cursos/${cursoId}/unidades/${unitId}`, { method: 'DELETE', headers: authHeaders });
                        if (!response.ok) throw new Error((await response.json()).message || 'Error al eliminar');
                        
                        showMessage('Sección eliminada con éxito.');
                        state.curso.unidades = state.curso.unidades.filter(u => u._id !== unitId);
                        renderUnitsSidebar(state.curso.unidades);
                        
                        unitContentDisplay.style.display = 'none';
                        unitContentPlaceholder.style.display = 'block';

                    } catch (error) { showMessage(error.message, true); }
                }
                return;
            }
        }

        document.querySelectorAll('.unit-item').forEach(item => item.classList.remove('active'));
        unitItem.classList.add('active');
        loadUnitContent(unitId);
    }

    function openUnitModal(unit = null) {
        const modal = document.getElementById('add-unit-modal');
        const title = document.getElementById('modal-title');
        const input = document.getElementById('unit-name-input');
        
        state.editMode = !!unit;
        state.currentUnitId = unit ? unit._id : null;
        
        title.textContent = state.editMode ? 'Editar Sección' : 'Añadir Nueva Sección';
        input.value = unit ? unit.name : '';
        
        modal.style.display = 'flex';
        input.focus();
    }

    function renderUnitsSidebar(unidades) {
        unitsListContainer.innerHTML = '';
        if (unidades && unidades.length > 0) {
            unidades.forEach(unidad => unitsListContainer.appendChild(createUnitElement(unidad)));
        } else {
            unitsListContainer.innerHTML = '<p class="empty-list-message">No hay unidades en este curso.</p>';
        }
    }

    function createUnitElement(unidad) {
        const div = document.createElement('div');
        div.className = 'unit-item';
        div.dataset.unitId = unidad._id;

        const adminActions = `
            <div class="unit-item-actions">
                <button class="btn-edit-unit" title="Editar"><i class="fas fa-pen"></i></button>
                <button class="btn-delete-unit" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>`;

        div.innerHTML = `<span>${unidad.name}</span> ${isAdmin ? adminActions : ''}`;
        return div;
    }
    
    async function loadUnitContent(unitId) {
        const id = unitId || state.currentUnitId;
        if (!id) return; 

        const unit = state.curso.unidades.find(u => u._id === id);
        if (!unit) return;

        state.currentUnitId = id;
    
        unitContentPlaceholder.style.display = 'none';
        unitContentDisplay.style.display = 'block';
        
        document.getElementById('unit-title-display').textContent = unit.name;
        
        const addContentButtons = document.querySelector('.unit-actions');
        if (addContentButtons) {
            addContentButtons.style.display = isAdmin ? 'flex' : 'none';
        }

        lessonsContainer.innerHTML = '<p>Cargando contenido...</p>';

        try {
            const url = `/unidades/${id}/Contenidos?_=${Date.now()}`;
            const response = await fetch(url, { headers: authHeaders, cache: 'no-store' });

            if (!response.ok) throw new Error('No se pudo cargar el contenido de la unidad.');

            const data = await response.json();

            // DEBUG: ver en consola qué contiene la respuesta (archivos/lecciones/actividades)
            console.log('[loadUnitContent] data recibida:', data);

            renderUnitDynamicContent(data.archivos, data.lecciones, data.actividades);

        } catch (error) {
            console.error("Error al cargar contenido de la unidad:", error);
            lessonsContainer.innerHTML = `<p style="color: red;">Error al cargar el contenido. ${error.message}</p>`;
        }
    }

    function enterEditMode(resourceElement, nameSpan) {
        if (state.isEditing) return;
        state.isEditing = true;

        const originalName = nameSpan.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalName;
        input.className = 'inline-edit-input'; 

        nameSpan.replaceWith(input);
        input.focus();
        input.select();

        const resourceId = resourceElement.dataset.resourceId;
        const resourceType = resourceElement.dataset.resourceType;

        const cleanup = () => {
            state.isEditing = false;
            input.removeEventListener('keydown', handleKeyDown);
            input.removeEventListener('blur', handleBlur);
        };
        
        // Función de guardado mejorada
        const saveChanges = async () => {
            // IMPORTANTE: Primero se remueven los listeners para evitar la doble ejecución
            cleanup();
            
            const newName = input.value.trim();
            if (newName && newName !== originalName) {
                await updateResourceName(resourceId, resourceType, newName, input);
            } else {
                nameSpan.textContent = originalName;
                input.replaceWith(nameSpan);
            }
        };

        const handleKeyDown = async (e) => {
            if (e.key === 'Enter') { e.preventDefault(); await saveChanges(); } 
            else if (e.key === 'Escape') { e.preventDefault(); nameSpan.textContent = originalName; input.replaceWith(nameSpan); cleanup(); }
        };
        
        const handleBlur = async () => { await saveChanges(); };

        input.addEventListener('keydown', handleKeyDown);
        input.addEventListener('blur', handleBlur);
    }

    async function updateResourceName(resourceId, resourceType, newName, inputElement) {
        let url;
        if (resourceType === 'archivo') { url = `/archivos/${resourceId}`; }
        else {
            showMessage('Tipo de recurso no soportado para edición.', true);
            const originalNameSpan = document.createElement('span');
            originalNameSpan.textContent = newName;
            inputElement.replaceWith(originalNameSpan);
            return;
        }

        try {
            const response = await fetch(url, { method: 'PATCH', headers: authHeaders, body: JSON.stringify({ name: newName }) });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Error al actualizar el nombre.');
            }
            
            const updatedResource = await response.json();
            const newNameSpan = document.createElement('span');
            newNameSpan.textContent = updatedResource.name;
            inputElement.replaceWith(newNameSpan);
            showMessage('Nombre actualizado con éxito.');
        } catch (error) {
            showMessage(error.message, true);
            const revertedNameSpan = document.createElement('span');
            revertedNameSpan.textContent = inputElement.value;
            inputElement.replaceWith(revertedNameSpan);
        }
    }

     async function handleResourceActionClick(e) {
        // Detectar botones relevantes
        const editButton = e.target.closest('.btn-edit-resource');
        const deleteButton = e.target.closest('.btn-delete-resource');
         const viewCandidate = e.target.closest('.btn-view-resource, .view-submissions-btn, .add-submission-btn');

        // Si ningún botón relevante, salimos
        if (!editButton && !deleteButton && !viewCandidate) return;

        // Helper: resolver contenedor, id y tipo robustamente
        function resolveResourceInfo(el) {
        const resourceElement = el ? (el.closest('.resource-item-list') || el.closest('.resource-item-main') || el.closest('.resource-item')) : null;

            // Prefer explicit data attributes on the button first, then fallback to container attributes
            const fromBtnId = el ? (el.dataset.activityId || el.dataset.resourceId || el.dataset.resourceid || el.dataset.activityid) : null;
            const id = fromBtnId || (resourceElement && (resourceElement.dataset.resourceId || resourceElement.getAttribute('data-resource-id'))) || null;

                let type = el ? (el.dataset.resourceType || el.dataset.type) : null;
                 if (!type && resourceElement) {
                     type = resourceElement.dataset.resourceType || resourceElement.getAttribute('data-resource-type') || null;
                    if (!type && resourceElement.className) {
                         const m = resourceElement.className.match(/resource-([a-zA-Z0-9_-]+)/);
                         if (m) type = m[1];
                    }
                 }

                return { resourceElement, id, type };
            }

                // -------- EDITAR --------
                if (editButton) {
                    e.preventDefault();
                    const { resourceElement, id: resourceId, type: resourceType } = resolveResourceInfo(editButton);

                    if (!isAdmin) {
                        showMessage('No tienes permisos para editar recursos.', true);
                        return;
                    }

                    try {
                        // LECCIÓN
                        if (resourceType === 'leccion' || (resourceElement && resourceElement.querySelector('.leccion-preview'))) {
                            let title = '';
                            let content = '';

                            const preview = resourceElement ? resourceElement.querySelector('.leccion-preview') : null;
                            if (preview) {
                                title = preview.querySelector('.leccion-preview-title')?.textContent?.trim() || title;
                                content = preview.querySelector('.leccion-preview-body')?.innerHTML || content;
                            }

                            // fallback a server si no hay contenido en DOM
                            if ((!content || content.trim() === '') && resourceId) {
                                try {
                                    const res = await fetch(`/lecciones/${resourceId}`, { headers: authHeaders });
                                    if (res.ok) {
                                        const data = await res.json().catch(() => null);
                                        if (data) {
                                            title = data.name || title;
                                            content = data.content || content;
                                        }
                                    }
                                } catch (err) { /* ignore */ }
                            }

                            openEditLessonModal({ _id: resourceId, name: title, content });
                            return;
                        }

                        // ACTIVIDAD
                        if (resourceType === 'actividad' || (resourceElement && resourceElement.querySelector('.actividad-preview'))) {
                            const id = resourceId || editButton.getAttribute('data-resource-id') || editButton.getAttribute('data-activity-id');
                            if (!id) return showMessage('ID de actividad no disponible.', true);
                            openEditActivityModal(id);
                            return;
                        }

                        // ARCHIVO -> edición inline (si está soportado)
                        if (resourceType === 'archivo' || (resourceElement && resourceElement.querySelector('.resource-link'))) {
                            const nameSpan = resourceElement ? (resourceElement.querySelector('.resource-name') || resourceElement.querySelector('span')) : null;
                            if (typeof enterEditMode === 'function' && nameSpan) {
                                enterEditMode(resourceElement, nameSpan);
                                return;
                            } else {
                                showMessage('Edición inline no disponible para este archivo.', true);
                                return;
                            }
                        }

                        showMessage('Edición no soportada para este tipo de recurso.', true);
                    } catch (err) {
                        console.error('Error al intentar editar recurso:', err);
                        showMessage('Error al abrir editor del recurso.', true);
                    }

                    return;
                }

                // -------- BORRAR --------
                if (deleteButton) {
                    e.preventDefault();
                    const { resourceElement, id: resourceId, type: resourceType } = resolveResourceInfo(deleteButton);

                    if (!isAdmin) {
                        showMessage('No tienes permisos para eliminar recursos.', true);
                        return;
                    }

                    if (!resourceId) {
                        showMessage('No se pudo determinar el recurso a eliminar.', true);
                        return;
                    }

                    if (!confirm('¿Estás seguro de que quieres eliminar este recurso? Esta acción no se puede deshacer.')) return;

                    try {
                        let url;
                        if (resourceType === 'archivo') url = `/archivos/${resourceId}`;
                        else if (resourceType === 'leccion') url = `/lecciones/${resourceId}`;
                        else if (resourceType === 'actividad') url = `/actividades/${resourceId}`;
                        else throw new Error('Tipo de recurso no soportado para eliminación.');

                        const response = await fetch(url, { method: 'DELETE', headers: authHeaders });
                        if (!response.ok) {
                            const errBody = await response.json().catch(() => null);
                            throw new Error(errBody && (errBody.message || errBody.error) ? (errBody.message || errBody.error) : `Error ${response.status}`);
                        }

                        // Animación y borrado DOM
                        if (resourceElement) {
                            resourceElement.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                            resourceElement.style.opacity = '0';
                            resourceElement.style.transform = 'translateX(20px)';
                            setTimeout(() => resourceElement.remove(), 260);
                        } else {
                            if (typeof loadUnitContent === 'function') loadUnitContent(state.currentUnitId);
                        }

                        showMessage('Recurso eliminado con éxito.');
                    } catch (error) {
                        console.error('Error al eliminar el recurso:', error);
                        showMessage(error.message || 'Error al eliminar recurso.', true);
                    }

                    return;
                }

                // -------- VER / ACCIONES (ojo / lista / agregar entrega) --------
                if (viewCandidate) {
                    e.preventDefault();
                    const { resourceElement, id: maybeId, type: maybeType } = resolveResourceInfo(viewCandidate);

                    // Determine the definitive button element (icon may be inside)
                    const btn = viewCandidate.tagName === 'BUTTON' ? viewCandidate : (viewCandidate.closest('button') || viewCandidate);

                    const resourceId = (btn && (btn.dataset.activityId || btn.dataset.resourceId || btn.dataset.resourceid || btn.dataset.activityid)) || maybeId || null;
                    const resourceType = (btn && (btn.dataset.resourceType || btn.dataset.type)) || maybeType || (resourceElement && (resourceElement.dataset.resourceType || resourceElement.getAttribute('data-resource-type'))) || null;

                    try {
                        // 1) Archivo: abrir link en nueva pestaña
                        if (resourceType === 'archivo' || (resourceElement && resourceElement.querySelector('a.resource-link'))) {
                            try {
                                let link = null;
                                const anchor = resourceElement ? resourceElement.querySelector('a.resource-link') : null;
                                if (anchor && anchor.href) link = anchor.href;

                                if (!link && resourceId) {
                                    try {
                                        const res = await fetch(`/archivos/${resourceId}`, { headers: authHeaders });
                                        if (res.ok) {
                                            const data = await res.json().catch(() => null);
                                            link = data && (data.url || data.path || data.route || data.fileUrl) || null;
                                        }
                                    } catch (err) { /* ignore */ }
                                }

                                if (!link) {
                                    showMessage('No se encontró URL del archivo.', true);
                                    return;
                                }

                                window.open(link, '_blank', 'noopener');
                            } catch (err) {
                                console.error('Error abriendo archivo:', err);
                                showMessage('No se pudo abrir el archivo.', true);
                            }
                            return;
                        }

                        // 2) Lección: abrir modal de lectura
                        if (resourceType === 'leccion' || (resourceElement && resourceElement.querySelector('.leccion-preview'))) {
                            try {
                                if (resourceElement) {
                                    const title = resourceElement.querySelector('.leccion-preview-title')?.textContent?.trim() || '';
                                    const bodyHtml = resourceElement.querySelector('.leccion-preview-body')?.innerHTML || '';
                                    if (bodyHtml && bodyHtml.trim() !== '') {
                                        openLessonModal(title || 'Lección', bodyHtml);
                                        return;
                                    }
                                }
                                if (resourceId) {
                                    const res = await fetch(`/lecciones/${resourceId}`, { headers: authHeaders });
                                    if (res.ok) {
                                        const data = await res.json().catch(() => null);
                                        openLessonModal(data?.name || 'Lección', data?.content || '<p><em>Contenido no disponible.</em></p>');
                                        return;
                                    }
                                }
                                showMessage('No se pudo abrir la lección.', true);
                            } catch (err) {
                                console.error('Error al abrir lección:', err);
                                showMessage('No se pudo abrir la lección.', true);
                            }
                            return;
                        }

                        // 3) Actividad: ver entregas / abrir modal de entregas o formulario
                        if (resourceType === 'actividad' || (resourceElement && resourceElement.querySelector('.actividad-preview'))) {
                            if (!resourceId) {
                                showMessage('ID de actividad no disponible.', true);
                                return;
                            }

                            // Si el botón es específicamente "Agregar entrega" -> abrir modal de entrega (estudiantes)
                            if (btn.classList.contains('add-submission-btn')) {
                                try {
                                    let activityObj = null;
                                    try {
                                        const res = await fetch(`/actividades/${resourceId}`, { headers: authHeaders });
                                        if (res.ok) activityObj = await res.json().catch(() => null);
                                    } catch (err) { /* ignore */ }

                                    if (!activityObj) {
                                        // construir un objeto mínimo para el modal
                                        activityObj = {
                                            _id: resourceId,
                                            name: resourceElement ? (resourceElement.querySelector('.resource-name')?.textContent?.trim() || 'Actividad') : 'Actividad'
                                        };
                                    }

                                    if (typeof openSubmissionModal === 'function') {
                                        openSubmissionModal(activityObj);
                                    } else {
                                        showMessage('Formulario de entrega no disponible.', true);
                                    }
                                } catch (err) {
                                    console.error('Error al abrir modal de entrega:', err);
                                    showMessage('No se pudo abrir el formulario de entrega.', true);
                                }
                                return;
                            }

                            // Si el botón es "Ver entregas" (eye/list)
                            if (btn.classList.contains('view-submissions-btn')) {
                                try {
                                    if (isAdmin) {
                                        if (typeof openViewSubmissionsModal === 'function') {
                                            openViewSubmissionsModal(resourceId);
                                        } else {
                                            showMessage('Función para ver entregas no disponible.', true);
                                        }
                                    } else {
                                        // estudiante: abrir formulario de entrega (misma experiencia que "Agregar entrega")
                                        let activityObj = null;
                                        try {
                                            const res = await fetch(`/actividades/${resourceId}`, { headers: authHeaders });
                                            if (res.ok) activityObj = await res.json().catch(() => null);
                                        } catch (err) { /* ignore */ }

                                        if (!activityObj) {
                                            activityObj = {
                                                _id: resourceId,
                                                name: resourceElement ? (resourceElement.querySelector('.resource-name')?.textContent?.trim() || 'Actividad') : 'Actividad'
                                            };
                                        }

                                        if (typeof openSubmissionModal === 'function') {
                                            openSubmissionModal(activityObj);
                                        } else {
                                            showMessage('Formulario de entrega no disponible.', true);
                                        }
                                    }
                                } catch (err) {
                                    console.error('Error al abrir vista de entregas:', err);
                                    showMessage('No se pudo abrir la vista de entregas.', true);
                                }
                                return;
                            }

                            // Si es el botón genérico de ver (sin especificar), priorizamos ver entregas para actividad (admin => lista, student => formulario)
                            try {
                                if (isAdmin) {
                                    if (typeof openViewSubmissionsModal === 'function') openViewSubmissionsModal(resourceId);
                                    else showMessage('Función para ver entregas no disponible.', true);
                                } else {
                                    let activityObj = null;
                                    try {
                                        const res = await fetch(`/actividades/${resourceId}`, { headers: authHeaders });
                                        if (res.ok) activityObj = await res.json().catch(() => null);
                                    } catch (err) { /* ignore */ }

                                    if (!activityObj) {
                                        activityObj = {
                                            _id: resourceId,
                                            name: resourceElement ? (resourceElement.querySelector('.resource-name')?.textContent?.trim() || 'Actividad') : 'Actividad'
                                        };
                                    }

                                    if (typeof openSubmissionModal === 'function') openSubmissionModal(activityObj);
                                    else showMessage('Formulario de entrega no disponible.', true);
                                }
                            } catch (err) {
                                console.error('Error handling actividad view:', err);
                                showMessage('No se pudo abrir la actividad.', true);
                            }
                            return;
                        }

                        // Fallback genérico
                        showMessage('Acción no disponible para este recurso.', true);
                        return;
                    } catch (err) {
                        console.error('Error processing view action:', err);
                        showMessage('Ocurrió un error al procesar la acción.', true);
                    }
                }
            }
          
    // --- FUNCIÓN DE RENDERIZADO DE CONTENIDO (Sin cambios) ---
    function getResourceIcon(archivo) {
        const nameForExtension = archivo.originalName || archivo.url || '';
        const fileExtension = nameForExtension.split('.').pop().toLowerCase();
        let iconClass = 'fas fa-file';
        let iconColor = '#6c757d';

        switch (fileExtension) {
            case 'pdf': iconClass = 'fas fa-file-pdf'; iconColor = '#e63946'; break;
            case 'doc': case 'docx': iconClass = 'fas fa-file-word'; iconColor = '#007bff'; break;
            case 'xls': case 'xlsx': iconClass = 'fas fa-file-excel'; iconColor = '#28a745'; break;
            case 'ppt': case 'pptx': iconClass = 'fas fa-file-powerpoint'; iconColor = '#fd7e14'; break;
            case 'jpg': case 'jpeg': case 'png': case 'gif': iconClass = 'fas fa-file-image'; iconColor = '#17a2b8'; break;
            case 'zip': case 'rar': iconClass = 'fas fa-file-archive'; iconColor = '#343a40'; break;
        }
        return `<i class="${iconClass} resource-icon" style="color: ${iconColor};"></i>`;
    }

    function initializeDragAndDrop() {
        if (!isAdmin) return;

        new Sortable(lessonsContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            filter: '.resource-item-actions', // IGNORA los clics en la sección de acciones para arrastrar
            preventOnFilter: true, // Permite que los clics en los elementos filtrados (botones) funcionen
            onEnd: function (evt) {
                console.log('Elemento movido.');
                console.log('Posición anterior:', evt.oldIndex, '-> Nueva posición:', evt.newIndex);
                
                const resourceId = evt.item.dataset.resourceId;
                // Próximamente: Llamar a la función para guardar el nuevo orden en la BD
                // updateResourceOrder(resourceId, evt.newIndex);
            }
        });
    }

            // Abre modal para editar una lección (editor TinyMCE)
        async function openEditLessonModal(lessonObj = { _id: null, name: '', content: '' }) {
            if (!activityFormModal || !activityFormContainer || !activityModalTitle) {
                console.warn('Modales no inicializados para editar lección.');
                return;
            }

            activityModalTitle.textContent = 'Editar Lección';
            activityFormContainer.innerHTML = `
                <form id="lesson-edit-form" class="activity-form">
                    <div class="form-section">
                        <div class="form-group">
                            <label for="lesson-title">Título</label>
                            <input type="text" id="lesson-title" name="title" required />
                        </div>
                    </div>
                    <div class="form-section">
                        <label for="lesson-editor">Contenido</label>
                        <textarea id="lesson-editor" name="content" rows="12"></textarea>
                    </div>
                    <div class="form-actions" style="margin-top:12px;">
                        <button type="submit" class="btn btn-primary">Guardar cambios</button>
                        <button type="button" class="btn btn-secondary" id="cancel-lesson-edit">Cancelar</button>
                    </div>
                </form>
            `;

            // mostrar modal y estilos
            activityFormModal.style.display = 'flex';
            activityFormModal.style.alignItems = 'center';
            activityFormModal.style.justifyContent = 'center';
            activityFormContainer.style.maxHeight = '80vh';
            activityFormContainer.style.overflowY = 'auto';

            const form = document.getElementById('lesson-edit-form');
            const titleInput = document.getElementById('lesson-title');
            const cancelBtn = document.getElementById('cancel-lesson-edit');

            // rellenar valores iniciales (si están)
            titleInput.value = lessonObj.name || '';

            // Inicializar TinyMCE para el textarea lesson-editor (igual que en los otros formularios)
            try {
                if (window.tinymce && window.tinymce.get('lesson-editor')) {
                    window.tinymce.get('lesson-editor').remove();
                }
            } catch (e) { /* ignore */ }

            try {
                if (!window.tinymce) {
                    const tinyCdn = `https://cdn.tiny.cloud/1/${TINYMCE_API_KEY}/tinymce/6/tinymce.min.js`;
                    await loadScript(tinyCdn);
                }
            } catch (err) {
                console.warn('No se pudo cargar TinyMCE para editar lección:', err);
            }

            try {
                window.tinymce.init({
                    language: 'es',
                    selector: '#lesson-editor',
                    height: 320,
                    menubar: true,
                    plugins: ['advlist','autolink','lists','link','image','media','table','code','fullscreen','paste','help'],
                    toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | removeformat | code | fullscreen | help',
                    toolbar_sticky: true,
                    branding: false,
                    setup: function (editor) {
                        editor.on('init', function () {
                            if (lessonObj.content) editor.setContent(lessonObj.content);
                            editor.focus();
                        });
                    }
                });
            } catch (err) {
                console.warn('TinyMCE init falló para editar lección:', err);
            }

            // Cancelar
            cancelBtn.addEventListener('click', () => {
                activityFormModal.style.display = 'none';
                try { if (window.tinymce && window.tinymce.get('lesson-editor')) window.tinymce.get('lesson-editor').remove(); } catch(e) {}
            }, { once: true });

            // Handler submit -> PATCH /lecciones/:id (si existe id) o POST si es nueva (no lo usaremos aquí)
            async function onSubmitEdit(e) {
                e.preventDefault();
                const editorInstance = window.tinymce && window.tinymce.get('lesson-editor');
                const content = editorInstance ? editorInstance.getContent() : document.getElementById('lesson-editor').value;
                const name = (titleInput.value || '').trim();

                if (!name) { showMessage('El título es obligatorio.', true); return; }

                // Si no hay id, no intentamos PATCH (pero tu flujo de edición siempre pasará id)
                if (!lessonObj._id) {
                    showMessage('ID de lección no disponible.', true);
                    return;
                }

                try {
                    const payload = { name, content };
                    const res = await fetch(`/lecciones/${lessonObj._id}`, {
                        method: 'PATCH',
                        headers: authHeaders,
                        body: JSON.stringify(payload)
                    });

                    const body = await res.json().catch(()=>null);
                    if (!res.ok) throw new Error(body?.message || `Error ${res.status}`);

                    showMessage('Lección actualizada con éxito.');
                    activityFormModal.style.display = 'none';
                    try { if (window.tinymce && window.tinymce.get('lesson-editor')) window.tinymce.get('lesson-editor').remove(); } catch(e) {}
                    if (typeof loadUnitContent === 'function') await loadUnitContent(state.currentUnitId);
                } catch (err) {
                    console.error('Error editando lección:', err);
                    showMessage(err.message || 'Error al actualizar lección', true);
                } finally {
                    form.removeEventListener('submit', onSubmitEdit);
                }
            }

            form.addEventListener('submit', onSubmitEdit);
        }

        function openLessonModal(title, htmlContent) {
            // Reutilizable: crea el modal si no existe y lo muestra
            let modal = document.getElementById('lesson-view-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'lesson-view-modal';
                modal.style.position = 'fixed';
                modal.style.left = '0';
                modal.style.top = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.zIndex = '1200';
                modal.style.display = 'none';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.background = 'rgba(0,0,0,0.45)';
                modal.innerHTML = `
                    <div id="lesson-modal-card" style="background:#fff; max-width:1000px; width:95%; max-height:85vh; overflow:auto; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.25);">
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid #eee;">
                            <h3 id="lesson-modal-title" style="margin:0; font-size:1.15rem"></h3>
                            <button id="lesson-modal-close" style="background:#fff; border:0; font-size:1.4rem; cursor:pointer; line-height:1;">&times;</button>
                        </div>
                        <div id="lesson-modal-body" style="padding:20px; color:#222; line-height:1.6;"></div>
                    </div>
                `;
                document.body.appendChild(modal);

                // Cerrar modal cuando se hace clic fuera del contenido
                modal.addEventListener('click', (e) => {
                    const card = document.getElementById('lesson-modal-card');
                    if (!card.contains(e.target)) modal.style.display = 'none';
                });
                // Cerrar con el botón
                modal.querySelector('#lesson-modal-close').addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }

            document.getElementById('lesson-modal-title').textContent = title || 'Lección';
            const body = document.getElementById('lesson-modal-body');

            // Inserta el HTML (nota: esto usa innerHTML)
            body.innerHTML = htmlContent || '<p><em>Contenido no disponible.</em></p>';

            // --- Si no hay <a> dentro, intentamos "linkificar" URLs planas (ej: https://...) para que sean clicables ---
            try {
                const hasAnchor = !!body.querySelector('a');
                if (!hasAnchor) {
                    // regex simple para http/https links
                    const urlRegex = /((https?:\/\/)[\w\-\._~:/?#[\]@!$&'()*+,;=%]+)(?![^<]*>)/g;
                    body.innerHTML = body.innerHTML.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
                }
            } catch (err) {
                // no bloquear si algo sale mal
                console.warn('Linkify falló:', err);
            }

            // Forzar que todos los enlaces del modal se abran en una nueva pestaña y evitar que su click burbujee al modal
            try {
                const anchors = body.querySelectorAll('a');
                anchors.forEach(a => {
                    a.setAttribute('target', '_blank');
                    a.setAttribute('rel', 'noopener noreferrer');
                    // Evitar que el click en el enlace dispare otros handlers (ej. que abran modal o cierren)
                    a.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        // Abrir explicitamente en nueva ventana/pestaña (compatibilidad)
                        try { window.open(a.href, '_blank', 'noopener'); } catch (e) { /* ignore */ }
                    });
                });
            } catch (err) {
                console.warn('No se pudieron procesar anchors en modal:', err);
            }

            // Mostrar modal
            modal.style.display = 'flex';
            // Opcional: desplazar al inicio del contenido
            const card = document.getElementById('lesson-modal-card');
            if (card) card.scrollTop = 0;
        }

      // Inserta después de openEditLessonModal(...)
        async function openEditActivityModal(activityId) {
            if (!activityFormModal || !activityFormContainer || !activityModalTitle) return;
            activityModalTitle.textContent = 'Editar Actividad';
            activityFormContainer.innerHTML = createActivityFormHTML();

            // Estilos / tamaño igual que el modal de creación
            activityFormContainer.style.boxSizing = 'border-box';
            activityFormContainer.style.width = 'min(1000px, 95%)';
            activityFormContainer.style.maxWidth = '1000px';
            activityFormContainer.style.maxHeight = '80vh';
            activityFormContainer.style.overflowY = 'auto';
            activityFormContainer.style.padding = '22px 28px';
            activityFormModal.style.display = 'flex';
            activityFormModal.style.alignItems = 'center';
            activityFormModal.style.justifyContent = 'center';

            // Cancelar
            const cancelBtn = activityFormContainer.querySelector('#cancel-activity-form');
            if (cancelBtn) cancelBtn.addEventListener('click', () => {
                activityFormModal.style.display = 'none';
                try { if (window.tinymce && window.tinymce.get('activity-description')) window.tinymce.get('activity-description').remove(); } catch(e){}
            }, { once: true });

            // Traer datos de la actividad (si el endpoint /actividades/:id responde)
            let activityObj = null;
            try {
                const res = await fetch(`/actividades/${activityId}`, { headers: authHeaders });
                if (res.ok) activityObj = await res.json().catch(()=>null);
            } catch (err) { /* ignore */ }

            const form = document.getElementById('activity-form');
            if (!form) return;

            const titleInput = form.querySelector('#activity-title');
            const descTextarea = form.querySelector('#activity-description');
            const dueInput = form.querySelector('#activity-due');
            const allowCheckbox = form.querySelector('#activity-allow-files');

            // Poblamos valores (fallback a DOM si no hay response)
            if (activityObj) {
                if (titleInput) titleInput.value = activityObj.name || '';
                if (descTextarea) descTextarea.value = activityObj.description || '';
                if (dueInput) dueInput.value = activityObj.dueDate ? (new Date(activityObj.dueDate)).toISOString().slice(0,16) : '';
                if (allowCheckbox) allowCheckbox.checked = (typeof activityObj.allowFiles === 'undefined') ? true : !!activityObj.allowFiles;
            } else {
                // fallback DOM
                const resourceEl = document.querySelector(`.resource-item-list[data-resource-id="${activityId}"]`);
                if (resourceEl) {
                    if (titleInput) titleInput.value = resourceEl.querySelector('.actividad-title')?.textContent?.trim() || '';
                    if (descTextarea) descTextarea.value = resourceEl.querySelector('.actividad-body')?.textContent?.trim() || '';
                }
            }

            // Inicializar TinyMCE para la descripción (igual que en creación)
            try { if (window.tinymce && window.tinymce.get('activity-description')) window.tinymce.get('activity-description').remove(); } catch(e){}
            (async () => {
                try {
                    if (!window.tinymce) {
                        const tinyCdn = `https://cdn.tiny.cloud/1/${TINYMCE_API_KEY}/tinymce/6/tinymce.min.js`;
                        await loadScript(tinyCdn);
                    }
                } catch (err) { console.warn('No se pudo cargar TinyMCE:', err); }

                try {
                    window.tinymce.init({
                        language: 'es',
                        selector: '#activity-description',
                        height: 190,
                        menubar: true,
                        plugins: ['advlist','autolink','lists','link','image','media','table','code','fullscreen','paste','help'],
                        toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | removeformat | code | fullscreen | help',
                        toolbar_sticky: true,
                        resize: true,
                        branding: false,
                        setup: function (editor) {
                            editor.on('init', function () {
                                if (activityObj && activityObj.description) editor.setContent(activityObj.description);
                                editor.focus();
                            });
                        }
                    });
                } catch (err) { console.warn('TinyMCE init falló:', err); }

                // Handler submit: PATCH /actividades/:id
                async function onSubmitEdit(ev) {
                    ev.preventDefault();
                    const editorInstance = window.tinymce && window.tinymce.get('activity-description');
                    const description = editorInstance ? editorInstance.getContent() : (descTextarea ? descTextarea.value : '');
                    const name = (titleInput ? titleInput.value.trim() : '') || '';
                    const dueLocal = dueInput ? dueInput.value : '';
                    const allowFiles = !!(allowCheckbox && allowCheckbox.checked);

                    if (!name) { showMessage('El título es obligatorio.', true); return; }

                    let dueIso = null;
                    if (dueLocal) {
                        const d = new Date(dueLocal);
                        if (!isNaN(d)) dueIso = d.toISOString();
                    }

                    try {
                        const payload = { name, description, dueDate: dueIso, allowFiles };
                        const res = await fetch(`/actividades/${activityId}`, {
                            method: 'PATCH',
                            headers: authHeaders,
                            body: JSON.stringify(payload)
                        });
                        const body = await res.json().catch(()=>null);
                        if (!res.ok) throw new Error(body?.message || `Error ${res.status}`);
                        showMessage('Actividad actualizada con éxito.');
                        activityFormModal.style.display = 'none';
                        try { if (window.tinymce && window.tinymce.get('activity-description')) window.tinymce.get('activity-description').remove(); } catch(e){}
                        await loadUnitContent(state.currentUnitId);
                    } catch (err) {
                        console.error('Error editando actividad:', err);
                        showMessage(err.message || 'Error al actualizar actividad', true);
                    } finally {
                        form.removeEventListener('submit', onSubmitEdit);
                    }
                }

                form.addEventListener('submit', onSubmitEdit);
            })();
        }

        function renderUnitDynamicContent(archivos = [], lecciones = [], actividades = []) {
        if (!lessonsContainer) return;

        // Limpiar intervals previos (evita fugas si re-renderizas)
        try {
            Array.from(lessonsContainer.querySelectorAll('[data-deadline-elem]')).forEach(el => {
                if (el._deadlineInterval) {
                    clearInterval(el._deadlineInterval);
                    el._deadlineInterval = null;
                }
            });
        } catch (e) { /* ignore */ }

        lessonsContainer.innerHTML = '';

        // --- Helpers locales (se usan solo si no hay una implementación global) ---
        const _formatLocalDateTime = (iso) => {
            try {
                if (!iso) return 'Sin fecha límite';
                const d = new Date(iso);
                if (isNaN(d)) return 'Fecha inválida';
                return d.toLocaleString();
            } catch (e) { return 'Fecha inválida'; }
        };

        const _isPastDue = (iso) => {
            try {
                if (!iso) return false;
                return new Date(iso).getTime() < Date.now();
            } catch (e) { return false; }
        };

        const _startDeadlineCountdown = (iso, displayEl, onExpired) => {
            if (!displayEl) return;
            try {
                if (displayEl._deadlineInterval) {
                    clearInterval(displayEl._deadlineInterval);
                    displayEl._deadlineInterval = null;
                }
                if (!iso) {
                    displayEl.textContent = 'Sin fecha límite';
                    return;
                }
                const target = new Date(iso).getTime();
                if (isNaN(target)) {
                    displayEl.textContent = 'Fecha inválida';
                    return;
                }
                const update = () => {
                    const now = Date.now();
                    const diff = target - now;
                    if (diff <= 0) {
                        displayEl.textContent = 'Vencido';
                        if (displayEl._deadlineInterval) {
                            clearInterval(displayEl._deadlineInterval);
                            displayEl._deadlineInterval = null;
                        }
                        if (typeof onExpired === 'function') onExpired();
                        return;
                    }
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const mins = Math.floor((diff / (1000 * 60)) % 60);
                    const secs = Math.floor((diff / 1000) % 60);
                    displayEl.textContent = (days > 0 ? `${days}d ` : '') + `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
                };
                update();
                displayEl._deadlineInterval = setInterval(update, 1000);
            } catch (e) { /* no bloquear */ }
        };

        // Preferir helpers globales si existen (evitar shadowing / TDZ)
        const formatLocalDateTimeFn = (typeof window.formatLocalDateTime === 'function') ? window.formatLocalDateTime : _formatLocalDateTime;
        const isPastDueFn = (typeof window.isPastDue === 'function') ? window.isPastDue : _isPastDue;
        const startDeadlineCountdownFn = (typeof window.startDeadlineCountdown === 'function') ? window.startDeadlineCountdown : _startDeadlineCountdown;

        // Combinar recursos manteniendo el tipo para render
        const allResources = [
            ...(archivos || []).map(a => ({ ...a, type: 'archivo' })),
            ...(lecciones || []).map(l => ({ ...l, type: 'leccion' })),
            ...(actividades || []).map(act => ({ ...act, type: 'actividad' }))
        ];

        if (!allResources.length) {
            lessonsContainer.innerHTML = '<p class="empty-list-message">Aún no hay lecciones ni actividades en esta unidad.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();

        allResources.forEach(resource => {
            const resourceElement = document.createElement('div');
            resourceElement.className = `resource-item-list resource-${resource.type}`;
            resourceElement.dataset.resourceId = resource._id || '';
            resourceElement.dataset.resourceType = resource.type || '';

            // Icono o representación por tipo
            let iconHTML = '';
            let resourceLink = '#';
            const resourceName = resource.name || 'Recurso sin nombre';

            if (resource.type === 'archivo') {
                iconHTML = getResourceIcon(resource);
                resourceLink = resource.url || resource.route || '#';
            } else if (resource.type === 'leccion') {
                iconHTML = '<i class="fas fa-file-alt resource-icon" style="color:#6c757d"></i>';
            } else { // actividad
                iconHTML = '<i class="fas fa-bullhorn resource-icon" style="color:#20c997"></i>';
            }

            // Preparar preview HTML (lecciones/actividades)
            let previewHtml = resource.content || resource.description || '';
            if (!previewHtml || previewHtml.trim() === '') previewHtml = '<p><em>Sin contenido.</em></p>';

            // Linkificar URLs planas en previews (solo si no contienen ya anchors)
            try {
                if (!/<a\s+/i.test(previewHtml)) {
                    previewHtml = previewHtml.replace(
                        /((https?:\/\/)[\w\-\._~:/?#[\]@!$&'()*+,;=%]+)(?![^<]*>)/g,
                        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
                    );
                }
            } catch (err) { /* ignore */ }

            // Construir innerHTML base
            resourceElement.innerHTML = `
                <div class="resource-item-main" style="display:flex; gap:12px; align-items:flex-start;">
                    <div class="resource-left" style="flex:0 0 44px; display:flex; align-items:center; justify-content:center;">
                        ${iconHTML}
                    </div>
                    <div class="resource-body" style="flex:1;">
                        ${resource.type === 'leccion' ? `
                            <div class="leccion-preview" data-resource-id="${resource._id || ''}">
                                <h3 class="leccion-preview-title" style="margin:0 0 6px 0;">${escapeHtml(resource.name || 'Lección')}</h3>
                                <div class="leccion-preview-body">${previewHtml}</div>
                            </div>
                        ` : resource.type === 'archivo' ? `
                            <a href="${resourceLink}" target="_blank" rel="noopener noreferrer" class="resource-link" style="text-decoration:none; color:inherit;">
                                <div class="resource-item-content"><span>${escapeHtml(resourceName)}</span></div>
                            </a>
                        ` : `
                            <div class="actividad-preview">
                                <div class="actividad-title" style="margin-bottom:6px;"><strong>${escapeHtml(resourceName)}</strong></div>
                                <div class="actividad-body">${previewHtml}</div>
                            </div>
                        `}
                    </div>
                    <div class="resource-item-actions" style="margin-left:12px; display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                        ${isAdmin ? `
                        <div style="display:flex; gap:8px; align-items:center;">
                            <button class="btn btn-icon btn-view-resource" title="${resource.type === 'actividad' ? 'Ver entregas' : resource.type === 'leccion' ? 'Ver lección' : 'Abrir archivo'}" style="display:inline-flex"
                                    data-resource-id="${resource._id || ''}">
                            <i class="fas ${resource.type === 'actividad' ? 'fa-list' : resource.type === 'leccion' ? 'fa-eye' : 'fa-file'}" aria-hidden="true"></i>
                            </button>

                            <button class="btn btn-secondary btn-icon btn-edit-resource" title="Editar recurso" style="display:inline-flex" data-resource-id="${resource._id || ''}">
                            <i class="fas fa-pen" aria-hidden="true"></i>
                            </button>

                            <button class="btn btn-danger btn-icon btn-delete-resource" title="Eliminar recurso" style="display:inline-flex" data-resource-id="${resource._id || ''}">
                            <i class="fas fa-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                        ` : `
                        ${resource.type === 'actividad' ? `<button class="btn add-submission-btn" data-activity-id="${resource._id || ''}">Agregar entrega</button>` : ''}
                        `}
                    </div>
                </div>
            `;

            // Si es actividad: añadir meta (fecha + countdown) y arrancar contador
            if (resource.type === 'actividad') {
                // Intentar leer varios campos posibles para la fecha ISO
                const dueIso = resource.dueDate || resource.due || resource.deadline || resource.fechaEntrega || null;
                const fechaText = dueIso ? formatLocalDateTimeFn(dueIso) : 'Sin fecha límite';

                // Crear elementos adicionales y agregarlos dentro de resource-body
                try {
                    const actividadBody = resourceElement.querySelector('.actividad-preview') || resourceElement.querySelector('.resource-body');
                    if (actividadBody) {
                        const metaWrap = document.createElement('div');
                        metaWrap.className = 'actividad-meta';
                        metaWrap.style.marginTop = '8px';
                        metaWrap.innerHTML = `
                            <div class="actividad-fecha" style="font-size:0.95rem; color:${isPastDueFn(dueIso) ? '#dc3545' : '#333'};"><strong>Entrega:</strong> <span class="actividad-fecha-text">${escapeHtml(fechaText)}</span></div>
                            <div class="actividad-countdown" style="font-family:monospace; font-weight:600; margin-top:6px;"></div>
                        `;
                        actividadBody.appendChild(metaWrap);

                        const countdownEl = actividadBody.querySelector('.actividad-countdown');
                        // Guardar ISO en dataset para que el listener delegado lo pueda leer si no hace fetch a la API
                        if (countdownEl) {
                            countdownEl.dataset.deadlineElem = 'true';
                            countdownEl.dataset.iso = dueIso || '';
                            // iniciar contador y, cuando expire, deshabilitar botón de entrega (cliente-side)
                            startDeadlineCountdownFn(dueIso, countdownEl, () => {
                                const addBtn = resourceElement.querySelector('.add-submission-btn');
                                if (addBtn) {
                                    addBtn.disabled = true;
                                    addBtn.textContent = 'Vencido';
                                    addBtn.classList.add('disabled');
                                }
                            });
                        }

                        // Si ya vencido, deshabilitar botón inmediatamente
                        if (dueIso && isPastDueFn(dueIso)) {
                            const addBtn = resourceElement.querySelector('.add-submission-btn');
                            if (addBtn) {
                                addBtn.disabled = true;
                                addBtn.textContent = 'Vencido';
                                addBtn.classList.add('disabled');
                            }
                        }
                    }
                } catch (err) {
                    console.warn('Error añadiendo meta de actividad:', err);
                }
            }

            // Evitar que el click en el anchor propague y active handlers superiores
            const anchorEl = resourceElement.querySelector('a.resource-link');
            if (anchorEl) {
                anchorEl.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                });
            }

            fragment.appendChild(resourceElement);
        });

        lessonsContainer.appendChild(fragment);

        // ---- nueva lógica: para cada actividad, comprobar si el usuario ya entregó ----
        (async () => {
            try {
                // buscar todas las filas de actividad añadidas
                const actividadEls = Array.from(lessonsContainer.querySelectorAll('.resource-item-list[data-resource-type="actividad"]'));
                if (!actividadEls.length) return;
                // preparar peticiones en paralelo
                const checks = actividadEls.map(async el => {
                    const actId = el.dataset.resourceId;
                    const btn = el.querySelector('.add-submission-btn');
                    if (!actId || !btn) return;
                    try {
                        const tokenLocal = localStorage.getItem('access_token') || '';
                        const headers = tokenLocal ? { 'Authorization': 'Bearer ' + tokenLocal } : {};
                        const q = `/entregas?actividadId=${encodeURIComponent(actId)}&studentId=${encodeURIComponent(window.userId || '')}`;
                        const r = await fetch(q, { headers, credentials: 'include', cache: 'no-store' });
                        if (!r.ok) return;
                        const arr = await r.json().catch(()=>[]);
                        const exists = Array.isArray(arr) && arr.length ? arr[0] : (arr && arr._id ? arr : null);
                        if (exists) {
                            btn.textContent = 'Editar entrega';
                            btn.classList.remove('add-submission-btn');
                            btn.classList.add('edit-submission-btn');
                            btn.dataset.submissionId = exists._id;
                            // al hacer click abrir con la submission
                            btn.addEventListener('click', (ev) => {
                                ev.preventDefault();
                                openSubmissionModal({ _id: actId, name: el.querySelector('.actividad-title')?.textContent || '' }, exists);
                            });
                        } else {
                            // si no existe: mantener comportamiento para crear; ya hay listener delegado que llama openSubmissionModal
                            btn.textContent = 'Agregar entrega';
                        }
                    } catch (err) { /* ignore per-item errors */ }
                });
                await Promise.all(checks);
            } catch (err) { console.warn('Error comprobando entregas del usuario:', err); }
        })();

        // Marcar elementos con lección para estilos/identificación (opcional)
        try {
            document.querySelectorAll('.resource-item-list').forEach(item => {
                if (item.querySelector('.leccion-preview')) item.classList.add('has-lesson');
            });
        } catch (e) { /* ignore */ }

        // Inicializar drag and drop si corresponde (si existe la función global)
        try {
            if (typeof initializeDragAndDrop === 'function') initializeDragAndDrop();
        } catch (err) {
            console.warn('initializeDragAndDrop falló:', err);
        }
    }

    // --- 7. PESTAÑA "PARTICIPANTES" ---
    function renderStudentList(inscritos) {
        const listaEstudiantes = document.getElementById('lista-estudiantes');
        if (!listaEstudiantes) return;
        listaEstudiantes.innerHTML = '';
        if (inscritos && inscritos.length > 0) {
            inscritos.forEach(estudiante => {
                if (!estudiante) return;
                const studentCard = document.createElement('div');
                studentCard.className = 'student-card';
                studentCard.innerHTML = `
                    <div class="student-info">
                        <i class="fas fa-user-circle student-icon"></i>
                        <div class="student-details">
                            <span class="student-name">${estudiante.username || 'Usuario sin nombre'}</span>
                            <span class="student-email">${estudiante.email}</span>
                        </div>
                    </div>
                    <button class="btn-delete-student" data-student-id="${estudiante._id}" aria-label="Eliminar estudiante"><i class="fas fa-trash-alt"></i></button>
                `;
                listaEstudiantes.appendChild(studentCard);
            });
        } else {
            listaEstudiantes.innerHTML = '<p class="empty-list-message">No hay estudiantes inscritos.</p>';
        }
    }

    function setupEnrollmentForm() {
        const formInscribir = document.getElementById('form-inscribir');
        if (!formInscribir) return;
        formInscribir.addEventListener('submit', async e => {
            e.preventDefault();
            const usuarioId = e.target.elements.usuarioId.value;
            if (!usuarioId) return showMessage('El ID de usuario no puede estar vacío.', true);
            try {
                const res = await fetch(`/cursos/${cursoId}/inscribir`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ usuarioId }) });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Error al inscribir');
                
                showMessage('¡Estudiante inscrito con éxito!');
                e.target.reset();
                state.curso.inscritos = data.inscritos;
                renderStudentList(state.curso.inscritos);
            } catch (error) { showMessage(error.message, true); }
        });
    }

    function setupStudentDeletion() {
        const container = document.getElementById('lista-estudiantes');
        if (!container) return;
        container.addEventListener('click', async e => {
            const deleteButton = e.target.closest('.btn-delete-student');
            if (!deleteButton) return;
            if (confirm('¿Seguro que quieres eliminar a este estudiante del curso?')) {
                const studentId = deleteButton.dataset.studentId;
                try {
                    const res = await fetch(`/cursos/${cursoId}/eliminar-estudiante`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ usuarioId: studentId }) });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Error al eliminar');

                    showMessage('¡Estudiante eliminado con éxito!');
                    state.curso.inscritos = data.inscritos;
                    renderStudentList(state.curso.inscritos);
                } catch (error) { showMessage(error.message, true); }
            }
        });
    }
    
        // ...existing code...
        function showMessage(message, isError = false) {
            if (!messageContainer) return;
            window._activeToasts = window._activeToasts || new Set();
            const key = (isError ? 'err:' : 'ok:') + String(message || '');
            if (window._activeToasts.has(key)) return; // evitar duplicados exactos
            window._activeToasts.add(key);
            const toast = document.createElement('div');
            toast.className = `toast ${isError ? 'toast--error' : ''}`;
            toast.textContent = message;
            messageContainer.appendChild(toast);
            setTimeout(() => {
                try { toast.remove(); } catch(e) {}
                window._activeToasts.delete(key);
            }, 4000);
        }
    // ...existing code...
    });

    // ---- Helpers de fecha y countdown ----
    function formatLocalDateTime(iso) {
        if (!iso) return 'Sin fecha';
        const d = new Date(iso);
        return d.toLocaleString();
    }
    function isPastDue(dueIso) {
        if (!dueIso) return false;
        return Date.now() > new Date(dueIso).getTime();
    }
    function startDeadlineCountdown(dueIso, displayElement, onExpired) {
        if (!dueIso || !displayElement) return;
        const dueTime = new Date(dueIso).getTime();
        function tick() {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((dueTime - now) / 1000)); // seg
            if (diff <= 0) {
                displayElement.textContent = 'Plazo vencido';
                if (typeof onExpired === 'function') onExpired();
                clearInterval(interval);
                return;
            }
            const days = Math.floor(diff / 86400);
            const hours = Math.floor((diff % 86400) / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            const parts = [];
            if (days) parts.push(`${days}d`);
            parts.push(String(hours).padStart(2,'0') + 'h');
            parts.push(String(minutes).padStart(2,'0') + 'm');
            parts.push(String(seconds).padStart(2,'0') + 's');
            displayElement.textContent = 'Tiempo restante: ' + parts.join(' ');
        }
        tick();
        const interval = setInterval(tick, 1000);
        return interval;
    }

        // Reemplaza la función openViewSubmissionsModal por esta versión que renderiza una tabla
        async function openViewSubmissionsModal(activityId) {
            const isAdminLocal = (typeof isAdmin !== 'undefined') ? isAdmin : !!window.isAdmin;
            if (!activityId) return showMessage('ID de actividad inválida.', true);

            const token = localStorage.getItem('access_token') || '';
            const headers = (typeof authHeaders !== 'undefined' && authHeaders) ? { ...authHeaders } : (window.authHeaders ? { ...window.authHeaders } : {});
            delete headers['Content-Type'];
            delete headers['content-type'];
            if (!headers['Authorization'] && token) headers['Authorization'] = `Bearer ${token}`;

            // crear/mostrar modal
            let modal = document.getElementById('view-submissions-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'view-submissions-modal';
                modal.style.position = 'fixed';
                modal.style.left = '0';
                modal.style.top = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.zIndex = '1400';
                modal.style.display = 'none';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.background = 'rgba(0,0,0,0.45)';
                modal.innerHTML = `
                    <div id="view-submissions-card" style="background:#fff; max-width:1100px; width:95%; max-height:80vh; overflow:auto; border-radius:8px; padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <h3 style="margin:0;">Entregas</h3>
                            <button id="view-submissions-close" aria-label="Cerrar" style="background:#fff;border:0;font-size:1.6rem;cursor:pointer;">&times;</button>
                        </div>
                        <div id="view-submissions-list" style="min-height:80px;">Cargando...</div>
                    </div>
                `;
                document.body.appendChild(modal);
                modal.querySelector('#view-submissions-close').addEventListener('click', () => modal.style.display = 'none');
                modal.addEventListener('click', (ev) => {
                    if (ev.target === modal) modal.style.display = 'none';
                });
            } else {
                const listElPrev = modal.querySelector('#view-submissions-list');
                if (listElPrev) listElPrev.innerHTML = 'Cargando...';
            }
            modal.style.display = 'flex';

            // estilos para tabla
            const vsStylesId = 'vs-table-styles';
            if (!document.getElementById(vsStylesId)) {
                const vsStyles = document.createElement('style');
                vsStyles.id = vsStylesId;
                vsStyles.innerHTML = `
                    #view-submissions-card { padding: 18px; border-radius:10px; box-shadow: 0 10px 30px rgba(0,0,0,0.18); }
                    #view-submissions-list table { width:100%; border-collapse:collapse; font-family:inherit; }
                    #view-submissions-list thead th { text-align:left; padding:10px 8px; border-bottom:2px solid #eee; background:#fafafa; font-weight:700; color:#222; }
                    #view-submissions-list tbody td { padding:10px 8px; border-bottom:1px solid #f1f1f1; vertical-align:top; color:#333; }
                    #view-submissions-list tbody tr:last-child td { border-bottom:none; }
                    .status-chip { display:inline-block; padding:6px 8px; border-radius:6px; font-size:0.9rem; }
                    .status-pending { background:#eaf7ea; color:#166534; }
                    .status-graded { background:#eef2ff; color:#2b3cff; }
                    .grade-input { width:86px; padding:6px; border-radius:6px; border:1px solid #ddd; }
                    .grade-comment-input { width:100%; min-height:48px; padding:8px; border-radius:6px; border:1px solid #ddd; }
                    .save-grade-btn { background:#e74c3c; color:#fff; border:0; padding:8px 12px; border-radius:20px; cursor:pointer; }
                    .save-grade-btn[disabled]{ opacity:0.6; cursor:not-allowed; }
                    a.resource-file-link{ color:#2b6cdf; text-decoration:underline; }
                    @media (max-width:900px) {
                        #view-submissions-card { padding:12px; }
                        #view-submissions-list thead { display:none; }
                        #view-submissions-list tbody td { display:block; width:100%; box-sizing:border-box; }
                        #view-submissions-list tbody tr { margin-bottom:10px; display:block; border-bottom:1px solid #eee; padding-bottom:8px; }
                    }
                `;
                document.head.appendChild(vsStyles);
                const commentsFixId = 'vs-comments-fix';
                if (!document.getElementById(commentsFixId)) {
                    const s2 = document.createElement('style');
                    s2.id = commentsFixId;
                    s2.innerHTML = `
                    /* Layout: textarea del docente ocupa el espacio disponible; botón a la derecha */
                    #view-submissions-list td.teacher-col { padding:10px 8px; vertical-align:top; }
                    #view-submissions-list td.teacher-col { display:flex; gap:12px; align-items:flex-start; justify-content:space-between; }

                    /* Contenedor izquierdo: textarea ocupa el espacio disponible */
                    #view-submissions-list td.teacher-col .grade-comment-input {
                        flex:1;
                        min-height:96px;
                        max-height:320px;
                        width: auto !important;
                        padding:10px;
                        border-radius:8px;
                        border:1px solid #e2e8f0;
                        resize:vertical;
                        overflow:auto;
                        box-sizing:border-box;
                        font-family:inherit;
                        font-size:0.95rem;
                        line-height:1.3;
                    }

                    /* Contenedor derecho: botón alineado a la parte superior, con espacio */
                    #view-submissions-list td.teacher-col .save-grade-btn {
                        flex:0 0 auto;
                        align-self:flex-start;
                        margin-left:12px;
                        padding:10px 16px;
                        border-radius:20px;
                        height:auto;
                    }

                    /* Si hay solo el botón (sin textarea), mantener alineación */
                    #view-submissions-list td.teacher-col > div.save-wrapper { display:flex; align-items:flex-start; }

                    /* Evitar que la columna de comentario comprima la tabla */
                    #view-submissions-list td.teacher-col { min-width:220px; max-width:520px; }

                    /* Ajustes responsivos: apilar en pantallas pequeñas */
                    @media (max-width:900px) {
                        #view-submissions-card { padding:12px; }
                        #view-submissions-list thead { display:none; }
                        #view-submissions-list tbody td { display:block; width:100%; box-sizing:border-box; }
                        #view-submissions-list td.teacher-col { flex-direction:column; gap:8px; align-items:stretch; }
                        #view-submissions-list td.teacher-col .save-grade-btn { align-self:flex-end; margin-left:0; }
                    }

                    /* Estética menor */
                    .save-grade-btn { background:#e65346; color:#fff; border:0; cursor:pointer; box-shadow:none; }
                    .save-grade-btn[disabled]{ opacity:0.6; cursor:not-allowed; }
                    `;
                    document.head.appendChild(s2);
                }
            }

            try {
                const url = `/entregas?actividadId=${encodeURIComponent(activityId)}`;
                const res = await fetch(url, { headers, credentials: 'include', cache: 'no-store', redirect: 'follow' });
                if (res.status === 401 || res.status === 403 || (res.url && (res.url.includes('/login') || res.url.endsWith('/index.html')))) {
                    showMessage('No autorizado o sesión expirada. Inicia sesión de nuevo.', true);
                    modal.style.display = 'none';
                    return;
                }

                const txt = await res.text();
                const loginIndicators = ['Correo Electrónico','Contraseña','<form','Entrar'];
                const looksLikeLogin = loginIndicators.some(ind => txt.includes(ind) && txt.indexOf(ind) < 4000);

                let entregas = [];
                if (!res.ok || looksLikeLogin) {
                    // fallback a /entregas
                    const allRes = await fetch('/entregas', { headers, credentials: 'include', cache: 'no-store' });
                    const all = allRes.ok ? await allRes.json().catch(()=>[]) : [];
                    entregas = Array.isArray(all) ? all.filter(it => {
                        const act = it.actividad || it.actividadId || (it.actividades && it.actividades[0] && (it.actividades[0]._id || it.actividades[0]));
                        return act && (act === activityId || (act._id && act._id === activityId));
                    }) : [];
                } else {
                    try { const parsed = JSON.parse(txt); entregas = Array.isArray(parsed) ? parsed : (parsed && parsed.data && Array.isArray(parsed.data) ? parsed.data : []); }
                    catch (e) { entregas = await res.json().catch(()=>[]); }
                }

                const listEl = modal.querySelector('#view-submissions-list');
                if (!listEl) return showMessage('No se pudo mostrar las entregas.', true);

                if (!entregas || entregas.length === 0) {
                    listEl.innerHTML = '<p class="empty-list-message">No hay entregas aún para esta actividad.</p>';
                    return;
                }

                // helper to get username if only id present
                const userCache = {};
                async function fetchUserNameById(id) {
                    if (!id) return 'Estudiante';
                    if (userCache[id]) return userCache[id];
                    try {
                        const r = await fetch(`/usuarios/${id}`, { headers, credentials: 'include' });
                        if (!r.ok) throw new Error('no user');
                        const u = await r.json();
                        const name = u?.name || u?.nombre || u?.username || u?.email || String(id);
                        userCache[id] = name;
                        return name;
                    } catch (err) { userCache[id] = String(id); return String(id); }
                }

                const baseOrigin = window.location.origin;
                // construir tabla
                const tableHtml = `
                    <br>
                    <table role="grid" aria-label="Lista de entregas">
                        <thead>
                            <tr>
                                <th style="width:18%;">Estudiante</th>
                                <th style="width:14%;">Fecha</th>
                                <th style="width:14%;">Estado</th>
                                <th style="width:10%;">Nota</th>
                                <th style="width:16%;">Archivo</th>
                                <th style="width:20%;">Comentario del estudiante</th>
                                <th style="width:8%;">Comentario del profesor</th>
                            </tr>
                        </thead>
                        <tbody id="vs-tbody"></tbody>
                    </table>
                `;
                listEl.innerHTML = tableHtml;
                const tbody = listEl.querySelector('#vs-tbody');

                // render rows sequentially (so we can await username fetch)
                for (const sub of entregas) {
                    const subId = sub._id || sub.id || '';
                    // student name
                    let student = 'Estudiante';
                    if (Array.isArray(sub.usuarios) && sub.usuarios.length) {
                        const u0 = sub.usuarios[0];
                        if (typeof u0 === 'string') student = await fetchUserNameById(u0);
                        else if (typeof u0 === 'object') student = u0.name || u0.nombre || u0.username || u0.email || (u0._id ? String(u0._id) : 'Estudiante');
                    } else if (sub.studentId) student = await fetchUserNameById(sub.studentId);
                    else if (sub.usuario && typeof sub.usuario === 'object') student = sub.usuario.name || sub.usuario.username || sub.usuario.email || sub.usuario._id || 'Estudiante';

                    const submittedAtRaw = sub.submitAt || sub.createdAt || sub.fecha || '';
                    const submittedAt = submittedAtRaw ? (new Date(submittedAtRaw)).toLocaleString() : '';

                    const gradeVal = (sub.grade !== undefined && sub.grade !== null) ? String(sub.grade) : '';
                    const teacherCommentVal = sub.teacherComment || sub.feedback || '';

                    const statusHtml = (gradeVal === '') ? `<span class="status-chip status-pending">Enviado para calificar</span>` : `<span class="status-chip status-graded">Calificado</span>`;

                    const filesArr = sub.archivos || sub.files || sub.filesList || [];
                    const filesHtml = (filesArr && filesArr.length) ? filesArr.map(f => {
                        if (!f) return '';
                        const raw = f.url || f.path || null;
                        let href = null;
                        if (raw) {
                            if (typeof raw === 'string' && raw.startsWith('http')) href = raw;
                            else if (typeof raw === 'string' && raw.startsWith('/')) href = baseOrigin + raw;
                            else if (typeof raw === 'string' && raw.indexOf(':') !== -1) {
                                const parts = raw.split(/[\\/]/); href = baseOrigin + '/uploads/entregas/' + encodeURIComponent(parts[parts.length - 1]);
                            } else if (typeof raw === 'string') href = baseOrigin + (raw.startsWith('/') ? raw : ('/' + raw));
                        }
                        if (!href && (f.filename || f.originalname)) href = baseOrigin + '/uploads/entregas/' + encodeURIComponent(f.filename || f.originalname);
                        const name = escapeHtml(f.originalname || f.name || f.filename || (href ? decodeURIComponent(href.split('/').pop()) : 'archivo'));
                        return href ? `<div><a class="resource-file-link" href="${href}" target="_blank" rel="noopener noreferrer">${name}</a></div>` : `<div>${name}</div>`;
                    }).join('') : '<div style="color:#666">Sin archivos</div>';

                    const studentComment = escapeHtml(sub.comment || sub.comentario || '');

                    // crear fila
                    const tr = document.createElement('tr');
                    tr.dataset.submissionId = subId;
                    tr.innerHTML = `
                        <td class="student-col"><strong>${escapeHtml(student)}</strong></td>
                        <td class="date-col">${escapeHtml(submittedAt)}</td>
                        <td class="status-col">${statusHtml}</td>
                        <td class="grade-col">
                            <input type="number" min="0" step="0.1" class="grade-input" value="${escapeHtml(gradeVal)}" />
                        </td>
                        <td class="file-col">${filesHtml}</td>
                        <td class="student-comment-col">${studentComment}</td>
                        <td class="teacher-col">
                            <textarea class="grade-comment-input" placeholder="Comentario docente (opcional)">${escapeHtml(teacherCommentVal)}</textarea>
                            ${isAdminLocal ? `<div style="margin-top:6px; text-align:right;"><button class="save-grade-btn">Guardar</button></div>` : ''}
                        </td>
                    `;
                    tbody.appendChild(tr);

                    // bind save handler if admin
                    if (isAdminLocal) {
                        const saveBtn = tr.querySelector('.save-grade-btn');
                        const gradeInput = tr.querySelector('.grade-input');
                        const commentInput = tr.querySelector('.grade-comment-input');
                        const statusCell = tr.querySelector('.status-col');
                        if (saveBtn && gradeInput && commentInput) {
                            saveBtn.addEventListener('click', async () => {
                                const rawGrade = gradeInput.value;
                                const grade = rawGrade === '' ? null : Number(rawGrade);
                                const teacherComment = commentInput.value || '';
                                saveBtn.disabled = true;
                                saveBtn.textContent = 'Guardando...';
                                try {
                                    const payload = { grade, teacherComment };
                                    const resPatch = await fetch(`/entregas/${subId}`, {
                                        method: 'PATCH',
                                        headers: Object.assign({}, (typeof authHeaders !== 'undefined' ? authHeaders : window.authHeaders) || {}, { 'Content-Type': 'application/json' }),
                                        body: JSON.stringify(payload)
                                    });
                                    const body = await resPatch.json().catch(()=>null);
                                    if (!resPatch.ok) throw new Error(body?.message || `Error ${resPatch.status}`);
                                    // actualizar UI estado y nota
                                    if (grade !== null) {
                                        statusCell.innerHTML = `<span class="status-chip status-graded">Calificado</span>`;
                                    } else {
                                        statusCell.innerHTML = `<span class="status-chip status-pending">Enviado para calificar</span>`;
                                    }
                                    showMessage('Nota guardada.');
                                } catch (err) {
                                    console.error('Error guardando nota:', err);
                                    showMessage(err.message || 'No se pudo guardar la nota', true);
                                } finally {
                                    saveBtn.disabled = false;
                                    saveBtn.textContent = 'Guardar';
                                }
                            });
                        }
                    }
                }

            } catch (err) {
                console.error('openViewSubmissionsModal fallo:', err);
                const listEl = document.querySelector('#view-submissions-list');
                if (listEl) listEl.innerHTML = `<p style="color:#c0392b;">No se pudieron cargar las entregas. Comprueba la conexión o el endpoint (/entregas). (${escapeHtml(err.message || '')})</p>`;
            }
        }

        function escapeHtml(input) {
            if (input === null || input === undefined) return '';
            return String(input).replace(/[&<>"'`=\/]/g, function (s) {
                return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
                }[s];
        });
        }

        // Fallback inline -> llama al modal anterior (puedes adaptar si quieres mostrar inline en la lista)
        function openInlineViewSubmissionsModal(activityId) {
            return openViewSubmissionsModal(activityId);
        }

        function setupSubmissionLogic(activity) {
            const form = document.getElementById('submission-form');
            if (!form) return;

            async function submitForm() {
                if (activity.dueDate && isPastDue(activity.dueDate)) {
                    showMessage('No se puede enviar: la fecha límite ya pasó.', true);
                    return;
                }

                const submitBtn = form.querySelector('button[type="submit"]');
                let originalText = submitBtn ? submitBtn.textContent : null;
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Enviando...';
                }

                try {
                    const fileInput = form.querySelector('#submission-files');
                    const files = (fileInput && fileInput.files) ? Array.from(fileInput.files) : [];

                    // Si hay archivos, enviamos FormData (multipart). Si no, enviamos JSON.
                    if (files.length === 0) {
                        // Envío JSON (más seguro si el backend espera JSON)
                        const payload = {
                            actividadId: activity._id,
                            studentId: userId,
                            comment: form.querySelector('#submission-comment')?.value || '',
                            submitAt: new Date().toISOString()
                        };

                        const res = await fetch('/entregas', {
                            method: 'POST',
                            headers: authHeaders, // contiene Content-Type: application/json + Authorization
                            body: JSON.stringify(payload)
                        });

                        const body = await res.json().catch(()=>null);
                        if (!res.ok) throw new Error(body?.message || `Error ${res.status}`);

                    } else {
                        // Envío multipart/form-data (no establecer Content-Type manualmente)
                        const fd = new FormData();
                        fd.append('actividadId', activity._id);
                        fd.append('studentId', userId);
                        fd.append('comment', form.querySelector('#submission-comment')?.value || '');
                        fd.append('submitAt', new Date().toISOString());
                        for (let i = 0; i < files.length; i++) fd.append('files', files[i], files[i].name);

                        // Construir headers solo con Authorization (sin Content-Type)
                        const tokenLocal = localStorage.getItem('access_token') || '';
                        const headersPost = tokenLocal ? { 'Authorization': 'Bearer ' + tokenLocal } : {};

                        const res = await fetch('/entregas', {
                            method: 'POST',
                            headers: headersPost,
                            body: fd
                        });

                        const body = await res.json().catch(()=>null);
                        if (!res.ok) throw new Error(body?.message || `Error ${res.status}`);
                    }

                    showMessage('Entrega enviada correctamente.');
                    activityFormModal.style.display = 'none';
                    if (typeof loadUnitContent === 'function') await loadUnitContent(state.currentUnitId);
                } catch (err) {
                    console.error('Error al enviar entrega', err);
                    showMessage(err.message || 'Fallo al enviar entrega', true);
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText || 'Enviar entrega';
                    }
                }
            }


            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await submitForm();
            });
        }


        function loadTinyMCE(apiKey, timeoutMs = 8000) {
        return new Promise((resolve, reject) => {
            if (window.tinymce) return resolve(window.tinymce);
            const existing = document.querySelector('script[data-tinymce-loader]');
            if (existing) {
                existing.addEventListener('load', () => window.tinymce ? resolve(window.tinymce) : reject(new Error('tinymce failed to load')));
                existing.addEventListener('error', () => reject(new Error('tinymce script error')));
                return;
            }
            const s = document.createElement('script');
            s.src = `https://cdn.tiny.cloud/1/${encodeURIComponent(apiKey)}/tinymce/6/tinymce.min.js`;
            s.setAttribute('data-tinymce-loader', '1');
            s.onload = () => window.tinymce ? resolve(window.tinymce) : reject(new Error('tinymce loaded but not available'));
            s.onerror = () => reject(new Error('tinymce script error'));
            document.head.appendChild(s);
            setTimeout(() => reject(new Error('timed out loading tinymce')), timeoutMs);
        });
    }
    // Uso ejemplo antes de inicializar editor:
    // loadTinyMCE(TINYMCE_API_KEY).then(() => tinymce.init({...})).catch(() => { fallback to textarea });