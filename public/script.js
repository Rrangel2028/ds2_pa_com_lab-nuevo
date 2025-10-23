document.addEventListener('DOMContentLoaded', () => {
    // --- Vistas de Login y Registro ---
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'none';
            registerView.style.display = 'block';
            registerView.classList.add('show');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerView.style.display = 'none';
            loginView.style.display = 'block';
        });
    }

    // --- Formularios ---
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // --- Lógica del Carrusel de Imágenes ---
    const contentContainer = document.getElementById('content-container');
    if (contentContainer && getComputedStyle(contentContainer).display !== 'none') {
        const slides = contentContainer.querySelectorAll('.slide');
        let currentSlide = 0;

        if (slides.length > 1) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 5000);
        }
    }
});

function showMessage(message, isError = false) {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'toast--error' : ''}`.trim();
    toast.textContent = message;

    messageContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, phone, password }),
        });

        if (response.ok) {
            // **NUEVO: Guardar los datos del perfil del usuario en el registro**
            const userProfile = { username, phone };
            localStorage.setItem(`profile_${email}`, JSON.stringify(userProfile));

            showMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
            document.getElementById('register-form').reset();
            document.getElementById('register-view').style.display = 'none';
            document.getElementById('login-view').style.display = 'block';
        } else {
            const error = await response.json();
            const errorMessage = Array.isArray(error.message) ? error.message.join(', ') : error.message;
            showMessage(`Error en el registro: ${errorMessage}`, true);
        }
    } catch (error) {
        showMessage('Error de conexión con el servidor.', true);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            // Guardamos el token y el email para la sesión
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_email', email); 
            window.location.href = 'main.html';
        } else {
            const error = await response.json();
            showMessage(error.message || 'Credenciales incorrectas.', true);
        }
    } catch (error) {
        showMessage('Error de conexión con el servidor.', true);
    }
}
