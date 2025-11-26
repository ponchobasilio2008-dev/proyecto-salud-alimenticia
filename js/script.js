document.getElementById('imcForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    // 1. Obtener valores y nombre
    const nombre = document.getElementById('nombre').value.trim() || 'Estudiante Anónimo';
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);

    // 2. Validar datos
    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
        alert('Por favor, ingresa valores válidos y positivos para peso y altura.');
        return;
    }

    // 3. Calcular IMC
    const imc = peso / (altura * altura);
    const imcRedondeado = imc.toFixed(2); 

    // 4. Determinar Clasificación
    let clasificacionTexto = '';
    let consejosHTML = '';
    let colorClasificacion = 'text-dark'; 
    
    // Basado en la clasificación de la OMS para adultos
    if (imc < 18.5) {
        clasificacionTexto = 'Bajo peso';
        colorClasificacion = 'text-warning';
        consejosHTML = `
            <p>🚨 **¡Alerta de Bajo Peso!** Tu IMC indica que podrías tener un peso insuficiente.</p>
            <ul>
                <li>**Consulta Médica:** Es vital acudir a un profesional (médico o nutriólogo) para evaluar tu estado de salud.</li>
                <li>**Nutrientes Densos:** Enfócate en alimentos nutritivos y calóricos como nueces, semillas, aguacate y granos enteros.</li>
                <li>**Comidas Regulares:** No te saltes comidas. Asegúrate de tener tres comidas principales y dos colaciones al día.</li>
            </ul>
        `;
    } else if (imc >= 18.5 && imc <= 24.9) {
        clasificacionTexto = 'Peso normal';
        colorClasificacion = 'text-success';
        consejosHTML = `
            <p>✅ **¡Excelente!** Tu IMC está dentro del rango normal.</p>
            <ul>
                <li>**Mantén los Hábitos:** Continúa con una dieta balanceada basada en el Plato del Buen Comer.</li>
                <li>**Actividad Física:** Mantén al menos 150 minutos de ejercicio moderado a la semana.</li>
                <li>**Hidratación:** Prioriza el consumo de agua natural sobre bebidas azucaradas.</li>
            </ul>
        `;
    } else if (imc >= 25.0 && imc <= 29.9) {
        clasificacionTexto = 'Sobrepeso';
        colorClasificacion = 'text-warning';
        consejosHTML = `
            <p>⚠️ **¡Atención!** Tu IMC está en el rango de sobrepeso. Es el momento ideal para hacer ajustes.</p>
            <ul>
                <li>**Reduce Azúcares y Grasas:** Limita el consumo de refrescos, jugos, pan dulce, frituras y comida rápida.</li>
                <li>**Aumenta Fibra:** Incrementa frutas, verduras y cereales integrales para mejorar la saciedad.</li>
                <li>**Control de Porciones:** Sé consciente de las cantidades que consumes en cada comida.</li>
                <li>**Incrementa la Actividad:** Intenta caminar o usar la bicicleta para distancias cortas.</li>
            </ul>
        `;
    } else { // imc >= 30.0
        clasificacionTexto = 'Obesidad';
        colorClasificacion = 'text-danger';
        consejosHTML = `
            <p>🛑 **¡Riesgo Alto!** Tu IMC está en el rango de obesidad, lo cual aumenta el riesgo de enfermedades crónicas.</p>
            <ul>
                <li>**Busca Ayuda Profesional:** Es fundamental iniciar un plan integral con un nutriólogo y un médico.</li>
                <li>**Comidas Frescas:** Prioriza alimentos preparados en casa, controlando la sal y las grasas añadidas.</li>
                <li>**Ejercicio Gradual:** Empieza con caminatas cortas y aumenta la intensidad lentamente. Evita ejercicios de alto impacto sin supervisión.</li>
                <li>**Evita Ultraprocesados:** Elimina o minimiza drásticamente los alimentos ultraprocesados.</li>
            </ul>
        `;
    }


    // 5. REGISTRO EN LOCALSTORAGE (Simulación de base de datos)
    const nuevoRegistro = {
        nombre: nombre,
        imc: imcRedondeado,
        clasificacion: clasificacionTexto,
        fecha: new Date().toLocaleDateString('es-MX')
    };

    // Obtener registros existentes o inicializar un array vacío
    let registros = JSON.parse(localStorage.getItem('registrosIMC')) || [];
    
    // Agregar el nuevo registro
    registros.push(nuevoRegistro);
    
    // Guardar la lista actualizada
    localStorage.setItem('registrosIMC', JSON.stringify(registros));
    
    // 6. Mostrar Resultados en el DOM 
    document.getElementById('valorIMC').textContent = imcRedondeado;
    
    const clasificacionElement = document.getElementById('clasificacion');
    clasificacionElement.textContent = clasificacionTexto;
    clasificacionElement.className = `fw-bold fs-3 ${colorClasificacion}`; 
    
    document.getElementById('consejos').innerHTML = consejosHTML;
    
    document.getElementById('resultadoIMC').style.display = 'block';
    document.getElementById('mensajeInicial').style.display = 'none';
});

// ===========================================
// FUNCIONALIDAD DE IMPRESIÓN Y REPORTES
// ===========================================

// Referencia a los botones
const btnImprimirIndividual = document.getElementById('btnImprimirIndividual');
const btnImprimirGeneral = document.getElementById('btnImprimirGeneral');

