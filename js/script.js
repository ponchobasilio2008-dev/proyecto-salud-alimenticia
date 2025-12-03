// ===========================================
// LÓGICA PRINCIPAL Y CONFIGURACIÓN
// ===========================================

// --- Variables y referencias globales ---
const btnImprimirIndividual = document.getElementById('btnImprimirIndividual');
const btnImprimirGeneral = document.getElementById('btnImprimirGeneral');
const imcForm = document.getElementById('imcForm');

// Mapeo de colores FUERTES para máxima visibilidad en gráficas
const COLORES_FUERTES = {
    'Bajo peso': '#00A0E3',    // Azul fuerte
    'Peso normal': '#28A745',  // Verde fuerte (Success)
    'Sobrepeso': '#FFC107',    // Amarillo/Naranja fuerte
    'Obesidad': '#DC3545',     // Rojo (Danger)
};

// Mapeo de colores PASTEL para fondos de tabla (más suaves para leer texto)
const COLORES_PASTEL = {
    'Bajo peso': '#e1f5fe',    
    'Peso normal': '#e8f5e9',  
    'Sobrepeso': '#fffde7',    
    'Obesidad': '#ffebee',     
};

// La tabla de la OMS para el reporte
const tablaOMSHTML = `
    <h4 style="color: #198754; margin-top: 20px;">Tabla de Clasificación IMC (OMS)</h4>
    <table style="width:100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9em;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">IMC (kg/m²)</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Clasificación</th>
            </tr>
        </thead>
        <tbody>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">Menos de 18.5</td><td style="border: 1px solid #ddd; padding: 8px; background-color: ${COLORES_PASTEL['Bajo peso']};">Bajo peso</td></tr> 
            <tr><td style="border: 1px solid #ddd; padding: 8px;">18.5 - 24.9</td><td style="border: 1px solid #ddd; padding: 8px; background-color: ${COLORES_PASTEL['Peso normal']};">Peso normal</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">25.0 - 29.9</td><td style="border: 1px solid #ddd; padding: 8px; background-color: ${COLORES_PASTEL['Sobrepeso']};">Sobrepeso</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">30.0 o más</td><td style="border: 1px solid #ddd; padding: 8px; background-color: ${COLORES_PASTEL['Obesidad']};">Obesidad</td></tr>
        </tbody>
    </table>
    <p style="font-size: 0.8em; margin-top: 5px; color: #666;">Fuente: Organización Mundial de la Salud (OMS). Rangos estándar para adultos.</p>
`;

/**
 * Genera las recomendaciones de texto según el IMC.
 */
function generarRecomendaciones(imc) {
    let consejosHTML = '';
    
    if (imc < 18.5) {
        consejosHTML = `
            <p style="font-weight: bold; color: ${COLORES_FUERTES['Bajo peso']}">🚨 ¡Alerta de Bajo Peso!</p>
            <ul>
                <li>Consulta Médica: Es vital acudir a un profesional.</li>
                <li>Nutrientes Densos: Enfócate en alimentos nutritivos y calóricos.</li>
            </ul>
        `;
    } else if (imc >= 18.5 && imc <= 24.9) {
        consejosHTML = `
            <p style="font-weight: bold; color: ${COLORES_FUERTES['Peso normal']}">✅ ¡Excelente! Peso Normal</p>
            <ul>
                <li>Mantén los Hábitos: Continúa con una dieta balanceada.</li>
                <li>Actividad Física: Mantén al menos 150 minutos de ejercicio moderado semanal.</li>
            </ul>
        `;
    } else if (imc >= 25.0 && imc <= 29.9) {
        consejosHTML = `
            <p style="font-weight: bold; color: ${COLORES_FUERTES['Sobrepeso']}">⚠️ ¡Atención! Sobrepeso</p>
            <ul>
                <li>Reduce Azúcares: Limita refrescos, jugos y comida rápida.</li>
                <li>Aumenta Fibra: Incrementa el consumo de verduras y agua simple.</li>
            </ul>
        `;
    } else { // imc >= 30.0
        consejosHTML = `
            <p style="font-weight: bold; color: ${COLORES_FUERTES['Obesidad']}">🛑 ¡Riesgo Alto! Obesidad</p>
            <ul>
                <li>Busca Ayuda Profesional: Inicia un plan con nutriólogo y médico.</li>
                <li>Evita Ultraprocesados: Elimina alimentos con sellos de exceso.</li>
            </ul>
        `;
    }
    return consejosHTML;
}

