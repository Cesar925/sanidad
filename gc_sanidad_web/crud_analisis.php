<?php
session_start();
if (empty($_SESSION['active'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

include_once '../conexion_grs_joya/conexion.php';
$conexion = conectar_sanidad();
if (!$conexion) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit();
}

$action = $_POST['action'] ?? '';
$nombre = trim($_POST['nombre'] ?? '');
$tipoMuestra = isset($_POST['tipoMuestra']) ? (int)$_POST['tipoMuestra'] : null;
$paqueteAnalisis = isset($_POST['paqueteAnalisis']) && $_POST['paqueteAnalisis'] !== '' ? (int)$_POST['paqueteAnalisis'] : null;
$codigo = isset($_POST['codigo']) ? (int)$_POST['codigo'] : null;

if (empty($nombre) && $action !== 'delete') {
    echo json_encode(['success' => false, 'message' => 'El nombre es obligatorio.']);
    exit();
}

if (!$tipoMuestra && $action !== 'delete') {
    echo json_encode(['success' => false, 'message' => 'Debe seleccionar un tipo de muestra.']);
    exit();
}

mysqli_begin_transaction($conexion);

try {
    if ($action === 'create') {
        // Verificar que el tipo de muestra existe
        $check = mysqli_prepare($conexion, "SELECT COUNT(*) AS cnt FROM com_tipo_muestra WHERE codigo = ?");
        mysqli_stmt_bind_param($check, "i", $tipoMuestra);
        mysqli_stmt_execute($check);
        $row = mysqli_stmt_get_result($check)->fetch_assoc();
        if ($row['cnt'] == 0) {
            throw new Exception('El tipo de muestra seleccionado no existe.');
        }

        // Verificar paquete de análisis si se proporcionó
        if ($paqueteAnalisis !== null) {
            $check2 = mysqli_prepare($conexion, "SELECT COUNT(*) AS cnt FROM com_paquetes_analisis WHERE codigo = ?");
            mysqli_stmt_bind_param($check2, "i", $paqueteAnalisis);
            mysqli_stmt_execute($check2);
            $row2 = mysqli_stmt_get_result($check2)->fetch_assoc();
            if ($row2['cnt'] == 0) {
                throw new Exception('El paquete de análisis seleccionado no existe.');
            }
        }

        $stmt = mysqli_prepare($conexion, "INSERT INTO com_analisis (nombre, tipoMuestra, PaqueteAnalisis) VALUES (?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "sii", $nombre, $tipoMuestra, $paqueteAnalisis);
        
    } elseif ($action === 'update') {
        if (!$codigo) throw new Exception('Código no válido.');

        // Verificar que el tipo de muestra existe
        $check = mysqli_prepare($conexion, "SELECT COUNT(*) AS cnt FROM com_tipo_muestra WHERE codigo = ?");
        mysqli_stmt_bind_param($check, "i", $tipoMuestra);
        mysqli_stmt_execute($check);
        $row = mysqli_stmt_get_result($check)->fetch_assoc();
        if ($row['cnt'] == 0) {
            throw new Exception('El tipo de muestra seleccionado no existe.');
        }

        // Verificar paquete de análisis si se proporcionó
        if ($paqueteAnalisis !== null) {
            $check2 = mysqli_prepare($conexion, "SELECT COUNT(*) AS cnt FROM com_paquetes_analisis WHERE codigo = ?");
            mysqli_stmt_bind_param($check2, "i", $paqueteAnalisis);
            mysqli_stmt_execute($check2);
            $row2 = mysqli_stmt_get_result($check2)->fetch_assoc();
            if ($row2['cnt'] == 0) {
                throw new Exception('El paquete de análisis seleccionado no existe.');
            }
        }

        $stmt = mysqli_prepare($conexion, "UPDATE com_analisis SET nombre = ?, tipoMuestra = ?, PaqueteAnalisis = ? WHERE codigo = ?");
        mysqli_stmt_bind_param($stmt, "siii", $nombre, $tipoMuestra, $paqueteAnalisis, $codigo);
        
    } elseif ($action === 'delete') {
        if (!$codigo) throw new Exception('Código no válido.');

        // Verificar si el análisis está en uso en detalles de muestra (campo JSON)
        // Nota: Esta verificación es compleja con JSON, se puede implementar según necesidad
        
        $stmt = mysqli_prepare($conexion, "DELETE FROM com_analisis WHERE codigo = ?");
        mysqli_stmt_bind_param($stmt, "i", $codigo);
        
    } else {
        throw new Exception('Acción no válida.');
    }

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception('Error en la base de datos: ' . mysqli_error($conexion));
    }

    mysqli_commit($conexion);
    
    $mensaje = '';
    switch ($action) {
        case 'create':
            $mensaje = '✅ Análisis creado correctamente.';
            break;
        case 'update':
            $mensaje = '✅ Análisis actualizado correctamente.';
            break;
        case 'delete':
            $mensaje = '✅ Análisis eliminado correctamente.';
            break;
    }
    
    echo json_encode(['success' => true, 'message' => $mensaje]);

} catch (Exception $e) {
    mysqli_rollback($conexion);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

mysqli_close($conexion);
?>
