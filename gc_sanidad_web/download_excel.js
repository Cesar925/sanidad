/**
 * DOWNLOAD_EXCEL.JS
 * Funciones para descargar datos de las tablas de mantenimiento en formato Excel y CSV
 * 
 * DEPENDENCIAS REQUERIDAS:
 * - SheetJS (xlsx): https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
 * 
 * INSTRUCCIONES DE USO:
 * 1. Agregar la librería SheetJS en index.php antes de este script:
 *    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
 * 2. Incluir este archivo en index.php:
 *    <script src="download_excel.js"></script>
 * 3. Descomentar los botones de descarga en el HTML
 * 
 * NOTA: Este archivo está preparado pero comentado para uso futuro
 */

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Convierte una tabla HTML a datos para Excel/CSV
 * @param {string} tableId - ID de la tabla HTML
 * @returns {Array} Array de objetos con los datos de la tabla
 */
function tableToData(tableId) {
    const table = document.querySelector(`#${tableId}`);
    if (!table) {
        console.error(`Tabla ${tableId} no encontrada`);
        return [];
    }

    const headers = [];
    const data = [];

    // Obtener encabezados
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach((cell, index) => {
        // Saltar la columna de "Acciones"
        const headerText = cell.textContent.trim();
        if (headerText.toLowerCase() !== 'acciones') {
            headers.push(headerText);
        }
    });

    // Obtener datos de las filas
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const rowData = {};
        const cells = row.querySelectorAll('td');
        let headerIndex = 0;

        cells.forEach((cell, index) => {
            // Saltar la última columna (Acciones) si existe
            if (index < cells.length - 1 || !cell.querySelector('.btn-icon')) {
                if (headerIndex < headers.length) {
                    rowData[headers[headerIndex]] = cell.textContent.trim();
                    headerIndex++;
                }
            }
        });

        if (Object.keys(rowData).length > 0) {
            data.push(rowData);
        }
    });

    return data;
}

/**
 * Descarga datos en formato Excel
 * @param {Array} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 */
function downloadExcel(data, filename) {
    if (!window.XLSX) {
        alert('Error: Librería XLSX no cargada. Por favor, recargue la página.');
        return;
    }

    if (data.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    
    // Convertir datos a hoja
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Ajustar ancho de columnas
    const colWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length)) + 2
    }));
    ws['!cols'] = colWidths;
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    
    // Descargar archivo
    XLSX.writeFile(wb, `${filename}_${getCurrentDate()}.xlsx`);
}

/**
 * Descarga datos en formato CSV
 * @param {Array} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 */
function downloadCSV(data, filename) {
    if (data.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Obtener encabezados
    const headers = Object.keys(data[0]);
    
    // Crear contenido CSV
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            let value = row[header] || '';
            // Escapar comillas y envolver en comillas si contiene coma o salto de línea
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                value = '"' + value.replace(/"/g, '""') + '"';
            }
            return value;
        });
        csvContent += values.join(',') + '\n';
    });

    // Crear Blob y descargar
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${getCurrentDate()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// ============================================
// EMPRESAS DE TRANSPORTE
// ============================================

function downloadEmpTransExcel() {
    const data = tableToData('empTransTableBody');
    if (data.length === 0) {
        // Si no hay tabla con ID, intentar obtener datos directamente de la tabla
        const data = [];
        const table = document.querySelector('#viewEmpresaTransporte table');
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    data.push({
                        'Código': cells[0].textContent.trim(),
                        'Nombre': cells[1].textContent.trim()
                    });
                }
            });
        }
    }
    downloadExcel(data, 'empresas_transporte');
}

function downloadEmpTransCSV() {
    const data = [];
    const table = document.querySelector('#viewEmpresaTransporte table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                data.push({
                    'Código': cells[0].textContent.trim(),
                    'Nombre': cells[1].textContent.trim()
                });
            }
        });
    }
    downloadCSV(data, 'empresas_transporte');
}

// ============================================
// LABORATORIOS
// ============================================

function downloadLaboratorioExcel() {
    const data = [];
    const table = document.querySelector('#viewLaboratorio table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                data.push({
                    'Código': cells[0].textContent.trim(),
                    'Nombre': cells[1].textContent.trim()
                });
            }
        });
    }
    downloadExcel(data, 'laboratorios');
}

function downloadLaboratorioCSV() {
    const data = [];
    const table = document.querySelector('#viewLaboratorio table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                data.push({
                    'Código': cells[0].textContent.trim(),
                    'Nombre': cells[1].textContent.trim()
                });
            }
        });
    }
    downloadCSV(data, 'laboratorios');
}

// ============================================
// TIPOS DE MUESTRA
// ============================================

function downloadTipoMuestraExcel() {
    const data = [];
    const table = document.querySelector('#viewTipoMuestra table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                data.push({
                    'Código': cells[0].textContent.trim(),
                    'Nombre': cells[1].textContent.trim(),
                    'Descripción': cells[2].textContent.trim(),
                    'Long. Código': cells[3].textContent.trim()
                });
            }
        });
    }
    downloadExcel(data, 'tipos_muestra');
}

function downloadTipoMuestraCSV() {
    const data = [];
    const table = document.querySelector('#viewTipoMuestra table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                data.push({
                    'Código': cells[0].textContent.trim(),
                    'Nombre': cells[1].textContent.trim(),
                    'Descripción': cells[2].textContent.trim(),
                    'Long. Código': cells[3].textContent.trim()
                });
            }
        });
    }
    downloadCSV(data, 'tipos_muestra');
}

