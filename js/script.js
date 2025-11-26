// ===========================================
// LÓGICA PRINCIPAL: CÁLCULO, REGISTRO Y RECOMENDACIONES
// ===========================================

// --- Variables y referencias globales ---
const btnImprimirIndividual = document.getElementById('btnImprimirIndividual');
const btnImprimirGeneral = document.getElementById('btnImprimirGeneral');
const imcForm = document.getElementById('imcForm');

// La tabla de la OMS para el reporte (usando estilos HTML inline)
const tablaOMSHTML = `
    <h4 style="color: #198754;">Tabla de IMC de la OMS</h4>
    <table style="width:100%; border-collapse: collapse; margin-top: 15px; font-size: 0.9em;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">IMC</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Estado</th>
            </tr>
        </thead>
        <tbody>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">Menos de 18.5</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #ffe0b2;">Bajo peso</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">18.5 - 24.9</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #c8e6c9;">Peso normal</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">25.0 - 29.9</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #fff9c4;">Sobrepeso</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">30.0 o más</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #ffccbc;">Obesidad</td></tr>
        </tbody>
    </table>
    <p style="font-size: 0.8em; margin-top: 5px;">Fuente: Organización Mundial de la Salud (OMS)</p>
`;

/**
 * Función para generar las recomendaciones HTML según el IMC.
 * (Necesaria para los reportes individuales en la página de Comunidad)
 */
function generarRecomendaciones(imc) {
    let consejosHTML = '';
    
    if (imc < 18.5) {
        consejosHTML = `
            <p>🚨 **¡Alerta de Bajo Peso!** Tu IMC indica que podrías tener un peso insuficiente.</p>
            <ul>
                <li>Consulta Médica: Es vital acudir a un profesional (médico o nutriólogo).</li>
                <li>Nutrientes Densos: Enfócate en alimentos nutritivos y calóricos.</li>
                <li>Comidas Regulares: Asegúrate de tener tres comidas principales y dos colaciones.</li>
            </ul>
        `;
    } else if (imc >= 18.5 && imc <= 24.9) {
        consejosHTML = `
            <p>✅ **¡Excelente!** Tu IMC está dentro del rango normal.</p>
            <ul>
                <li>Mantén los Hábitos: Continúa con una dieta balanceada.</li>
                <li>Actividad Física: Mantén al menos 150 minutos de ejercicio moderado.</li>
                <li>Hidratación: Prioriza el consumo de agua natural.</li>
            </ul>
        `;
    } else if (imc >= 25.0 && imc <= 29.9) {
        consejosHTML = `
            <p>⚠️ **¡Atención!** Tu IMC está en el rango de sobrepeso.</p>
            <ul>
                <li>Reduce Azúcares y Grasas: Limita el consumo de refrescos, jugos y comida rápida.</li>
                <li>Aumenta Fibra: Incrementa frutas, verduras y cereales integrales.</li>
                <li>Incrementa la Actividad: Intenta caminar o usar la bicicleta para distancias cortas.</li>
            </ul>
        `;
    } else { // imc >= 30.0 (Obesidad)
        consejosHTML = `
            <p>🛑 **¡Riesgo Alto!** Tu IMC está en el rango de obesidad.</p>
            <ul>
                <li>Busca Ayuda Profesional: Es fundamental iniciar un plan integral con nutriólogo y médico.</li>
                <li>Ejercicio Gradual: Empieza con caminatas cortas y aumenta la intensidad lentamente.</li>
                <li>Evita Ultraprocesados: Elimina o minimiza drásticamente los alimentos ultraprocesados.</li>
            </ul>
        `;
    }
    return consejosHTML;
}


