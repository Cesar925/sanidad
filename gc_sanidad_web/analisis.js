// analisis.js - Gestión de Análisis

function openAnalisisModal(action, codigo = null) {
    const modal = document.getElementById('analisisModal');
    const title = document.getElementById('analisisModalTitle');
    const form = document.getElementById('analisisForm');

    if (action === 'create') {
        title.textContent = '➕ Nuevo Análisis';
        document.getElementById('analisisModalAction').value = 'create';
        document.getElementById('analisisEditCodigo').value = '';
        document.getElementById('analisisModalNombre').value = '';
        document.getElementById('analisisModalTipoMuestra').value = '';
        document.getElementById('analisisModalPaquete').value = '';
    } else if (action === 'edit') {
        title.textContent = '✏️ Editar Análisis';
        document.getElementById('analisisModalAction').value = 'update';
        document.getElementById('analisisEditCodigo').value = codigo;
        
        // Cargar datos del análisis
        fetch('get_analisis.php?codigo=' + codigo)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('analisisModalNombre').value = data.nombre;
                    document.getElementById('analisisModalTipoMuestra').value = data.tipoMuestra;
                    document.getElementById('analisisModalPaquete').value = data.PaqueteAnalisis || '';
                } else {
                    alert('❌ Error al cargar datos: ' + data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error al cargar datos del análisis.');
            });
    }

    modal.style.display = 'flex';
}

function closeAnalisisModal() {
    document.getElementById('analisisModal').style.display = 'none';
}

function saveAnalisis(event) {
    event.preventDefault();
    const action = document.getElementById('analisisModalAction').value;
    const nombre = document.getElementById('analisisModalNombre').value.trim();
    const tipoMuestra = document.getElementById('analisisModalTipoMuestra').value;
    const paqueteAnalisis = document.getElementById('analisisModalPaquete').value;
    const codigo = document.getElementById('analisisEditCodigo').value;

    if (!nombre) {
        alert('⚠️ El nombre es obligatorio.');
        return false;
    }

    if (!tipoMuestra) {
        alert('⚠️ Debe seleccionar un tipo de muestra.');
        return false;
    }

    const params = { action, nombre, tipoMuestra };
    if (paqueteAnalisis) params.paqueteAnalisis = paqueteAnalisis;
    if (action === 'update') params.codigo = codigo;

    fetch('crud_analisis.php', {
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

function confirmAnalisisDelete(codigo) {
    if (confirm('¿Está seguro de eliminar este análisis? Esta acción no se puede deshacer.')) {
        fetch('crud_analisis.php', {
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