// ============================================
// PAQUETES DE ANÁLISIS
// ============================================

function downloadPaqueteAnalisisExcel() {
    const data = [];
    const table = document.querySelector('#viewPaqueteAnalisis table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                data.push({
                    'Código': cells[0].textContent.trim(),
                    'Nombre': cells[1].textContent.trim(),
                    'Tipo de Muestra': cells[2].textContent.trim()
                });
            }
        });
    }
    downloadExcel(data, 'paquetes_analisis');
}

function downloadPaqueteAnalisisCSV() {
    const data = [];
    const table = document.querySelector('#viewPaqueteAnalisis table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                data.push({
                    'Código': cells[0].textContent.trim(),
                    'Nombre': cells[1].textContent.trim(),
                    'Tipo de Muestra': cells[2].textContent.trim()
                });
            }
        });
    }
    downloadCSV(data, 'paquetes_analisis');
}

// ============================================
// ANÁLISIS
// ============================================

function downloadAnalisisExcel() {
    const data = [];
    const table = document.querySelector('#viewAnalisis table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                data.push({
                    'Código': cells[0].textContent.trim(),
                    'Nombre': cells[1].textContent.trim(),
                    'Tipo de Muestra': cells[2].textContent.trim(),
                    'Paquete de Análisis': cells[3].textContent.trim()
                });
            }
        });
    }
    downloadExcel(data, 'analisis');
}

function downloadAnalisisCSV() {
    const data = [];
    const table = document.querySelector('#viewAnalisis table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                data.push({
                    'Código': cells[0].textContent.trim(),
                    'Nombre': cells[1].textContent.trim(),
                    'Tipo de Muestra': cells[2].textContent.trim(),
                    'Paquete de Análisis': cells[3].textContent.trim()
                });
            }
        });
    }
    downloadCSV(data, 'analisis');
}

// ============================================
// MUESTRAS - CABECERA
// ============================================

function downloadMuestraCabeceraExcel() {
    const data = [];
    const table = document.querySelector('#viewMuestraCabecera table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                data.push({
                    'Código Envío': cells[0].textContent.trim(),
                    'Fecha Envío': cells[1].textContent.trim(),
                    'Hora Envío': cells[2].textContent.trim(),
                    'Laboratorio': cells[3].textContent.trim(),
                    'Empresa Transporte': cells[4].textContent.trim(),
                    'Usuario Responsable': cells[5].textContent.trim()
                });
            }
        });
    }
    downloadExcel(data, 'muestras_cabecera');
}

function downloadMuestraCabeceraCSV() {
    const data = [];
    const table = document.querySelector('#viewMuestraCabecera table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                data.push({
                    'Código Envío': cells[0].textContent.trim(),
                    'Fecha Envío': cells[1].textContent.trim(),
                    'Hora Envío': cells[2].textContent.trim(),
                    'Laboratorio': cells[3].textContent.trim(),
                    'Empresa Transporte': cells[4].textContent.trim(),
                    'Usuario Responsable': cells[5].textContent.trim()
                });
            }
        });
    }
    downloadCSV(data, 'muestras_cabecera');
}

// ============================================
// MUESTRAS - DETALLE
// ============================================

function downloadMuestraDetalleExcel() {
    const data = [];
    const table = document.querySelector('#viewMuestraDetalle table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                data.push({
                    'Código Envío': cells[0].textContent.trim(),
                    'Posición': cells[1].textContent.trim(),
                    'Fecha Toma': cells[2].textContent.trim(),
                    'Código Referencia': cells[3].textContent.trim(),
                    'Nro. Muestras': cells[4].textContent.trim(),
                    'Observaciones': cells[5].textContent.trim()
                });
            }
        });
    }
    downloadExcel(data, 'muestras_detalle');
}

function downloadMuestraDetalleCSV() {
    const data = [];
    const table = document.querySelector('#viewMuestraDetalle table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                data.push({
                    'Código Envío': cells[0].textContent.trim(),
                    'Posición': cells[1].textContent.trim(),
                    'Fecha Toma': cells[2].textContent.trim(),
                    'Código Referencia': cells[3].textContent.trim(),
                    'Nro. Muestras': cells[4].textContent.trim(),
                    'Observaciones': cells[5].textContent.trim()
                });
            }
        });
    }
    downloadCSV(data, 'muestras_detalle');
}

// ============================================
// CONSOLA DE AYUDA
// ============================================

console.log('%c📊 Sistema de Descarga Excel/CSV', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cFunciones disponibles:', 'color: #4a5568; font-size: 14px;');
console.log('- downloadEmpTransExcel() / downloadEmpTransCSV()');
console.log('- downloadLaboratorioExcel() / downloadLaboratorioCSV()');
console.log('- downloadTipoMuestraExcel() / downloadTipoMuestraCSV()');
console.log('- downloadPaqueteAnalisisExcel() / downloadPaqueteAnalisisCSV()');
console.log('- downloadAnalisisExcel() / downloadAnalisisCSV()');
console.log('- downloadMuestraCabeceraExcel() / downloadMuestraCabeceraCSV()');
console.log('- downloadMuestraDetalleExcel() / downloadMuestraDetalleCSV()');
console.log('%cEjemplo de uso: downloadEmpTransExcel()', 'color: #718096; font-style: italic;');
