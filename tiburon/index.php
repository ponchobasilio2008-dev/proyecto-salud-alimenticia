<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Punto de Venta - Cobro</title>
    <style>
        /* ========================================================== */
        /* CSS GENERAL (SIMILITUD VISUAL) */
        /* ========================================================== */
        body { font-family: Arial, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .panel { border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; border-radius: 4px; background-color: #f9f9f9; }
        .panel-header { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .input-group { display: flex; margin-bottom: 10px; align-items: center; }
        .input-group label { width: 150px; font-weight: 500; }
        .input-group input, .input-group select { flex-grow: 1; padding: 8px; border: 1px solid #ddd; border-radius: 3px; }
        
        /* Estilos específicos para la tabla de cobro */
        #lista-venta { width: 100%; border-collapse: collapse; margin-top: 15px; }
        #lista-venta th, #lista-venta td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        #lista-venta th { background-color: #e9ecef; }
        
        .totales-footer { display: flex; justify-content: flex-end; padding: 15px 0; border-top: 2px solid #333; }
        .total-box { font-size: 1.5em; font-weight: bold; margin-left: 30px; }
        .total-box span { color: #d9534f; margin-left: 10px; }
        
        .actions-footer button { padding: 10px 20px; margin-left: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        #btn-cobrar { background-color: #5cb85c; color: white; }
        #btn-cancelar { background-color: #f0ad4e; color: white; }
        
        /* Estilos para resultados de búsqueda dinámica */
        .search-results-container { 
            position: absolute; 
            width: 100%;
            max-width: 400px; 
            background: white; 
            border: 1px solid #ccc; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
            max-height: 200px; 
            overflow-y: auto; 
            z-index: 10; 
        }
        .resultado-busqueda { 
            padding: 8px; 
            cursor: pointer; 
            border-bottom: 1px dotted #eee; 
            font-size: 0.9em;
        }
        .resultado-busqueda:hover { background-color: #e9ecef; }

        /* ========================================================== */
        /* ESTILOS MODAL */
        /* ========================================================== */
        .modal-overlay { 
            display: none; 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.6); 
            z-index: 1000;
            justify-content: center; /* Centrado vertical */
            align-items: center; /* Centrado horizontal */
        }
        .modal-content { 
            background: white; 
            width: 450px; 
            padding: 25px; 
            border-radius: 8px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        }
        .modal-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border-bottom: 1px solid #ddd; 
            margin-bottom: 15px;
        }
        .close-btn { 
            cursor: pointer; 
            font-size: 1.8em; 
            color: #aaa;
        }
        .close-btn:hover { color: #333; }
        #btn-guardar-precio { background-color: #5cb85c; color: white; }
    </style>
</head>
<body>

<div class="container">
    <h1>Terminal Punto de Venta (T.P.V.)</h1>

    <div class="panel">
        <div class="panel-header">Detalle de la Transacción</div>
        <div class="input-group">
            <label for="fecha">Fecha:</label>
            <input type="text" id="fecha" value="<?php echo date('Y-m-d H:i:s'); ?>" readonly>
        </div>
        <div class="input-group">
            <label for="cajero">Cajero:</label>
            <input type="text" id="cajero" value="Cajero (ID: 1)" readonly>
            
            <button id="btn-abrir-ajuste">[Ajustar Precios Rápido]</button>
        </div>
    </div>
    
    <div class="panel">
        <div class="panel-header">Añadir Producto</div>
        
        <div class="input-group">
            <label for="busqueda-producto">Buscar Producto (Nombre):</label>
            <div style="position: relative; flex-grow: 1;">
                 <input type="text" id="busqueda-producto" placeholder="Escribe el nombre del producto (ej: tomate, leche)">
                 <div id="search-results" class="search-results-container" style="display: none;"></div>
            </div>
        </div>
        
        <div id="producto-seleccionado" style="margin-top: 10px; padding: 5px; min-height: 30px;">
            </div>

        <div class="input-group" style="margin-top: 15px;">
            <label for="cantidad">Cantidad / Peso:</label>
            <input type="number" id="cantidad" step="0.001" min="0.001" value="1" style="width: 150px;">
            <span id="unidad-display" style="margin-left: 10px; font-weight: bold;">(Unidad)</span>
            
            <label for="precio-total" style="width: 200px; margin-left: 30px;">TOTAL LÍNEA:</label>
            <input type="text" id="precio-total" readonly style="color: #d9534f; font-weight: bold; background-color: #eee;">
            
            <button id="btn-agregar-linea" style="margin-left: 15px;">Añadir a Venta</button>
        </div>
    </div>

    <div class="panel">
        <div class="panel-header">Productos en Carrito</div>
        
        <table id="lista-venta">
            <thead>
                <tr>
                    <th>Cód.</th>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody id="cuerpo-venta">
                </tbody>
        </table>

        <div class="totales-footer">
            <div class="total-box">
                Total a Pagar: <span id="total-final">$0.00</span>
            </div>
        </div>
        
        <div class="actions-footer" style="text-align: right; padding-top: 20px;">
            <button id="btn-cobrar">✅ Cobrar Venta</button>
            <button id="btn-cancelar">❌ Cancelar Venta</button>
        </div>
    </div>
    
</div>

<div id="modal-precio" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Ajuste Rápido de Precio</h2>
            <span class="close-btn" onclick="document.getElementById('modal-precio').style.display='none';">&times;</span>
        </div>
        
        <div class="input-group">
            <label for="modal-busqueda-producto" style="width: 100px;">Buscar:</label>
            <div style="position: relative; flex-grow: 1;">
                 <input type="text" id="modal-busqueda-producto" placeholder="Nombre o ID" style="width: 250px;">
                 <div id="modal-search-results" class="search-results-container" style="width: 300px; display: none;"></div>
            </div>
        </div>
        
        <div id="modal-producto-info" style="min-height: 50px; margin-top: 10px;">
            <p>Escriba un nombre para buscar y **seleccionar** el producto.</p>
        </div>
    </div>
</div>

<?php 
require 'db_config.php';
// Cerramos la conexión después de usarla
$conn->close();
?>
<script src="js/tpv.js"></script>
</body>
</html>