
document.addEventListener("DOMContentLoaded", function () {

  let currentSample = 0;
  let totalSamples = 0;
  let sampleDataCache = {};

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const timeStr = today.toTimeString().split(" ")[0].substring(0, 5);

  const fechaEnvio = document.getElementById("fechaEnvio");
  const horaEnvio = document.getElementById("horaEnvio");
  const fechaToma = document.getElementById("fechaToma");

  if (fechaEnvio) fechaEnvio.value = dateStr;
  if (horaEnvio) horaEnvio.value = timeStr;
  if (fechaToma) fechaToma.value = dateStr;

  const numeroInput = document.getElementById("numeroSolicitudes");
  const container = document.getElementById("samples-container");
  const template = document.querySelector(".sample-template");

  if (!numeroInput || !container || !template) {
    console.warn("Dynamic sample elements not found");
    return;
  }
  async function loadCodigoEnvio() {
    try {
      const res = await fetch("reserve_codigo_envio.php");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      document.getElementById("codigoEnvio").value = data.codigo_envio;
    } catch (error) {
      console.error("Error al reservar código:", error);
      alert(
        "⚠️ No se pudo generar el código de envío. Intente recargar la página."
      );
    }
  }
  loadCodigoEnvio();
  async function cargarTiposMuestra(containerId, sampleIndex) {
    try {
      const res = await fetch("get_tipos_muestra.php");
      const tipos = await res.json();
      if (tipos.error) throw new Error(tipos.error);

      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = "";
      tipos.forEach((tipo) => {
        const label = document.createElement("label");
        label.className = "radio-item";
        label.innerHTML = `
                <input type="radio" name="tipoMuestra_${sampleIndex}" value="${tipo.codigo}">
                <span>${tipo.nombre}</span>
            `;
        container.appendChild(label);
      });


      container.addEventListener("change", function (e) {
        if (e.target.matches(`input[name="tipoMuestra_${sampleIndex}"]`)) {
          const tipoId = e.target.value;

          requestAnimationFrame(() => {
            updateAnalisis(tipoId, sampleIndex);
          });
        }
      });
    } catch (error) {
      console.error("Error al cargar tipos de muestra:", error);
      alert("⚠️ No se pudieron cargar los tipos de muestra.");
    }
  }


  paquetesContainer.querySelectorAll(".paquete-checkbox").forEach((cb) => {
    cb.addEventListener("change", function () {
      const paqueteId = parseInt(this.dataset.paqueteId);
      const isChecked = this.checked;
      const map = JSON.parse(paquetesContainer.dataset.analisisMap || "{}");
      const analisisIds = map[paqueteId] || [];

      analisisIds.forEach((id) => {
        const analisisCheckbox = analisisContainer.querySelector(
          `.analisis-individual[value="${id}"]`
        );
        if (analisisCheckbox) {

          if (isChecked) {
            analisisCheckbox.checked = true;
          } else {

            let stillActive = false;
            Object.keys(map).forEach((pId) => {
              if (parseInt(pId) !== paqueteId && map[pId].includes(id)) {
                const otroPaquete = paquetesContainer.querySelector(
                  `.paquete-checkbox[data-paquete-id="${pId}"]`
                );
                if (otroPaquete && otroPaquete.checked) {
                  stillActive = true;
                }
              }
            });
            if (!stillActive) {
              analisisCheckbox.checked = false;
            }
          }
        }
      });
    });
  });

  function createReferenceCodeBoxes(longitud, container, hiddenInput) {
    container.innerHTML = "";
    hiddenInput.value = "";

    for (let i = 0; i < longitud; i++) {
      const box = document.createElement("input");
      box.type = "text";
      box.maxLength = 1;
      box.style.cssText = `
          width: 40px;
          height: 50px; /* Aumentamos un poco la altura */
          text-align: center;
          font-size: 20px; /* Ajustamos el tamaño de fuente */
          font-weight: 600;
          border: 2px solid #cbd5e0;
          border-radius: 8px;
          background: #f7fafc;
          padding: 0; /* Eliminamos el padding interno para evitar que el texto se corte */
          line-height: 50px; /* Hacemos que la línea sea igual a la altura */
          box-sizing: border-box; /* Aseguramos que el padding y border no afecten el tamaño */
      `;
      box.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
        if (this.value && this.nextElementSibling)
          this.nextElementSibling.focus();
        updateHiddenValue();
      });
      box.addEventListener("keydown", function (e) {
        if (
          e.key === "Backspace" &&
          !this.value &&
          this.previousElementSibling
        ) {
          this.previousElementSibling.focus();
        }
      });
      container.appendChild(box);
    }

    function updateHiddenValue() {
      const value = Array.from(container.querySelectorAll("input"))
        .map((i) => i.value || "")
        .join("");
      hiddenInput.value = value;
    }
  }


  function clearSamples() {
    container.innerHTML = "";
    currentSample = 0;
    totalSamples = 0;
  }


  function createNavigationControls() {
    const navDiv = document.createElement("div");
    navDiv.className = "sample-navigation";
    navDiv.innerHTML = `
     <button type="button" class="nav-btn prev-btn" onclick="navigateSample(-1)" style="font-size: 18px;">
  <span>◀</span> Anterior
</button>
<div class="sample-indicator" style="font-size: 18px;">
  <span class="current-sample">1</span> de <span class="total-samples">${totalSamples}</span>
</div>
<button type="button" class="nav-btn next-btn" onclick="navigateSample(1)" style="font-size: 18px;">
  Siguiente <span>▶</span>
</button>
    `;
    return navDiv;
  }

  function createSample(index) {
    const template = document.querySelector(".sample-template");
    const clone = template.cloneNode(true);
    clone.style.display = "none";
    clone.classList.remove("sample-template");
    clone.classList.add("sample-item");
    clone.dataset.sampleIndex = index;


    const sampleNumber = clone.querySelector(".sample-number");
    if (sampleNumber) sampleNumber.textContent = index + 1;


    const idFields = [
      "analisisContainer",
      "analisisContent",
      "codigoReferenciaContainer",
      "codigoReferenciaBoxes",
      "codigoReferenciaValue",
      "fechaToma",
      "numeroMuestras",
      "paquetesContainer",
    ];
    idFields.forEach((id) => {
      const el = clone.querySelector(`#${id}`);
      if (el) el.id = `${id}_${index}`;
    });

    const inputs = clone.querySelectorAll("input, select, textarea");
    /*inputs.forEach((input) => {
      if (input.id && !input.id.includes("_"))
        input.id = `${input.id}_${index}`;
      if (input.id === `numeroMuestras_${index}`) {
        input.name = `numeroMuestras_${index}`;
      }
      if (input.id === `codigoReferenciaValue_${index}`) {
        input.name = `codigoReferenciaValue_${index}`;
      }
      if (
        input.name &&
        !input.name.includes("_") &&
        input.id !== `codigoReferenciaValue_${index}`
      )
        input.name = `${input.name}_${index}`;
    });*/
    inputs.forEach((input) => {
      if (input.id && !input.id.includes("_")) {
        input.id = `${input.id}_${index}`;
      }

      if (input.id && !input.name) {
        input.name = input.id;
      }
      const hiddenRefInput = clone.querySelector("#codigoReferenciaValue");
      if (hiddenRefInput) {
        hiddenRefInput.id = `codigoReferenciaValue_${index}`;
        hiddenRefInput.name = `codigoReferenciaValue_${index}`; // ← ¡Esto es clave!
      }
    });


    const radiosContainer = clone.querySelector("#tipoMuestraRadios");
    if (radiosContainer) {
      radiosContainer.id = `tipoMuestraRadios_${index}`;
      setTimeout(
        () => cargarTiposMuestra(`tipoMuestraRadios_${index}`, index),
        10
      );
    }


    if (sampleDataCache[index]) {

      setTimeout(() => {
        restoreSampleData(clone, index, sampleDataCache[index]);
      }, 50);
    }

    return clone;
  }


  function restoreSampleData(clone, index, data) {

    const fechaToma = clone.querySelector(`#fechaToma_${index}`);
    if (fechaToma && data.fechaToma) {
      fechaToma.value = data.fechaToma;
    }

    const numeroMuestras = clone.querySelector(`#numeroMuestras_${index}`);
    if (numeroMuestras && data.numeroMuestras) {
      numeroMuestras.value = data.numeroMuestras;
    }


    if (data.tipoMuestra) {
      const radio = clone.querySelector(
        `input[name="tipoMuestra_${index}"][value="${data.tipoMuestra}"]`
      );
      if (radio) {
        radio.checked = true;

        updateAnalisis(data.tipoMuestra, index);


        setTimeout(() => {

          if (data.codigoReferenciaValue) {
            const refInput = clone.querySelector(
              `#codigoReferenciaValue_${index}`
            );
            if (refInput) {
              refInput.value = data.codigoReferenciaValue;
              const boxes = clone.querySelectorAll(
                `#codigoReferenciaBoxes_${index} input`
              );
              const digits = data.codigoReferenciaValue.split("");
              boxes.forEach((box, i) => {
                box.value = digits[i] || "";
              });
            }
          }


          if (data.analisisSeleccionados) {
            data.analisisSeleccionados.forEach((codigo) => {
              const cb = clone.querySelector(
                `.analisis-individual[value="${codigo}"]`
              );
              if (cb) cb.checked = true;
            });
          }


          if (data.paquetesSeleccionados) {
            data.paquetesSeleccionados.forEach((codigo) => {
              const cb = clone.querySelector(
                `.paquete-checkbox[data-paquete-id="${codigo}"]`
              );
              if (cb) cb.checked = true;
            });
          }
        }, 150); // Delay para asegurar que updateAnalisis haya terminado
      }
    }


    const observaciones = clone.querySelector("textarea");
    if (observaciones && data.observaciones) {
      observaciones.value = data.observaciones;
    }
  }
  window.updateAnalisis = async function (tipoId, sampleIndex) {

    function waitForElement(selector, timeout = 2000) {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => {
          const el = document.querySelector(selector);
          if (el) {
            resolve(el);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error(`Timeout: ${selector} not found`));
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      });
    }

    try {

      const analisisContainer = await waitForElement(
        `#analisisContainer_${sampleIndex}`
      );
      const codigoRefContainer = await waitForElement(
        `#codigoReferenciaContainer_${sampleIndex}`
      );
      const analisisContent = await waitForElement(
        `#analisisContent_${sampleIndex}`
      );
      const codigoRefBoxes = await waitForElement(
        `#codigoReferenciaBoxes_${sampleIndex}`
      );
      const codigoRefValue = await waitForElement(
        `#codigoReferenciaValue_${sampleIndex}`
      );
      const paquetesContainer = await waitForElement(
        `#paquetesContainer_${sampleIndex}`
      );

      if (!tipoId) {
        analisisContainer.style.display = "none";
        codigoRefContainer.style.display = "none";
        paquetesContainer.style.display = "none";
        return;
      }

      const res = await fetch(`get_config_muestra.php?tipo=${tipoId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);


      codigoRefContainer.style.display = "block";
      createReferenceCodeBoxes(
        data.tipo_muestra.longitud_codigo,
        codigoRefBoxes,
        codigoRefValue
      );


      let paquetesHTML = "";
      if (data.paquetes && data.paquetes.length > 0) {
        paquetesHTML = `
                <div class="paquetes-container" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
                    ${data.paquetes
                      .map(
                        (p) => `
                        <label class="paquete-item" style="display: flex; align-items: center; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 12px; cursor: pointer;">
                            <input type="checkbox" class="paquete-checkbox" data-paquete-id="${p.codigo}" style="margin-right: 8px;">
                            <span>${p.nombre}</span>
                        </label>
                    `
                      )
                      .join("")}
                </div>
            `;
      }
      paquetesContainer.innerHTML = paquetesHTML;
      paquetesContainer.style.display =
        data.paquetes && data.paquetes.length > 0 ? "block" : "none";


      let analisisHTML = "";
      if (data.analisis && data.analisis.length > 0) {
        analisisHTML = `
                <div class="checkbox-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 8px;">
                    ${data.analisis
                      .map(
                        (a) => `
                        <label class="checkbox-item" style="display: flex; align-items: center; padding: 10px; background: #f8fafc; border: 1px solid #cbd5e0; border-radius: 6px; cursor: pointer;">
                            <input type="checkbox" name="analisis_${sampleIndex}[]" class="analisis-individual" value="${a.codigo}" data-nombre="${a.nombre}" style="margin-right: 10px; width: 16px; height: 16px;">
                            <span style="font-size: 14px;">${a.nombre}</span>
                        </label>
                    `
                      )
                      .join("")}
                </div>
            `;
      }
      analisisContent.innerHTML = analisisHTML;
      analisisContainer.style.display = "block";


      const analisisPorPaquete = {};
      data.analisis.forEach((a) => {
        if (a.paquete !== null) {
          if (!analisisPorPaquete[a.paquete])
            analisisPorPaquete[a.paquete] = [];
          analisisPorPaquete[a.paquete].push(a.codigo);
        }
      });
      paquetesContainer.dataset.analisisMap =
        JSON.stringify(analisisPorPaquete);


      paquetesContainer.querySelectorAll(".paquete-checkbox").forEach((cb) => {
        cb.addEventListener("change", function () {
          const paqueteId = parseInt(this.dataset.paqueteId);
          const isChecked = this.checked;
          const map = JSON.parse(paquetesContainer.dataset.analisisMap || "{}");
          const analisisIds = map[paqueteId] || [];

          analisisIds.forEach((id) => {
            const analisisCheckbox = analisisContainer.querySelector(
              `.analisis-individual[value="${id}"]`
            );
            if (analisisCheckbox) {
              if (isChecked) {
                analisisCheckbox.checked = true;
              } else {
                let stillActive = false;
                Object.keys(map).forEach((pId) => {
                  if (parseInt(pId) !== paqueteId && map[pId].includes(id)) {
                    const otroPaquete = paquetesContainer.querySelector(
                      `.paquete-checkbox[data-paquete-id="${pId}"]`
                    );
                    if (otroPaquete && otroPaquete.checked) {
                      stillActive = true;
                    }
                  }
                });
                if (!stillActive) {
                  analisisCheckbox.checked = false;
                }
              }
            }
          });
        });
      });
    } catch (error) {
      console.error("Error al cargar análisis:", error);
      alert("⚠️ No se pudieron cargar los análisis. Intente nuevamente.");

      const containers = [
        `#analisisContainer_${sampleIndex}`,
        `#codigoReferenciaContainer_${sampleIndex}`,
        `#paquetesContainer_${sampleIndex}`,
      ];
      containers.forEach((id) => {
        const el = document.querySelector(id);
        if (el) el.style.display = "none";
      });
    }
  };


  window.navigateSample = function (direction) {
    const newIndex = currentSample + direction;


    if (newIndex < 0 || newIndex >= totalSamples) return;


    const currentElement = container.querySelector(
      `[data-sample-index="${currentSample}"]`
    );
    if (currentElement) {
      currentElement.style.display = "none";
      currentElement.classList.remove("active");
    }


    currentSample = newIndex;
    const newElement = container.querySelector(
      `[data-sample-index="${currentSample}"]`
    );
    if (newElement) {
      newElement.style.display = "block";
      newElement.classList.add("active");


      const navigation = container.querySelector(".sample-navigation");
      if (navigation) {
        navigation.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }


    const indicator = document.querySelector(".current-sample");
    if (indicator) indicator.textContent = currentSample + 1;


    updateNavigationButtons();
  };


  function updateNavigationButtons() {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (prevBtn) prevBtn.disabled = currentSample === 0;
    if (nextBtn) nextBtn.disabled = currentSample === totalSamples - 1;
  }


  numeroInput.addEventListener("input", function () {
    let count = parseInt(this.value, 10);
    if (isNaN(count) || count < 1) {
      clearSamples();
      return;
    }
    const max = 20;
    if (count > max) {
      count = max;
      this.value = count;
    }


    for (let i = 0; i < totalSamples; i++) {
      const sampleEl = container.querySelector(`[data-sample-index="${i}"]`);
      if (sampleEl) {
        sampleDataCache[i] = extractSampleData(sampleEl, i);
      }
    }

    clearSamples();
    totalSamples = count;


    if (count > 1) {
      const navControls = createNavigationControls();
      container.appendChild(navControls);
    }


    for (let i = 0; i < count; i++) {
      const sampleElement = createSample(i);
      container.appendChild(sampleElement);
    }

    if (count > 1) {
      updateNavigationButtons();

      currentSample = 0;
      const firstSample = container.querySelector(`[data-sample-index="0"]`);
      if (firstSample) {
        firstSample.style.display = "block";
        firstSample.classList.add("active");
      }
    } else {

      currentSample = 0;
      const theSample = container.querySelector(`[data-sample-index="0"]`);
      if (theSample) {
        theSample.style.display = "block";
        theSample.classList.add("active");
      }
    }


    const indicator = document.querySelector(".current-sample");
    const totalIndicator = document.querySelector(".total-samples");
    if (indicator) indicator.textContent = "1";
    if (totalIndicator) totalIndicator.textContent = count;
  });

  if (numeroInput.value) {
    numeroInput.dispatchEvent(new Event("input"));
  }


  function extractSampleData(sampleEl, index) {
    const data = {};


    const fechaToma = sampleEl.querySelector(`#fechaToma_${index}`);
    if (fechaToma) data.fechaToma = fechaToma.value;
    const numMuestrasInput = sampleEl.querySelector(`#numeroMuestras_${index}`);
    if (numMuestrasInput) data.numeroMuestras = numMuestrasInput.value;

    const tipoMuestra = sampleEl.querySelector(
      `input[name="tipoMuestra_${index}"]:checked`
    );
    if (tipoMuestra) data.tipoMuestra = tipoMuestra.value;


    const codigoRef = sampleEl.querySelector(`#codigoReferenciaValue_${index}`);
    if (codigoRef) data.codigoReferenciaValue = codigoRef.value;


    const analisisChecks = sampleEl.querySelectorAll(
      `.analisis-individual:checked`
    );
    data.analisisSeleccionados = Array.from(analisisChecks).map(
      (cb) => cb.value
    );


    const paqueteChecks = sampleEl.querySelectorAll(
      `.paquete-checkbox:checked`
    );
    data.paquetesSeleccionados = Array.from(paqueteChecks).map(
      (cb) => cb.dataset.paqueteId
    );


    const observaciones = sampleEl.querySelector("textarea");
    if (observaciones) data.observaciones = observaciones.value;

    return data;
  }


  function logout() {
    /*document.getElementById('dashboard').classList.remove('active');
            document.getElementById('loginScreen').style.display = 'flex';*/
    if (confirm("¿Desea cerrar la sesión?")) {
      window.location.href = "logout.php";
    }
  }


  window.handleSampleSubmit = function (event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("sampleForm"));

    generateSummary(formData);

    document.getElementById("confirmModal").style.display = "flex";
  };

  function generateSummary(formData) {

    const numeroSolicitudes = parseInt(formData.get("numeroSolicitudes"));
    const fechaEnvio = formData.get("fechaEnvio");
    const horaEnvio = formData.get("horaEnvio");
    const laboratorioCodigo = formData.get("laboratorio");
    const empresaTransporte = formData.get("empresa_transporte");
    const autorizadoPor = formData.get("autorizado_por");
    const usuarioRegistrador = formData.get("usuario_registrador") || "user"; // Valor por defecto
    const usuarioResponsable = formData.get("usuario_responsable");


    let laboratorioNombre = "No disponible";
    const laboratorioSelect = document.getElementById("laboratorio");
    if (laboratorioSelect) {
      const selectedOption =
        laboratorioSelect.options[laboratorioSelect.selectedIndex];
      laboratorioNombre = selectedOption
        ? selectedOption.text
        : "No seleccionado";
    }

    let summaryHTML = `
        <h3>📋 Resumen del Envío</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <div><strong>Código de Envío:</strong> <span id="resumenCodigoEnvio"></span></div>
            <div><strong>Laboratorio:</strong> ${laboratorioNombre}</div>
            <div><strong>Fecha de Envío:</strong> ${fechaEnvio}</div>
            <div><strong>Hora de Envío:</strong> ${horaEnvio}</div>
            <div><strong>Empresa de Transporte:</strong> ${empresaTransporte}</div>
            <div><strong>Autorizado por:</strong> ${autorizadoPor}</div>
            <div><strong>Usuario Registrador:</strong> ${usuarioRegistrador}</div>
            <div><strong>Usuario Responsable:</strong> ${usuarioResponsable}</div>
            <div><strong>Número de Muestras:</strong> ${numeroSolicitudes}</div>
        </div>
        <h3>🧪 Muestras Detalladas</h3>
    `;


    for (let i = 0; i < numeroSolicitudes; i++) {
      const sampleEl = document.querySelector(
        `.sample-item[data-sample-index="${i}"]`
      );
      if (!sampleEl) continue;


      const tipoMuestraRadio = sampleEl.querySelector(
        `input[name="tipoMuestra_${i}"]:checked`
      );
      const tipoMuestraNombre = tipoMuestraRadio
        ? tipoMuestraRadio.nextElementSibling.textContent
        : "No seleccionado";


      const fechaTomaInput = sampleEl.querySelector(`#fechaToma_${i}`);
      const fechaToma = fechaTomaInput ? fechaTomaInput.value : "-";
      const numeroMuestras = formData.get(`numeroMuestras_${i}`) || "1";

      const codigoRefBoxes = sampleEl.querySelectorAll(
        `#codigoReferenciaBoxes_${i} input`
      );
      const codigoRef = Array.from(codigoRefBoxes)
        .map((box) => box.value || "")
        .join("");


      const observacionesTextarea = sampleEl.querySelector("textarea");
      const observaciones = observacionesTextarea
        ? observacionesTextarea.value
        : "Ninguna";


      const analisisSeleccionados = [];
      const analisisCheckboxes = sampleEl.querySelectorAll(
        ".analisis-individual:checked"
      );
      analisisCheckboxes.forEach((cb) => {
        analisisSeleccionados.push(cb.nextElementSibling.textContent);
      });

      summaryHTML += `
            <div style="border: 1px solid #e2e8f0; padding: 16px; margin: 12px 0; border-radius: 8px; background: #f8fafc;">
                <h4 style="margin: 0 0 12px 0; color: #2d3748;">Muestra #${
                  i + 1
                }</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                    <div><strong>Tipo de Muestra:</strong> ${tipoMuestraNombre}</div>
                    <div><strong>Fecha de Toma:</strong> ${fechaToma}</div>
                    <div><strong>N° de Muestras:</strong> ${numeroMuestras}</div>
                    <div><strong>Código de Referencia:</strong> ${codigoRef}</div>
                    <div><strong>Observaciones:</strong> ${observaciones}</div>
                </div>
                <div style="margin-top: 12px;">
                    <strong>Análisis Solicitados:</strong><br>
                    <span style="display: inline-block; margin-top: 4px; padding: 6px 10px; background: #edf2f7; border-radius: 6px; font-size: 13px;">
                        ${
                          analisisSeleccionados.length > 0
                            ? analisisSeleccionados.join(", ")
                            : "Ninguno"
                        }
                    </span>
                </div>
            </div>
        `;
    }

    document.getElementById("summaryContent").innerHTML = summaryHTML;

    document.getElementById("resumenCodigoEnvio").textContent =
      document.getElementById("codigoEnvio").value;
  }
  window.confirmSubmit = async function () {
    const formData = new FormData(document.getElementById("sampleForm"));
    for (const [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }
    try {
      const response = await fetch("guardar_muestra.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("✅ " + result.message + ". Código: " + result.codigoEnvio);

        document.getElementById("confirmModal").style.display = "none";


      } else {
        throw new Error(result.error || "Error desconocido al guardar.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al guardar el registro: " + error.message);
    }
  };

  window.closeConfirmModal = function () {
    document.getElementById("confirmModal").style.display = "none";
  };


  window.toggleSubmenu = function toggleSubmenu(menuId) {
    const menu = document.getElementById(menuId);
    const submenu = document.getElementById(menuId.replace("Menu", "Submenu"));
    menu.classList.toggle("expanded");
    submenu.classList.toggle("open");
  };


  window.showView = function showView(viewId) {

    document
      .querySelectorAll(".content-view")
      .forEach((el) => el.classList.remove("active"));

    document
      .getElementById("view" + viewId.charAt(0).toUpperCase() + viewId.slice(1))
      .classList.add("active");


    document
      .querySelectorAll(".menu-item, .submenu-item")
      .forEach((el) => el.classList.remove("active"));


    if (viewId === "registro") {

      const capturaMenu = document.getElementById("capturaMenu");
      const capturaSubmenu = document.getElementById("capturaSubmenu");
      capturaMenu.classList.add("expanded");
      capturaSubmenu.classList.add("open");

      const registroItem = capturaSubmenu.querySelector(".submenu-item");
      if (registroItem) registroItem.classList.add("active");
    } else {

      const menuItem = document.querySelector(
        `.menu-item[onclick="showView('${viewId}')"]`
      );
      if (menuItem) menuItem.classList.add("active");
    }
  };
});
