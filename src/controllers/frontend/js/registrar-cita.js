
const appointmentForm = document.getElementById('appointmentForm')
const patientSelect = document.getElementById('paciente')
const appointmentMessage = document.getElementById('appointmentMessage')
const saveButton = document.getElementById('saveAppointmentButton')
const dateInput = document.getElementById('fecha')

// Evitar seleccionar fechas pasadas.
const today = new Date()
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().slice(0, 10)

dateInput.min = localToday

// Cargar pacientes registrados.
async function loadPatients() {
    try {
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

        if (patients.length === 0) {
            appointmentMessage.textContent =
                'No hay pacientes registrados. Registra un paciente antes de programar una cita.'
        }

    } catch (error) {
        appointmentMessage.textContent =
            error.message || 'No se pudieron cargar los pacientes.'
    }
}

// Registrar cita.
appointmentForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    appointmentMessage.textContent = ''

    const appointment = {
        paciente: patientSelect.value,
        fecha: dateInput.value,
        hora: document.getElementById('hora').value,
        motivo: document.getElementById('motivo').value.trim()
    }

    if (
        !appointment.paciente ||
        !appointment.fecha ||
        !appointment.hora ||
        !appointment.motivo
    ) {
        appointmentMessage.textContent =
            'Completa todos los campos obligatorios.'
        return
    }

    saveButton.disabled = true
    saveButton.textContent = 'Guardando...'

    try {
        const data = await apiRequest('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointment)
        })

        appointmentMessage.style.color = '#34775A'
        appointmentMessage.textContent =
            data.mensaje || 'Cita registrada correctamente.'

        appointmentForm.reset()
        dateInput.min = localToday

        setTimeout(() => {
            window.location.href = 'citas.html'
        }, 1200)

    } catch (error) {
        appointmentMessage.style.color = '#B54747'
        appointmentMessage.textContent = error.message
    } finally {
        saveButton.disabled = false
        saveButton.textContent = 'Registrar cita'
    }
})

loadPatients()
