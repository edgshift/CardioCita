const patientMessage = document.getElementById('patientMessage');

// Verificar que exista una sesión
const token = sessionStorage.getItem('cardiocita_token');

if (!token) {
    window.location.href = 'login.html';
}

// Obtener el ID del paciente desde la URL
const params = new URLSearchParams(window.location.search);
const patientId = params.get('id');

// Verificar que exista un ID
if (!patientId) {
    patientMessage.textContent = 'No se encontró el paciente solicitado.';
    patientMessage.style.color = '#B54747';
} else {
    cargarPaciente(patientId);
}

// Obtener paciente desde el backend
async function cargarPaciente(id) {
    try {
        const data = await apiRequest(`/patients/${id}`);

        const paciente = data.paciente || data;

        document.getElementById('nombres').textContent =
            paciente.nombres || '';

        document.getElementById('apellidos').textContent =
            paciente.apellidos || '';

        document.getElementById('cedula').textContent =
            paciente.cedula || '';

        document.getElementById('edad').textContent =
            paciente.edad ?? '';

        document.getElementById('sexo').textContent =
            paciente.sexo || '';

        document.getElementById('tipoEnfermedad').textContent =
            paciente.tipoEnfermedad || '';

        if (paciente.fechaNacimiento) {
            const fecha = new Date(paciente.fechaNacimiento);

            document.getElementById('fechaNacimiento').textContent =
                fecha.toLocaleDateString('es-DO');
        }

    } catch (error) {
        patientMessage.textContent =
            error.message || 'No se pudo cargar el paciente.';

        patientMessage.style.color = '#B54747';
    }
}

const editButton = document.getElementById('editButton');

if (editButton && patientId) {
    editButton.addEventListener('click', () => {
        window.location.href =
            `editar-paciente.html?id=${patientId}`;
    });
}

const deleteButton = document.getElementById('deleteButton');

if (deleteButton && patientId) {
    deleteButton.addEventListener('click', async () => {

        const confirmar = confirm(
            '¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer.'
        );

        if (!confirmar) {
            return;
        }

        deleteButton.disabled = true;
        deleteButton.textContent = 'Eliminando...';

        try {
            const data = await apiRequest(`/patients/${patientId}`, {
                method: 'DELETE'
            });

            alert(
                data.mensaje || 'Paciente eliminado correctamente.'
            );

            window.location.href = 'pacientes.html';

        } catch (error) {
            alert(
                error.message || 'No se pudo eliminar el paciente.'
            );

            deleteButton.disabled = false;
            deleteButton.textContent = 'Eliminar paciente';
        }
    });
}
