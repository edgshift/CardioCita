
const editAppointmentForm = document.getElementById('editAppointmentForm')
const patientSelect = document.getElementById('paciente')
const dateInput = document.getElementById('fecha')
const timeInput = document.getElementById('hora')
const reasonInput = document.getElementById('motivo')
const statusSelect = document.getElementById('estado')

const message = document.getElementById('editAppointmentMessage')
const updateButton = document.getElementById('updateAppointmentButton')

const params = new URLSearchParams(window.location.search)
const appointmentId = params.get('id')

let currentAppointment = null

// Establecer la fecha mínima permitida.
const today = new Date()
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().slice(0, 10)

dateInput.min = localToday

// Cargar pacientes registrados.
async function loadPatients() {
    const data = await apiRequest('/patients')
    const patients = Array.isArray(data) ? data : []

    patientSelect.innerHTML =
        '<option value="">Seleccionar paciente</option>'

    patients.forEach(patient => {
        const option = document.createElement('option')
        option.value = patient._id
        option.textContent =
            `${patient.nombres} ${patient.apellidos} - ${patient.cedula}`

        patientSelect.appendChild(option)
    })
}

// Convertir fecha al formato que necesita el input date.
function formatDateForInput(date) {
    if (!date) return ''

    return String(date).slice(0, 10)
}

// Cargar información de la cita.
async function loadAppointment() {
    if (!appointmentId) {
        throw new Error('No se especificó una cita para editar.')
    }

    const data = await apiRequest(`/appointments/${appointmentId}`)
    const appointment = data.cita || data

    currentAppointment = appointment

    patientSelect.value = appointment.paciente?._id || appointment.paciente || ''
    dateInput.value = formatDateForInput(appointment.fecha)
    timeInput.value = appointment.hora || ''
    reasonInput.value = appointment.motivo || ''
    statusSelect.value = appointment.estado || 'Pendiente'
}

// Cargar los datos necesarios para editar.
async function initializeEditPage() {
    updateButton.disabled = true
    message.textContent = 'Cargando información de la cita...'

    try {
        await loadPatients()
        await loadAppointment()

        message.textContent = ''
        updateButton.disabled = false

    } catch (error) {
        message.textContent =
            error.message || 'No se pudo cargar la información.'

        updateButton.disabled = true
    }
}

// Guardar cambios.
editAppointmentForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!currentAppointment || !appointmentId) return

    message.textContent = ''

    const updatedAppointment = {
        paciente: patientSelect.value,
        fecha: dateInput.value,
        hora: timeInput.value,
        motivo: reasonInput.value.trim(),
        estado: statusSelect.value
    }

    if (
        !updatedAppointment.paciente ||
        !updatedAppointment.fecha ||
        !updatedAppointment.hora ||
        !updatedAppointment.motivo ||
        !updatedAppointment.estado
    ) {
        message.textContent = 'Completa todos los campos obligatorios.'
        return
    }

    updateButton.disabled = true
    updateButton.textContent = 'Guardando...'

    try {
        const data = await apiRequest(`/appointments/${appointmentId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedAppointment)
        })

        message.style.color = '#34775A'
        message.textContent =
            data.mensaje || 'Cita actualizada correctamente.'

        setTimeout(() => {
            window.location.href = 'citas.html'
        }, 1200)

    } catch (error) {
        message.style.color = '#B54747'
        message.textContent =
            error.message || 'No se pudieron guardar los cambios.'

    } finally {
        updateButton.disabled = false
        updateButton.textContent = 'Guardar cambios'
    }
})

initializeEditPage()