// La tabla de la OMS (para usar en el reporte individual)
const tablaOMSHTML = `
    <h4 style="color: #198754;">Tabla de IMC 2024 de la OMS (Índice de Masa Corporal)</h4>
    <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
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
            <tr><td style="border: 1px solid #ddd; padding: 8px;">30.0 - 34.9</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #ffccbc;">Obesidad Clase I</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">35.0 - 39.9</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #ffab91;">Obesidad Clase II</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 8px;">Más de 40.0</td><td style="border: 1px solid #ddd; padding: 8px; background-color: #ff8a65;">Obesidad Clase III</td></tr>
        </tbody>
    </table>
    <p style="font-size: 0.8em; margin-top: 5px;">Fuente: Organización Mundial de la Salud (OMS)</p>
`;


// --- Funcionalidad para Imprimir Reporte Personal (imc.html) ---
if (btnImprimirIndividual) {
    btnImprimirIndividual.addEventListener('click', () => {
        const nombre = document.getElementById('nombreInput').value || 'Anónimo';
        const valorIMC = document.getElementById('valorIMC').innerText;
        const clasificacionIMC = document.getElementById('clasificacionIMC').innerText;
        const recomendacionesHTML = document.getElementById('recomendaciones').innerHTML;
        const fechaActual = new Date().toLocaleDateString('es-ES');

        const contenidoImprimir = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h1 style="color: #198754; text-align: center;">Reporte Personal de IMC</h1>
                <p style="text-align: right; font-size: 0.9em;">Fecha del Reporte: ${fechaActual}</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">

                <h3 style="color: #0d6efd;">Datos Personales</h3>
                <p><strong>Nombre:</strong> ${nombre}</p>
                
                <h3 style="color: #0d6efd;">Resultados de IMC</h3>
                <p><strong>Valor de IMC:</strong> <span style="font-size: 1.5em; font-weight: bold; color: #dc3545;">${valorIMC}</span></p>
                <p><strong>Clasificación:</strong> <span style="font-size: 1.2em; font-weight: bold;">${clasificacionIMC}</span></p>
                
                <h3 style="color: #0d6efd;">Recomendaciones Personalizadas</h3>
                ${recomendacionesHTML}

                <hr style="border: 1px solid #eee; margin: 20px 0;">
                
                ${tablaOMSHTML}

                <p style="margin-top: 30px; font-size: 0.8em; text-align: center; color: #666;">
                    Este reporte es solo con fines informativos y no reemplaza la consulta profesional con un médico o nutriólogo.
                </p>
            </div>
        `;

        // Abrir una nueva ventana para imprimir
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
    });

    // Mostrar el botón de imprimir una vez que se calculan los resultados
    document.getElementById('calcularIMC').addEventListener('click', () => {
        if (!document.getElementById('resultadoIMC').classList.contains('d-none')) {
            btnImprimirIndividual.classList.remove('d-none');
        }
    });
}


// --- Funcionalidad para Imprimir Reporte General (comunidad.html) ---
if (btnImprimirGeneral) {
    btnImprimirGeneral.addEventListener('click', () => {
        const registros = JSON.parse(localStorage.getItem('registrosIMC')) || [];
        const fechaActual = new Date().toLocaleDateString('es-ES');

        if (registros.length === 0) {
            alert('No hay registros para generar un reporte general.');
            return;
        }

        // Calcular promedios y estadísticas
        let totalIMC = 0;
        const clasificacionesCount = {
            'Bajo peso': 0,
            'Peso normal': 0,
            'Sobrepeso': 0,
            'Obesidad Clase I': 0,
            'Obesidad Clase II': 0,
            'Obesidad Clase III': 0
        };

        registros.forEach(registro => {
            totalIMC += parseFloat(registro.imc);
            if (clasificacionesCount[registro.clasificacion]) {
                clasificacionesCount[registro.clasificacion]++;
            } else { // Manejo de clasificaciones no estándar por si acaso
                clasificacionesCount[registro.clasificacion] = 1;
            }
        });

        const promedioIMC = (totalIMC / registros.length).toFixed(2);
        
        // Crear lista de distribución de clasificaciones
        let distribucionClasificacionesHTML = '<ul>';
        for (const clasif in clasificacionesCount) {
            if (clasificacionesCount[clasif] > 0) {
                const porcentaje = ((clasificacionesCount[clasif] / registros.length) * 100).toFixed(1);
                distribucionClasificacionesHTML += `<li>${clasif}: ${clasificacionesCount[clasif]} personas (${porcentaje}%)</li>`;
            }
        }
        distribucionClasificacionesHTML += '</ul>';

        // Crear tabla de registros individuales
        let tablaRegistrosHTML = `
            <h4 style="color: #198754; margin-top: 30px;">Detalle de Registros Individuales</h4>
            <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
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
                <p><strong>Total de Registros:</strong> ${registros.length}</p>
                <p><strong>Promedio de IMC de la Comunidad:</strong> <span style="font-size: 1.5em; font-weight: bold; color: #dc3545;">${promedioIMC}</span></p>

                <h4 style="color: #198754;">Distribución de Clasificaciones</h4>
                ${distribucionClasificacionesHTML}

                <hr style="border: 1px solid #eee; margin: 20px 0;">

                ${tablaRegistrosHTML}
                
                <p style="margin-top: 30px; font-size: 0.8em; text-align: center; color: #666;">
                    Este reporte es un resumen estadístico de los datos ingresados localmente por la comunidad.
                </p>
            </div>
        `;

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

    // Mostrar el botón de imprimir general si hay registros
    const registrosCargados = JSON.parse(localStorage.getItem('registrosIMC')) || [];
    if (registrosCargados.length > 0) {
        btnImprimirGeneral.classList.remove('d-none');
    }
}