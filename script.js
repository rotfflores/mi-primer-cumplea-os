"use strict";

// EDITA AQUÍ LOS DATOS DE LA INVITACIÓN.
// La fecha usa AAAA-MM-DD. La fotografía es una ruta local relativa a index.html.
// Vacía o inexistente = marco de muestra. Alternativa: "./assets/yovana-cumpleanos.webp".
const INVITATION_CONFIG = Object.freeze({
  nombre: "Yovana",
  fecha: "2026-11-15",
  hora: "16:00",                // HH:MM, formato de 24 horas.
  desfaseHorario: "-06:00",      // Hora del centro de México; evita depender del visitante.
  lugar: "Parque Bicentenario",   // Ubicación real provisional; reemplaza por el lugar definitivo.
  direccion: "Av. 5 de Mayo 290, Col. Refinería 18 de Marzo, Miguel Hidalgo, 11210, Ciudad de México",
  enlaceMaps: "https://www.google.com/maps/search/?api=1&query=Parque%20Bicentenario%2C%20Av.%205%20de%20Mayo%20290%2C%20Ciudad%20de%20M%C3%A9xico", // Ubicación provisional. Vacío = pendiente.
  fotografia: "./assets/yovana-retrato.webp",
  posicionFotografia: "50% 50%", // Ajusta el encuadre; por ejemplo, "50% 30%".
  confirmacion: {
    modoDemo: true, // Prueba visual local: no envía ni guarda datos. Desactiva para usar el backend.
    invitacionId: "yovana-primer-anito-2026", // Identificador público; debe existir en el servidor.
    endpoint: "", // Conecta aquí el endpoint POST de guardado real. Sin conexión, no se envía.
  },
  // NOTAS DE MUESTRA EDITABLES. Solo aparece una nota si está habilitada
  // y tiene título y descripción. Sustituye los textos por indicaciones de la familia.
  // Iconos disponibles: ropa, bolsa, actividades, acceso, regalo y lista.
  detallesInvitados: [
    { habilitado: true, categoria: "vestimenta", titulo: "Ven cómodo", descripcion: "Trae ropa cómoda para disfrutar la celebración.", icono: "ropa" },
    // Ejemplos neutros elegidos con autorización del usuario; también editables.
    { habilitado: true, categoria: "queLlevar", titulo: "Con ganas de celebrar", descripcion: "Lo más bonito será compartir este día contigo.", icono: "bolsa" },
    { habilitado: true, categoria: "recomendacion", titulo: "Un recuerdo en familia", descripcion: "Disfruta las risas, los abrazos y los pequeños momentos de la fiesta.", icono: "lista" },
    // Opcionales: no suponen servicios, actividades ni una política de regalos.
    { habilitado: false, categoria: "actividades", titulo: "Alberca o actividades", descripcion: "", icono: "actividades" },
    { habilitado: false, categoria: "acceso", titulo: "Estacionamiento y acceso", descripcion: "", icono: "acceso" },
    { habilitado: false, categoria: "regalos", titulo: "Regalos", descripcion: "", icono: "regalo" },
  ],
  // Fotografías de catálogo, no fotografías reales de Yovana.
  // imagen: "" conserva el espacio de muestra. posicion ajusta cada encuadre.
  recuerdos: [
    {
      titulo: "Cuando llegué",
      descripcion: "Pequeñito en sus brazos, llené de amor su mundo.",
      imagen: "./assets/recuerdo-recien-nacido.webp",
      alternativo: "Foto de catálogo: un recién nacido duerme sobre una manta de punto crema.",
      posicion: "50% 50%",
      etiqueta: "Foto de recién nacido",
    },
    {
      titulo: "A mis seis meses",
      descripcion: "Entre risas y descubrimientos, fui mostrando mi personalidad.",
      imagen: "./assets/recuerdo-seis-meses.webp",
      alternativo: "Foto de catálogo: una bebé sonríe sobre una manta, con un lazo amarillo.",
      posicion: "50% 65%",
      etiqueta: "Foto a los seis meses",
    },
    {
      titulo: "¡Mi primer añito!",
      descripcion: "Hoy tengo nuevas aventuras por vivir y un cumpleaños que celebrar contigo.",
      imagen: "./assets/recuerdo-primer-anito.webp",
      alternativo: "Foto de catálogo: una bebé con gorrito de cumpleaños junto a globos crema.",
      posicion: "50% 100%",
      etiqueta: "Foto del primer añito",
    },
  ],
});

