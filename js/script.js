// ===========================================
// LÓGICA PRINCIPAL: CÁLCULO, REGISTRO Y RECOMENDACIONES
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
    'Obesidad': '#DC3545',     // Rojo fuerte (Danger)
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
    <h4 style="color: #198754;">Tabla de Clasificación IMC (OMS)</h4>
    <table style="width:100%; border-collapse: collapse; margin-top: 15px; font-size: 0.9em;">
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
    <p style="font-size: 0.8em; margin-top: 5px;">Fuente: Organización Mundial de la Salud (OMS)</p>
`;

/**
 * Genera las recomendaciones de texto según el IMC.
 */
function generarRecomendaciones(imc) {
    let consejosHTML = '';
    
    if (imc < 18.5) {
        consejosHTML = `
            <p>🚨 **¡Alerta de Bajo Peso!**</p>
            <ul>
                <li>Consulta Médica: Es vital acudir a un profesional.</li>
                <li>Nutrientes Densos: Enfócate en alimentos nutritivos y calóricos.</li>
                <li>Comidas Regulares: Asegúrate de tener tres comidas principales y dos colaciones.</li>
            </ul>
        `;
    } else if (imc >= 18.5 && imc <= 24.9) {
        consejosHTML = `
            <p>✅ **¡Excelente! Peso Normal**</p>
            <ul>
                <li>Mantén los Hábitos: Continúa con una dieta balanceada.</li>
                <li>Actividad Física: Mantén al menos 150 minutos de ejercicio moderado.</li>
                <li>Hidratación: Prioriza el consumo de agua natural.</li>
            </ul>
        `;
    } else if (imc >= 25.0 && imc <= 29.9) {
        consejosHTML = `
            <p>⚠️ **¡Atención! Sobrepeso**</p>
            <ul>
                <li>Reduce Azúcares: Limita refrescos y jugos.</li>
                <li>Aumenta Fibra: Incrementa frutas, verduras y cereales.</li>
                <li>Actividad: Intenta caminar más o usar la bicicleta.</li>
            </ul>
        `;
    } else { // imc >= 30.0
        consejosHTML = `
            <p>🛑 **¡Riesgo Alto! Obesidad**</p>
            <ul>
                <li>Busca Ayuda Profesional: Inicia un plan con nutriólogo.</li>
                <li>Ejercicio Gradual: Empieza con caminatas cortas.</li>
                <li>Evita Ultraprocesados: Elimina alimentos con sellos de exceso.</li>
            </ul>
        `;
    }
    return consejosHTML;
}

/**
 * GRÁFICA GAUGE (MEDIDOR) PARA REPORTE INDIVIDUAL
 * Muestra el IMC específico del usuario en un arco de colores.
 */
function generarGraficaGauge(imcVal) {
    const minIMC = 10;
    const maxIMC = 45;
    const clampedIMC = Math.min(Math.max(imcVal, minIMC), maxIMC);
    const rotationAngle = ((clampedIMC - minIMC) / (maxIMC - minIMC)) * 180;

    // Colores del arco
    const cBajo = COLORES_FUERTES['Bajo peso'];
    const cNormal = COLORES_FUERTES['Peso normal'];
    const cSobre = COLORES_FUERTES['Sobrepeso'];
    const cObes = COLORES_FUERTES['Obesidad'];

    // Gradiente cónico para simular el arco del medidor
    const gradient = `conic-gradient(from 270deg, 
        ${cBajo} 0deg 43deg, 
        ${cNormal} 43deg 77deg, 
        ${cSobre} 77deg 103deg, 
        ${cObes} 103deg 180deg)`;

    return `
        <div style="margin: 20px auto; width: 300px; text-align: center;">
            <h4 style="color: #198754; margin-bottom: 10px;">Tu Ubicación en la Gráfica OMS</h4>
            <div style="width: 300px; height: 150px; overflow: hidden; position: relative; margin: 0 auto;">
                <div style="width: 300px; height: 300px; border-radius: 50%; background: ${gradient}; position: absolute; top: 0; left:0;"></div>
                <div style="width: 220px; height: 220px; border-radius: 50%; background: white; position: absolute; top: 40px; left: 40px;"></div>
                
                <div style="
                    position: absolute; bottom: 0; left: 50%;
                    width: 4px; height: 140px; background: #333;
                    transform-origin: bottom center;
                    transform: translateX(-50%) rotate(${rotationAngle}deg);
                    z-index: 10;
                ">
                     <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 15px solid #333; position: absolute; top: -10px; left: -6px;"></div>
                </div>
                <div style="width: 20px; height: 20px; background: #333; border-radius: 50%; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); z-index: 11;"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; width: 300px; margin: 5px auto 0; font-size: 0.8em; color: #555; font-weight: bold;">
                <span style="color: ${cBajo}">Bajo</span>
                <span style="color: ${cNormal}">Normal</span>
                <span style="color: ${cSobre}">Sobre</span>
                <span style="color: ${cObes}">Obesidad</span>
            </div>
             <p style="margin-top: 10px; font-weight: bold; font-size: 1.3em; color: #333;">Tu IMC: ${imcVal}</p>
        </div>
    `;
}

/**
 * GRÁFICA PASTEL (DONUT) PARA REPORTE GENERAL
 * Muestra la distribución estadística con colores fuertes y leyenda.
 */
function generarGraficaEstadistica(counts, total) {
    if (total === 0) return '';

    let gradientStops = '';
    let currentStop = 0;
    let simbologiaHTML = '';

    const sortedClasificaciones = ['Bajo peso', 'Peso normal', 'Sobrepeso', 'Obesidad'];

    sortedClasificaciones.forEach(clasif => {
        const value = counts[clasif];
        if (value > 0) {
            const color = COLORES_FUERTES[clasif];
            const percentage = (value / total) * 100;
            const nextStop = currentStop + percentage;
            
            gradientStops += `${color} ${currentStop}% ${nextStop}%, `;
            currentStop = nextStop;

            simbologiaHTML += `
                <div style="display: flex; align-items: center; margin: 5px 0;">
                    <div style="width: 15px; height: 15px; background-color: ${color}; border-radius: 3px; margin-right: 8px;"></div>
                    <span style="font-size: 0.9em; color: #333;">${clasif}: <strong>${percentage.toFixed(1)}%</strong></span>
                </div>
            `;
        }
    });
    gradientStops = gradientStops.slice(0, -2);

    return `
        <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0; gap: 30px;">
            <div style="
                width: 160px;
                height: 160px;
                border-radius: 50%;
                background: conic-gradient(${gradientStops});
                position: relative;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            ">
                <div style="
                    position: absolute;
                    top: 35px;
                    left: 35px;
                    width: 90px;
                    height: 90px;
                    background: white;
                    border-radius: 50%;
                "></div>
            </div>
            
            <div style="display: flex; flex-direction: column;">
                ${simbologiaHTML}
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
    
    // Generar gráfica visual del medidor
    const graficaGaugeHTML = generarGraficaGauge(parseFloat(valorIMC));

    const contenidoImprimir = `
        <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 800px; margin: 0 auto;">
            <div style="border-bottom: 2px solid #198754; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <h1 style="color: #198754; margin: 0; font-size: 24px;">Reporte Personal de IMC</h1>
                <span style="font-size: 0.9em; color: #666;">Fecha: ${fecha}</span>
            </div>

            <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                <div style="flex: 1;">
                    <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px;">Datos del Estudiante</h3>
                    <p style="font-size: 1.1em;"><strong>Nombre:</strong> ${nombre}</p>
                    <p style="font-size: 1.1em;"><strong>IMC Calculado:</strong> <span style="font-size: 1.4em; font-weight: bold; color: #333;">${valorIMC}</span></p>
                    <p style="font-size: 1.1em;"><strong>Clasificación:</strong> <span style="font-weight: bold; color: ${COLORES_FUERTES[clasificacionIMC] || '#333'};">${clasificacionIMC}</span></p>
                </div>
                <div style="flex: 1;">
                    ${graficaGaugeHTML}
                </div>
            </div>
            
            <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px;">Recomendaciones Personalizadas</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #0d6efd;">
                ${recomendacionesHTML}
            </div>

            <div style="margin-top: 30px;">
                ${tablaOMSHTML}
            </div>

            <div style="margin-top: 40px; border-top: 1px solid #ccc; pt: 10px; text-align: center; font-size: 0.8em; color: #888;">
                <p>© 2025 Proyecto Salud Estudiantil. Este reporte es informativo y no sustituye una consulta médica.</p>
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

    const promedioIMC = (totalIMC / registros.length).toFixed(2);
    const graficaHTML = generarGraficaEstadistica(clasificacionesCount, registros.length);

    // Generar filas de la tabla con colores
    let filasTabla = '';
    registros.forEach(registro => {
        let clasifBase = registro.clasificacion;
        if (clasifBase.includes('Obesidad')) clasifBase = 'Obesidad';
        const colorFondo = COLORES_PASTEL[clasifBase] || 'transparent';

        filasTabla += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${registro.nombre}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${registro.imc}</td>
                <td style="border: 1px solid #ddd; padding: 8px; background-color: ${colorFondo};">${registro.clasificacion}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${registro.fecha}</td>
            </tr>
        `;
    });

    const contenidoImprimir = `
        <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 800px; margin: 0 auto;">
            <div style="border-bottom: 2px solid #198754; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <h1 style="color: #198754; margin: 0; font-size: 24px;">Reporte General de la Comunidad</h1>
                <span style="font-size: 0.9em; color: #666;">Fecha: ${fechaActual}</span>
            </div>

            <div style="display: flex; gap: 20px; margin-bottom: 30px; align-items: center;">
                <div style="flex: 1;">
                    <h3 style="color: #0d6efd;">Resumen Estadístico</h3>
                    <p style="font-size: 1.1em;"><strong>Total de Estudiantes:</strong> ${registros.length}</p>
                    <p style="font-size: 1.1em;"><strong>Promedio de IMC General:</strong> <span style="font-size: 1.4em; font-weight: bold; color: #333;">${promedioIMC}</span></p>
                </div>
                <div style="flex: 1;">
                    <h4 style="text-align: center; color: #666; margin-bottom: 10px;">Distribución de Casos</h4>
                    ${graficaHTML}
                </div>
            </div>

            <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px;">Detalle de Registros</h3>
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

            <div style="margin-top: 40px; border-top: 1px solid #ccc; pt: 10px; text-align: center; font-size: 0.8em; color: #888;">
                <p>© 2025 Proyecto Salud Estudiantil. Resumen estadístico de datos locales.</p>
            </div>
        </div>
    `;

    abrirVentanaImpresion(contenidoImprimir);
}

// Función auxiliar para abrir la ventana
function abrirVentanaImpresion(contenido) {
    const ventana = window.open('', '_blank');
    ventana.document.write('<html><head><title>Reporte de Salud</title>');
    ventana.document.write('<style>body { margin: 0; padding: 0; font-family: sans-serif; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }</style>');
    ventana.document.write('</head><body>');
    ventana.document.write(contenido);
    ventana.document.write('</body></html>');
    ventana.document.close();
    setTimeout(() => { ventana.print(); }, 500);
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