
async function apiRequest(endpoint, options = {}) {
    const token = sessionStorage.getItem('cardiocita_token');

    const headers = {
        ...options.headers
    };

    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errores?.join(', ') ||
            data.mensaje ||
            'Ocurrió un error en la solicitud'
        );
    }

    return data;
}
