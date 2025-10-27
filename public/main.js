document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado. Iniciando script...');

    // --- DECODIFICADOR DE JWT Y AUTENTICACIÓN ---
    function decodeJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Error fatal al decodificar JWT:", e);
            localStorage.clear();
            window.location.href = 'index.html';
            return null;
        }
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
        console.log('No se encontró token. Redirigiendo a index.html');
        window.location.href = 'index.html';
        return;
    }

    const decodedToken = decodeJwt(token);
    console.log('Token decodificado:', decodedToken);

    const userRole = decodedToken ? decodedToken.role : 'student';
    const isAdmin = userRole === 'admin';
    const userId = decodedToken ? decodedToken.sub : null;
    console.log(`Rol: ${userRole}, Admin: ${isAdmin}, ID: ${userId}`);

    const currentUserEmail = localStorage.getItem('user_email');

    const authHeaders = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // --- ELEMENTOS DEL DOM ---
    const welcomeMessageContainer = document.getElementById('welcome-message');
    const settingsButton = document.getElementById('settings-btn');
    const dropdownContent = document.getElementById('dropdown-content');
    const logoutButton = document.getElementById('logout-button');
    const addCourseBtn = document.getElementById('add-course-btn');
    const grid = document.querySelector('.subject-cards-grid');
    
    // Vistas y Modales de Curso
    const courseModal = document.getElementById('course-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const courseForm = document.getElementById('course-form');
    const modalTitle = document.getElementById('modal-title');
    const courseIdInput = document.getElementById('course-id');
    const courseNameInput = document.getElementById('course-name');
    const courseDescriptionInput = document.getElementById('course-description');
    
    // Vistas y Modales de Perfil
    const profileLink = document.getElementById('profile-link');
    const profileView = document.getElementById('profile-view');
    const closeProfileBtn = document.getElementById('close-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const profileEmailInput = document.getElementById('profile-email');
    const profileUsernameInput = document.getElementById('profile-username');
    const profilePhoneInput = document.getElementById('profile-phone');

    let cursosCache = [];

    // --- FUNCIONES PRINCIPALES ---

    function displayWelcomeMessage() {
        if (!currentUserEmail || !welcomeMessageContainer) return;
        const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
        let username = currentUserEmail.split('@')[0];
        if (userProfileString) {
            username = JSON.parse(userProfileString).username || username;
        }
        welcomeMessageContainer.innerHTML = `👋🏼 Bienvenido, <strong>${username}</strong>`;
    }

    function setupAdminControls() {
        if (addCourseBtn && isAdmin) {
            addCourseBtn.style.display = 'block';
        } else if(addCourseBtn) {
            addCourseBtn.style.display = 'none';
        }
    }

    async function cargarCursos() {
        if (!grid) return;
        grid.innerHTML = ''; 

        try {
            let cursosParaMostrar = [];
            if (isAdmin) {
                // Si es admin, obtiene todos los cursos.
                const response = await fetch('/cursos', { headers: authHeaders });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                cursosCache = await response.json(); // Guardamos en caché para editar/eliminar
                cursosParaMostrar = cursosCache;
            } else {
                // Si es estudiante, obtiene solo sus cursos desde su perfil.
                if (!userId) throw new Error('No se pudo obtener el ID del usuario.');
                const response = await fetch(`/usuarios/${userId}`, { headers: authHeaders });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                const usuario = await response.json();
                // El backend ya popula los cursos, así que `usuario.cursos` es la lista que necesitamos.
                cursosParaMostrar = usuario.cursos || []; 
            }

            if (cursosParaMostrar.length === 0) {
                grid.innerHTML = isAdmin 
                    ? '<p class="empty-grid-message">No hay cursos disponibles. ¡Crea el primero para empezar!</p>' 
                    : '<p class="empty-grid-message">Aún no estás inscrito en ningún curso.</p>';
                return;
            }
            
            renderizarTarjetas(cursosParaMostrar);

        } catch (error) {
            console.error("Error al cargar cursos:", error);
            grid.innerHTML = '<p class="empty-grid-message">Hubo un error al cargar los cursos. Por favor, intenta de nuevo más tarde.</p>';
        }
    }


    function renderizarTarjetas(cursos) {
        const icons = ['fas fa-book-open', 'fas fa-atom', 'fas fa-palette', 'fas fa-laptop-code'];
        grid.innerHTML = ''; // Limpiamos el grid antes de renderizar
        cursos.forEach((curso, index) => {
            if (!curso) return; 
            const card = document.createElement('div');
            card.className = 'subject-card';
            const iconClass = icons[index % icons.length];
            // Solo los admins pueden ver los botones de editar y eliminar
            const adminActions = isAdmin ? `
                <div class="card-actions">
                    <button class="btn btn-edit" data-id="${curso._id}">Editar</button>
                    <button class="btn btn-delete" data-id="${curso._id}">Eliminar</button>
                </div>
            ` : '';

            card.innerHTML = `
                <a href="modulo1.html?cursoId=${curso._id}" class="card-content-link">
                    <div class="card-icon"><i class="${iconClass}"></i></div>
                    <h3 class="card-caption">${curso.nombre}</h3>
                    <p class="card-description">${curso.descripcion}</p>
                </a>
                ${adminActions}
            `;
            // If course already provides an image URL, use it; otherwise generate one based on the name
            try {
                const imagenUrl = curso.imagen || getImageForCourse(curso, index);
                card.classList.add('card-style-image');
                card.style.backgroundImage = `url('${imagenUrl}')`;
            } catch (e) {
                // ignore and render without background
                console.warn('No se pudo asignar imagen al curso', e);
            }

            grid.appendChild(card);
        });
    }

    // Helper: choose an image URL based on course name (client-side fallback)
    // For production it's better to have `curso.imagen` in the API; this is a quick client-side approach.
    function getImageForCourse(curso, index) {
        const name = (curso.nombre || '').toLowerCase();
        let query = 'photography';
        if (name.includes('foto') || name.includes('photograph') || name.includes('camera')) {
            query = 'photography,camera';
        } else if (name.includes('edici') || name.includes('edit')) {
            query = 'photo editing,computer';
        } else if (name.includes('dise') || name.includes('design')) {
            query = 'design,art';
        } else if (name.includes('video') || name.includes('film')) {
            query = 'video,filmmaking';
        } else {
            // default to photography-related imagery
            query = 'photography,landscape';
        }
        // Use Unsplash Source to get a random image for the query. We add index as sig to vary images.
        // Note: this is a simple client-side approach and may produce different images on each load.
        return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}&sig=${index}`;
    }

    // --- MANEJADORES DE EVENTOS ---

    function setupEventListeners() {
        // Dropdown de configuración
        if (settingsButton) {
            settingsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownContent.classList.toggle('show');
            });
        }

        // Logout
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = 'index.html';
            });
        }
        
        // Abrir Modal para CREAR curso
        if(addCourseBtn && isAdmin) {
            addCourseBtn.addEventListener('click', () => {
                courseForm.reset();
                courseIdInput.value = '';
                modalTitle.textContent = 'Crear Nuevo Curso';
                courseModal.style.display = 'flex';
            });
        }

        // Clics en tarjetas de curso (EDITAR/ELIMINAR)
        if (grid) {
            grid.addEventListener('click', (e) => {
                const editButton = e.target.closest('.btn-edit');
                const deleteButton = e.target.closest('.btn-delete');

                if (isAdmin && editButton) {
                    const id = editButton.dataset.id;
                    const curso = cursosCache.find(c => c._id === id);
                    if (curso) {
                        courseIdInput.value = curso._id;
                        courseNameInput.value = curso.nombre;
                        courseDescriptionInput.value = curso.descripcion;
                        modalTitle.textContent = 'Editar Curso';
                        courseModal.style.display = 'flex';
                    }
                } else if (isAdmin && deleteButton) {
                    const id = deleteButton.dataset.id;
                    if (confirm('¿Seguro que quieres eliminar este curso?')) {
                        fetch(`/cursos/${id}`, { method: 'DELETE', headers: authHeaders })
                            .then(res => {
                                if(!res.ok) throw new Error('Error en el borrado');
                                cargarCursos(); // Recargamos los cursos
                            })
                            .catch(err => console.error('Fallo al eliminar', err));
                    }
                }
            });
        }

        // Cerrar modal de CURSO
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => courseModal.style.display = 'none');
        }

        // Enviar formulario de CURSO (crear/editar)
        if (courseForm) {
            courseForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = courseIdInput.value;
                const url = id ? `/cursos/${id}` : '/cursos';
                const method = id ? 'PATCH' : 'POST';
                const courseData = { nombre: courseNameInput.value, descripcion: courseDescriptionInput.value };
                try {
                    const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(courseData) });
                    if (!res.ok) throw new Error('La petición al servidor falló');
                    closeModalBtn.click();
                    await cargarCursos();
                } catch (err) {
                    console.error('Error al guardar curso:', err);
                }
            });
        }
        
        // --- LÓGICA DE PERFIL ---
        
        // Abrir modal de PERFIL
        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (currentUserEmail && profileEmailInput) {
                    profileEmailInput.value = currentUserEmail;
                }
                const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
                if (userProfileString) {
                    const profile = JSON.parse(userProfileString);
                    if (profileUsernameInput) profileUsernameInput.value = profile.username || '';
                    if (profilePhoneInput) profilePhoneInput.value = profile.phone || '';
                } else {
                    if (profileUsernameInput) profileUsernameInput.value = decodedToken.username || currentUserEmail.split('@')[0];
                    if (profilePhoneInput) profilePhoneInput.value = '';
                }
                
                if (profileView) profileView.style.display = 'flex';
                if (dropdownContent) dropdownContent.classList.remove('show');
            });
        }

        // Cerrar modal de PERFIL
        if (closeProfileBtn) {
            closeProfileBtn.addEventListener('click', () => {
                if (profileView) profileView.style.display = 'none';
            });
        }
        
        // Guardar formulario de PERFIL
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = profileUsernameInput.value;
                const phone = profilePhoneInput.value;
                const profileData = { username, phone };
                localStorage.setItem(`profile_${currentUserEmail}`, JSON.stringify(profileData));
                
                displayWelcomeMessage(); 
                if (profileView) profileView.style.display = 'none';

                const msgContainer = document.getElementById('message-container');
                if (msgContainer) {
                    const toast = document.createElement('div');
                    toast.className = 'toast';
                    toast.textContent = 'Perfil actualizado con éxito.';
                    msgContainer.appendChild(toast);
                    setTimeout(() => toast.remove(), 4000);
                }
            });
        }

        // Cierre global de modales y dropdowns
        window.addEventListener('click', (e) => {
            if (dropdownContent && !settingsButton.contains(e.target) && !dropdownContent.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
            if(e.target === courseModal) courseModal.style.display = 'none';
            if(e.target === profileView) profileView.style.display = 'none';
        });
    }

    // --- SECUENCIA DE INICIALIZACIÓN ---
    displayWelcomeMessage();
    setupAdminControls();
    cargarCursos();
    setupEventListeners();
});
