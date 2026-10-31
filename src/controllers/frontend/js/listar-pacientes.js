
const patientsTableBody = document.getElementById('patientsTableBody');
const patientsMessage = document.getElementById('patientsMessage');

// Verificar que el usuario haya iniciado sesión
const token = sessionStorage.getItem('cardiocita_token');

if (!token) {
    window.location.href = 'login.html';
}

// Obtener y mostrar los pacientes
async function cargarPacientes() {
    patientsTableBody.innerHTML = `
        <tr>
            <td colspan="6">Cargando pacientes...</td>
        </tr>
    `;

    try {
        const pacientes = await apiRequest('/patients');

        patientsTableBody.innerHTML = '';

        if (!Array.isArray(pacientes) || pacientes.length === 0) {
            patientsTableBody.innerHTML = `
                <tr>
                    <td colspan="6">No hay pacientes registrados.</td>
                </tr>
            `;
            return;
        }

        pacientes.forEach((paciente) => {
            const fila = document.createElement('tr');

            const nombreCompleto =
                `${paciente.nombres} ${paciente.apellidos}`;

            const valores = [
                paciente.cedula,
                nombreCompleto,
                paciente.edad,
                paciente.sexo,
                paciente.tipoEnfermedad
            ];

            valores.forEach((valor) => {
                const celda = document.createElement('td');
                celda.textContent = valor ?? '';
                fila.appendChild(celda);
            });

            const acciones = document.createElement('td');

            const botonVer = document.createElement('button');
            botonVer.type = 'button';
            botonVer.textContent = 'Ver';

            botonVer.addEventListener('click', () => {
    window.location.href =
        `detalle-paciente.html?id=${paciente._id}`;
});

            acciones.appendChild(botonVer);
            fila.appendChild(acciones);

            patientsTableBody.appendChild(fila);
        });

    } catch (error) {
        patientsTableBody.innerHTML = `
            <tr>
                <td colspan="6">No se pudieron cargar los pacientes.</td>
            </tr>
        `;

        patientsMessage.textContent = error.message;
        patientsMessage.style.color = '#B54747';
    }
}

// Ejecutar la consulta al abrir la página
cargarPacientes();
