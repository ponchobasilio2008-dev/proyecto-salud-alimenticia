// ===========================================
// LÓGICA PRINCIPAL: CÁLCULO, REGISTRO Y RECOMENDACIONES
// ===========================================

// --- Variables y referencias globales ---
const btnImprimirIndividual = document.getElementById('btnImprimirIndividual');
const btnImprimirGeneral = document.getElementById('btnImprimirGeneral');
const imcForm = document.getElementById('imcForm');

// Mapeo de colores FUERTES para la Gráfica (Máxima Visibilidad)
const COLORES_FUERTES = {
    'Bajo peso': '#00A0E3',    // Azul fuerte
    'Peso normal': '#28A745',  // Verde Bootstrap (Success)
    'Sobrepeso': '#FFC107',    // Amarillo/Naranja fuerte
    'Obesidad': '#DC3545',     // Rojo (Danger)
};

// La tabla de la OMS para el reporte (colores pastel de fondo)
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
            <tr><td style="border: 1px solid #ddd; padding: 8px;">Menos de 18.5</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #fce4e4;">Bajo peso</td></tr> 
            <tr><td style="border: 1px solid #ddd; padding: 8px;">18.5 - 24.9</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #e8f5e9;">Peso normal</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">25.0 - 29.9</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #fffde7;">Sobrepeso</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">30.0 o más</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #ffcdd2;">Obesidad</td></tr>
        </tbody>
    </table>
    <p style="font-size: 0.8em; margin-top: 5px;">Fuente: Organización Mundial de la Salud (OMS)</p>
`;

/**
 * Función para generar las recomendaciones HTML según el IMC.
 * (Función no alterada, solo la he incluido para completitud)
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

/**
 * Genera una gráfica de pastel (anillo) y la simbología con colores FUERTES.
 */
function generarGraficaEstadistica(counts, total) {
    if (total === 0) return '';

    let gradientStops = '';
    let currentStop = 0;
    let simbologiaHTML = '';

    // Orden de las clasificaciones para la visualización
    const sortedClasificaciones = ['Bajo peso', 'Peso normal', 'Sobrepeso', 'Obesidad'];

    // 1. Genera la cadena CSS para el conic-gradient y la simbología
    sortedClasificaciones.forEach(clasif => {
        const value = counts[clasif];
        if (value > 0) {
            const color = COLORES_FUERTES[clasif];
            const percentage = (value / total) * 100;
            const nextStop = currentStop + percentage;
            
            // Crea el segmento de color
            gradientStops += `${color} ${currentStop}% ${nextStop}%, `;
            currentStop = nextStop;

            // Crea la entrada en la simbología (Leyenda) con el porcentaje
            simbologiaHTML += `
                <div style="display: flex; align-items: center; margin: 5px 0;">
                    <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 2px; margin-right: 8px;"></div>
                    <span style="font-size: 0.9em; color: #333;">${clasif} (${percentage.toFixed(1)}%)</span>
                </div>
            `;
        }
    });
    gradientStops = gradientStops.slice(0, -2);


    return `
        <div style="display: flex; justify-content: space-around; align-items: flex-start; margin: 20px 0;">
            <div style="
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: conic-gradient(${gradientStops});
                position: relative;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                margin-right: 20px;
            ">
                <div style="
                    position: absolute;
                    top: 30px;
                    left: 30px;
                    width: 90px;
                    height: 90px;
                    background: white;
                    border-radius: 50%;
                "></div>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center; margin-top: 5px;">
                ${simbologiaHTML}
            </div>
        </div>
    `;
}

// --- Lógica del formulario (Continúa igual) ---

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
 * Función central para generar y abrir la ventana de impresión del reporte individual.
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

        // 1. Calcular promedios y estadísticas
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
        
        // Genera la gráfica de pastel
        const graficaHTML = generarGraficaEstadistica(clasificacionesCount, registros.length);
        
        // 2. Crear lista de distribución (usada para los cálculos)
        
        // 3. Crear tabla de registros individuales
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
        // Mapeo de colores de fondo para la tabla (SINCRONIZADO con la tabla OMS)
        const coloresFondoTabla = {
            'Bajo peso': '#fce4e4',
            'Peso normal': '#e8f5e9',
            'Sobrepeso': '#fffde7',
            'Obesidad': '#ffcdd2',
        };

        registros.forEach(registro => {
            let clasifBase = registro.clasificacion;
            if (clasifBase.includes('Obesidad')) { clasifBase = 'Obesidad'; }
            const colorFondo = coloresFondoTabla[clasifBase] || 'transparent';

            tablaRegistrosHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${registro.nombre}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${registro.imc}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; background-color: ${colorFondo};">${registro.clasificacion}</td>
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
                
                ${graficaHTML}
                
                <div style="display: flex; flex-wrap: wrap; justify-content: center; margin-top: 15px;">
                    <div style="display: flex; align-items: center; margin: 5px 10px;">
                        <div style="width: 10px; height: 10px; background-color: ${COLORES_FUERTES['Peso normal']}; border-radius: 2px; margin-right: 5px;"></div>
                        <span style="font-size: 0.9em;">Peso normal (${(clasificacionesCount['Peso normal'] / registros.length * 100).toFixed(1)}%)</span>
                    </div>
                    <div style="display: flex; align-items: center; margin: 5px 10px;">
                        <div style="width: 10px; height: 10px; background-color: ${COLORES_FUERTES['Sobrepeso']}; border-radius: 2px; margin-right: 5px;"></div>
                        <span style="font-size: 0.9em;">Sobrepeso (${(clasificacionesCount['Sobrepeso'] / registros.length * 100).toFixed(1)}%)</span>
                    </div>
                    <div style="display: flex; align-items: center; margin: 5px 10px;">
                        <div style="width: 10px; height: 10px; background-color: ${COLORES_FUERTES['Obesidad']}; border-radius: 2px; margin-right: 5px;"></div>
                        <span style="font-size: 0.9em;">Obesidad (${(clasificacionesCount['Obesidad'] / registros.length * 100).toFixed(1)}%)</span>
                    </div>
                    <div style="display: flex; align-items: center; margin: 5px 10px;">
                        <div style="width: 10px; height: 10px; background-color: ${COLORES_FUERTES['Bajo peso']}; border-radius: 2px; margin-right: 5px;"></div>
                        <span style="font-size: 0.9em;">Bajo peso (${(clasificacionesCount['Bajo peso'] / registros.length * 100).toFixed(1)}%)</span>
                    </div>
                </div>


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