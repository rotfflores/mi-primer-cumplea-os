# Mi primer añito · Rotf Studio

Abre `index.html` en un navegador. HTML, CSS y JavaScript sin dependencias ni conexión a internet.

## Personalizar

Edita `INVITATION_CONFIG`, al inicio de `script.js`:

```js
nombre: "Yovana",
fecha: "2026-11-15",              // AAAA-MM-DD
hora: "16:00",                   // HH:MM, formato de 24 horas
desfaseHorario: "-06:00",         // Hora del centro de México
lugar: "",                       // Nombre del salón o lugar
direccion: "",                   // Dirección completa
enlaceMaps: "",                  // Enlace HTTPS de Google Maps
fotografia: "./assets/yovana-retrato.webp", // Vacía = espacio de muestra
posicionFotografia: "50% 50%",    // Encuadre dentro del óvalo
```

Copia la fotografía a `assets/`. Se recomienda un retrato vertical. Si la ruta falla, se conserva el espacio de muestra. La fecha se muestra en español sin desplazamientos por zona horaria.

La portada utiliza `assets/yovana-retrato.webp`. Para elegir la segunda fotografía descargada, cambia `fotografia` a `"./assets/yovana-cumpleanos.webp"`. Son fotografías de muestra para el catálogo.

Las dos vistas comparten la misma celda de una cuadrícula para conservar la altura de la portada al abrir. El botón funciona con clic, Enter y espacio. Al terminar, el foco pasa al nombre. Al cargar, cada elemento de la tarjeta entra en secuencia; al abrir, el nombre, la fotografía, el osito, el mensaje y la fecha aparecen uno tras otro. En celulares de poca altura el diseño se compacta. El aviso "Desliza" invita a seguir leyendo y desaparece al llegar a la presentación. La preferencia de movimiento reducido elimina las animaciones, las transiciones y el movimiento de los globos.

## Presentación

La sección `#presentacion` se habilita después de abrir la invitación y se alcanza con el desplazamiento normal. Su título utiliza el mismo `INVITATION_CONFIG.nombre` de la portada. El mensaje aparece sobre el fondo crema con párrafos de 16 px en móvil y 17 px en escritorio, sin repetir fotografía ni fecha.

Un `IntersectionObserver` revela cada elemento una sola vez al entrar en pantalla. Con movimiento reducido o sin compatibilidad con este observador, todos los elementos se muestran directamente. Sin JavaScript, tanto la portada principal como la presentación permanecen visibles.

## Ampliar después

Al abrir se emite `invitation:opened`, con `detail.nombre` y `detail.fecha`, para iniciar futuros componentes dentro de `main#invitation`.

## Detalles para invitados

La sección `#detalles-invitados` está después de la confirmación y el buzón. Las tarjetas se generan desde `INVITATION_CONFIG.detallesInvitados`, con `habilitado`, `categoria`, `titulo`, `descripcion` e `icono`. Solo se muestra una tarjeta cuando `habilitado` es exactamente `true` y título y descripción tienen texto. Si no hay notas activas, se oculta la sección completa.

Las tres notas iniciales son **muestras editables**, señaladas en los comentarios de configuración: “Ven cómodo”, “Con ganas de celebrar” y “Un recuerdo en familia”. Los dos últimos textos se eligieron con autorización del usuario. Alberca/actividades, estacionamiento/acceso y regalos se preparan desactivados y sin descripción; no se asume que la fiesta ofrezca esos servicios ni tenga esas políticas.

Iconos locales disponibles: `ropa`, `bolsa`, `actividades`, `acceso`, `regalo`, `lista`. Un icono desconocido utiliza la lista como respaldo. El osito del encabezado sostiene una pequeña lista SVG. Las hojas llevan variaciones leves de color y cinta; solo el papel de fondo se inclina y los textos se mantienen rectos.

Las notas forman una lista en una sola hoja con clip, como la que sostiene el osito del encabezado: cada renglón tiene su ícono, el texto y una palomita. Al aparecer, los renglones entran uno tras otro, el ícono salta y la palomita se dibuja de izquierda a derecha; al tocar un renglón (o pasar el puntero), su ícono se mueve. La hoja conserva el mismo diseño en móvil, tablet y escritorio, y respeta movimiento reducido. Funcionan al abrir `index.html` directamente. Sin JavaScript, HTML conserva las tres muestras; al personalizar, actualiza también ese respaldo si deseas que refleje las notas nuevas en navegadores sin JavaScript.