// --- 1. Lógica al calcular IMC (imc.html) ---
if (imcForm) {
    imcForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const nombre = document.getElementById('nombre').value.trim() || 'Estudiante Anónimo';
        const peso = parseFloat(document.getElementById('peso').value);
        const altura = parseFloat(document.getElementById('altura').value);

        if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
            alert('Por favor, ingresa valores válidos y positivos para peso y altura.');
            return;
        }

        const imc = peso / (altura * altura);
        const imcRedondeado = imc.toFixed(2); 

        let clasificacionTexto = '';
        let colorClasificacion = 'text-dark'; 
        
        // Determinar clasificación para la interfaz
        if (imc < 18.5) { clasificacionTexto = 'Bajo peso'; colorClasificacion = 'text-warning'; } 
        else if (imc >= 18.5 && imc <= 24.9) { clasificacionTexto = 'Peso normal'; colorClasificacion = 'text-success'; } 
        else if (imc >= 25.0 && imc <= 29.9) { clasificacionTexto = 'Sobrepeso'; colorClasificacion = 'text-warning'; } 
        else { clasificacionTexto = 'Obesidad'; colorClasificacion = 'text-danger'; }

        // Generar consejos para la interfaz
        const consejosHTML = generarRecomendaciones(imc);

        // Registro en LocalStorage
        const nuevoRegistro = { nombre, imc: imcRedondeado, clasificacion: clasificacionTexto, fecha: new Date().toLocaleDateString('es-MX') };
        let registros = JSON.parse(localStorage.getItem('registrosIMC')) || [];
        registros.push(nuevoRegistro);
        localStorage.setItem('registrosIMC', JSON.stringify(registros));
        
        // Mostrar Resultados en el DOM
        document.getElementById('valorIMC').textContent = imcRedondeado;
        document.getElementById('clasificacion').textContent = clasificacionTexto;
        document.getElementById('clasificacion').className = `fw-bold fs-3 ${colorClasificacion}`; 
        document.getElementById('consejos').innerHTML = consejosHTML;
        document.getElementById('resultadoIMC').style.display = 'block';
        document.getElementById('mensajeInicial').style.display = 'none';

        // Mostrar el botón de impresión individual
        if (btnImprimirIndividual) {
            btnImprimirIndividual.style.display = 'block';
        }
    });
}


// -------------------------------------------------------------
// --- 2. FUNCIONES DE REPORTE Y EVENTOS GLOBALES ---
// -------------------------------------------------------------

/**
 * Función central para generar y abrir la ventana de impresión.
 * @param {string} nombre 
 * @param {string} valorIMC 
 * @param {string} clasificacionIMC 
 * @param {string} recomendacionesHTML 
 * @param {string} fecha 
 * @param {boolean} isGeneral (Si es reporte individual o un detalle general)
 */
