// paquete_analisis.js - Gestión de Paquetes de Análisis

function openPaqueteAnalisisModal(action, codigo = null) {
    const modal = document.getElementById('paqueteAnalisisModal');
    const title = document.getElementById('paqueteAnalisisModalTitle');
    const form = document.getElementById('paqueteAnalisisForm');

    if (action === 'create') {
        title.textContent = '➕ Nuevo Paquete de Análisis';
        document.getElementById('paqueteAnalisisModalAction').value = 'create';
        document.getElementById('paqueteAnalisisEditCodigo').value = '';
        document.getElementById('paqueteAnalisisModalNombre').value = '';
        document.getElementById('paqueteAnalisisModalTipoMuestra').value = '';
    } else if (action === 'edit') {
        title.textContent = '✏️ Editar Paquete de Análisis';
        document.getElementById('paqueteAnalisisModalAction').value = 'update';
        document.getElementById('paqueteAnalisisEditCodigo').value = codigo;
        
        // Cargar datos del paquete
        fetch('get_paquete_analisis.php?codigo=' + codigo)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('paqueteAnalisisModalNombre').value = data.nombre;
                    document.getElementById('paqueteAnalisisModalTipoMuestra').value = data.tipoMuestra;
                } else {
                    alert('❌ Error al cargar datos: ' + data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error al cargar datos del paquete.');
            });
    }

    modal.style.display = 'flex';
}

function closePaqueteAnalisisModal() {
    document.getElementById('paqueteAnalisisModal').style.display = 'none';
}

function savePaqueteAnalisis(event) {
    event.preventDefault();
    const action = document.getElementById('paqueteAnalisisModalAction').value;
    const nombre = document.getElementById('paqueteAnalisisModalNombre').value.trim();
    const tipoMuestra = document.getElementById('paqueteAnalisisModalTipoMuestra').value;
    const codigo = document.getElementById('paqueteAnalisisEditCodigo').value;

    if (!nombre) {
        alert('⚠️ El nombre es obligatorio.');
        return false;
    }

    if (!tipoMuestra) {
        alert('⚠️ Debe seleccionar un tipo de muestra.');
        return false;
    }

    const params = { action, nombre, tipoMuestra };
    if (action === 'update') params.codigo = codigo;

    fetch('crud_paquete_analisis.php', {
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

function confirmPaqueteAnalisisDelete(codigo) {
    if (confirm('¿Está seguro de eliminar este paquete de análisis? Esta acción no se puede deshacer.')) {
        fetch('crud_paquete_analisis.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'delete',
                codigo: codigo
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
