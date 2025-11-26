<?php
// ==========================================================
// GUARDAR_PRECIO_AJAX.PHP - GUARDA EL PRECIO AL INSTANTE
// ==========================================================
require 'db_config.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? 0;
    $nuevo_precio = floatval($data['precio']);

    if ($id > 0 && $nuevo_precio > 0) {
        
        $stmt = $conn->prepare("UPDATE productos SET precio_actual = ? WHERE id = ?");
        $stmt->bind_param("di", $nuevo_precio, $id);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Precio actualizado.", "new_price" => number_format($nuevo_precio, 2)]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error DB: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Datos inválidos (ID o Precio <= 0)."]);
    }
}
$conn->close();
?>