(() => {
  const root = document.getElementById("invitation");
  const cover = document.getElementById("portada");
  const intro = document.getElementById("invitation-intro");
  const content = document.getElementById("invitation-content");
  const button = document.getElementById("open-invitation");
  const nameHeading = document.getElementById("birthday-name");
  const dateElement = document.getElementById("birthday-date");
  const photo = document.getElementById("baby-photo");
  const placeholder = document.getElementById("photo-placeholder");
  const status = document.getElementById("invitation-status");
  const presentation = document.getElementById("presentacion");
  const countdown = document.getElementById("cuenta-regresiva");
  const locationSection = document.getElementById("ubicacion");
  const memoriesSection = document.getElementById("asi-he-crecido");
  const rsvpSection = document.getElementById("confirmacion");
  const guestNotesSection = document.getElementById("detalles-invitados");
  const farewellSection = document.getElementById("despedida");
  const revealedSections = [presentation, countdown, locationSection, memoriesSection, rsvpSection, guestNotesSection, farewellSection];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const name = String(INVITATION_CONFIG.nombre || "Yovana").trim() || "Yovana";

  document.querySelectorAll("[data-name]").forEach((element) => { element.textContent = name; });
  document.querySelectorAll("[data-photo-name]").forEach((element) => { element.textContent = name.toLocaleUpperCase("es-MX"); });
  document.querySelectorAll("[data-initial]").forEach((element) => { element.textContent = Array.from(name)[0]; });
  document.title = `Mi primer añito · ${name} | Rotf Studio`;
  document.querySelector('meta[name="description"]').content = `Un primer añito, un amor infinito. Una invitación de Rotf Studio para celebrar a ${name}.`;

  // UTC conserva el día elegido, independientemente del huso horario del visitante.
  const configuredDate = String(INVITATION_CONFIG.fecha);
  const parsedDate = new Date(`${configuredDate}T12:00:00Z`);
  const dateIsValid = /^\d{4}-\d{2}-\d{2}$/.test(configuredDate)
    && !Number.isNaN(parsedDate.getTime())
    && parsedDate.toISOString().slice(0, 10) === configuredDate;
  if (dateIsValid) {
    dateElement.dateTime = configuredDate;
    dateElement.textContent = new Intl.DateTimeFormat("es-MX", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    }).format(parsedDate);
  }

  photo.alt = `Fotografía de ${name}`;
  photo.closest("figure").setAttribute("aria-label", `Fotografía de ${name}`);
  photo.style.setProperty("--photo-position", INVITATION_CONFIG.posicionFotografia);
  if (INVITATION_CONFIG.fotografia) {
    // Esperar a la carga mantiene el marco intacto y evita un icono de imagen rota.
    photo.addEventListener("load", () => {
      photo.hidden = false;
      placeholder.hidden = true;
    }, { once: true });
    photo.addEventListener("error", () => {
      photo.hidden = true;
      placeholder.hidden = false;
      photo.removeAttribute("src");
    }, { once: true });
    photo.src = INVITATION_CONFIG.fotografia;
  }

  // Invita a seguir leyendo; desaparece cuando la siguiente sección entra en pantalla.
  const scrollHint = document.getElementById("scroll-hint");
  const scrollTarget = presentation || content.querySelector(".birthday-closing");
  function hideScrollHint() {
    scrollHint.classList.remove("is-visible");
    window.removeEventListener("scroll", onScroll);
  }
  function onScroll() {
    if (scrollTarget.getBoundingClientRect().top <= window.innerHeight * .82) hideScrollHint();
  }
  function showScrollHintIfNeeded() {
    const bounds = scrollTarget.getBoundingClientRect();
    if (bounds.bottom <= window.innerHeight || bounds.top <= window.innerHeight * .82) return;
    scrollHint.classList.add("is-visible");
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Un álbum editable. La versión HTML conserva los recuerdos sin JavaScript.
  const memoriesList = document.getElementById("memories-list");
  const viewer = document.getElementById("memory-viewer");
  const viewerPhoto = document.getElementById("viewer-photo");
  const viewerTitle = document.getElementById("viewer-title");
  const viewerClose = document.getElementById("viewer-close");
  const viewerError = viewer.querySelector(".viewer-error");
  const placeholderTemplate = document.getElementById("memory-placeholder-template");
  let viewerTrigger;
  let scrollBeforeViewer = 0;
  let bodyStyleBeforeViewer;

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  const viewerCaption = document.getElementById("viewer-caption");
  const viewerCounter = document.getElementById("viewer-counter");
  const viewerPrev = document.getElementById("viewer-prev");
  const viewerNext = document.getElementById("viewer-next");
  const viewerChrome = viewer.querySelectorAll(".viewer-header, .viewer-footer, .viewer-nav");
  // Recuerdos con foto, en orden; el visor navega entre ellos.
  const viewerItems = [];
  let viewerIndex = 0;
  let viewerClosing = false;

  function animate(element, keyframes, options) {
    if (reducedMotion.matches || typeof element.animate !== "function") return Promise.resolve();
    const animation = element.animate(keyframes, { easing: "cubic-bezier(.22, .61, .36, 1)", ...options });
    // Si el navegador pausa las animaciones (pestaña en segundo plano), el flujo sigue igual.
    const limit = (options.duration || 0) + (options.delay || 0) + 150;
    return Promise.race([animation.finished.catch(() => {}), new Promise((resolve) => { window.setTimeout(resolve, limit); })]);
  }

  // Transformación que lleva la foto ampliada al lugar y tamaño de su miniatura.
  function thumbnailTransform(index) {
    const thumbnail = viewerItems[index]?.image;
    if (!thumbnail?.isConnected) return null;
    const from = thumbnail.getBoundingClientRect();
    const to = viewerPhoto.getBoundingClientRect();
    if (!from.width || !to.width || from.bottom < 0 || from.top > window.innerHeight) return null;
    const scale = Math.max(from.width / to.width, from.height / to.height);
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${scale})`;
  }

  function showMemory(index, direction = 0) {
    viewerIndex = (index + viewerItems.length) % viewerItems.length;
    const { memory } = viewerItems[viewerIndex];
    viewerTitle.textContent = memory.titulo;
    viewerCaption.textContent = memory.descripcion || "";
    viewerCounter.textContent = `${viewerIndex + 1} / ${viewerItems.length}`;
    viewerPhoto.alt = memory.alternativo || memory.titulo;
    viewerError.hidden = true;
    viewerPhoto.hidden = false;
    viewerPhoto.src = memory.imagen;
    viewerPrev.hidden = viewerItems.length < 2;
    viewerNext.hidden = viewerItems.length < 2;
    if (!direction) return;
    // La foto nueva entra desde el lado hacia el que se avanza, como pasar una página del álbum.
    animate(viewerPhoto, [
      { opacity: 0, transform: `translateX(${direction * 56}px) rotate(${direction * 2.5}deg) scale(.96)` },
      { opacity: 1, transform: "none" },
    ], { duration: 460 });
    animate(viewerTitle, [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 380 });
    animate(viewerCaption, [{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: 80, fill: "backwards" });
  }

  function openMemory(memory, trigger) {
    // Si el navegador no admite dialog, el enlace abre el archivo local completo.
    if (typeof viewer.showModal !== "function" || viewer.open || viewerClosing) return false;
    const index = viewerItems.findIndex((item) => item.link === trigger);
    if (index < 0) return false;
    viewerTrigger = trigger;
    showMemory(index);
    viewer.showModal();
    scrollBeforeViewer = window.scrollY;
    // position:fixed bloquea también el scroll táctil, conservando la posición.
    bodyStyleBeforeViewer = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    Object.assign(document.body.style, {
      position: "fixed", top: `-${scrollBeforeViewer}px`, width: "100%",
      overflow: "hidden", paddingRight: `${padding + scrollbarWidth}px`,
    });
    viewerClose.focus({ preventScroll: true });
    // El fondo se oscurece mientras la foto crece desde su miniatura.
    animate(viewer, [{ backgroundColor: "#281c1700" }, { backgroundColor: "#281c17e6" }], { duration: 420 });
    viewerChrome.forEach((element) => {
      animate(element, [{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 220, fill: "backwards" });
    });
    const grow = () => {
      const from = thumbnailTransform(viewerIndex);
      animate(viewerPhoto, from
        ? [{ transform: from, opacity: .5 }, { transform: "none", opacity: 1 }]
        : [{ transform: "scale(.92)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 560 });
    };
    if (viewerPhoto.complete && viewerPhoto.naturalWidth) grow();
    else viewerPhoto.addEventListener("load", grow, { once: true });
    return true;
  }

  // Al cerrar, la foto regresa a su lugar en el álbum antes de que el diálogo desaparezca.
  async function closeViewer() {
    if (!viewer.open || viewerClosing) return;
    viewerClosing = true;
    viewerTrigger = viewerItems[viewerIndex]?.link || viewerTrigger;
    const to = viewerPhoto.hidden ? null : thumbnailTransform(viewerIndex);
    // El temporizador garantiza el cierre aunque el navegador pause las animaciones.
    await Promise.race([new Promise((resolve) => { window.setTimeout(resolve, 600); }), Promise.all([
      animate(viewerPhoto, [{ transform: "none", opacity: 1 }, to ? { transform: to, opacity: .6 } : { transform: "scale(.92)", opacity: 0 }], { duration: 420, fill: "forwards" }),
      animate(viewer, [{ backgroundColor: "#281c17e6" }, { backgroundColor: "#281c1700" }], { duration: 420, fill: "forwards" }),
      ...[...viewerChrome].map((element) => animate(element, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" })),
    ])]);
    viewer.close();
    viewer.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    viewerClosing = false;
  }

  (Array.isArray(INVITATION_CONFIG.recuerdos) ? INVITATION_CONFIG.recuerdos : []).forEach((memory, index) => {
    if (index === 0) memoriesList.replaceChildren();
    const item = makeElement("li", "memory");
    item.setAttribute("data-reveal", "");
    const figure = makeElement("figure");
    const frame = makeElement("div", "memory-frame");
    const media = makeElement("div", "memory-photo is-loading");
    const emptyPhoto = placeholderTemplate.content.firstElementChild.cloneNode(true);
    emptyPhoto.querySelector(".memory-placeholder__label").textContent = memory.etiqueta || memory.titulo;
    media.append(emptyPhoto);
    if (String(memory.imagen || "").trim()) {
      const memoryImage = makeElement("img", "memory-image");
      memoryImage.alt = memory.alternativo || memory.titulo;
      memoryImage.width = 1200;
      memoryImage.height = 1500;
      memoryImage.loading = "lazy";
      memoryImage.decoding = "async";
      const position = CSS.supports("object-position", String(memory.posicion)) ? memory.posicion : "50% 50%";
      memoryImage.style.setProperty("--memory-position", position);
      const link = makeElement("a", "memory-photo-link");
      link.href = memory.imagen;
      link.hidden = true;
      link.setAttribute("aria-label", `Ampliar fotografía: ${memory.titulo}`);
      link.setAttribute("aria-haspopup", "dialog");
      link.setAttribute("aria-controls", "memory-viewer");
      const expand = makeElement("span", "memory-expand", "Ver foto");
      expand.setAttribute("aria-hidden", "true");
      link.append(expand);
      memoryImage.addEventListener("load", () => {
        media.classList.remove("is-loading");
        emptyPhoto.hidden = true;
        link.hidden = false;
      }, { once: true });
      memoryImage.addEventListener("error", () => {
        viewerItems.splice(viewerItems.findIndex((item) => item.link === link), 1);
        memoryImage.remove();
        link.remove();
        media.classList.remove("is-loading");
      }, { once: true });
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        if (openMemory(memory, link)) event.preventDefault();
      });
      viewerItems.push({ memory, link, image: memoryImage });
      media.append(memoryImage, link);
      memoryImage.src = memory.imagen;
    } else {
      media.classList.remove("is-loading");
    }
    frame.append(media, makeElement("span", "memory-print", `${String(index + 1).padStart(2, "0")} / mi historia`));
    frame.lastElementChild.setAttribute("aria-hidden", "true");
    const caption = makeElement("figcaption", "memory-caption");
    caption.append(makeElement("h3", "", memory.titulo), makeElement("p", "", memory.descripcion));
    figure.append(frame, caption);
    item.append(figure);
    memoriesList.append(item);
  });
  memoriesList.setAttribute("aria-label", `${memoriesList.children.length} recuerdos de mi primer año`);

  viewerPhoto.addEventListener("error", () => {
    viewerPhoto.hidden = true;
    viewerError.hidden = false;
  });
  viewerClose.addEventListener("click", closeViewer);
  viewerPrev.addEventListener("click", () => showMemory(viewerIndex - 1, -1));
  viewerNext.addEventListener("click", () => showMemory(viewerIndex + 1, 1));
  // Deslizar la foto a un lado cambia de recuerdo en pantallas táctiles.
  let swipeStartX = null;
  viewerPhoto.addEventListener("pointerdown", (event) => { swipeStartX = event.clientX; });
  viewerPhoto.addEventListener("pointerup", (event) => {
    if (swipeStartX === null || viewerItems.length < 2) return;
    const distance = event.clientX - swipeStartX;
    swipeStartX = null;
    if (Math.abs(distance) > 48) showMemory(viewerIndex + (distance < 0 ? 1 : -1), distance < 0 ? 1 : -1);
  });
  viewerPhoto.addEventListener("pointercancel", () => { swipeStartX = null; });
  // Cerrar al tocar fuera de la foto o los controles; no al arrastrar desde la foto.
  let pointerStartedOutside = false;
  function isOutsideViewerContent(target) {
    return target !== viewerPhoto && !target.closest(".viewer-header, .viewer-footer, .viewer-nav, .viewer-error");
  }
  viewer.addEventListener("pointerdown", (event) => {
    pointerStartedOutside = isOutsideViewerContent(event.target);
  });
  viewer.addEventListener("click", (event) => {
    if (pointerStartedOutside && isOutsideViewerContent(event.target)) closeViewer();
    pointerStartedOutside = false;
  });
  viewer.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeViewer();
  });
  viewer.addEventListener("keydown", (event) => {
    // El diálogo nativo hace inerte la página; Tab recorre solo sus botones.
    if (event.key === "Tab") {
      event.preventDefault();
      const controls = [viewerClose, viewerPrev, viewerNext].filter((control) => !control.hidden);
      const current = controls.indexOf(document.activeElement);
      controls[(current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus({ preventScroll: true });
    } else if (viewerItems.length > 1 && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      showMemory(viewerIndex + direction, direction);
    }
  });
  viewer.addEventListener("close", () => {
    if (bodyStyleBeforeViewer) Object.assign(document.body.style, bodyStyleBeforeViewer);
    window.scrollTo({ top: scrollBeforeViewer, behavior: "instant" });
    viewerTrigger?.focus({ preventScroll: true });
    viewerPhoto.removeAttribute("src");
  });

  // Confirmación: solo un servidor que confirme un guardado real puede dar éxito.
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpFields = document.getElementById("rsvp-fields");
  const guestName = document.getElementById("guest-name");
  const attendanceInputs = [...rsvpForm.querySelectorAll('[name="asistencia"]')];
  const guestCounts = document.getElementById("guest-counts");
  const guestAdults = document.getElementById("guest-adults");
  const guestChildren = document.getElementById("guest-children");
  const guestMessage = document.getElementById("guest-message");
  const rsvpSubmit = document.getElementById("rsvp-submit");
  const rsvpAvailability = document.getElementById("rsvp-availability");
  const rsvpPrivacy = document.getElementById("rsvp-privacy");
  const rsvpAlert = document.getElementById("rsvp-alert");
  const rsvpResult = document.getElementById("rsvp-result");
  const mailboxScene = document.getElementById("mailbox-scene");
  const rsvpConfig = INVITATION_CONFIG.confirmacion || {};
  const invitationId = String(rsvpConfig.invitacionId || "").trim();
  const rsvpEndpoint = resolveRsvpEndpoint(rsvpConfig.endpoint);
  const rsvpDemo = rsvpConfig.modoDemo === true;
  const rsvpReady = rsvpDemo || Boolean(rsvpEndpoint && invitationId);
  const rsvpDemoAgain = document.getElementById("rsvp-demo-again");
  let rsvpBusy = false;
  let rsvpSaved = false;
  let pendingAttempt;
  let formOpenedAt = performance.now();
  root.addEventListener("invitation:opened", () => { formOpenedAt = performance.now(); }, { once: true });

  const letterToggle = document.getElementById("letter-toggle");
  const letterBody = document.getElementById("letter-body");

  // Despliega u oculta un bloque animando su altura; `hidden` sigue siendo la fuente de verdad.
  function revealBlock(element, show) {
    const isOpen = element.dataset.revealState ? element.dataset.revealState === "open" : !element.hidden;
    if (isOpen === show) return Promise.resolve();
    element.dataset.revealState = show ? "open" : "closed";
    element.getAnimations?.().forEach((animation) => animation.cancel());
    if (show) {
      element.hidden = false;
      return animate(element, [
        { height: "0px", opacity: 0, transform: "translateY(-8px)", overflow: "hidden" },
        { height: `${element.scrollHeight}px`, opacity: 1, transform: "none", overflow: "hidden" },
      ], { duration: 460 });
    }
    return animate(element, [
      { height: `${element.scrollHeight}px`, opacity: 1, overflow: "hidden" },
      { height: "0px", opacity: 0, overflow: "hidden" },
    ], { duration: 300 }).then(() => {
      if (element.dataset.revealState === "closed") element.hidden = true;
    });
  }

  // Un campo con error tiembla un instante para que se encuentre de un vistazo.
  function shakeField(key) {
    const box = rsvpErrorFields[key]?.controls[0].closest(".attendance-field, .rsvp-field, .future-letter");
    if (box) animate(box, [
      { transform: "none" }, { transform: "translateX(-7px)" }, { transform: "translateX(6px)" },
      { transform: "translateX(-4px)" }, { transform: "translateX(2px)" }, { transform: "none" },
    ], { duration: 440, easing: "ease-in-out" });
  }

  // Confeti de papel en los tonos de la invitación, desde el agradecimiento.
  function burstConfetti(anchor) {
    if (reducedMotion.matches || typeof anchor.animate !== "function") return;
    const card = anchor.closest(".letter-card");
    const cardBox = card.getBoundingClientRect();
    const box = anchor.getBoundingClientRect();
    const originX = box.left - cardBox.left + box.width / 2;
    const originY = box.top - cardBox.top + 46;
    for (let index = 0; index < 18; index += 1) {
      const piece = makeElement("span", `rsvp-confetti rsvp-confetti--${index % 3}`);
      piece.setAttribute("aria-hidden", "true");
      Object.assign(piece.style, { left: `${originX}px`, top: `${originY}px` });
      card.append(piece);
      const angle = (Math.PI * 2 * index) / 18 + Math.random() * .35;
      const distance = 70 + Math.random() * 80;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      piece.animate([
        { transform: "translate(-50%, -50%) scale(.3) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y - 34}px)) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: .65 },
        { transform: `translate(calc(-50% + ${x * 1.15}px), calc(-50% + ${y + 26}px)) scale(.8) rotate(${Math.random() * 540}deg)`, opacity: 0 },
      ], { duration: 1300 + Math.random() * 500, easing: "cubic-bezier(.2, .7, .3, 1)" }).finished
        .then(() => piece.remove(), () => piece.remove());
    }
  }

  // El formulario se pliega como una carta y aparece el agradecimiento con su sobre sellado.
  async function showRsvpSuccess(message) {
    await animate(rsvpForm, [
      { opacity: 1, transform: "none" },
      { opacity: 0, transform: "translateY(-14px) scale(.96)" },
    ], { duration: 340, fill: "forwards" });
    rsvpForm.hidden = true;
    rsvpForm.getAnimations?.().forEach((animation) => animation.cancel());
    rsvpResult.classList.add("is-saved");
    rsvpResult.textContent = message;
    mailboxScene.classList.add("has-delivered");
    rsvpResult.focus({ preventScroll: true });
    animate(rsvpResult, [
      { opacity: 0, transform: "translateY(18px) scale(.95)" },
      { opacity: 1, transform: "none" },
    ], { duration: 600, easing: "cubic-bezier(.2, .9, .3, 1.15)" });
    burstConfetti(rsvpResult);
  }

  function resolveRsvpEndpoint(value) {
    if (!String(value || "").trim()) return null;
    try {
      const url = new URL(String(value).trim(), window.location.href);
      const localHttp = url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
      if ((!localHttp && url.protocol !== "https:") || url.username || url.password || url.hash) return null;
      return url.href;
    } catch { return null; }
  }

  const rsvpErrorFields = {
    nombreInvitado: { controls: [guestName], error: document.getElementById("guest-name-error") },
    asistencia: { controls: attendanceInputs, error: document.getElementById("attendance-error") },
    adultos: { controls: [guestAdults], error: document.getElementById("guest-adults-error") },
    ninos: { controls: [guestChildren], error: document.getElementById("guest-children-error") },
    mensaje: { controls: [guestMessage], error: document.getElementById("guest-message-error") },
  };

  function fieldError(field, text = "") {
    const target = rsvpErrorFields[field];
    if (!target) return;
    target.error.textContent = text;
    target.error.hidden = !text;
    target.controls.forEach((control) => {
      if (text) control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    });
  }

  function updateRsvpDraft() {
    document.getElementById("message-length").textContent = guestMessage.value.length;
    rsvpSubmit.textContent = rsvpBusy ? (rsvpDemo ? "Enviando…" : "Guardando…")
      : rsvpDemo ? (guestMessage.value.trim() ? "Enviar confirmación y mi cartita" : "Enviar confirmación")
        : guestMessage.value.trim() ? "Enviar confirmación y guardar mi cartita" : "Enviar confirmación";
    rsvpSubmit.disabled = !rsvpReady || rsvpBusy || rsvpSaved;
    rsvpSubmit.classList.toggle("is-busy", rsvpBusy);
  }

  function updateAttendance() {
    const attending = rsvpForm.querySelector('[name="asistencia"]:checked')?.value === "si";
    revealBlock(guestCounts, attending);
    guestCounts.disabled = !attending;
    if (!attending) {
      fieldError("adultos");
      fieldError("ninos");
    }
    // El borrador se conserva al alternar; si responde no, el envío usa ceros.
  }

  Object.entries(rsvpErrorFields).forEach(([key, field]) => {
    field.controls.forEach((control) => control.addEventListener("input", () => {
      if (!rsvpBusy) {
        fieldError(key);
        if (!rsvpForm.querySelector('[aria-invalid="true"]') && rsvpAlert.textContent.startsWith("Revisa los campos")) rsvpAlert.textContent = "";
      }
      updateRsvpDraft();
    }));
  });
  attendanceInputs.forEach((control) => control.addEventListener("change", updateAttendance));
  rsvpAvailability.hidden = rsvpReady;
  rsvpAvailability.textContent = "El buzón estará disponible pronto";
  rsvpPrivacy.textContent = rsvpDemo ? "Tus palabras son un regalo para mi yo del futuro."
    : rsvpReady ? "Tu mensaje será privado y quedará guardado para la familia."
      : "Tu cartita será privada. Podrás enviarla cuando el buzón esté disponible.";
  rsvpDemoAgain.addEventListener("click", () => {
    if (!rsvpDemo || rsvpBusy) return;
    rsvpSaved = false;
    rsvpForm.hidden = false;
    rsvpFields.disabled = false;
    rsvpResult.textContent = "";
    rsvpResult.classList.remove("is-saved");
    rsvpDemoAgain.hidden = true;
    mailboxScene.classList.remove("has-delivered");
    animate(rsvpForm, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 420 });
    updateAttendance();
    updateRsvpDraft();
    guestName.focus();
  });
  updateAttendance();
  updateRsvpDraft();

  // Botones − y +: cambian el número y lo hacen saltar en su casilla.
  rsvpForm.querySelectorAll(".stepper-button").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.getAttribute("aria-controls"));
      const step = Number(button.dataset.step);
      const minimum = Number(input.min) || 0;
      const current = /^\d+$/u.test(input.value.trim()) ? Number(input.value) : minimum;
      const next = Math.max(minimum, current + step);
      animate(button, [{ transform: "scale(.86)" }, { transform: "none" }], { duration: 260 });
      if (next === current && input.value.trim()) {
        animate(input, [{ transform: "none" }, { transform: "translateX(-4px)" }, { transform: "translateX(3px)" }, { transform: "none" }], { duration: 260 });
        return;
      }
      input.value = String(next);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      animate(input, [{ transform: `translateY(${step > 0 ? -5 : 5}px) scale(1.06)`, opacity: .4 }, { transform: "none", opacity: 1 }], { duration: 300 });
    });
  });

  // La cartita empieza como un sobre cerrado; al tocarlo se abre y aparece el papel.
  function openLetter({ focus = true } = {}) {
    if (letterToggle.getAttribute("aria-expanded") === "true") return Promise.resolve();
    letterToggle.setAttribute("aria-expanded", "true");
    const opening = reducedMotion.matches ? Promise.resolve() : new Promise((resolve) => { window.setTimeout(resolve, 320); });
    return opening.then(() => Promise.all([revealBlock(letterBody, true), revealBlock(letterToggle, false)]))
      .then(() => { if (focus) guestMessage.focus(); });
  }
  if (!guestMessage.value) {
    letterToggle.hidden = false;
    letterToggle.setAttribute("aria-expanded", "false");
    letterBody.hidden = true;
  }
  letterToggle.addEventListener("click", () => openLetter());

  function validateRsvp() {
    Object.keys(rsvpErrorFields).forEach((key) => fieldError(key));
    const payload = {
      invitacionId: invitationId,
      nombreInvitado: guestName.value.trim(),
      asistencia: rsvpForm.querySelector('[name="asistencia"]:checked')?.value || "",
      adultos: 0,
      ninos: 0,
      mensaje: guestMessage.value.trim(),
    };
    const errors = {};
    if (!payload.nombreInvitado) errors.nombreInvitado = "Escribe tu nombre para saber quién nos acompaña.";
    else if (guestName.value.length > 100) errors.nombreInvitado = "Tu nombre puede tener hasta 100 caracteres.";
    if (!["si", "no"].includes(payload.asistencia)) errors.asistencia = "Elige si podrás acompañarnos.";
    if (payload.asistencia === "si") {
      [["adultos", guestAdults, 1], ["ninos", guestChildren, 0]].forEach(([key, control, minimum]) => {
        const raw = control.value.trim();
        const count = Number(raw);
        if (!raw) errors[key] = key === "adultos" ? "Indica cuántos adultos asistirán." : "Indica cuántos niños asistirán; escribe 0 si no irán niños.";
        else if (!/^\d+$/u.test(raw) || !Number.isSafeInteger(count) || count < minimum) errors[key] = key === "adultos"
          ? "Escribe un número entero de adultos, como mínimo 1."
          : "Escribe un número entero de niños, como mínimo 0.";
        else payload[key] = count;
      });
    }
    if (guestMessage.value.length > 2000) errors.mensaje = "Tu cartita puede tener hasta 2000 caracteres.";
    Object.entries(errors).forEach(([key, message]) => fieldError(key, message));
    return { payload, errors };
  }

  function idempotencyKey() {
    if (typeof window.crypto?.randomUUID === "function") return window.crypto.randomUUID();
    const bytes = window.crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function focusRsvpError(errors) {
    const first = Object.keys(errors).find((key) => rsvpErrorFields[key]);
    Object.keys(errors).forEach(shakeField);
    if (errors.mensaje) openLetter({ focus: false });
    if (first) rsvpErrorFields[first].controls[0].focus();
  }

  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (rsvpBusy || rsvpSaved) return;
    rsvpAlert.textContent = "";
    if (!rsvpReady) {
      rsvpAlert.textContent = "El buzón estará disponible pronto. Todavía no se ha enviado tu respuesta.";
      return;
    }
    const { payload, errors } = validateRsvp();
    if (Object.keys(errors).length) {
      rsvpAlert.textContent = "Revisa los campos marcados para enviar tu respuesta.";
      focusRsvpError(errors);
      return;
    }
    const website = document.getElementById("guest-website").value;
    if (website) {
      rsvpAlert.textContent = "No pudimos validar el envío. Tus datos siguen aquí.";
      return;
    }
    // Demostración explícita: no fabrica un recibo ni llama al servidor.
    if (rsvpDemo) {
      rsvpBusy = true;
      rsvpFields.disabled = true;
      rsvpForm.setAttribute("aria-busy", "true");
      updateRsvpDraft();
      await new Promise((resolve) => window.setTimeout(resolve, reducedMotion.matches ? 200 : 700));
      rsvpBusy = false;
      rsvpSaved = true;
      rsvpForm.removeAttribute("aria-busy");
      updateRsvpDraft();
      await showRsvpSuccess(payload.mensaje
        ? `¡Gracias, ${payload.nombreInvitado}! Tus palabras para ${name} son un regalo que nos llena de alegría.`
        : `¡Gracias, ${payload.nombreInvitado}! Nos alegra conocer tu respuesta.`);
      rsvpDemoAgain.hidden = false;
      return;
    }
    const signature = JSON.stringify(payload);
    try {
      if (!pendingAttempt || pendingAttempt.signature !== signature) pendingAttempt = { signature, key: idempotencyKey() };
    } catch {
      rsvpAlert.textContent = "Este navegador no permite un envío seguro. Usa un navegador actualizado; tus datos siguen aquí.";
      return;
    }
    const key = pendingAttempt.key;
    rsvpBusy = true;
    rsvpFields.disabled = true;
    rsvpForm.setAttribute("aria-busy", "true");
    updateRsvpDraft();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let serverErrors;
    try {
      const response = await fetch(rsvpEndpoint, {
        method: "POST", credentials: "omit", cache: "no-store", signal: controller.signal,
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Idempotency-Key": key },
        body: JSON.stringify({ ...payload, antispam: { sitioWeb: website, tiempoFormularioMs: Math.round(performance.now() - formOpenedAt) } }),
      });
      const receipt = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 422 && receipt?.errores && typeof receipt.errores === "object") {
          serverErrors = {};
          Object.entries(receipt.errores).forEach(([field, message]) => {
            if (rsvpErrorFields[field] && typeof message === "string") {
              serverErrors[field] = message.slice(0, 300);
              fieldError(field, serverErrors[field]);
            }
          });
        }
        if (serverErrors && Object.keys(serverErrors).length) throw new Error("Revisa los campos marcados por el buzón. Tus datos siguen aquí.");
        if (response.status === 429) throw new Error("El buzón ha recibido muchas respuestas. Espera unos minutos y vuelve a intentar.");
        throw new Error("No pudimos confirmar el guardado. Tus datos siguen aquí; intenta de nuevo.");
      }
      // Un 200 genérico, una página HTML o una respuesta parcial no prueban guardado.
      const validReceipt = receipt?.ok === true && typeof receipt.id === "string" && receipt.id.trim()
        && receipt.invitacionId === invitationId && receipt.claveIdempotencia === key
        && typeof receipt.fechaEnvio === "string" && receipt.fechaEnvio.endsWith("Z")
        && Number.isFinite(Date.parse(receipt.fechaEnvio));
      if (!validReceipt) throw new Error("El buzón no confirmó el guardado. Tus datos siguen aquí; intenta de nuevo.");
      rsvpSaved = true;
      await showRsvpSuccess(payload.mensaje
        ? `¡Gracias, ${payload.nombreInvitado}! Tu respuesta y tu cartita quedaron guardadas para que ${name} las descubra cuando sea más grande.`
        : `¡Gracias, ${payload.nombreInvitado}! Tu respuesta quedó guardada.`);
    } catch (error) {
      rsvpAlert.textContent = error.name === "AbortError"
        ? "El buzón tardó en responder. No pudimos confirmar el guardado; intenta de nuevo con los mismos datos."
        : error instanceof TypeError
          ? "No pudimos conectar con el buzón. Tus datos siguen aquí; revisa tu conexión e intenta de nuevo."
          : error.message;
    } finally {
      window.clearTimeout(timeout);
      rsvpBusy = false;
      if (!rsvpSaved) {
        rsvpFields.disabled = false;
        updateAttendance();
        if (serverErrors) focusRsvpError(serverErrors);
      }
      rsvpForm.removeAttribute("aria-busy");
      updateRsvpDraft();
    }
  });

  // Notas opcionales. textContent mantiene los textos de configuración como texto.
  const guestNotesList = document.getElementById("guest-notes-list");
  const guestNoteIcons = document.getElementById("guest-note-icons");
  const allowedNoteIcons = new Set(["ropa", "bolsa", "actividades", "acceso", "regalo", "lista"]);
  const visibleNotes = (Array.isArray(INVITATION_CONFIG.detallesInvitados) ? INVITATION_CONFIG.detallesInvitados : [])
    .filter((note) => note?.habilitado === true && typeof note.titulo === "string" && note.titulo.trim()
      && typeof note.descripcion === "string" && note.descripcion.trim());
  guestNotesList.replaceChildren();
  visibleNotes.forEach((note) => {
    const item = makeElement("li", "guest-note");
    item.setAttribute("data-reveal", "");
    const top = makeElement("div", "guest-note-top");
    const iconHolder = makeElement("span", "guest-note-icon");
    iconHolder.setAttribute("aria-hidden", "true");
    const iconName = allowedNoteIcons.has(note.icono) ? note.icono : "lista";
    iconHolder.append(guestNoteIcons.content.querySelector(`[data-note-icon="${iconName}"]`).cloneNode(true));
    top.append(iconHolder);
    item.append(top, makeElement("h3", "guest-note-title", note.titulo.trim()), makeElement("p", "guest-note-description", note.descripcion.trim()));
    guestNotesList.append(item);
  });
  guestNotesSection.dataset.hasNotes = String(visibleNotes.length > 0);

  content.inert = true;
  content.setAttribute("aria-hidden", "true");
  // Sin JavaScript, las secciones conservan su contenido y su altura normal.
  revealedSections.forEach((section) => {
    section.hidden = true;
    section.inert = true;
    section.setAttribute("aria-hidden", "true");
  });
  let openingTimer;
  let sectionObserver;

  function revealSectionsImmediately() {
    sectionObserver?.disconnect();
    revealedSections.forEach((section) => {
      section.querySelectorAll("[data-reveal]").forEach((element) => {
        element.classList.remove("is-waiting");
        element.classList.add("has-entered");
      });
    });
  }

  root.addEventListener("invitation:opened", () => {
    if (!reducedMotion.matches && "IntersectionObserver" in window) {
      sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("is-waiting");
          entry.target.classList.add("has-entered");
          // Cada elemento aparece una sola vez, aunque vuelvas a subir y bajar.
          sectionObserver.unobserve(entry.target);
        });
      }, { threshold: .14, rootMargin: "0px 0px -28px 0px" });
      revealedSections.forEach((section) => {
        section.querySelectorAll("[data-reveal]").forEach((element) => {
          element.classList.add("is-waiting");
          sectionObserver.observe(element);
        });
      });
    } else {
      revealSectionsImmediately();
    }
    revealedSections.forEach((section) => {
      section.hidden = section === guestNotesSection && section.dataset.hasNotes === "false";
      section.inert = false;
      section.removeAttribute("aria-hidden");
    });
    startCountdown();
  }, { once: true });

  const countdownValues = document.getElementById("countdown-values");
  const countdownCelebration = document.getElementById("countdown-celebration");
  const countdownFallback = document.getElementById("countdown-fallback");
  const countdownWhen = document.getElementById("countdown-when");
  const eventTimeElement = document.getElementById("countdown-event-time");
  const countdownNumbers = [...countdown.querySelectorAll("[data-countdown]")];
  const configuredHour = String(INVITATION_CONFIG.hora);
  const configuredOffset = String(INVITATION_CONFIG.desfaseHorario);
  // Un único instante absoluto: 2026-11-15T16:00:00-06:00 para esta muestra.
  const eventDateTime = `${configuredDate}T${configuredHour}:00${configuredOffset}`;
  const eventTimestamp = Date.parse(eventDateTime);
  const eventIsValid = dateIsValid
    && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(configuredHour)
    && /^[+-](?:(?:0\d|1[0-3]):[0-5]\d|14:00)$/.test(configuredOffset)
    && Number.isFinite(eventTimestamp);
  let countdownInterval;
  let countdownStarted = false;
  let countdownFinished = false;
  let countdownSizingReady = false;

  if (eventIsValid) {
    const eventDate = new Date(eventTimestamp);
    const eventZone = "America/Mexico_City";
    const formattedDate = new Intl.DateTimeFormat("es-MX", {
      day: "numeric", month: "long", year: "numeric", timeZone: eventZone,
    }).format(eventDate);
    const fullDate = new Intl.DateTimeFormat("es-MX", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: eventZone,
    }).format(eventDate);
    const timeLabel = new Intl.DateTimeFormat("es-MX", {
      hour: "numeric", minute: "2-digit", hour12: true, timeZone: eventZone,
    }).format(eventDate).replace(/([ap])\.?\s*m\.?/iu, "$1. m.").replace(/\s+/gu, " ");
    const dateParts = new Intl.DateTimeFormat("en-CA", {
      year: "numeric", month: "2-digit", day: "2-digit", timeZone: eventZone,
    }).formatToParts(eventDate);
    dateElement.dateTime = ["year", "month", "day"].map((type) => dateParts.find((part) => part.type === type).value).join("-");
    dateElement.textContent = formattedDate;
    eventTimeElement.dateTime = eventDateTime;
    eventTimeElement.textContent = `${formattedDate} a las ${timeLabel}`;
    const locationDate = document.getElementById("location-date");
    const locationTime = document.getElementById("location-time");
    locationDate.dateTime = eventDateTime;
    // Hoja de calendario: día de la semana, número y mes con año.
    const calendarParts = Object.fromEntries(new Intl.DateTimeFormat("es-MX", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: eventZone,
    }).formatToParts(eventDate).map((part) => [part.type, part.value]));
    const [weekdayPart, dayPart, monthPart] = locationDate.querySelectorAll("span");
    weekdayPart.textContent = calendarParts.weekday;
    dayPart.textContent = calendarParts.day;
    monthPart.textContent = `${calendarParts.month} ${calendarParts.year}`;
    locationDate.setAttribute("aria-label", `${fullDate.charAt(0).toLocaleUpperCase("es-MX")}${fullDate.slice(1)}`);
    locationTime.dateTime = eventDateTime;
    locationTime.textContent = timeLabel;
    // Bajo el contador: "Domingo, 15 de noviembre · 4:00 p. m."
    const dayLabel = new Intl.DateTimeFormat("es-MX", {
      weekday: "long", day: "numeric", month: "long", timeZone: eventZone,
    }).format(eventDate);
    const whenParts = [`${dayLabel.charAt(0).toLocaleUpperCase("es-MX")}${dayLabel.slice(1)}`, " · ", timeLabel]
      .map((text, index) => Object.assign(document.createElement("span"), {
        className: ["countdown-when__day", "countdown-when__separator", "countdown-when__time"][index],
        textContent: text,
      }));
    countdownWhen.replaceChildren(...whenParts);
  } else {
    countdownFallback.textContent = "Pronto compartiremos la hora de la celebración.";
    document.getElementById("location-date").textContent = "Fecha por confirmar";
    document.getElementById("location-date").classList.add("is-pending");
    document.getElementById("location-time").textContent = "Horario por confirmar";
    document.getElementById("location-date").removeAttribute("datetime");
    document.getElementById("location-time").removeAttribute("datetime");
  }

  // La despedida repite la fecha y la hora de la cuenta regresiva.
  const farewellWhen = document.getElementById("farewell-when");
  if (countdownWhen.childElementCount) farewellWhen.replaceChildren(...[...countdownWhen.childNodes].map((node) => node.cloneNode(true)));
  else farewellWhen.hidden = true;

  document.getElementById("location-venue").textContent = String(INVITATION_CONFIG.lugar || "").trim() || "[Nombre del salón o lugar]";
  document.getElementById("location-address").textContent = String(INVITATION_CONFIG.direccion || "").trim() || "[Dirección completa]";

  function getGoogleMapsUrl(value) {
    try {
      const url = new URL(String(value || "").trim());
      if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
      const host = url.hostname.toLowerCase();
      const shortLink = (host === "maps.app.goo.gl" && url.pathname.length > 1)
        || (host === "goo.gl" && url.pathname.startsWith("/maps/"));
      const mapsHost = host === "maps.google.com" || host === "maps.google.com.mx";
      const googleMapsPath = ["google.com", "www.google.com", "google.com.mx", "www.google.com.mx"].includes(host)
        && /^\/maps(?:\/|$)/u.test(url.pathname);
      return shortLink || mapsHost || googleMapsPath ? url.href : null;
    } catch {
      return null;
    }
  }

  const mapsUrl = getGoogleMapsUrl(INVITATION_CONFIG.enlaceMaps);
  const directionsLink = document.getElementById("directions-link");
  const locationPending = document.getElementById("location-pending");
  const mapLink = document.getElementById("location-map-link");
  if (mapsUrl) {
    directionsLink.href = mapsUrl;
    mapLink.href = mapsUrl;
    directionsLink.hidden = false;
    locationPending.hidden = true;
  } else {
    directionsLink.removeAttribute("href");
    mapLink.removeAttribute("href");
    directionsLink.hidden = true;
    locationPending.hidden = false;
  }

  function finishCountdown() {
    window.clearInterval(countdownInterval);
    countdownFinished = true;
    countdown.dataset.countdownState = "finished";
    countdownNumbers.forEach((element) => {
      element.textContent = element.dataset.countdown === "dias" ? "0" : "00";
    });
    countdownValues.hidden = true;
    countdownWhen.hidden = true;
    countdownFallback.hidden = true;
    countdownCelebration.hidden = false;
    // Solo este cambio final se anuncia; los segundos tienen aria-live="off".
    countdownCelebration.textContent = "¡Hoy celebramos mi primer añito!";
  }

  function updateCountdown() {
    const remainingMilliseconds = eventTimestamp - Date.now();
    if (remainingMilliseconds <= 0) {
      finishCountdown();
      return false;
    }
    // Redondear hacia arriba conserva el último segundo hasta el instante del evento.
    const totalSeconds = Math.ceil(remainingMilliseconds / 1000);
    const values = {
      dias: String(Math.floor(totalSeconds / 86400)),
      horas: String(Math.floor(totalSeconds / 3600) % 24).padStart(2, "0"),
      minutos: String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0"),
      segundos: String(totalSeconds % 60).padStart(2, "0"),
    };
    if (!countdownSizingReady) {
      // Reserva el tamaño inicial de los días; no cambia al pasar de 100 a 99, etc.
      countdownValues.style.setProperty("--days-scale", Math.max(1, values.dias.length / 2.4));
      countdownSizingReady = true;
    }
    countdownNumbers.forEach((element) => {
      const nextValue = values[element.dataset.countdown];
      if (element.textContent === nextValue) return;
      element.textContent = nextValue;
      // Cada cifra nueva cae suavemente en su cubo (no en la primera lectura).
      if (countdownValues.hidden) return;
      element.classList.remove("is-ticking");
      void element.offsetWidth;
      element.classList.add("is-ticking");
    });
    countdownValues.hidden = false;
    countdownWhen.hidden = false;
    countdownFallback.hidden = true;
    countdown.dataset.countdownState = "running";
    return true;
  }

  function startCountdown() {
    if (countdownStarted || !eventIsValid) return;
    countdownStarted = true;
    // Nunca se resta uno al contador: cada ejecución consulta la hora real.
    if (updateCountdown()) countdownInterval = window.setInterval(updateCountdown, 1000);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && countdownStarted && !countdownFinished) updateCountdown();
  });

  function finishOpening() {
    if (cover.dataset.state !== "opening") return;
    clearTimeout(openingTimer);
    cover.dataset.state = "open";
    intro.inert = true;
    intro.setAttribute("aria-hidden", "true");
    nameHeading.focus({ preventScroll: true });
    status.textContent = `La invitación de ${name} está abierta.`;
    // Se mide cuando la entrada termina, porque las animaciones desplazan los elementos.
    window.setTimeout(showScrollHintIfNeeded, reducedMotion.matches ? 0 : 1400);
    // Punto de integración para la cuenta regresiva y futuras secciones.
    root.dispatchEvent(new CustomEvent("invitation:opened", {
      bubbles: true,
      detail: { nombre: name, fecha: dateElement.dateTime },
    }));
  }

  button.addEventListener("click", () => {
    if (cover.dataset.state !== "closed") return;
    button.disabled = true;
    button.setAttribute("aria-expanded", "true");
    content.inert = false;
    content.removeAttribute("aria-hidden");
    cover.setAttribute("aria-labelledby", "birthday-name");
    cover.dataset.state = "opening";
    if (reducedMotion.matches) {
      finishOpening();
    } else {
      openingTimer = window.setTimeout(finishOpening, 660);
    }
  });

  // También respeta un cambio de preferencia mientras la tarjeta se abre.
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      finishOpening();
      revealSectionsImmediately();
    }
  });
})();