## Confirmación y cartitas

La sección `#confirmacion`, después del álbum, incluye un buzón ilustrado, el osito, una tarjeta de papel y un formulario accesible. El nombre del bebé se reutiliza desde la configuración. Si el invitado responde sí, se solicitan adultos (mínimo 1) y niños (mínimo 0); si responde no, se ocultan y se envían ambos como 0. La cartita siempre es opcional, con contador y límite de 2000 caracteres. No se solicita contacto.

**El buzón está en modo demostración** (`confirmacion.modoDemo: true`). Puedes completar el formulario, probar la confirmación, ver el sobre entrar en el buzón y repetir con “Escribir otra cartita”. Por petición del usuario, la interfaz del catálogo no lleva avisos de demostración y utiliza mensajes naturales de agradecimiento. Esto no activa guardado real: nada se envía ni se almacena. No se usa almacenamiento del navegador ni se fabrican recibos del servidor.

**No hay backend en este proyecto.** Para usar un servicio real, cambia `confirmacion.modoDemo` a `false` y configura `confirmacion.endpoint`. Si no hay endpoint, el envío se deshabilita y se muestra “El buzón estará disponible pronto”.

Para conectar el guardado persistente privado, consulta [BACKEND.md](./BACKEND.md) y el esquema `rsvp-request.schema.json`. Hace falta un endpoint HTTPS POST con base de datos, validación y protección contra spam en el servidor, idempotencia y acceso privado para la familia. No se ha creado un panel de administración.

Una vez conectado y con demostración desactivada, el cliente valida campos, deshabilita controles durante el envío y conserva el borrador y la clave de idempotencia ante fallos. Solo un recibo de guardado válido permite mostrar agradecimiento y animar el sobre en ese modo. Sin JavaScript se mantienen visibles la sección y su aviso; el envío permanece deshabilitado. La entrada y el sobre respetan movimiento reducido.

### Interacciones de la confirmación

La asistencia se elige con dos tarjetas: al marcar una, su ícono salta y aparece una palomita. Al responder que sí, los campos de adultos y niños se despliegan con suavidad y tienen botones − y + (el número salta al cambiar). La cartita empieza como un sobre cerrado: al tocarlo, la solapa se abre, aparece el papel rayado y el cursor queda listo para escribir; sin JavaScript el campo se muestra abierto. Si falta un dato, el campo con error tiembla un instante. Mientras se envía, el botón muestra un indicador giratorio; al terminar, el formulario se pliega, aparece el agradecimiento con un sobre sellado y confeti de papel, y en el buzón la carta entra, la bandera se agita y el osito da un saltito. Con movimiento reducido, todo cambia sin animaciones.

## Así he crecido

El álbum `#asi-he-crecido` aparece después de la ubicación y se habilita al abrir la invitación. Son tres recuerdos con marcos de papel, cinta decorativa, una línea punteada y un pequeño osito al final. En móvil se recorren verticalmente; desde 860 px se organizan en tres columnas. Solo los marcos se inclinan, los textos permanecen rectos.

Edita la lista `INVITATION_CONFIG.recuerdos` en `script.js`. Cada recuerdo tiene `titulo`, `descripcion`, `imagen` (ruta local), `alternativo`, `posicion` (encuadre CSS, como `"50% 65%"`) y `etiqueta` (texto del espacio de muestra). Una ruta vacía o que no carga conserva el marco con su etiqueta y sin enlace ni visor. Las fotos utilizan carga diferida y mantienen un espacio de proporción 4:5, sin cambiar la altura al cargarse. Los archivos descargados conservan la imagen completa para el visor.

Las tres fotos son muestras de catálogo de distintos bebés, no fotos reales de Yovana ni un registro de su crecimiento. Reemplázalas por las fotos de la familia al personalizar la invitación. El aviso al pie del álbum identifica estas muestras.

