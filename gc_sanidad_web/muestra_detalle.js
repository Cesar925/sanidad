// muestra_detalle.js - Gestión de Muestras Detalle

function openMuestraDetalleModal(action, codigoEnvio = null, posicion = null) {
    const modal = document.getElementById('muestraDetalleModal');
    const title = document.getElementById('muestraDetalleModalTitle');
    const form = document.getElementById('muestraDetalleForm');

    if (action === 'create') {
        title.textContent = '➕ Nuevo Detalle de Muestra';
        document.getElementById('muestraDetalleModalAction').value = 'create';
        document.getElementById('muestraDetalleEditCodigo').value = '';
        document.getElementById('muestraDetalleEditPosicion').value = '';
        document.getElementById('muestraDetalleModalCodigoEnvio').disabled = false;
        document.getElementById('muestraDetalleModalPosicion').readOnly = false;
        document.getElementById('muestraDetalleModalCodigoEnvio').value = '';
        document.getElementById('muestraDetalleModalPosicion').value = '';
        document.getElementById('muestraDetalleModalFechaToma').value = '';
        document.getElementById('muestraDetalleModalCodigoRef').value = '';
        document.getElementById('muestraDetalleModalNumMuestras').value = '';
        document.getElementById('muestraDetalleModalObservaciones').value = '';
    } else if (action === 'edit') {
        title.textContent = '✏️ Editar Detalle de Muestra';
        document.getElementById('muestraDetalleModalAction').value = 'update';
        document.getElementById('muestraDetalleEditCodigo').value = codigoEnvio;
        document.getElementById('muestraDetalleEditPosicion').value = posicion;
        document.getElementById('muestraDetalleModalCodigoEnvio').disabled = true;
        document.getElementById('muestraDetalleModalPosicion').readOnly = true;
        
        // Cargar datos del detalle de muestra
        fetch('get_muestra_detalle.php?codigoEnvio=' + encodeURIComponent(codigoEnvio) + '&posicion=' + posicion)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('muestraDetalleModalCodigoEnvio').value = data.codigoEnvio;
                    document.getElementById('muestraDetalleModalPosicion').value = data.posicionSolicitud;
                    document.getElementById('muestraDetalleModalFechaToma').value = data.fechaToma;
                    document.getElementById('muestraDetalleModalCodigoRef').value = data.codigoReferencia;
                    document.getElementById('muestraDetalleModalNumMuestras').value = data.numeroMuestras;
                    document.getElementById('muestraDetalleModalObservaciones').value = data.observaciones || '';
                } else {
                    alert('❌ Error al cargar datos: ' + data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error al cargar datos del detalle.');
            });
    }

    modal.style.display = 'flex';
}

function closeMuestraDetalleModal() {
    document.getElementById('muestraDetalleModal').style.display = 'none';
}

function saveMuestraDetalle(event) {
    event.preventDefault();
    const action = document.getElementById('muestraDetalleModalAction').value;
    const codigoEnvio = document.getElementById('muestraDetalleModalCodigoEnvio').value;
    const posicionSolicitud = document.getElementById('muestraDetalleModalPosicion').value;
    const fechaToma = document.getElementById('muestraDetalleModalFechaToma').value;
    const codigoReferencia = document.getElementById('muestraDetalleModalCodigoRef').value.trim();
    const numeroMuestras = document.getElementById('muestraDetalleModalNumMuestras').value;
    const observaciones = document.getElementById('muestraDetalleModalObservaciones').value.trim();
    const codigoOriginal = document.getElementById('muestraDetalleEditCodigo').value;
    const posicionOriginal = document.getElementById('muestraDetalleEditPosicion').value;

    if (!codigoEnvio || !posicionSolicitud || !fechaToma || !codigoReferencia || !numeroMuestras) {
        alert('⚠️ Todos los campos obligatorios deben ser completados.');
        return false;
    }

    const params = { 
        action, 
        codigoEnvio, 
        posicionSolicitud, 
        fechaToma, 
        codigoReferencia, 
        numeroMuestras, 
        observaciones 
    };
    if (action === 'update') {
        params.codigoOriginal = codigoOriginal;
        params.posicionOriginal = posicionOriginal;
    }

    fetch('crud_muestra_detalle.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(params)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert('❌ ' + data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error al guardar.');
    });

    return false;
}

function confirmMuestraDetalleDelete(codigoEnvio, posicion) {
    if (confirm('¿Está seguro de eliminar este detalle de muestra? Esta acción no se puede deshacer.')) {
        fetch('crud_muestra_detalle.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'delete',
                codigoEnvio: codigoEnvio,
                posicionSolicitud: posicion
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload();
            } else {
                alert('❌ ' + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error al eliminar.');
        });
    }
}

function filtrarMuestraDetalle() {
    const filtro = document.getElementById('filtroCodigoEnvio').value;
    const filas = document.querySelectorAll('#muestraDetalleTableBody tr');
    
    filas.forEach(fila => {
        const codigoEnvio = fila.getAttribute('data-codigo-envio');
        if (!filtro || codigoEnvio === filtro) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function viewAnalisisDetalle(codigoEnvio, posicion) {
    // Función placeholder para ver análisis asociados a un detalle
    alert('Vista de análisis para: ' + codigoEnvio + ' - Posición: ' + posicion);
    // Aquí se podría implementar una vista modal con los análisis
}
