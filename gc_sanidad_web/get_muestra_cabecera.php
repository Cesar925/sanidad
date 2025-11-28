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

$codigoEnvio = $_GET['codigoEnvio'] ?? '';

if (empty($codigoEnvio)) {
    echo json_encode(['success' => false, 'message' => 'Código de envío no válido']);
    exit();
}

try {
    $stmt = mysqli_prepare($conexion, 
        "SELECT codigoEnvio, fechaEnvio, horaEnvio, laboratorio, empTrans, usuarioResponsable, autorizadoPor 
        FROM com_db_muestra_cabecera WHERE codigoEnvio = ?");
    mysqli_stmt_bind_param($stmt, "s", $codigoEnvio);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if ($row = mysqli_fetch_assoc($result)) {
        echo json_encode([
            'success' => true,
            'codigoEnvio' => $row['codigoEnvio'],
            'fechaEnvio' => $row['fechaEnvio'],
            'horaEnvio' => $row['horaEnvio'],
            'laboratorio' => $row['laboratorio'],
            'empTrans' => $row['empTrans'],
            'usuarioResponsable' => $row['usuarioResponsable'],
            'autorizadoPor' => $row['autorizadoPor']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Cabecera de muestra no encontrada']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

mysqli_close($conexion);
?>
