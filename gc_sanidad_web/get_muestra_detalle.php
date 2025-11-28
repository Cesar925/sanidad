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
$posicion = isset($_GET['posicion']) ? (int)$_GET['posicion'] : 0;

if (empty($codigoEnvio) || $posicion <= 0) {
    echo json_encode(['success' => false, 'message' => 'Código de envío o posición no válidos']);
    exit();
}

try {
    $stmt = mysqli_prepare($conexion, 
        "SELECT codigoEnvio, posicionSolicitud, fechaToma, codigoReferencia, numeroMuestras, observaciones 
        FROM com_db_muestra_detalle WHERE codigoEnvio = ? AND posicionSolicitud = ?");
    mysqli_stmt_bind_param($stmt, "si", $codigoEnvio, $posicion);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if ($row = mysqli_fetch_assoc($result)) {
        echo json_encode([
            'success' => true,
            'codigoEnvio' => $row['codigoEnvio'],
            'posicionSolicitud' => $row['posicionSolicitud'],
            'fechaToma' => $row['fechaToma'],
            'codigoReferencia' => $row['codigoReferencia'],
            'numeroMuestras' => $row['numeroMuestras'],
            'observaciones' => $row['observaciones']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Detalle de muestra no encontrado']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

mysqli_close($conexion);
?>
