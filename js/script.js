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