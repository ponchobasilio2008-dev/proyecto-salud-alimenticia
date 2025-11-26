<?php
// ==========================================================
// AJUSTAR_PRECIOS.PHP - INTERFAZ DE AJUSTE DE PRECIOS PARA EL CAJERO/ENCARGADO
// ==========================================================
require 'db_config.php'; // Incluye la conexión a la DB

$message = '';
$producto_data = null; // Almacenará los datos del producto buscado

// ----------------------------------------------------------
// 1. LÓGICA DE ACTUALIZACIÓN DE PRECIO (POST)
// ----------------------------------------------------------
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['update_price'])) {
    $id_producto = $conn->real_escape_string($_POST['id_producto_update']);
    $nuevo_precio = floatval($_POST['nuevo_precio']);

    if ($nuevo_precio > 0) {
        // Ejecuta la actualización del precio_actual
        $stmt = $conn->prepare("UPDATE productos SET precio_actual = ? WHERE id = ?");
        $stmt->bind_param("di", $nuevo_precio, $id_producto);

        if ($stmt->execute()) {
            $message = '<div class="message success">✅ Precio actualizado correctamente a $' . number_format($nuevo_precio, 2) . '</div>';
        } else {
            $message = '<div class="message error">❌ Error al actualizar el precio: ' . $stmt->error . '</div>';
        }
        $stmt->close();
    } else {
        $message = '<div class="message error">❌ El precio debe ser mayor a cero.</div>';
    }
}

// ----------------------------------------------------------
// 2. LÓGICA DE BÚSQUEDA DEL PRODUCTO (GET o después de POST)
// ----------------------------------------------------------
$search_query = '';
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['search_query'])) {
    $search_query = $conn->real_escape_string($_GET['search_query']);
} elseif ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id_producto_update'])) {
    // Si actualizamos, cargamos de nuevo el producto para mostrar el resultado
    $search_query = $conn->real_escape_string($_POST['nombre_producto_update']);
}

if (!empty($search_query)) {
    // Buscar por nombre o ID
    $stmt = $conn->prepare("SELECT id, nombre, precio_actual, unidad_base, stock_base FROM productos WHERE nombre LIKE ? OR id = ?");
    $search_param = '%' . $search_query . '%';
    
    // Necesitamos pasar el query dos veces: una como string (LIKE) y otra como entero (ID)
    $temp_id = is_numeric($search_query) ? intval($search_query) : 0;
    
    // Bind param 'si' significa String e Integer
    $stmt->bind_param("si", $search_param, $temp_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $producto_data = $result->fetch_assoc();
    } else {
        $message = '<div class="message warning">⚠️ Producto no encontrado. Intenta con un nombre o ID diferente.</div>';
    }
    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ajuste Rápido de Precios</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        h1 { text-align: center; color: #333; }
        .panel { border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; border-radius: 4px; background-color: #f9f9f9; }
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-weight: bold; margin-bottom: 5px; }
        .input-group input[type="text"], .input-group input[type="number"] { width: calc(100% - 180px); padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .input-group button { padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px; }
        
        /* Mensajes */
        .message { padding: 10px; margin-bottom: 15px; border-radius: 4px; font-weight: bold; }
        .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .warning { background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; }
        
        .product-info { border: 1px solid #007bff; padding: 15px; border-radius: 4px; margin-top: 15px; }
        .product-info p { margin: 5px 0; }
        
        .update-form button { background-color: #5cb85c; margin-top: 15px; }
        .back-btn { display: inline-block; padding: 10px 15px; background-color: #6c757d; color: white; border-radius: 4px; text-decoration: none; margin-top: 20px; }
    </style>
</head>
<body>

<div class="container">
    <h1>Ajuste Rápido de Precios de Venta</h1>
    <a href="index.php" class="back-btn">← Volver al Punto de Venta</a>

    <?php echo $message; ?>

    <div class="panel">
        <form method="GET" action="ajustar_precios.php">
            <div class="input-group" style="display: flex;">
                <label for="search_query" style="width: 150px;">Buscar Producto:</label>
                <input type="text" id="search_query" name="search_query" placeholder="Nombre o ID del producto" value="<?php echo htmlspecialchars($search_query); ?>" required>
                <button type="submit">Buscar</button>
            </div>
        </form>
    </div>

    <?php if ($producto_data): ?>
    <div class="panel product-info">
        <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">
            Producto Seleccionado: <?php echo htmlspecialchars($producto_data['nombre']); ?> (ID: <?php echo $producto_data['id']; ?>)
        </div>
        <p>Unidad de Venta: **<?php echo htmlspecialchars($producto_data['unidad_base']); ?>**</p>
        <p>Stock Actual: **<?php echo number_format($producto_data['stock_base'], 3); ?>**</p>
        <p>Precio de Venta Actual: **$<?php echo number_format($producto_data['precio_actual'], 2); ?>**</p>

        <form method="POST" action="ajustar_precios.php" class="update-form">
            <h2>Cambiar Precio</h2>
            <input type="hidden" name="id_producto_update" value="<?php echo $producto_data['id']; ?>">
            <input type="hidden" name="nombre_producto_update" value="<?php echo htmlspecialchars($producto_data['nombre']); ?>">
            
            <div class="input-group" style="display: flex; align-items: center;">
                <label for="nuevo_precio" style="width: 200px;">Nuevo Precio ($):</label>
                <input type="number" id="nuevo_precio" name="nuevo_precio" step="0.01" min="0.01" 
                       value="<?php echo number_format($producto_data['precio_actual'], 2, '.', ''); ?>" required>
                <button type="submit" name="update_price">Guardar Nuevo Precio</button>
            </div>
        </form>
    </div>
    <?php endif; ?>

</div>

</body>
</html>