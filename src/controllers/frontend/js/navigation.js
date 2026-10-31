
document.addEventListener('DOMContentLoaded', () => {

    // Verificar sesión
    const token = sessionStorage.getItem('cardiocita_token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar usuario
    const usuario = sessionStorage.getItem('cardiocita_usuario');

    const doctorName = document.getElementById('doctorName');
    const doctorAvatar = document.getElementById('doctorAvatar');

    if (doctorName && usuario) {
        doctorName.textContent = usuario;
    }

    if (doctorAvatar && usuario) {
        doctorAvatar.textContent = usuario.charAt(0).toUpperCase();
    }

    // Cerrar sesión
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {

            sessionStorage.removeItem('cardiocita_token');
            sessionStorage.removeItem('cardiocita_usuario');

            window.location.href = 'login.html';
        });
    }

});
