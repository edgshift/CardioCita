document.addEventListener('DOMContentLoaded', async () => {

    // Verificar que exista una sesión activa
    const token = sessionStorage.getItem('cardiocita_token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre del usuario
    const doctorName = document.getElementById('doctorName');
    const usuario = sessionStorage.getItem('cardiocita_usuario');

    if (doctorName && usuario) {
        doctorName.textContent = usuario;
    }

    // Mostrar fecha actual
    const currentDate = document.getElementById('currentDate');

    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString('es-DO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Consultar pacientes registrados
    const totalPatients = document.getElementById('totalPatients');
    const dashboardMessage = document.getElementById('dashboardMessage');

    try {
        const patients = await apiRequest('/patients');

        if (totalPatients) {
            totalPatients.textContent = patients.length;
        }

    } catch (error) {
        if (dashboardMessage) {
            dashboardMessage.textContent =
                'No fue posible cargar las estadísticas de pacientes: ' +
                error.message;
        }
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