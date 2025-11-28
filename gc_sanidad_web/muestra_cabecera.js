// muestra_cabecera.js - Gestión de Muestras Cabecera

function openMuestraCabeceraModal(action, codigoEnvio = null) {
    const modal = document.getElementById('muestraCabeceraModal');
    const title = document.getElementById('muestraCabeceraModalTitle');
    const form = document.getElementById('muestraCabeceraForm');

    if (action === 'create') {
        title.textContent = '➕ Nueva Cabecera de Muestra';
        document.getElementById('muestraCabeceraModalAction').value = 'create';
        document.getElementById('muestraCabeceraEditCodigo').value = '';
        document.getElementById('muestraCabeceraModalCodigo').value = '';
        document.getElementById('muestraCabeceraModalCodigo').readOnly = false;
        document.getElementById('muestraCabeceraModalFecha').value = '';
        document.getElementById('muestraCabeceraModalHora').value = '';
        document.getElementById('muestraCabeceraModalLaboratorio').value = '';
        document.getElementById('muestraCabeceraModalEmpTrans').value = '';
        document.getElementById('muestraCabeceraModalResponsable').value = '';
        document.getElementById('muestraCabeceraModalAutorizado').value = '';
    } else if (action === 'edit') {
        title.textContent = '✏️ Editar Cabecera de Muestra';
        document.getElementById('muestraCabeceraModalAction').value = 'update';
        document.getElementById('muestraCabeceraEditCodigo').value = codigoEnvio;
        document.getElementById('muestraCabeceraModalCodigo').readOnly = true;
        
        // Cargar datos de la muestra cabecera
        fetch('get_muestra_cabecera.php?codigoEnvio=' + encodeURIComponent(codigoEnvio))
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('muestraCabeceraModalCodigo').value = data.codigoEnvio;
                    document.getElementById('muestraCabeceraModalFecha').value = data.fechaEnvio;
                    document.getElementById('muestraCabeceraModalHora').value = data.horaEnvio;
                    document.getElementById('muestraCabeceraModalLaboratorio').value = data.laboratorio;
                    document.getElementById('muestraCabeceraModalEmpTrans').value = data.empTrans;
                    document.getElementById('muestraCabeceraModalResponsable').value = data.usuarioResponsable;
                    document.getElementById('muestraCabeceraModalAutorizado').value = data.autorizadoPor;
                } else {
                    alert('❌ Error al cargar datos: ' + data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error al cargar datos de la muestra.');
            });
    }

    modal.style.display = 'flex';
}

function closeMuestraCabeceraModal() {
    document.getElementById('muestraCabeceraModal').style.display = 'none';
}

function saveMuestraCabecera(event) {
    event.preventDefault();
    const action = document.getElementById('muestraCabeceraModalAction').value;
    const codigoEnvio = document.getElementById('muestraCabeceraModalCodigo').value.trim();
    const fechaEnvio = document.getElementById('muestraCabeceraModalFecha').value;
    const horaEnvio = document.getElementById('muestraCabeceraModalHora').value;
    const laboratorio = document.getElementById('muestraCabeceraModalLaboratorio').value;
    const empTrans = document.getElementById('muestraCabeceraModalEmpTrans').value;
    const usuarioResponsable = document.getElementById('muestraCabeceraModalResponsable').value.trim();
    const autorizadoPor = document.getElementById('muestraCabeceraModalAutorizado').value.trim();
    const codigoOriginal = document.getElementById('muestraCabeceraEditCodigo').value;

    if (!codigoEnvio || !fechaEnvio || !horaEnvio || !laboratorio || !empTrans || !usuarioResponsable || !autorizadoPor) {
        alert('⚠️ Todos los campos son obligatorios.');
        return false;
    }

    const params = { 
        action, 
        codigoEnvio, 
        fechaEnvio, 
        horaEnvio, 
        laboratorio, 
        empTrans, 
        usuarioResponsable, 
        autorizadoPor 
    };
    if (action === 'update') params.codigoOriginal = codigoOriginal;

    fetch('crud_muestra_cabecera.php', {
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

function confirmMuestraCabeceraDelete(codigoEnvio) {
    if (confirm('¿Está seguro de eliminar esta cabecera de muestra? Esta acción eliminará también todos los detalles asociados y no se puede deshacer.')) {
        fetch('crud_muestra_cabecera.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'delete',
                codigoEnvio: codigoEnvio
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

function viewMuestraDetalle(codigoEnvio) {
    // Cambiar a la vista de detalle y filtrar por código de envío
    showView('MuestraDetalle');
    setTimeout(() => {
        const filtro = document.getElementById('filtroCodigoEnvio');
        if (filtro) {
            filtro.value = codigoEnvio;
            filtrarMuestraDetalle();
        }
    }, 100);
}