/**
 * =========================================================
 * NUEVA GRÁFICA GAUGE (MEDIDOR) DEFINITIVA
 * =========================================================
 * Genera el medidor estilo "velocímetro" con el valor IMC DENTRO de la gráfica.
 * Se usa tanto para reportes individuales como para el promedio general.
 */
function generarGraficaGauge(imcVal, tituloGrafica = "Ubicación en el Espectro IMC") {
    // 1. Definir límites visuales (ej. IMC de 14 a 40 para que se vea bien)
    const minVisualIMC = 14;
    const maxVisualIMC = 40;
    const clampedIMC = Math.min(Math.max(imcVal, minVisualIMC), maxVisualIMC);

    // 2. Calcular ángulo de la aguja (0 a 180 grados)
    const rotationAngle = ((clampedIMC - minVisualIMC) / (maxVisualIMC - minVisualIMC)) * 180;

    // Colores
    const cBajo = COLORES_FUERTES['Bajo peso'];
    const cNormal = COLORES_FUERTES['Peso normal'];
    const cSobre = COLORES_FUERTES['Sobrepeso'];
    const cObes = COLORES_FUERTES['Obesidad'];

    // Gradiente cónico para el arco (ajustado para parecerse a la imagen de referencia)
    const gradient = `conic-gradient(from 270deg, 
        ${cBajo} 0deg 30deg, 
        ${cNormal} 30deg 85deg, 
        ${cSobre} 85deg 125deg, 
        ${cObes} 125deg 180deg)`;

    return `
        <div style="margin: 20px auto; width: 350px; text-align: center; font-family: sans-serif;">
            <h4 style="color: #333; margin-bottom: 15px;">${tituloGrafica}</h4>
            
            <div style="width: 350px; height: 175px; overflow: hidden; position: relative; margin: 0 auto;">
                
                <div style="width: 350px; height: 350px; border-radius: 50%; background: ${gradient}; position: absolute; top: 0; left:0; box-shadow: inset 0 0 10px rgba(0,0,0,0.1);"></div>
                
                <div style="
                    width: 250px; height: 250px; 
                    border-radius: 50%; background: white; 
                    position: absolute; top: 50px; left: 50px;
                    display: flex; justify-content: center; align-items: flex-start;
                    padding-top: 50px; box-sizing: border-box;
                    box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
                ">
                    <div style="text-align: center;">
                        <span style="font-size: 2.5em; font-weight: bold; color: #333; display: block; line-height: 1;">${imcVal.toFixed(1)}</span>
                        <span style="font-size: 0.9em; color: #777;">IMC (kg/m²)</span>
                    </div>
                </div>
                
                <div style="
                    position: absolute; bottom: 0; left: 50%;
                    width: 6px; height: 165px; /* Altura ajustada */
                    background: transparent;
                    transform-origin: bottom center;
                    transform: translateX(-50%) rotate(${rotationAngle}deg);
                    z-index: 10;
                ">
                     <div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 25px solid #333; position: absolute; top: 10px; left: -7px;"></div>
                </div>
                <div style="width: 24px; height: 24px; background: #333; border-radius: 50%; position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); z-index: 11;"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; width: 350px; margin: 15px auto 0; font-size: 0.9em; color: #555; font-weight: bold; border-top: 1px solid #eee; padding-top: 5px;">
                <span style="color: ${cBajo}">Bajo Peso</span>
                <span style="color: ${cNormal}">Normal</span>
                <span style="color: ${cSobre}">Sobrepeso</span>
                <span style="color: ${cObes}">Obesidad</span>
            </div>
        </div>
    `;
}


// --- Lógica del Formulario de Cálculo (imc.html) ---
if (imcForm) {
    imcForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const nombre = document.getElementById('nombre').value.trim() || 'Estudiante Anónimo';
        const peso = parseFloat(document.getElementById('peso').value);
        const altura = parseFloat(document.getElementById('altura').value);

        if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
            alert('Por favor, ingresa valores válidos y positivos.');
            return;
        }

        const imc = peso / (altura * altura);
        const imcRedondeado = imc.toFixed(2); 

        let clasificacionTexto = '';
        let colorClasificacion = 'text-dark'; 
        
        if (imc < 18.5) { clasificacionTexto = 'Bajo peso'; colorClasificacion = 'text-warning'; } 
        else if (imc >= 18.5 && imc <= 24.9) { clasificacionTexto = 'Peso normal'; colorClasificacion = 'text-success'; } 
        else if (imc >= 25.0 && imc <= 29.9) { clasificacionTexto = 'Sobrepeso'; colorClasificacion = 'text-warning'; } 
        else { clasificacionTexto = 'Obesidad'; colorClasificacion = 'text-danger'; }

        const consejosHTML = generarRecomendaciones(imc);

        // Registro
        const nuevoRegistro = { nombre, imc: imcRedondeado, clasificacion: clasificacionTexto, fecha: new Date().toLocaleDateString('es-MX') };
        let registros = JSON.parse(localStorage.getItem('registrosIMC')) || [];
        registros.push(nuevoRegistro);
        localStorage.setItem('registrosIMC', JSON.stringify(registros));
        
        // Mostrar
        document.getElementById('valorIMC').textContent = imcRedondeado;
        document.getElementById('clasificacion').textContent = clasificacionTexto;
        document.getElementById('clasificacion').className = `fw-bold fs-3 ${colorClasificacion}`; 
        document.getElementById('consejos').innerHTML = consejosHTML;
        document.getElementById('resultadoIMC').style.display = 'block';
        document.getElementById('mensajeInicial').style.display = 'none';

        if (btnImprimirIndividual) btnImprimirIndividual.style.display = 'block';
    });
}