Al tocar una foto o activar su enlace con Enter, un diálogo nativo muestra la imagen completa. La foto crece desde su miniatura y, al cerrar, regresa a su lugar en el álbum. Dentro del visor se pasa al recuerdo anterior o siguiente con las flechas en pantalla, las flechas del teclado o deslizando la foto; se muestran el título, la descripción y un contador. Se cierra con el botón visible, Escape o tocando fuera de la foto. El fondo queda inerte y sin desplazamiento; Tab y Mayús+Tab recorren solo los botones del visor.

Al llegar a cada recuerdo, el marco cae sobre el álbum, la cinta se pega, la foto se revela como una instantánea (de sepia y desenfocada a nítida), el punto de la línea aparece y el tramo punteado avanza hacia el siguiente recuerdo. Con el puntero, el marco se endereza y se eleva; al tocarlo, se hunde ligeramente. Con movimiento reducido no hay animaciones. Al cerrar, se recuperan el foco y la posición de lectura. Sin JavaScript, los recuerdos siguen visibles y sus enlaces abren los archivos completos; al personalizar también puedes actualizar los textos y enlaces de respaldo en `index.html`.

La entrada reutiliza el observador de las otras secciones y se ejecuta una vez por recuerdo. Con movimiento reducido se muestran directamente.

