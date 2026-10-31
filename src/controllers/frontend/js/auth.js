
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value;

        const message = document.getElementById('loginMessage');
        const button = document.getElementById('loginButton');

        message.textContent = '';
        button.disabled = true;
        button.textContent = 'Verificando...';

        try {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    usuario,
                    password
                })
            });

            sessionStorage.setItem('cardiocita_token', data.token);
            sessionStorage.setItem('cardiocita_usuario', data.usuario.usuario);

            message.textContent = 'Inicio de sesión exitoso.';

            window.location.href = 'registrar-paciente.html';

        } catch (error) {
            message.textContent = error.message;
            message.style.color = '#B54747';

        } finally {
            button.disabled = false;
            button.textContent = 'Iniciar sesión';
        }
    });
}
