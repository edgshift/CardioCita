
const detailPatient = document.getElementById('detailPatient')
const detailCedula = document.getElementById('detailCedula')
const detailDate = document.getElementById('detailDate')
const detailTime = document.getElementById('detailTime')
const detailReason = document.getElementById('detailReason')
const appointmentStatus = document.getElementById('appointmentStatus')
const detailMessage = document.getElementById('detailAppointmentMessage')
const editButton = document.getElementById('editAppointmentButton')

// Obtener el ID desde la URL.
const params = new URLSearchParams(window.location.search)
const appointmentId = params.get('id')

function formatAppointmentDate(date) {
    if (!date) return 'No disponible'

    const parts = String(date).slice(0, 10).split('-')

    if (parts.length !== 3) return 'No disponible'

    return `${parts[2]}/${parts[1]}/${parts[0]}`
}

function getStatusClass(status) {
    const classes = {
        Pendiente: 'status-pendiente',
        Confirmada: 'status-confirmada',
        Completada: 'status-completada',
        Cancelada: 'status-cancelada'
    }

    return classes[status] || ''
}

async function loadAppointmentDetail() {
    if (!appointmentId) {
        detailMessage.textContent = 'No se especificó una cita.'
        return
    }

    try {
        const data = await apiRequest(`/appointments/${appointmentId}`)
        const appointment = data.cita || data
        const patient = appointment.paciente

        detailPatient.textContent = patient
            ? `${patient.nombres} ${patient.apellidos}`
            : 'No disponible'

        detailCedula.textContent = patient?.cedula || 'No disponible'
        detailDate.textContent = formatAppointmentDate(appointment.fecha)
        detailTime.textContent = appointment.hora || 'No disponible'
        detailReason.textContent = appointment.motivo || 'No disponible'

        appointmentStatus.textContent = appointment.estado || 'Sin estado'
        appointmentStatus.className =
            `status-badge ${getStatusClass(appointment.estado)}`

        editButton.disabled = false
        editButton.addEventListener('click', () => {
            window.location.href = `editar-cita.html?id=${appointmentId}`
        })

    } catch (error) {
        detailMessage.textContent =
            error.message || 'No se pudo cargar la información de la cita.'

        detailPatient.textContent = 'No disponible'
        detailCedula.textContent = 'No disponible'
        detailDate.textContent = 'No disponible'
        detailTime.textContent = 'No disponible'
        detailReason.textContent = 'No disponible'
        appointmentStatus.textContent = 'No disponible'
    }
}

loadAppointmentDetail()