Fuentes de las fotografías descargadas para el álbum, bajo la [licencia Unsplash](https://unsplash.com/license), guardadas en WebP de hasta 1600 px sin recortar:

- `assets/recuerdo-recien-nacido.webp`: [Olivia Anne Snyder — recién nacido sobre una manta](https://unsplash.com/photos/a-newborn-baby-sleeps-peacefully-on-a-soft-blanket-NfE2M4Z9rME).
- `assets/recuerdo-seis-meses.webp`: [Christian Bowen — bebé sonriente sobre una manta](https://unsplash.com/photos/smiling-baby-lying-forward-on-pink-textile-uFCkcE6GI40). Se usa como ejemplo visual del segundo momento, sin atribuirle una edad exacta.
- `assets/recuerdo-primer-anito.webp`: [Selenay Balkan — bebé junto a globos de cumpleaños](https://unsplash.com/photos/a-baby-sitting-on-the-floor-in-front-of-balloons-L2RtGqIlv_0).

## Fecha, horario y ubicación

La tarjeta `#ubicacion` aparece después de la cuenta regresiva. La fecha y la hora provienen del mismo instante del contador; todos los textos del evento se formatean en español con `America/Mexico_City`, independientemente de la zona horaria del invitado.

Edita `lugar`, `direccion` y `enlaceMaps` en la configuración. Los campos vacíos muestran `[Nombre del salón o lugar]` y `[Dirección completa]`. Mientras el enlace esté vacío o no sea un enlace HTTPS válido de Google Maps, se muestra “Ubicación por confirmar”, sin un enlace activo. Un enlace válido activa automáticamente “Cómo llegar”, con `target="_blank"` y `rel="noopener noreferrer"`.

Se aceptan enlaces de `maps.app.goo.gl`, `goo.gl/maps/`, `maps.google.com`, `maps.google.com.mx` y rutas `/maps` en Google (`google.com`, `google.com.mx`, con o sin `www`). No hay un mapa incrustado. Los iconos son SVG locales y las decoraciones reutilizan los recursos existentes.

En móvil, los tres grupos se organizan verticalmente. En escritorio, fecha y horario comparten una fila, y el lugar ocupa todo el ancho de una tarjeta de máximo 580 px. La entrada reutiliza el observador de las secciones anteriores; sin JavaScript o con movimiento reducido, el contenido sigue visible.

## Cuenta regresiva

La sección `#cuenta-regresiva` está después de la presentación y se habilita con la misma apertura. Reutiliza el osito y los globos locales, junto a un bloque decorativo con el número 1. Los cuatro cubos del contador se mantienen en una fila desde 340 px; en pantallas más estrechas pasan a dos por dos.

`fecha`, `hora` y `desfaseHorario` forman el instante `2026-11-15T16:00:00-06:00`, equivalente a `2026-11-15T22:00:00Z`. Cambiar la fecha existente también cambia la cuenta regresiva. El desfase explícito conserva el mismo evento para visitantes en distintas zonas horarias.

Cada segundo se calcula la diferencia con `Date.now()`, sin acumular restas ni desfases. Al volver a una pestaña se recalcula inmediatamente. Horas, minutos y segundos llevan dos dígitos; los días usan los necesarios. Los cubos y las cifras conservan sus dimensiones. Al alcanzar o superar el instante del evento, se elimina el intervalo y el contador se sustituye por “¡Hoy celebramos mi primer añito!”. Los segundos no se anuncian a lectores de pantalla; solo el mensaje final tiene una región de estado.

La entrada ocurre una sola vez al entrar en pantalla; los globos flotan suavemente. Movimiento reducido elimina ambas animaciones. Sin JavaScript se conserva la escena y se muestra la fecha y hora del evento en lugar de un contador congelado.

## Despedida

La invitación termina en `#despedida`, después de los detalles para invitados. Repite la fecha y la hora de la cuenta regresiva (se generan desde `INVITATION_CONFIG`), ofrece «Confirmar asistencia» (lleva a `#confirmacion`) y «Volver al inicio», y cierra con la firma «Con mucho amor» y el nombre configurado, más la firma de Rotf Studio. Al llegar, los globos suben desde abajo y el nombre se escribe de izquierda a derecha. Los enlaces internos se desplazan con suavidad, salvo con movimiento reducido.

## Recursos locales

- `assets/osito.webp`: ilustración creada con la herramienta integrada de generación de imágenes. Prompt: osito clásico sentado, lazo de lino marfil, acuarela y gouache delicada, tonos beige y caramelo, fondo transparente, sin texto ni adornos.
- `assets/balloon-*.svg`: dos globos vectoriales en crema y durazno.
- `assets/paper.svg`: textura de papel sutil.
- `assets/yovana-retrato.jpg`: fotografía de muestra de Selenay Balkan, descargada de [Unsplash](https://unsplash.com/photos/a-baby-sitting-on-the-floor-wearing-a-birthday-hat-NmoCot1vUwk).
- `assets/yovana-cumpleanos.jpg`: segunda fotografía de muestra de Selenay Balkan, descargada de [Unsplash](https://unsplash.com/photos/a-baby-sitting-on-the-floor-in-front-of-balloons-L2RtGqIlv_0).
- Fotografías bajo la [licencia Unsplash](https://unsplash.com/license); las copias locales no requieren conexión para mostrarse.
- Tipografía: familias del sistema Palatino/Georgia y Segoe UI/Arial; sin solicitudes a servicios externos.

Prompt completo de la ilustración (herramienta integrada, fondo transparente):

> Use case: illustration-story. Asset type: isolated transparent PNG illustration for an elegant minimalist first birthday digital invitation. Primary request: one very tender classic teddy bear sitting, facing viewer, with a small ivory linen bow at its neck. Style/medium: delicate hand-painted watercolor and gouache on paper, fine organic grain, muted warm beige and soft caramel brown, gentle sophisticated nursery stationery illustration. Composition: full bear centered, entire body visible, rounded ears, subtly asymmetric handmade shape, little dark brown eyes and delicate stitched smile, paws forward, small soft oval ground shadow directly under bear only. The bear fills 85 percent of square canvas with generous clean edges. Truly transparent background with alpha, no white rectangle, no background scene. Soft understated watercolor shading, natural proportions, no shiny 3D effect, no harsh outlines, no blush cheeks, no other objects, no balloons, no flowers, no sparkles, no text, no border, no watermark. Restrained cream, peach and warm brown palette. Production asset, not a page mockup.

Fotografías optimizadas: `yovana-retrato.webp` (recortada para quitar el banderín superior y ajustada al óvalo, 640×816, ~34KB) y `yovana-cumpleanos.webp` (640 px de ancho, ~32KB), generadas con ffmpeg a partir de los JPG originales, que se conservan como fuente:

```
ffmpeg -i yovana-retrato.jpg -vf "crop=1200:1530:0:200,scale=640:-2:flags=lanczos" -c:v libwebp -quality 82 yovana-retrato.webp
```