// --- Función Central de Impresión (Reporte Individual) ---
function imprimirReporte(nombre, valorIMC, clasificacionIMC, recomendacionesHTML, fecha) {
    
    // Generar gráfica Gauge para el IMC individual
    const graficaGaugeHTML = generarGraficaGauge(parseFloat(valorIMC), "Tu Ubicación Personal");

    const contenidoImprimir = `
        <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 850px; margin: 0 auto; background: white;">
            <div style="border-bottom: 3px solid #198754; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
                <h1 style="color: #198754; margin: 0; font-size: 28px;">Reporte Personal de IMC</h1>
                <div style="text-align: right;">
                    <p style="margin: 0; font-weight: bold; font-size: 1.1em;">${nombre}</p>
                    <span style="font-size: 0.9em; color: #666;">Fecha: ${fecha}</span>
                </div>
            </div>

            <div style="display: flex; gap: 30px; margin-bottom: 30px; align-items: center;">
                <div style="flex: 1; background: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    <h3 style="color: #0d6efd; margin-top: 0;">Diagnóstico</h3>
                    <p style="font-size: 1.1em; margin-bottom: 10px;">Tu Índice de Masa Corporal es:</p>
                    <p style="font-size: 2.5em; font-weight: bold; color: #333; margin: 10px 0; text-align: center;">${valorIMC}</p>
                    <p style="font-size: 1.1em; text-align: center;">Clasificación: <span style="font-weight: bold; padding: 5px 10px; border-radius: 4px; background-color: ${COLORES_PASTEL[clasificacionIMC] || '#eee'}; color: ${COLORES_FUERTES[clasificacionIMC] || '#333'};">${clasificacionIMC}</span></p>
                </div>
                <div style="flex: 1.2;">
                    ${graficaGaugeHTML}
                </div>
            </div>
            
            <div style="display: flex; gap: 30px;">
                <div style="flex: 1;">
                     <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px;">Recomendaciones</h3>
                     ${recomendacionesHTML}
                </div>
                <div style="flex: 1;">
                    ${tablaOMSHTML}
                </div>
            </div>

            <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 15px; text-align: center; font-size: 0.8em; color: #888;">
                <p>Proyecto Salud Estudiantil 2025. Este reporte es una herramienta informativa y no sustituye el consejo médico profesional.</p>
            </div>
        </div>
    `;

    abrirVentanaImpresion(contenidoImprimir);
}

