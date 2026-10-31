
const appointmentsTableBody = document.getElementById('appointmentsTableBody')
const appointmentsMessage = document.getElementById('appointmentsMessage')

const searchAppointment = document.getElementById('searchAppointment')
const filterStatus = document.getElementById('filterStatus')
const refreshAppointments = document.getElementById('refreshAppointments')

let appointments = []

// =====================================
// CARGAR CITAS
// =====================================

async function loadAppointments() {
    appointmentsMessage.textContent = 'Cargando citas...'

    try {
        const data = await apiRequest('/appointments')

        appointments = Array.isArray(data) ? data : []

        updateSummary()
        renderAppointments()

        appointmentsMessage.textContent =
            appointments.length === 0
                ? 'Todavía no hay citas registradas.'
                : ''

    } catch (error) {
        appointmentsTableBody.innerHTML = `
            <tr>
                <td colspan="6">No se pudieron cargar las citas.</td>
            </tr>
        `

        appointmentsMessage.textContent =
            error.message || 'Ocurrió un error al cargar las citas.'
    }
}

// =====================================
// ACTUALIZAR RESUMEN
// =====================================

function updateSummary() {
    document.getElementById('totalAppointments').textContent =
        appointments.length

    document.getElementById('pendingAppointments').textContent =
        appointments.filter(cita => cita.estado === 'Pendiente').length

    document.getElementById('confirmedAppointments').textContent =
        appointments.filter(cita => cita.estado === 'Confirmada').length

    document.getElementById('completedAppointments').textContent =
        appointments.filter(cita => cita.estado === 'Completada').length
}

// =====================================
// FORMATEAR FECHA
// =====================================

function formatDate(date) {
    if (!date) return 'No disponible'

    const dateParts = String(date).slice(0, 10).split('-')

    if (dateParts.length !== 3) return 'No disponible'

    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
}

// =====================================
// CLASES DE ESTADO
// =====================================

function getStatusClass(status) {
    const classes = {
        Pendiente: 'status-pendiente',
        Confirmada: 'status-confirmada',
        Completada: 'status-completada',
        Cancelada: 'status-cancelada'
    }

    return classes[status] || ''
}

// =====================================
// MOSTRAR CITAS EN LA TABLA
// =====================================

function renderAppointments() {
    const search = searchAppointment.value.trim().toLowerCase()
    const status = filterStatus.value

    const filteredAppointments = appointments.filter(cita => {
        const patientName = cita.paciente
            ? `${cita.paciente.nombres} ${cita.paciente.apellidos}`.toLowerCase()
            : ''

        const matchesSearch = patientName.includes(search)
        const matchesStatus = !status || cita.estado === status

        return matchesSearch && matchesStatus
    })

    if (filteredAppointments.length === 0) {
        appointmentsTableBody.innerHTML = `
            <tr>
                <td colspan="6">No se encontraron citas.</td>
            </tr>
        `
        return
    }

    appointmentsTableBody.innerHTML = filteredAppointments.map(cita => {
        const patientName = cita.paciente
            ? `${cita.paciente.nombres} ${cita.paciente.apellidos}`
            : 'Paciente no disponible'

        const statusClass = getStatusClass(cita.estado)

        return `
            <tr>
                <td>${escapeHTML(patientName)}</td>

                <td>${formatDate(cita.fecha)}</td>

                <td>${escapeHTML(cita.hora || 'No disponible')}</td>

                <td>${escapeHTML(cita.motivo || 'No disponible')}</td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${escapeHTML(cita.estado || 'Sin estado')}
                    </span>
                </td>

                <td>
                    <div class="appointment-actions">

                        <button
                            type="button"
                            class="action-button view-button"
                            data-id="${escapeHTML(cita._id)}">
                            Ver
                        </button>

                        <button
                            type="button"
                            class="action-button edit-button"
                            data-id="${escapeHTML(cita._id)}">
                            Editar
                        </button>

                        <button
                            type="button"
                            class="action-button cancel-button"
                            data-id="${escapeHTML(cita._id)}"
                            ${cita.estado === 'Cancelada' ? 'disabled' : ''}>
                            Cancelar
                        </button>

                    </div>
                </td>
            </tr>
        `
    }).join('')
}

// =====================================
// PROTEGER TEXTO HTML
// =====================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }

        return entities[character]
    })
}

// =====================================
// CANCELAR CITA
// =====================================

async function cancelAppointment(id) {
    const confirmed = confirm(
        '¿Estás segura de que deseas cancelar esta cita?'
    )

    if (!confirmed) return

    try {
        const data = await apiRequest(`/appointments/${id}`, {
            method: 'DELETE'
        })

        appointmentsMessage.textContent =
            data.mensaje || 'Cita cancelada correctamente.'

        await loadAppointments()

    } catch (error) {
        appointmentsMessage.textContent =
            error.message || 'No se pudo cancelar la cita.'
    }
}

// =====================================
// EVENTOS DE LOS BOTONES
// =====================================

appointmentsTableBody.addEventListener('click', event => {
    const button = event.target.closest('button')

    if (!button) return

    const id = button.dataset.id

    if (!id) return

    if (button.classList.contains('view-button')) {
        window.location.href = `detalle-cita.html?id=${encodeURIComponent(id)}`
        return
    }

    if (button.classList.contains('edit-button')) {
        window.location.href = `editar-cita.html?id=${encodeURIComponent(id)}`
        return
    }

    if (
        button.classList.contains('cancel-button') &&
        !button.disabled
    ) {
        cancelAppointment(id)
    }
})

// =====================================
// FILTROS Y ACTUALIZACIÓN
// =====================================

searchAppointment.addEventListener('input', renderAppointments)

filterStatus.addEventListener('change', renderAppointments)

refreshAppointments.addEventListener('click', loadAppointments)

// =====================================
// INICIALIZAR
// =====================================

loadAppointments()
