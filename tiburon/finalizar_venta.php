<?php
// ==========================================================
// FINALIZAR_VENTA.PHP - LÓGICA DE TRANSACCIÓN Y STOCK
// ==========================================================
require 'db_config.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
    exit();
}

// Recibir y decodificar los datos JSON del carrito
$data = json_decode(file_get_contents("php://input"), true);
$carrito = $data['carrito'] ?? [];
$total_venta = $data['total_final'] ?? 0.00;

if (empty($carrito)) {
    echo json_encode(["status" => "error", "message" => "El carrito de ventas está vacío."]);
    exit();
}

// ----------------------------------------------------------
// INICIO DE LA TRANSACCIÓN SQL
// ----------------------------------------------------------
$conn->begin_transaction();
$id_cajero = 1; // Asumimos ID 1 para el cajero (del usuario de prueba insertado)

try {
    // 1. INSERTAR EN LA TABLA VENTAS (Cabecera)
    $stmt_venta = $conn->prepare("INSERT INTO ventas (fecha_hora, id_cajero, total_venta) VALUES (NOW(), ?, ?)");
    $stmt_venta->bind_param("id", $id_cajero, $total_venta);
    if (!$stmt_venta->execute()) {
        throw new Exception("Error al insertar la cabecera de la venta.");
    }
    $id_venta = $conn->insert_id;
    
    // 2. ITERAR Y PROCESAR CADA PRODUCTO EN EL CARRITO
    foreach ($carrito as $item) {
        $id_producto = $item['id'];
        $cantidad = $item['cantidad'];
        $precio_unitario = $item['precio_unitario'];
        
        // A. VERIFICACIÓN DE STOCK (Para evitar vender más de lo que hay)
        $stmt_stock = $conn->prepare("SELECT stock_base FROM productos WHERE id = ?");
        $stmt_stock->bind_param("i", $id_producto);
        $stmt_stock->execute();
        $result_stock = $stmt_stock->get_result();
        $stock_actual = $result_stock->fetch_assoc()['stock_base'] ?? 0;
        
        if ($stock_actual < $cantidad) {
            throw new Exception("Stock insuficiente para el producto (ID: $id_producto). Stock actual: $stock_actual.");
        }

        // B. INSERTAR EN DETALLE_VENTA
        $stmt_detalle = $conn->prepare("INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario_venta) VALUES (?, ?, ?, ?)");
        $stmt_detalle->bind_param("iidd", $id_venta, $id_producto, $cantidad, $precio_unitario);
        if (!$stmt_detalle->execute()) {
            throw new Exception("Error al insertar detalle de producto $id_producto.");
        }

        // C. ACTUALIZAR STOCK_BASE (Restar la cantidad vendida)
        $stmt_update = $conn->prepare("UPDATE productos SET stock_base = stock_base - ? WHERE id = ?");
        $stmt_update->bind_param("di", $cantidad, $id_producto);
        if (!$stmt_update->execute()) {
            throw new Exception("Error al actualizar stock del producto $id_producto.");
        }
    }
    
    // 3. CONFIRMAR (COMMIT) la transacción
    $conn->commit();
    $conn->close();
    echo json_encode(["status" => "success", "message" => "Venta registrada con éxito.", "id_venta" => $id_venta]);

} catch (Exception $e) {
    // Si algo falló, REVERTIR (ROLLBACK) todos los cambios
    $conn->rollback();
    $conn->close();
    error_log("Fallo en la venta: " . $e->getMessage()); 
    echo json_encode(["status" => "error", "message" => "Error al finalizar la venta. Causa: " . $e->getMessage()]);
}
?>