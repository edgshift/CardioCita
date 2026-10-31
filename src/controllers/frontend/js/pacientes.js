
// =====================================
// CARDIOCITA - REGISTRO DE PACIENTES
// =====================================

const patientForm = document.getElementById('patientForm');
const formMessage = document.getElementById('formMessage');

// Comprobar que exista una sesión iniciada
const token = sessionStorage.getItem('cardiocita_token');

if (!token) {
    window.location.href = 'login.html';
}

// Evitar fechas de nacimiento futuras
const fechaNacimiento = document.getElementById('fechaNacimiento');

if (fechaNacimiento) {
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
    ].join('-');

    fechaNacimiento.max = localToday;
}

// Registrar paciente
if (patientForm) {
    patientForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        formMessage.textContent = '';
        formMessage.style.color = '';

        // Obtener los datos del formulario
        const formData = new FormData(patientForm);

        const paciente = {
            nombres: formData.get('nombres').trim(),
            apellidos: formData.get('apellidos').trim(),
            edad: Number(formData.get('edad')),
            cedula: formData.get('cedula').trim(),
            sexo: formData.get('sexo'),
            tipoEnfermedad: formData.get('tipoEnfermedad')
        };

        // La fecha de nacimiento es opcional
        const fecha = formData.get('fechaNacimiento');

        if (fecha) {
            paciente.fechaNacimiento = fecha;
        }

        const button = patientForm.querySelector(
            'button[type="submit"]'
        );

        button.disabled = true;
        button.textContent = 'Registrando...';

        try {
            const data = await apiRequest('/patients', {
                method: 'POST',
                body: JSON.stringify(paciente)
            });

            formMessage.textContent =
                data.mensaje || 'Paciente registrado correctamente.';

            formMessage.style.color = '#34775A';

            patientForm.reset();

        } catch (error) {
            formMessage.textContent = error.message;
            formMessage.style.color = '#B54747';

        } finally {
            button.disabled = false;
            button.textContent = 'Registrar paciente';
        }
    });
}
