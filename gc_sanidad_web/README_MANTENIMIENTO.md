# 📚 Sistema de Mantenimiento - Guía de Activación

Este documento describe cómo activar las funcionalidades adicionales del módulo de Mantenimiento que están preparadas pero comentadas.

## 📋 Tabla de Contenidos

1. [Estilos de Mantenimiento](#estilos-de-mantenimiento)
2. [Descarga Excel/CSV](#descarga-excelcsv)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Solución de Problemas](#solución-de-problemas)

---

## 🎨 Estilos de Mantenimiento

### Descripción
El archivo `mantenimiento.css` contiene estilos específicos y mejorados para las tablas de mantenimiento, incluyendo:
- Encabezados con diseño moderno
- Botones de acción estilizados
- Tablas responsive
- Badges y etiquetas
- Filtros de búsqueda
- Paginación
- Estados de carga y vacío

### Activación

**Paso 1:** Abrir `index.php`

**Paso 2:** Buscar la sección `<head>` y descomentar la línea:

```html
<!-- ANTES -->
<!-- <link rel="stylesheet" href="mantenimiento.css"> -->

<!-- DESPUÉS -->
<link rel="stylesheet" href="mantenimiento.css">
```

**Paso 3:** Recargar la página en el navegador

### Aplicación a las Vistas

Los estilos están diseñados para aplicarse automáticamente usando clases específicas:

```html
<!-- Encabezado de mantenimiento -->
<div class="maintenance-header">
    <div class="maintenance-header-left">
        <h1>🚚 Empresas de Transporte</h1>
        <p>Administre las empresas de transporte registradas</p>
    </div>
    <div class="maintenance-header-right">
        <!-- Botones de acción -->
    </div>
</div>

<!-- Tabla de mantenimiento -->
<div class="maintenance-table-container">
    <table class="maintenance-table">
        <!-- ... -->
    </table>
</div>
```

---

## 📊 Descarga Excel/CSV

### Descripción
El sistema incluye funcionalidades completas para exportar todas las tablas de mantenimiento en formatos Excel y CSV.

### Archivos Involucrados
- `download_excel.js` - Funciones de exportación
- Librería SheetJS (CDN) - Procesamiento de archivos Excel

### Activación

#### Paso 1: Activar Librería SheetJS

Abrir `index.php` y descomentar en la sección `<head>`:

```html
<!-- ANTES -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script> -->

<!-- DESPUÉS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```

#### Paso 2: Activar Script de Descarga

Buscar al final del `index.php` antes de `</body>` y descomentar:

```html
<!-- ANTES -->
<!-- <script src="download_excel.js"></script> -->

<!-- DESPUÉS -->
<script src="download_excel.js"></script>
```

#### Paso 3: Descomentar Botones de Descarga

En cada vista de mantenimiento, buscar los botones comentados:

**Ejemplo - Empresas de Transporte (línea ~590):**

```html
<!-- ANTES -->
<!-- 
<div class="download-buttons">
    <button type="button" class="btn-download btn-excel" onclick="downloadEmpTransExcel()">
        📊 Descargar Excel
    </button>
    <button type="button" class="btn-download btn-csv" onclick="downloadEmpTransCSV()">
        📄 Descargar CSV
    </button>
</div>
-->

<!-- DESPUÉS -->
<div class="download-buttons">
    <button type="button" class="btn-download btn-excel" onclick="downloadEmpTransExcel()">
        📊 Descargar Excel
    </button>
    <button type="button" class="btn-download btn-csv" onclick="downloadEmpTransCSV()">
        📄 Descargar CSV
    </button>
</div>
```

#### Paso 4: Repetir para Todas las Tablas

Descomentar los botones en:
1. ✅ Empresas de Transporte
2. ✅ Laboratorios
3. ✅ Tipos de Muestra
4. ✅ Paquetes de Análisis
5. ✅ Análisis
6. ✅ Muestras - Cabecera
7. ✅ Muestras - Detalle

### Funciones Disponibles

```javascript
// Empresas de Transporte
downloadEmpTransExcel()
downloadEmpTransCSV()

// Laboratorios
downloadLaboratorioExcel()
downloadLaboratorioCSV()

// Tipos de Muestra
downloadTipoMuestraExcel()
downloadTipoMuestraCSV()

// Paquetes de Análisis
downloadPaqueteAnalisisExcel()
downloadPaqueteAnalisisCSV()

// Análisis
downloadAnalisisExcel()
downloadAnalisisCSV()

// Muestras - Cabecera
downloadMuestraCabeceraExcel()
downloadMuestraCabeceraCSV()

// Muestras - Detalle
downloadMuestraDetalleExcel()
downloadMuestraDetalleCSV()
```

### Uso Manual desde Consola

También puedes ejecutar las funciones manualmente desde la consola del navegador:

```javascript
// Ejemplo: Descargar Empresas de Transporte en Excel
downloadEmpTransExcel();

// Ejemplo: Descargar Laboratorios en CSV
downloadLaboratorioCSV();
```

---

## 📁 Estructura de Archivos

```
gc_sanidad_web/
├── index.php                    # Archivo principal
├── style.css                    # Estilos generales
├── mantenimiento.css            # 🆕 Estilos de mantenimiento (comentado)
├── download_excel.js            # 🆕 Script de descarga (comentado)
├── README_MANTENIMIENTO.md      # 🆕 Este archivo
├── registro.js                  # Lógica de registro
├── mantenimiento.js             # Lógica de mantenimiento
├── laboratorio.js               # CRUD Laboratorios
├── tipo_muestra.js              # CRUD Tipos de Muestra
├── paquete_analisis.js          # CRUD Paquetes de Análisis
├── analisis.js                  # CRUD Análisis
├── muestra_cabecera.js          # CRUD Muestras Cabecera
├── muestra_detalle.js           # CRUD Muestras Detalle
└── ...
```

---

## 🔧 Solución de Problemas

### Los estilos no se aplican

**Solución:**
1. Verificar que `mantenimiento.css` esté descomentado en `index.php`
2. Limpiar caché del navegador (Ctrl+Shift+R)
3. Verificar que las clases CSS estén correctamente aplicadas en el HTML

### Los botones de descarga no funcionan

**Solución:**
1. Verificar que SheetJS esté descomentado en `<head>`
2. Verificar que `download_excel.js` esté descomentado antes de `</body>`
3. Abrir consola del navegador (F12) y verificar errores
4. Verificar que el orden de carga sea:
   - SheetJS (en head)
   - Otros scripts
   - download_excel.js (al final)

### El archivo Excel descarga vacío

**Solución:**
1. Verificar que la tabla tenga datos
2. Verificar que los selectores de tabla en `download_excel.js` coincidan con los IDs en `index.php`
3. Revisar la consola del navegador para mensajes de error

### Error: "XLSX is not defined"

**Solución:**
- La librería SheetJS no está cargada. Verificar que la línea esté descomentada:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```

---

## 📝 Notas Adicionales

### Formatos de Descarga

**Excel (.xlsx):**
- Formato binario de Microsoft Excel
- Mantiene formato y estilos
- Mejor para análisis y manipulación de datos
- Tamaño de archivo más grande

**CSV (.csv):**
- Formato de texto plano separado por comas
- Compatible con cualquier hoja de cálculo
- Ideal para importar a otros sistemas
- Tamaño de archivo más pequeño

### Personalización

Puedes personalizar las funciones de descarga editando `download_excel.js`:

```javascript
// Cambiar el nombre del archivo
downloadExcel(data, 'mi_archivo_personalizado');

// Agregar más columnas a la exportación
data.push({
    'Código': cells[0].textContent.trim(),
    'Nombre': cells[1].textContent.trim(),
    'Nueva Columna': 'valor'
});
```

### Rendimiento

- Los archivos se generan del lado del cliente (navegador)
- No requiere procesamiento del servidor
- Funciona incluso sin conexión a internet
- Puede manejar miles de registros sin problemas

---

## 🚀 Recomendaciones

1. **Activar progresivamente**: Activar primero los estilos, probar, luego las descargas
2. **Probar en diferentes navegadores**: Chrome, Firefox, Edge, Safari
3. **Mantener librerías actualizadas**: Revisar versiones de SheetJS periódicamente
4. **Documentar cambios**: Si modificas las funciones, documenta los cambios

---

## 📞 Soporte

Si encuentras problemas o necesitas asistencia:

1. Revisar la consola del navegador (F12)
2. Verificar que todos los archivos existan en el directorio
3. Comprobar que no haya errores de sintaxis en los comentarios
4. Consultar la documentación de SheetJS: https://docs.sheetjs.com/

---

**Última actualización:** 2025-11-28
**Versión:** 1.0.0
**Autor:** GenSpark AI Developer