function imprimirReporte(nombre, valorIMC, clasificacionIMC, recomendacionesHTML, fecha) {
    const contenidoImprimir = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h1 style="color: #198754; text-align: center;">Reporte Personal de IMC</h1>
            <p style="text-align: right; font-size: 0.9em;">Fecha del Registro: ${fecha}</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">

            <h3 style="color: #0d6efd;">Datos y Resultados</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Valor de IMC:</strong> <span style="font-size: 1.5em; font-weight: bold; color: #dc3545;">${valorIMC}</span></p>
            <p><strong>Clasificación:</strong> <span style="font-size: 1.2em; font-weight: bold;">${clasificacionIMC}</span></p>
            
            <h3 style="color: #0d6efd;">Recomendaciones Personalizadas</h3>
            ${recomendacionesHTML}

            <hr style="border: 1px solid #eee; margin: 20px 0;">
            
            ${tablaOMSHTML}

            <p style="margin-top: 30px; font-size: 0.8em; text-align: center; color: #666;">
                Este reporte es solo con fines informativos y no reemplaza la consulta profesional. Proyecto Escolar 2025.
            </p>
        </div>
    `;

    // Lógica de impresión en nueva ventana
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write('<html><head><title>Reporte IMC Personal</title>');
    ventanaImpresion.document.write('<style>');
    ventanaImpresion.document.write('body { margin: 0; padding: 0; }');
    ventanaImpresion.document.write('@media print { body { -webkit-print-color-adjust: exact; } }');
    ventanaImpresion.document.write('</style>');
    ventanaImpresion.document.write('</head><body>');
    ventanaImpresion.document.write(contenidoImprimir);
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.close();
    ventanaImpresion.print();
}

// --- 2. Evento del Botón Imprimir Reporte Personal (imc.html) ---
if (btnImprimirIndividual) {
    btnImprimirIndividual.addEventListener('click', () => { 
        const nombre = document.getElementById('nombre').value || 'Anónimo';
        const valorIMC = document.getElementById('valorIMC').innerText;
        const clasificacionIMC = document.getElementById('clasificacion').innerText;
        const recomendacionesHTML = document.getElementById('consejos').innerHTML;
        const fechaActual = new Date().toLocaleDateString('es-MX');

        imprimirReporte(nombre, valorIMC, clasificacionIMC, recomendacionesHTML, fechaActual);
    });
}


// --- 3. Evento del Botón Imprimir Reporte General (comunidad.html) ---
if (btnImprimirGeneral) {
    btnImprimirGeneral.addEventListener('click', () => {
        const registros = JSON.parse(localStorage.getItem('registrosIMC')) || [];
        const fechaActual = new Date().toLocaleDateString('es-ES');

        if (registros.length === 0) {
            alert('No hay registros para generar un reporte general.');
            return;
        }

        // CÁLCULOS ESTADÍSTICOS (Promedio, distribución, etc.)
        let totalIMC = 0;
        const clasificacionesCount = { 'Bajo peso': 0, 'Peso normal': 0, 'Sobrepeso': 0, 'Obesidad': 0 };

        registros.forEach(registro => {
            totalIMC += parseFloat(registro.imc);
            let clasif = registro.clasificacion;
            if (clasif.includes('Obesidad')) { clasif = 'Obesidad'; }
            if (clasificacionesCount.hasOwnProperty(clasif)) { clasificacionesCount[clasif]++; }
            else { clasificacionesCount[clasif] = 1; }
        });

        const promedioIMC = (totalIMC / registros.length).toFixed(2);
        
        // Generar HTML del Reporte General
        // ... (Este bloque es el mismo que ya tienes, generando las tablas y listas) ...

        let distribucionClasificacionesHTML = '<ul style="list-style: none; padding: 0;">';
        for (const clasif in clasificacionesCount) {
            const count = clasificacionesCount[clasif];
            if (count > 0) {
                const porcentaje = ((count / registros.length) * 100).toFixed(1);
                distribucionClasificacionesHTML += `<li style="margin-bottom: 5px;">— ${clasif}: ${count} personas (${porcentaje}%)</li>`;
            }
        }
        distribucionClasificacionesHTML += '</ul>';

        let tablaRegistrosHTML = `
            <h4 style="color: #198754; margin-top: 30px;">Detalle de Registros Individuales</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 15px; font-size: 0.9em;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Nombre</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">IMC</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Clasificación</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha</th>
                    </tr>
                </thead>
                <tbody>
        `;
        registros.forEach(registro => {
            tablaRegistrosHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${registro.nombre}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${registro.imc}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${registro.clasificacion}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${registro.fecha}</td>
                </tr>
            `;
        });
        tablaRegistrosHTML += `</tbody></table>`;


        const contenidoImprimir = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h1 style="color: #198754; text-align: center;">Reporte General de la Comunidad IMC</h1>
                <p style="text-align: right; font-size: 0.9em;">Fecha del Reporte: ${fechaActual}</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <h3 style="color: #0d6efd;">Resumen de la Comunidad</h3>
                <p><strong>Total de Registros:</strong> ${registros.length} estudiantes</p>
                <p><strong>Promedio de IMC General:</strong> <span style="font-size: 1.5em; font-weight: bold; color: #dc3545;">${promedioIMC}</span></p>
                <h4 style="color: #198754;">Distribución de Clasificaciones</h4>
                ${distribucionClasificacionesHTML}
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                ${tablaRegistrosHTML}
                <p style="margin-top: 30px; font-size: 0.8em; text-align: center; color: #666;">
                    Este reporte es un resumen estadístico de los datos ingresados localmente por la comunidad. Proyecto Escolar 2025.
                </p>
            </div>
        `;

        // Lógica de impresión en nueva ventana
        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write('<html><head><title>Reporte IMC General</title>');
        ventanaImpresion.document.write('<style>');
        ventanaImpresion.document.write('body { margin: 0; padding: 0; }');
        ventanaImpresion.document.write('@media print { body { -webkit-print-color-adjust: exact; } }');
        ventanaImpresion.document.write('</style>');
        ventanaImpresion.document.write('</head><body>');
        ventanaImpresion.document.write(contenidoImprimir);
        ventanaImpresion.document.write('</body></html>');
        ventanaImpresion.document.close();
        ventanaImpresion.print();
    });
}

// --- 4. Evento Global para Impresión Individual en la Comunidad ---
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-reporte-individual')) {
        const btn = e.target;
        const imcVal = parseFloat(btn.getAttribute('data-imc'));
        
        // Obtener datos del atributo data-
        const nombre = btn.getAttribute('data-nombre');
        const imcRedondeado = btn.getAttribute('data-imc');
        const clasificacionTexto = btn.getAttribute('data-clasificacion');
        const fecha = btn.getAttribute('data-fecha');
        
        // Generar recomendaciones específicas usando la función central
        const recomendacionesHTML = generarRecomendaciones(imcVal);

        // Llamar a la función de impresión central
        imprimirReporte(nombre, imcRedondeado, clasificacionTexto, recomendacionesHTML, fecha);
    }
});