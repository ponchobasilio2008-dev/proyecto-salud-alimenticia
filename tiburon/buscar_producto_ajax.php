<?php
// ==========================================================
// BUSCAR_PRODUCTO_AJAX.PHP - BÚSQUEDA DINÁMICA
// ==========================================================
require 'db_config.php';

header('Content-Type: application/json');

if (isset($_GET['query'])) {
    $query = '%' . $conn->real_escape_string($_GET['query']) . '%';
    
    // Consulta para buscar productos por nombre
    $stmt = $conn->prepare("SELECT id, nombre, precio_actual, unidad_base, stock_base FROM productos WHERE nombre LIKE ? LIMIT 10");
    $stmt->bind_param("s", $query);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $productos = [];
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $productos[] = [
                'id' => $row['id'],
                'nombre' => $row['nombre'],
                'precio' => floatval($row['precio_actual']),
                'unidad' => $row['unidad_base'],
                'stock' => floatval($row['stock_base'])
            ];
        }
    }
    
    echo json_encode($productos);
    
    $stmt->close();
} else {
    echo json_encode([]);
}

$conn->close();
?>