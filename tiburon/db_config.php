<?php
// ==========================================================
// DB_CONFIG.PHP - CONFIGURACIÓN DE CONEXIÓN
// Puerto de MySQL configurado a 3308
// ==========================================================
$servername = "localhost";
$username = "root";       // Usuario por defecto de XAMPP
$password = "";           // Contraseña por defecto (vacía)
$dbname = "supermercado_db"; // Nombre de la Base de Datos
$port = 3308;             // ¡Puerto de MySQL confirmado!

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar la conexión
if ($conn->connect_error) {
    // Si falla, detener el script y mostrar el error
    http_response_code(500); // Código de error interno del servidor
    die(json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]));
}

// Opcional: Establecer el juego de caracteres a utf8mb4 para evitar problemas con tildes, etc.
$conn->set_charset("utf8mb4");
?>