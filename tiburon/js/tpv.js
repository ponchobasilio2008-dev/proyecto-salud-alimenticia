// ==========================================================
// JS/TPV.JS - LÓGICA DEL PUNTO DE VENTA (CLIENTE)
// Versión con Modal de Ajuste de Precios y Navegación por TECLADO
// ==========================================================

document.addEventListener('DOMContentLoaded', function() {
    // Declaración de variables y elementos del DOM (T.P.V. principal)
    const busquedaInput = document.getElementById('busqueda-producto');
    const searchResultsDiv = document.getElementById('search-results');
    const productoDisplay = document.getElementById('producto-seleccionado');
    const cantidadInput = document.getElementById('cantidad');
    const precioTotalInput = document.getElementById('precio-total');
    const unidadDisplay = document.getElementById('unidad-display');
    const cuerpoVenta = document.getElementById('cuerpo-venta');
    const totalFinalDisplay = document.getElementById('total-final');
    const btnAgregar = document.getElementById('btn-agregar-linea');
    
    let productoSeleccionado = null; 
    let carrito = []; 

    // Variables para el modal de precios
    const modalPrecio = document.getElementById('modal-precio');
    const btnAbrirAjuste = document.getElementById('btn-abrir-ajuste');
    const modalBusquedaInput = document.getElementById('modal-busqueda-producto');
    const modalProductoInfo = document.getElementById('modal-producto-info');
    const modalSearchContainer = document.getElementById('modal-search-results'); 

    let productoModal = null; 

    // Variable global para mantener el foco en la búsqueda actual
    let focusedElementIndex = -1; 
    let currentSearchContainer = null; // Indica si estamos en el TPV o en el Modal

    // ==========================================================
    // 1. LÓGICA DE BÚSQUEDA Y SELECCIÓN (AJAX) - TPV PRINCIPAL
    // ==========================================================
    
    // Función de búsqueda AJAX al escribir (Autocompletar)
    busquedaInput.addEventListener('input', function() {
        const query = busquedaInput.value.trim();
        if (query.length < 3) {
            searchResultsDiv.style.display = 'none';
            return;
        }
        currentSearchContainer = searchResultsDiv;
        realizarBusqueda(query, searchResultsDiv, seleccionarProductoTPV);
    });

    // Función genérica para búsqueda AJAX
    function realizarBusqueda(query, resultsContainer, selectCallback) {
        fetch(`buscar_producto_ajax.php?query=${query}`)
            .then(response => response.json())
            .then(data => {
                resultsContainer.innerHTML = ''; 
                focusedElementIndex = -1; // Resetear el foco al cargar nuevos resultados

                if (data.length > 0) {
                    data.forEach((p, index) => {
                        const div = document.createElement('div');
                        div.className = 'resultado-busqueda';
                        div.setAttribute('data-index', index);
                        div.setAttribute('data-producto', JSON.stringify(p)); // Almacenar datos completos
                        div.innerHTML = `(${p.id}) ${p.nombre} - $${p.precio.toFixed(2)} / ${p.unidad}`;

                        // Callback: Al hacer clic, ejecuta la función de selección específica
                        div.onclick = () => selectCallback(p, resultsContainer);
                        resultsContainer.appendChild(div);
                    });
                    resultsContainer.style.display = 'block';
                } else {
                    resultsContainer.innerHTML = '<div>No hay coincidencias.</div>';
                    resultsContainer.style.display = 'block';
                }
            })
            .catch(error => console.error('Error en la búsqueda:', error));
    }

    // Callback para seleccionar un producto en el TPV
    function seleccionarProductoTPV(producto, resultsContainer) {
        productoSeleccionado = producto;
        busquedaInput.value = producto.nombre;
        resultsContainer.style.display = 'none'; 
        
        productoDisplay.innerHTML = `
            <strong>Seleccionado:</strong> ${producto.nombre} (Cód: ${producto.id}) <br>
            Precio Unitario: <strong>$${producto.precio.toFixed(2)} / ${producto.unidad}</strong> | Stock: ${producto.stock.toFixed(3)} ${producto.unidad}
        `;
        unidadDisplay.textContent = `(${producto.unidad})`;
        cantidadInput.value = 1; 
        calcularLineaTotal();
        cantidadInput.focus(); // Mover el foco al campo de cantidad después de seleccionar
    }
    
    // Ocultar resultados de búsqueda principal al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!busquedaInput.contains(e.target) && !searchResultsDiv.contains(e.target)) {
            searchResultsDiv.style.display = 'none';
        }
    });

    // ==========================================================
    // 2. NAVEGACIÓN POR TECLADO (FLECHAS Y ENTER)
    // ==========================================================

    document.addEventListener('keydown', function(e) {
        // Solo actuar si el contenedor de resultados de alguna búsqueda está visible
        if (currentSearchContainer && currentSearchContainer.style.display === 'block') {
            const results = currentSearchContainer.querySelectorAll('.resultado-busqueda');
            if (results.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault(); // Prevenir el desplazamiento de la página
                focusedElementIndex = (focusedElementIndex < results.length - 1) ? focusedElementIndex + 1 : 0;
                updateFocus(results);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                focusedElementIndex = (focusedElementIndex > 0) ? focusedElementIndex - 1 : results.length - 1;
                updateFocus(results);
            } else if (e.key === 'Enter') {
                if (focusedElementIndex !== -1) {
                    e.preventDefault();
                    results[focusedElementIndex].click(); // Simular un click en el elemento enfocado
                    currentSearchContainer.style.display = 'none'; // Ocultar después de la selección
                    currentSearchContainer = null; // Resetear el contenedor
                }
            }
        }
    });

    function updateFocus(results) {
        results.forEach((el, index) => {
            if (index === focusedElementIndex) {
                el.style.backgroundColor = '#007bff'; // Color de foco
                el.style.color = 'white';
                el.scrollIntoView({ block: 'nearest' }); // Asegurar que el elemento esté visible
            } else {
                el.style.backgroundColor = '';
                el.style.color = '';
            }
        });
    }

    // ==========================================================
    // 3. CÁLCULO DINÁMICO DE TOTALES Y VENTA
    // ==========================================================
    
    function calcularLineaTotal() {
        if (!productoSeleccionado) {
            precioTotalInput.value = '0.00';
            return;
        }
        
        const cantidad = parseFloat(cantidadInput.value);
        const precioUnitario = productoSeleccionado.precio;
        
        if (isNaN(cantidad) || cantidad <= 0) {
            precioTotalInput.value = '0.00';
            return;
        }

        const totalLinea = cantidad * precioUnitario;
        precioTotalInput.value = totalLinea.toFixed(2);
    }
    
    cantidadInput.addEventListener('input', calcularLineaTotal);

    btnAgregar.addEventListener('click', function() {
        if (!productoSeleccionado) {
            alert('Por favor, selecciona un producto primero.');
            return;
        }
        
        const cantidad = parseFloat(cantidadInput.value);
        if (isNaN(cantidad) || cantidad <= 0) {
            alert('La cantidad debe ser un número positivo.');
            return;
        }
        
        if (cantidad > productoSeleccionado.stock) {
             alert(`ATENCIÓN: La cantidad solicitada (${cantidad.toFixed(3)}) supera el stock actual (${productoSeleccionado.stock.toFixed(3)}).`);
        }

        const lineaVenta = {
            id: productoSeleccionado.id,
            nombre: productoSeleccionado.nombre,
            precio_unitario: productoSeleccionado.precio,
            cantidad: cantidad,
            subtotal: parseFloat(precioTotalInput.value),
            unidad: productoSeleccionado.unidad
        };
        
        carrito.push(lineaVenta);
        
        // Limpiar para la siguiente búsqueda
        busquedaInput.value = '';
        productoDisplay.innerHTML = '';
        cantidadInput.value = 1;
        productoSeleccionado = null;
        
        actualizarCarritoVisual();
        busquedaInput.focus(); // Regresar el foco al campo de búsqueda
    });
    
    // ... (actualizarCarritoVisual, removerItem, btn-cobrar, btn-cancelar permanecen iguales) ...
    // [Aquí iría la función actualizarCarritoVisual, removerItem, y la lógica de cobro/cancelar]
    
    // --- (Funciones Auxiliares que permanecen iguales) ---

    function actualizarCarritoVisual() {
        cuerpoVenta.innerHTML = ''; // Limpiar tabla
        let totalFinal = 0;

        carrito.forEach((item, index) => {
            const tr = document.createElement('tr');
            
            // Usamos item.unidad si está definida, si no, 'Unidad'
            const unidadVenta = item.unidad || 'Unidad';
            
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nombre}</td>
                <td>$${item.precio_unitario.toFixed(2)}</td>
                <td>${item.cantidad.toFixed(3)} ${unidadVenta}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
                <td><button onclick="removerItem(${index})" style="background-color:#dc3545; color:white; border:none; padding:5px;">X</button></td>
            `;
            cuerpoVenta.appendChild(tr);
            totalFinal += item.subtotal;
        });
        
        totalFinalDisplay.textContent = `$${totalFinal.toFixed(2)}`;
    }
    
    window.removerItem = function(index) {
        carrito.splice(index, 1);
        actualizarCarritoVisual();
    };


    document.getElementById('btn-cobrar').addEventListener('click', function() {
        if (carrito.length === 0) {
            alert('No hay productos en la lista de venta.');
            return;
        }
        
        const totalVenta = parseFloat(totalFinalDisplay.textContent.replace('$', ''));
        
        const datosVenta = { carrito: carrito, total_final: totalVenta };

        fetch('finalizar_venta.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosVenta)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(`✅ Venta N° ${data.id_venta} registrada con éxito.`);
                carrito = [];
                actualizarCarritoVisual();
                busquedaInput.focus();
            } else {
                alert(`❌ ERROR: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error de comunicación con el servidor:', error);
            alert('Hubo un error de conexión al procesar la venta. Revisa la consola.');
        });
    });

    document.getElementById('btn-cancelar').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres cancelar la venta actual?')) {
            carrito = [];
            actualizarCarritoVisual();
        }
    });

    // ==========================================================
    // 4. LÓGICA DE MODAL DE AJUSTE DE PRECIOS (CON SELECCIÓN MANUAL)
    // ==========================================================
    
    // Abrir Modal
    btnAbrirAjuste.addEventListener('click', function() {
        modalPrecio.style.display = 'flex';
        modalBusquedaInput.value = '';
        modalProductoInfo.innerHTML = '<p>Escriba un nombre para buscar y **seleccionar** el producto.</p>';
        modalSearchContainer.style.display = 'none';
        modalBusquedaInput.focus();
    });

    // Lógica de búsqueda del modal (muestra lista, soporta teclado)
    modalBusquedaInput.addEventListener('input', function() {
        const query = modalBusquedaInput.value.trim();
        if (query.length < 3) {
             modalSearchContainer.style.display = 'none';
             return;
        }
        currentSearchContainer = modalSearchContainer; // Establecer el foco en este contenedor
        realizarBusqueda(query, modalSearchContainer, seleccionarProductoModal);
    });

    // Callback para seleccionar un producto en el MODAL
    function seleccionarProductoModal(producto, container) {
        productoModal = producto;
        container.style.display = 'none';
        modalBusquedaInput.value = producto.nombre;
        
        // Contenido del formulario para ajustar
        modalProductoInfo.innerHTML = `
            <p>Producto: <strong>${producto.nombre}</strong> (Cód: ${producto.id})</p>
            <p>Precio Actual: <strong>$${producto.precio.toFixed(2)} / ${producto.unidad}</strong></p>
            <div class="input-group" style="margin-top: 15px;">
                <label for="input-nuevo-precio" style="width: 120px;">Nuevo Precio:</label>
                <input type="number" id="input-nuevo-precio" step="0.01" min="0.01" value="${producto.precio.toFixed(2)}" style="width: 150px;">
                <button id="btn-guardar-precio" data-id="${producto.id}" style="margin-left: 10px;">Guardar</button>
            </div>
        `;
        
        document.getElementById('btn-guardar-precio').onclick = guardarPrecio;
        document.getElementById('input-nuevo-precio').focus();
    }
    
    // Función para guardar el precio vía AJAX
    function guardarPrecio() {
        const id = document.getElementById('btn-guardar-precio').dataset.id;
        const nuevoPrecio = parseFloat(document.getElementById('input-nuevo-precio').value);

        if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
            alert('El precio debe ser un número positivo.');
            return;
        }

        fetch('guardar_precio_ajax.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, precio: nuevoPrecio })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(`✅ ${productoModal.nombre} actualizado a $${nuevoPrecio.toFixed(2)}`);
                modalPrecio.style.display = 'none';
                
                // Actualizar el precio en la variable de JS si el producto está seleccionado en el TPV
                if (productoSeleccionado && productoSeleccionado.id == id) {
                    productoSeleccionado.precio = nuevoPrecio;
                    calcularLineaTotal();
                    
                    productoDisplay.innerHTML = `
                        <strong>Seleccionado:</strong> ${productoSeleccionado.nombre} (Cód: ${productoSeleccionado.id}) <br>
                        Precio Unitario: <strong>$${productoSeleccionado.precio.toFixed(2)} / ${productoSeleccionado.unidad}</strong> | Stock: ${productoSeleccionado.stock.toFixed(3)} ${productoSeleccionado.unidad}
                    `;
                }
                busquedaInput.focus();
            } else {
                alert(`❌ Error al guardar: ${data.message}`);
            }
        })
        .catch(error => console.error('Error al guardar precio:', error));
    }

    // Inicializar el foco en el campo de búsqueda al cargar la página
    busquedaInput.focus();
});