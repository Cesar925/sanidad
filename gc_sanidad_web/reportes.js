 document.addEventListener("DOMContentLoaded", function () {
  const analisisConfig = {
    aves_vivas: [
      {
        title: "DESCARTE de Proceso Respiratorio",
        type: "multiple",
        options: [
          "BI (Bronquitis Infecciosa)",
          "SCH (Síndrome de Cabeza Hinchada)",
          "ENC (Encefalomielitis)",
          "LT (Laringotraqueítis)",
        ],
      },
      {
        title: "Antibiograma",
        type: "single",
        options: ["Antibiograma Estándar", "Antibiograma Ampliado"],
      },
    ],
    sueros: [
      {
        title: "Serología",
        type: "multiple",
        options: [
          "ELISA",
          "IFI (Inmunofluorescencia Indirecta)",
          "SN (Seroneutralización)",
        ],
      },
    ],
    organos_refrigerados: [
      {
        title: "Tipo de Análisis",
        type: "multiple",
        options: ["Histopatología", "Bacteriología"],
      },
    ],
    organos_formol: [
      {
        title: "Tipo de Análisis",
        type: "single",
        options: [
          "Histopatología Estándar",
          "Histopatología con Coloraciones Especiales",
        ],
      },
    ],
    culturete: [
      {
        title: "Tipo de Análisis",
        type: "multiple",
        options: ["Bacteriología", "Antibiograma"],
      },
    ],
    agua: [
      {
        title: "Análisis Microbiológico",
        type: "multiple",
        options: [
          "Coliformes Totales",
          "Coliformes Fecales",
          "Salmonella",
          "Recuento Total",
        ],
      },
    ],
    aves_muertas: [
      {
        title: "Tipo de Análisis",
        type: "multiple",
        options: ["Necropsia Completa", "Bacteriología", "Histopatología"],
      },
    ],
  };

  
  function generatePDF(
    codigo,
    fecha,
    hora,
    laboratorio,
    codigoRef,
    numMuestras,
    tipoMuestra,
    estado
  ) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

codigoEnvio
    doc.setFontSize(20);
    doc.setTextColor(44, 82, 130);
    doc.text("REPORTE DE MUESTRA", 105, 20, { align: "center" });

codigoEnvio
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("SANIDAD - Sistema de Registro de Muestras", 105, 30, {
      align: "center",
    });

codigoEnvio
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

codigoEnvio
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("INFORMACIÓN DEL REGISTRO", 20, 45);

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");

codigoEnvio
    const startY = 55;
    const lineHeight = 10;
    const labelX = 25;
    const valueX = 85;

    doc.setFont(undefined, "bold");
    doc.text("Código de Envío:", labelX, startY);
    doc.setFont(undefined, "normal");
    doc.text(codigo, valueX, startY);

    doc.setFont(undefined, "bold");
    doc.text("Fecha y Hora:", labelX, startY + lineHeight);
    doc.setFont(undefined, "normal");
    doc.text(`${fecha} - ${hora}`, valueX, startY + lineHeight);

    doc.setFont(undefined, "bold");
    doc.text("Laboratorio:", labelX, startY + lineHeight * 2);
    doc.setFont(undefined, "normal");
    doc.text(laboratorio, valueX, startY + lineHeight * 2);

    doc.setFont(undefined, "bold");
    doc.text("Código de Referencia:", labelX, startY + lineHeight * 3);
    doc.setFont(undefined, "normal");
    doc.text(codigoRef, valueX, startY + lineHeight * 3);

    doc.setFont(undefined, "bold");
    doc.text("Número de Muestras:", labelX, startY + lineHeight * 4);
    doc.setFont(undefined, "normal");
    doc.text(`${numMuestras} unidades`, valueX, startY + lineHeight * 4);

    doc.setFont(undefined, "bold");
    doc.text("Tipo de Muestra:", labelX, startY + lineHeight * 5);
    doc.setFont(undefined, "normal");
    doc.text(tipoMuestra, valueX, startY + lineHeight * 5);

    doc.setFont(undefined, "bold");
    doc.text("Estado:", labelX, startY + lineHeight * 6);
    doc.setFont(undefined, "normal");
    doc.text(estado, valueX, startY + lineHeight * 6);

codigoEnvio
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, 125, 190, 125);

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("ANÁLISIS SOLICITADOS", 20, 135);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");

codigoEnvio
    const tipoMuestraKey = {
      "Aves Vivas": "aves_vivas",
      Sueros: "sueros",
      "Órganos Refrigerados": "organos_refrigerados",
      "Órganos en Formol": "organos_formol",
      Culturete: "culturete",
      Agua: "agua",
      "Aves Muertas": "aves_muertas",
    }[tipoMuestra];

    let yPos = 145;
    if (tipoMuestraKey && analisisConfig[tipoMuestraKey]) {
      analisisConfig[tipoMuestraKey].forEach((grupo) => {
        doc.setFont(undefined, "bold");
        doc.text(`• ${grupo.title}:`, 25, yPos);
        doc.setFont(undefined, "normal");
        yPos += 7;
        grupo.options.forEach((opt, idx) => {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`  - ${opt}`, 30, yPos);
          yPos += 6;
        });
        yPos += 3;
      });
    } else {
      doc.text(
        "Según especificaciones del tipo de muestra seleccionado.",
        25,
        yPos
      );
    }

codigoEnvio
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("OBSERVACIONES", 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      "Este documento certifica el registro de la muestra en el sistema SANIDAD.",
      25,
      yPos
    );
    yPos += 7;
    doc.text(
      "Para consultas adicionales, contacte al laboratorio correspondiente.",
      25,
      yPos
    );
    yPos += 7;
    doc.text(
      "La muestra debe ser procesada según los protocolos establecidos.",
      25,
      yPos
    );

codigoEnvio
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text("Generado automáticamente por SANIDAD App", 105, 280, {
        align: "center",
      });
      doc.text(
        `Fecha de generación: ${new Date().toLocaleDateString(
          "es-PE"
        )} ${new Date().toLocaleTimeString("es-PE")}`,
        105,
        285,
        { align: "center" }
      );
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
    }

codigoEnvio
    doc.save(`Reporte_${codigo}.pdf`);
  }

});
 