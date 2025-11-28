// tipo_muestra.js - Gestión de Tipos de Muestra

function openTipoMuestraModal(action, codigo = null, nombre = '', descripcion = '', longitud = 8) {
    const modal = document.getElementById('tipoMuestraModal');
    const title = document.getElementById('tipoMuestraModalTitle');
    const form = document.getElementById('tipoMuestraForm');

    if (action === 'create') {
        title.textContent = '➕ Nuevo Tipo de Muestra';
        document.getElementById('tipoMuestraModalAction').value = 'create';
        document.getElementById('tipoMuestraEditCodigo').value = '';
        document.getElementById('tipoMuestraModalNombre').value = '';
        document.getElementById('tipoMuestraModalDescripcion').value = '';
        document.getElementById('tipoMuestraModalLongitud').value = 8;
    } else if (action === 'edit') {
        title.textContent = '✏️ Editar Tipo de Muestra';
        document.getElementById('tipoMuestraModalAction').value = 'update';
        document.getElementById('tipoMuestraEditCodigo').value = codigo;
        document.getElementById('tipoMuestraModalNombre').value = nombre;
        document.getElementById('tipoMuestraModalDescripcion').value = descripcion;
        document.getElementById('tipoMuestraModalLongitud').value = longitud;
    }

    modal.style.display = 'flex';
}

function closeTipoMuestraModal() {
    document.getElementById('tipoMuestraModal').style.display = 'none';
}

function saveTipoMuestra(event) {
    event.preventDefault();
    const action = document.getElementById('tipoMuestraModalAction').value;
    const nombre = document.getElementById('tipoMuestraModalNombre').value.trim();
    const descripcion = document.getElementById('tipoMuestraModalDescripcion').value.trim();
    const longitud = document.getElementById('tipoMuestraModalLongitud').value;
    const codigo = document.getElementById('tipoMuestraEditCodigo').value;

    if (!nombre) {
        alert('⚠️ El nombre es obligatorio.');
        return false;
    }

    if (!longitud || longitud < 1 || longitud > 20) {
        alert('⚠️ La longitud de código debe estar entre 1 y 20.');
        return false;
    }

    const params = { action, nombre, descripcion, longitud_codigo: longitud };
    if (action === 'update') params.codigo = codigo;

    fetch('crud_tipo_muestra.php', {
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

function confirmTipoMuestraDelete(codigo) {
    if (confirm('¿Está seguro de eliminar este tipo de muestra? Esta acción no se puede deshacer y puede afectar a otros registros relacionados.')) {
        fetch('crud_tipo_muestra.php', {
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
