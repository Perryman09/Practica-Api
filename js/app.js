/**
 * AutoFetch.world - Lógica JavaScript de la Aplicación
 * Demostración didáctica del consumo de servicios web usando la API nativa fetch()
 * de JavaScript (async/await y Promesas tradicionales .then/.catch)
 * Consumiendo la API pública mundial de vehículos: NHTSA vPIC (US Dept of Transportation)
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Elementos del DOM
    // -------------------------------------------------------------------------
    const brandInput = document.getElementById('brandInput');
    const yearInput = document.getElementById('yearInput');
    const vinInput = document.getElementById('vinInput');
    const btnFetchAsync = document.getElementById('btnFetchAsync');
    const btnFetchPromises = document.getElementById('btnFetchPromises');

    // Secciones y contenedores dinámicos
    const brandInputsGroup = document.getElementById('brandInputsGroup');
    const vinInputsGroup = document.getElementById('vinInputsGroup');
    const urlDisplay = document.getElementById('urlDisplay');

    // Métricas HTTP
    const metricsBar = document.getElementById('metricsBar');
    const metricStatus = document.getElementById('metricStatus');
    const metricTime = document.getElementById('metricTime');
    const metricType = document.getElementById('metricType');
    const metricMode = document.getElementById('metricMode');
    const metricCount = document.getElementById('metricCount');

    // Display y Visores
    const vehicleDisplay = document.getElementById('vehicleDisplay');
    const jsonOutput = document.getElementById('jsonOutput');
    const codeSnippetContent = document.getElementById('codeSnippetContent');
    const codeTitle = document.getElementById('codeTitle');
    const btnCopyJson = document.getElementById('btnCopyJson');
    const btnCopyCode = document.getElementById('btnCopyCode');

    // Endpoint Selector Buttons
    const endpointBtns = document.querySelectorAll('.endpoint-btn');
    const brandChips = document.querySelectorAll('.brand-chip');

    // Pestañas (Tabs)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // -------------------------------------------------------------------------
    // 2. Estado Global y Metadatos de Marcas Mundiales
    // -------------------------------------------------------------------------
    let currentEndpointMode = 'models'; // 'models' | 'models-year' | 'vin'
    let currentFetchedData = null;
    let allCurrentModels = [];

    const brandInfoMap = {
        'toyota': { country: 'Japón', flag: '🇯🇵', emblem: '🚗', name: 'Toyota Motor Corp.' },
        'bmw': { country: 'Alemania', flag: '🇩🇪', emblem: '🏎️', name: 'Bayerische Motoren Werke AG' },
        'ferrari': { country: 'Italia', flag: '🇮🇹', emblem: '🐎', name: 'Ferrari N.V.' },
        'tesla': { country: 'Estados Unidos', flag: '🇺🇸', emblem: '⚡', name: 'Tesla, Inc.' },
        'porsche': { country: 'Alemania', flag: '🇩🇪', emblem: '🏁', name: 'Dr. Ing. h.c. F. Porsche AG' },
        'ford': { country: 'Estados Unidos', flag: '🇺🇸', emblem: '🚙', name: 'Ford Motor Company' },
        'honda': { country: 'Japón', flag: '🇯🇵', emblem: '🚘', name: 'Honda Motor Co., Ltd.' },
        'mercedes-benz': { country: 'Alemania', flag: '🇩🇪', emblem: '⭐', name: 'Mercedes-Benz Group AG' },
        'mercedes': { country: 'Alemania', flag: '🇩🇪', emblem: '⭐', name: 'Mercedes-Benz Group AG' },
        'hyundai': { country: 'Corea del Sur', flag: '🇰🇷', emblem: '🚗', name: 'Hyundai Motor Company' },
        'nissan': { country: 'Japón', flag: '🇯🇵', emblem: '🏎️', name: 'Nissan Motor Co., Ltd.' },
        'audi': { country: 'Alemania', flag: '🇩🇪', emblem: '⭕', name: 'Audi AG' },
        'chevrolet': { country: 'Estados Unidos', flag: '🇺🇸', emblem: '🚙', name: 'Chevrolet / GM' },
        'lamborghini': { country: 'Italia', flag: '🇮🇹', emblem: '🐂', name: 'Automobili Lamborghini S.p.A.' },
        'volvo': { country: 'Suecia', flag: '🇸🇪', emblem: '🛡️', name: 'Volvo Car Corporation' },
        'aston martin': { country: 'Reino Unido', flag: '🇬🇧', emblem: '👑', name: 'Aston Martin Lagonda' },
        'bugatti': { country: 'Francia', flag: '🇫🇷', emblem: '💎', name: 'Bugatti Automobiles' },
        'mclaren': { country: 'Reino Unido', flag: '🇬🇧', emblem: '🚀', name: 'McLaren Automotive' },
        'mazda': { country: 'Japón', flag: '🇯🇵', emblem: '🕊️', name: 'Mazda Motor Corporation' },
        'subaru': { country: 'Japón', flag: '🇯🇵', emblem: '🌌', name: 'Subaru Corporation' }
    };

    // -------------------------------------------------------------------------
    // 3. Construcción Dinámica de URLs
    // -------------------------------------------------------------------------
    function buildRequestUrl() {
        if (currentEndpointMode === 'vin') {
            const vin = vinInput.value.trim() || '1FA6P8CF5H5313936';
            return `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`;
        }

        const brand = brandInput.value.trim().toLowerCase() || 'toyota';
        const year = yearInput.value.trim();

        if (currentEndpointMode === 'models-year' && year) {
            return `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${brand}/modelyear/${year}?format=json`;
        }

        return `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${brand}?format=json`;
    }

    function updateUrlBarDisplay() {
        const url = buildRequestUrl();
        if (urlDisplay) {
            urlDisplay.value = url;
        }
    }

    // -------------------------------------------------------------------------
    // 4. Mecanismo 1: Consumo con async / await (Sintaxis Moderna ES8)
    // -------------------------------------------------------------------------
    async function executeFetchAsync() {
        const url = buildRequestUrl();
        showLoadingState(url);
        updateCodeDisplayAsync(url);

        const startTime = performance.now();

        try {
            // 1. Iniciar la petición HTTP asíncrona
            const response = await fetch(url);
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            // 2. Verificar el estado de la respuesta HTTP
            if (!response.ok) {
                updateMetrics(response.status, `${response.status} ${response.statusText}`, latency, 'async/await', 0, false);
                throw new Error(`Error en la respuesta del servidor: Código HTTP ${response.status}`);
            }

            // 3. Deserializar el payload JSON
            const data = await response.json();
            currentFetchedData = data;

            // 4. Procesar y actualizar métricas
            const count = data.Count || (data.Results ? data.Results.length : 0);
            updateMetrics(response.status, `${response.status} OK`, latency, 'async/await', count, true);

            // 5. Renderizar los datos en la interfaz
            renderApiResponse(data);
            renderJsonOutput(data);

        } catch (error) {
            renderErrorState(error.message);
            jsonOutput.textContent = `// Error durante la petición:\n${error.message}`;
        }
    }

    // -------------------------------------------------------------------------
    // 5. Mecanismo 2: Consumo con Promesas Tradicionales (.then / .catch)
    // -------------------------------------------------------------------------
    function executeFetchPromises() {
        const url = buildRequestUrl();
        showLoadingState(url);
        updateCodeDisplayPromises(url);

        const startTime = performance.now();

        // 1. Iniciar la promesa fetch
        fetch(url)
            .then(response => {
                const endTime = performance.now();
                const latency = Math.round(endTime - startTime);

                // 2. Validar código de estado en el primer .then
                if (!response.ok) {
                    updateMetrics(response.status, `${response.status} ${response.statusText}`, latency, '.then() / Promesas', 0, false);
                    throw new Error(`Error en la respuesta del servidor: Código HTTP ${response.status}`);
                }

                // 3. Retornar la promesa de transformación a JSON
                return response.json().then(data => {
                    return { data, status: response.status, latency };
                });
            })
            .then(({ data, status, latency }) => {
                // 4. Consumir el objeto JSON deserializado en el segundo .then
                currentFetchedData = data;
                const count = data.Count || (data.Results ? data.Results.length : 0);
                updateMetrics(status, `${status} OK`, latency, '.then() / Promesas', count, true);

                renderApiResponse(data);
                renderJsonOutput(data);
            })
            .catch(error => {
                // 5. Capturar cualquier fallo en la cadena de promesas
                renderErrorState(error.message);
                jsonOutput.textContent = `// Error durante la petición:\n${error.message}`;
            });
    }

    // -------------------------------------------------------------------------
    // 6. Funciones de Renderizado de la Interfaz de Usuario
    // -------------------------------------------------------------------------

    function showLoadingState(url) {
        metricsBar.classList.remove('hidden');
        vehicleDisplay.innerHTML = `
            <div class="spinner-container">
                <div class="spinner"></div>
                <p>Consultando servicio web REST con <code>fetch()</code>...</p>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-code);">${url}</span>
            </div>
        `;
        jsonOutput.textContent = '// Esperando respuesta del servidor...';
    }

    function updateMetrics(status, statusText, latency, mode, count, isSuccess) {
        metricStatus.textContent = statusText;
        metricStatus.className = isSuccess ? 'badge badge-success' : 'badge badge-danger';
        metricTime.textContent = `${latency} ms`;
        metricType.textContent = 'application/json';
        metricMode.textContent = mode;
        metricCount.textContent = `${count} resultado(s)`;
    }

    function renderApiResponse(data) {
        if (!data || !data.Results) {
            renderErrorState('No se recibieron resultados válidos de la API.');
            return;
        }

        if (currentEndpointMode === 'vin') {
            renderVinCard(data.Results[0]);
        } else {
            renderModelsGrid(data);
        }
    }

    function renderModelsGrid(data) {
        const rawBrand = brandInput.value.trim().toLowerCase();
        const info = brandInfoMap[rawBrand] || { country: 'Global', flag: '🌐', emblem: '🚘', name: rawBrand.toUpperCase() };
        allCurrentModels = data.Results || [];

        if (allCurrentModels.length === 0) {
            vehicleDisplay.innerHTML = `
                <div class="placeholder-state" style="color: #f59e0b;">
                    <span class="placeholder-icon">⚠️</span>
                    <h3>No se encontraron modelos para "${brandInput.value}"</h3>
                    <p>Verifica el nombre del fabricante o prueba con marcas como <strong>Toyota, BMW, Ferrari, Tesla, Ford o Porsche</strong>.</p>
                </div>
            `;
            return;
        }

        const makeName = allCurrentModels[0].Make_Name || brandInput.value.toUpperCase();
        const makeId = allCurrentModels[0].Make_ID || '-';
        const yearSuffix = (currentEndpointMode === 'models-year' && yearInput.value) ? ` (Año ${yearInput.value})` : '';

        vehicleDisplay.innerHTML = `
            <!-- Banner del Fabricante -->
            <div class="make-summary-banner">
                <div class="make-info-group">
                    <div class="make-logo-emblem">${info.emblem}</div>
                    <div class="make-text-col">
                        <h3>${makeName}${yearSuffix} <span>${info.flag}</span></h3>
                        <p>${info.name} &bull; Origen: <strong>${info.country}</strong> &bull; Make ID: <code>#${makeId}</code></p>
                    </div>
                </div>
                <div class="make-stats-group">
                    <div class="make-stat-pill">
                        <div class="make-stat-val">${allCurrentModels.length}</div>
                        <div class="make-stat-label">Modelos Registrados</div>
                    </div>
                </div>
            </div>

            <!-- Barra de Búsqueda y Filtro en Vivo de Modelos -->
            <div class="models-filter-bar">
                <div class="filter-input-wrap">
                    <span class="filter-icon">🔍</span>
                    <input type="text" id="modelFilterInput" placeholder="Filtrar modelos en tiempo real (ej. Corolla, Supra, M3, 911)...">
                </div>
                <div class="filter-count-badge" id="filterCountBadge">
                    Mostrando ${allCurrentModels.length} de ${allCurrentModels.length} modelos
                </div>
            </div>

            <!-- Grilla de Modelos -->
            <div class="models-grid" id="modelsGridContainer">
                ${generateModelsCardsHtml(allCurrentModels, makeName)}
            </div>
        `;

        // Activar buscador en tiempo real sobre los modelos recibidos
        const filterInput = document.getElementById('modelFilterInput');
        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                const filtered = allCurrentModels.filter(m => 
                    (m.Model_Name && m.Model_Name.toLowerCase().includes(term)) ||
                    (String(m.Model_ID).includes(term))
                );
                
                const gridContainer = document.getElementById('modelsGridContainer');
                const badge = document.getElementById('filterCountBadge');
                
                if (gridContainer) {
                    gridContainer.innerHTML = filtered.length > 0 
                        ? generateModelsCardsHtml(filtered, makeName)
                        : `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
                             No hay modelos coincidentes con "${term}"
                           </div>`;
                }
                if (badge) {
                    badge.textContent = `Mostrando ${filtered.length} de ${allCurrentModels.length} modelos`;
                }
            });
        }
    }

    function generateModelsCardsHtml(models, makeName) {
        return models.map(item => {
            const modelName = item.Model_Name || 'Modelo no especificado';
            const modelId = item.Model_ID || 'N/A';

            return `
                <div class="model-card">
                    <div class="model-card-top">
                        <span class="model-brand-name">${makeName}</span>
                        <span class="model-id-badge">ID #${modelId}</span>
                    </div>
                    <h4>${modelName}</h4>
                    <div class="model-card-footer">
                        <span class="vehicle-type-tag">🚘 Vehículo Global</span>
                        <a href="https://www.google.com/search?q=${encodeURIComponent(makeName + ' ' + modelName)}" 
                           target="_blank" 
                           class="btn-sm" 
                           title="Ver ficha e imágenes en Google"
                           style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;">
                            <span>Ver info</span> ↗
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderVinCard(vinData) {
        if (!vinData || (!vinData.Make && !vinData.Model)) {
            renderErrorState('No fue posible decodificar el VIN ingresado. Asegúrate de ingresar un número de chasis válido de 17 caracteres.');
            return;
        }

        vehicleDisplay.innerHTML = `
            <div class="vin-result-card">
                <div class="vin-hero-row">
                    <div class="vin-hero-title">
                        <h3>${vinData.Make || 'Fabricante'} ${vinData.Model || 'Modelo'}</h3>
                        <p>VIN Decodificado: <code>${vinInput.value.toUpperCase()}</code></p>
                    </div>
                    <span class="badge badge-car" style="font-size: 0.95rem; padding: 0.4rem 0.8rem;">
                        Año Modelo ${vinData.ModelYear || 'Desconocido'}
                    </span>
                </div>

                <div class="vin-specs-grid">
                    <div class="vin-spec-box">
                        <div class="vin-spec-label">Fabricante</div>
                        <div class="vin-spec-val">${vinData.Make || 'N/A'}</div>
                    </div>
                    <div class="vin-spec-box">
                        <div class="vin-spec-label">Modelo</div>
                        <div class="vin-spec-val">${vinData.Model || 'N/A'}</div>
                    </div>
                    <div class="vin-spec-box">
                        <div class="vin-spec-label">Tipo de Vehículo</div>
                        <div class="vin-spec-val">${vinData.VehicleType || 'N/A'}</div>
                    </div>
                    <div class="vin-spec-box">
                        <div class="vin-spec-label">País de Fabricación</div>
                        <div class="vin-spec-val">${vinData.PlantCountry || 'N/A'}</div>
                    </div>
                    <div class="vin-spec-box">
                        <div class="vin-spec-label">Tipo de Combustible</div>
                        <div class="vin-spec-val">${vinData.FuelTypePrimary || 'Gasolina / Estándar'}</div>
                    </div>
                    <div class="vin-spec-box">
                        <div class="vin-spec-label">Tracción (Drive Type)</div>
                        <div class="vin-spec-val">${vinData.DriveType || 'N/A'}</div>
                    </div>
                    <div class="vin-spec-box">
                        <div class="vin-spec-label">Planta de Ensamblaje</div>
                        <div class="vin-spec-val">${vinData.PlantCity || 'N/A'}, ${vinData.PlantState || ''}</div>
                    </div>
                    <div class="vin-spec-box">
                        <div class="vin-spec-label">Cilindrada / Motor</div>
                        <div class="vin-spec-val">${vinData.DisplacementL ? vinData.DisplacementL + ' Litros' : 'N/A'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderJsonOutput(data) {
        const jsonStr = JSON.stringify(data, null, 2);
        jsonOutput.textContent = jsonStr;
    }

    function renderErrorState(message) {
        vehicleDisplay.innerHTML = `
            <div class="placeholder-state" style="color: #f87171;">
                <span class="placeholder-icon">❌</span>
                <h3>Error en la Petición Fetch</h3>
                <p>${message}</p>
            </div>
        `;
    }

    // -------------------------------------------------------------------------
    // 7. Generador Didáctico de Código JavaScript Ejecutado
    // -------------------------------------------------------------------------
    function updateCodeDisplayAsync(url) {
        codeTitle.textContent = 'Código JavaScript Ejecutado (async / await)';
        codeSnippetContent.textContent =
`// Consumo de servicio web REST usando async / await
async function obtenerVehiculos() {
  const url = '${url}';

  try {
    // 1. Iniciar la petición HTTP GET asíncrona
    const respuesta = await fetch(url);

    // 2. Verificar el estado HTTP (rango 200-299)
    if (!respuesta.ok) {
      throw new Error(\`Error HTTP: \${respuesta.status} - \${respuesta.statusText}\`);
    }

    // 3. Deserializar el flujo JSON a un objeto JavaScript
    const datos = await respuesta.json();
    
    console.log('Resultados obtenidos:', datos.Results);
    return datos;
  } catch (error) {
    // 4. Capturar fallos de red o excepciones
    console.error('Error al realizar fetch:', error.message);
  }
}

// Invocación de la función
obtenerVehiculos();`;
    }

    function updateCodeDisplayPromises(url) {
        codeTitle.textContent = 'Código JavaScript Ejecutado (Promesas .then / .catch)';
        codeSnippetContent.textContent =
`// Consumo de servicio web REST usando Promesas tradicionales (.then / .catch)
function obtenerVehiculosConPromesas() {
  const url = '${url}';

  // 1. Petición HTTP nativa con fetch
  fetch(url)
    .then(respuesta => {
      // 2. Validar que la respuesta sea satisfactoria
      if (!respuesta.ok) {
        throw new Error(\`Error HTTP: \${respuesta.status} - \${respuesta.statusText}\`);
      }
      // 3. Retornar la promesa con el cuerpo parseado a JSON
      return respuesta.json();
    })
    .then(datos => {
      // 4. Procesar los datos deserializados
      console.log('Resultados obtenidos:', datos.Results);
    })
    .catch(error => {
      // 5. Manejador centralizado de errores
      console.error('Error al realizar fetch:', error.message);
    });
}

// Invocación de la función
obtenerVehiculosConPromesas();`;
    }

    // -------------------------------------------------------------------------
    // 8. Event Listeners y Manejo de Interacciones
    // -------------------------------------------------------------------------

    // Botones de ejecución
    btnFetchAsync.addEventListener('click', executeFetchAsync);
    btnFetchPromises.addEventListener('click', executeFetchPromises);

    // Enter en los inputs de búsqueda
    brandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeFetchAsync();
    });
    yearInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeFetchAsync();
    });
    vinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeFetchAsync();
    });

    // Actualizar URL al escribir
    brandInput.addEventListener('input', updateUrlBarDisplay);
    yearInput.addEventListener('input', updateUrlBarDisplay);
    vinInput.addEventListener('input', updateUrlBarDisplay);

    // Botones de Selección de Endpoints
    endpointBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            endpointBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentEndpointMode = btn.getAttribute('data-mode');

            if (currentEndpointMode === 'vin') {
                brandInputsGroup.style.display = 'none';
                vinInputsGroup.style.display = 'block';
            } else if (currentEndpointMode === 'models-year') {
                brandInputsGroup.style.display = 'grid';
                vinInputsGroup.style.display = 'none';
                yearInput.style.display = 'block';
                if (!yearInput.value) yearInput.value = '2023';
            } else {
                brandInputsGroup.style.display = 'grid';
                vinInputsGroup.style.display = 'none';
            }

            updateUrlBarDisplay();
        });
    });

    // Chips de Marcas Populares
    brandChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const make = chip.getAttribute('data-brand');
            brandInput.value = make;
            if (currentEndpointMode === 'vin') {
                // Cambiar a modo modelos si estaba en VIN
                endpointBtns[0].click();
            } else {
                updateUrlBarDisplay();
                executeFetchAsync();
            }
        });
    });

    // Pestañas (Tabs)
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetElement = document.getElementById(targetTab);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });

    // Copiar JSON
    btnCopyJson.addEventListener('click', () => {
        if (!currentFetchedData) return;
        navigator.clipboard.writeText(JSON.stringify(currentFetchedData, null, 2))
            .then(() => {
                const prevText = btnCopyJson.textContent;
                btnCopyJson.textContent = '¡Copiado! ✓';
                btnCopyJson.style.color = '#34d399';
                setTimeout(() => {
                    btnCopyJson.textContent = prevText;
                    btnCopyJson.style.color = '';
                }, 2000);
            })
            .catch(err => console.error('Error al copiar JSON:', err));
    });

    // Copiar Código JS
    btnCopyCode.addEventListener('click', () => {
        const codeText = codeSnippetContent.textContent;
        navigator.clipboard.writeText(codeText)
            .then(() => {
                const prevText = btnCopyCode.textContent;
                btnCopyCode.textContent = '¡Copiado! ✓';
                btnCopyCode.style.color = '#34d399';
                setTimeout(() => {
                    btnCopyCode.textContent = prevText;
                    btnCopyCode.style.color = '';
                }, 2000);
            })
            .catch(err => console.error('Error al copiar código:', err));
    });

    // -------------------------------------------------------------------------
    // 9. Carga Inicial Automática (Efecto WOW Inmediato)
    // -------------------------------------------------------------------------
    updateUrlBarDisplay();
    executeFetchAsync(); // Carga por defecto Toyota
});
