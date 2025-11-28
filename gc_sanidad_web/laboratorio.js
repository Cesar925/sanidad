// laboratorio.js - Gestión de Laboratorios

function openLaboratorioModal(action, codigo = null, nombre = '') {
    const modal = document.getElementById('laboratorioModal');
    const title = document.getElementById('laboratorioModalTitle');
    const form = document.getElementById('laboratorioForm');

    if (action === 'create') {
        title.textContent = '➕ Nuevo Laboratorio';
        document.getElementById('laboratorioModalAction').value = 'create';
        document.getElementById('laboratorioEditCodigo').value = '';
        document.getElementById('laboratorioModalNombre').value = '';
    } else if (action === 'edit') {
        title.textContent = '✏️ Editar Laboratorio';
        document.getElementById('laboratorioModalAction').value = 'update';
        document.getElementById('laboratorioEditCodigo').value = codigo;
        document.getElementById('laboratorioModalNombre').value = nombre;
    }

    modal.style.display = 'flex';
}

function closeLaboratorioModal() {
    document.getElementById('laboratorioModal').style.display = 'none';
}

function saveLaboratorio(event) {
    event.preventDefault();
    const action = document.getElementById('laboratorioModalAction').value;
    const nombre = document.getElementById('laboratorioModalNombre').value.trim();
    const codigo = document.getElementById('laboratorioEditCodigo').value;

    if (!nombre) {
        alert('⚠️ El nombre es obligatorio.');
        return false;
    }

    const params = { action, nombre };
    if (action === 'update') params.codigo = codigo;

    fetch('crud_laboratorio.php', {
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

function confirmLaboratorioDelete(codigo) {
    if (confirm('¿Está seguro de eliminar este laboratorio? Esta acción no se puede deshacer.')) {
        fetch('crud_laboratorio.php', {
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
