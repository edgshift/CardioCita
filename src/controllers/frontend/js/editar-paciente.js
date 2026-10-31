const editPatientForm = document.getElementById('editPatientForm');
const formMessage = document.getElementById('formMessage');

// Verificar sesión
const token = sessionStorage.getItem('cardiocita_token');

if (!token) {
    window.location.href = 'login.html';
}

// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const patientId = params.get('id');

// Verificar que exista el ID
if (!patientId) {
    formMessage.textContent = 'No se encontró el paciente que desea editar.';
    formMessage.style.color = '#B54747';
} else {
    cargarPaciente(patientId);
}

// Evitar fechas futuras
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

// Cargar datos actuales del paciente
async function cargarPaciente(id) {
    try {
        const data = await apiRequest(`/patients/${id}`);

        const paciente = data.paciente || data;

        document.getElementById('nombres').value =
            paciente.nombres || '';

        document.getElementById('apellidos').value =
            paciente.apellidos || '';

        document.getElementById('cedula').value =
            paciente.cedula || '';

        document.getElementById('edad').value =
            paciente.edad ?? '';

        document.getElementById('sexo').value =
            paciente.sexo || '';

        document.getElementById('tipoEnfermedad').value =
            paciente.tipoEnfermedad || '';

        if (paciente.fechaNacimiento) {
            const fecha = new Date(paciente.fechaNacimiento);

            const year = fecha.getFullYear();
            const month = String(fecha.getMonth() + 1).padStart(2, '0');
            const day = String(fecha.getDate()).padStart(2, '0');

            document.getElementById('fechaNacimiento').value =
                `${year}-${month}-${day}`;
        }

    } catch (error) {
        formMessage.textContent =
            error.message || 'No se pudo cargar el paciente.';

        formMessage.style.color = '#B54747';
    }
}

// Guardar cambios
if (editPatientForm) {
    editPatientForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        formMessage.textContent = '';
        formMessage.style.color = '';

        const formData = new FormData(editPatientForm);

        const paciente = {
            nombres: formData.get('nombres').trim(),
            apellidos: formData.get('apellidos').trim(),
            edad: Number(formData.get('edad')),
            cedula: formData.get('cedula').trim(),
            sexo: formData.get('sexo'),
            tipoEnfermedad: formData.get('tipoEnfermedad')
        };

        const fecha = formData.get('fechaNacimiento');

        if (fecha) {
            paciente.fechaNacimiento = fecha;
        }

        const button = editPatientForm.querySelector(
            'button[type="submit"]'
        );

        button.disabled = true;
        button.textContent = 'Guardando...';

        try {
            const data = await apiRequest(`/patients/${patientId}`, {
                method: 'PUT',
                body: JSON.stringify(paciente)
            });

            formMessage.textContent =
                data.mensaje || 'Paciente actualizado correctamente.';

            formMessage.style.color = '#34775A';

            setTimeout(() => {
                window.location.href =
                    `detalle-paciente.html?id=${patientId}`;
            }, 1000);

        } catch (error) {
            formMessage.textContent = error.message;
            formMessage.style.color = '#B54747';

        } finally {
            button.disabled = false;
            button.textContent = 'Guardar cambios';
        }
    });
}