// --- Función Central de Impresión (Reporte General) ---
function imprimirReporteGeneral() {
    const registros = JSON.parse(localStorage.getItem('registrosIMC')) || [];
    const fechaActual = new Date().toLocaleDateString('es-ES');

    if (registros.length === 0) {
        alert('No hay registros para generar un reporte.');
        return;
    }

    let totalIMC = 0;
    const clasificacionesCount = { 'Bajo peso': 0, 'Peso normal': 0, 'Sobrepeso': 0, 'Obesidad': 0 };

    registros.forEach(registro => {
        totalIMC += parseFloat(registro.imc);
        let clasif = registro.clasificacion;
        if (clasif.includes('Obesidad')) clasif = 'Obesidad';
        if (clasificacionesCount.hasOwnProperty(clasif)) clasificacionesCount[clasif]++;
        else clasificacionesCount[clasif] = 1;
    });

    const promedioIMC = (totalIMC / registros.length); // Mantenemos como número para la gráfica
    const promedioIMCStr = promedioIMC.toFixed(2); // String para mostrar
    
    // USA LA MISMA GRÁFICA GAUGE PARA EL PROMEDIO GENERAL
    const graficaHTML = generarGraficaGauge(promedioIMC, "Promedio General de la Comunidad");

    // Generar filas de la tabla con colores pastel
    let filasTabla = '';
    registros.forEach(registro => {
        let clasifBase = registro.clasificacion;
        if (clasifBase.includes('Obesidad')) clasifBase = 'Obesidad';
        const colorFondo = COLORES_PASTEL[clasifBase] || 'transparent';

        filasTabla += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${registro.nombre}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${registro.imc}</td>
                <td style="border: 1px solid #ddd; padding: 8px; background-color: ${colorFondo};">${registro.clasificacion}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${registro.fecha}</td>
            </tr>
        `;
    });

    const contenidoImprimir = `
        <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 850px; margin: 0 auto; background: white;">
            <div style="border-bottom: 3px solid #198754; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
                <h1 style="color: #198754; margin: 0; font-size: 28px;">Reporte General de Comunidad</h1>
                <span style="font-size: 0.9em; color: #666;">Fecha: ${fechaActual}</span>
            </div>

            <div style="display: flex; gap: 30px; margin-bottom: 30px; align-items: center;">
                <div style="flex: 1;">
                    <h3 style="color: #0d6efd;">Resumen Estadístico</h3>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <p style="font-size: 1.2em; margin-bottom: 15px;"><strong>Total de Estudiantes:</strong> ${registros.length}</p>
                        <p style="font-size: 1.2em;"><strong>Promedio IMC General:</strong></p>
                        <p style="font-size: 3em; font-weight: bold; color: #333; margin: 10px 0; line-height: 1;">${promedioIMCStr}</p>
                    </div>
                    
                    <h4 style="margin-top: 20px; color: #555;">Distribución (Conteo):</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li><span style="color:${COLORES_FUERTES['Peso normal']}">■</span> Normal: ${clasificacionesCount['Peso normal']}</li>
                        <li><span style="color:${COLORES_FUERTES['Sobrepeso']}">■</span> Sobrepeso: ${clasificacionesCount['Sobrepeso']}</li>
                        <li><span style="color:${COLORES_FUERTES['Obesidad']}">■</span> Obesidad: ${clasificacionesCount['Obesidad']}</li>
                         <li><span style="color:${COLORES_FUERTES['Bajo peso']}">■</span> Bajo peso: ${clasificacionesCount['Bajo peso']}</li>
                    </ul>
                </div>
                <div style="flex: 1.3;">
                    ${graficaHTML}
                </div>
            </div>

            <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px; page-break-before: always;">Detalle de Registros Individuales</h3>
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
                    ${filasTabla}
                </tbody>
            </table>

            <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 15px; text-align: center; font-size: 0.8em; color: #888;">
                <p>Proyecto Salud Estudiantil 2025. Resumen estadístico basado en registros locales.</p>
            </div>
        </div>
    `;

    abrirVentanaImpresion(contenidoImprimir);
}

// Función auxiliar para abrir la ventana y asegurar estilos de impresión
function abrirVentanaImpresion(contenido) {
    const ventana = window.open('', '_blank');
    ventana.document.write('<html><head><title>Reporte de Salud</title>');
    ventana.document.write('<style>');
    ventana.document.write('body { margin: 0; padding: 20px; font-family: sans-serif; background: #f4f4f4; }');
    // CSS crucial para que los colores de fondo y gradientes se impriman
    ventana.document.write('@media print { body { background: white; padding: 0; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; } }');
    ventana.document.write('</style>');
    ventana.document.write('</head><body>');
    ventana.document.write(contenido);
    ventana.document.write('</body></html>');
    ventana.document.close();
    // Retraso para asegurar carga de estilos antes de imprimir
    setTimeout(() => { ventana.print(); }, 800);
}

// --- Event Listeners para los botones ---
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

if (btnImprimirGeneral) {
    btnImprimirGeneral.addEventListener('click', imprimirReporteGeneral);
}

// Evento global para botones dinámicos en la lista de comunidad
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-reporte-individual')) {
        const btn = e.target;
        const imcVal = parseFloat(btn.getAttribute('data-imc'));
        const nombre = btn.getAttribute('data-nombre');
        const imcRedondeado = btn.getAttribute('data-imc');
        const clasificacionTexto = btn.getAttribute('data-clasificacion');
        const fecha = btn.getAttribute('data-fecha');
        
        const recomendacionesHTML = generarRecomendaciones(imcVal);
        imprimirReporte(nombre, imcRedondeado, clasificacionTexto, recomendacionesHTML, fecha);
    }
});