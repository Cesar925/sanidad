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

$codigo = isset($_GET['codigo']) ? (int)$_GET['codigo'] : 0;

if ($codigo <= 0) {
    echo json_encode(['success' => false, 'message' => 'Código no válido']);
    exit();
}

try {
    $stmt = mysqli_prepare($conexion, "SELECT codigo, nombre, tipoMuestra FROM com_paquetes_analisis WHERE codigo = ?");
    mysqli_stmt_bind_param($stmt, "i", $codigo);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if ($row = mysqli_fetch_assoc($result)) {
        echo json_encode([
            'success' => true,
            'codigo' => $row['codigo'],
            'nombre' => $row['nombre'],
            'tipoMuestra' => $row['tipoMuestra']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Paquete no encontrado']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

mysqli_close($conexion);
?>
