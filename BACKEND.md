# Conectar el buzón privado

## Estado actual

Este proyecto es estático: no tiene backend, base de datos, credenciales ni un servicio de guardado desplegado. `confirmacion.endpoint` está vacío. El modo demostración está activo (`confirmacion.modoDemo: true`) por petición del usuario: permite probar la interacción y la animación. La interfaz del catálogo no lleva avisos de demostración, también por petición del usuario, pero nada se envía ni se guarda. No fabrica recibos ni anuncia guardado real. No hay localStorage ni lectura pública de cartas. Al desactivar la demostración sin conectar un endpoint, el botón queda deshabilitado y aparece “El buzón estará disponible pronto”.

Falta conectar **un endpoint HTTPS POST con almacenamiento persistente privado**, por ejemplo una función de servidor y una base de datos PostgreSQL. La familia necesitará acceso autenticado a los registros de esa base de datos o una exportación privada desde el servicio, para consultarlos desde otro dispositivo. No se ha construido un panel de administración ni un endpoint público de consulta.

## Configuración del navegador

En `script.js`, conecta la URL del servicio ya desplegado:

```js
confirmacion: {
  modoDemo: false,
  invitacionId: "yovana-primer-anito-2026",
  endpoint: "https://tu-dominio.example/api/confirmaciones",
},
```

La URL anterior es solo un ejemplo: no está configurada en la invitación. Para un backend del mismo dominio se puede usar `/api/confirmaciones`. Para desarrollo se admite HTTP únicamente en localhost. Nunca incluyas claves de base de datos, tokens de administración o secretos en este objeto. El identificador de invitación es público y debe estar autorizado del lado del servidor.

## Contrato de envío

Solo `POST`. El navegador manda JSON, `Accept: application/json` y una cabecera `Idempotency-Key` con un UUID v4. Usa `rsvp-request.schema.json` para validar la estructura **en el servidor**; tener el archivo en el proyecto no ejecuta esa validación por sí solo.

```json
{
  "invitacionId": "yovana-primer-anito-2026",
  "nombreInvitado": "Invitada de ejemplo",
  "asistencia": "si",
  "adultos": 2,
  "ninos": 0,
  "mensaje": "Una carta para cuando seas más grande.",
  "antispam": { "sitioWeb": "", "tiempoFormularioMs": 24000 }
}
```

El nombre se recorta en los extremos y no puede quedar vacío, ni exceder 100 caracteres. El mensaje es opcional, se recorta en los extremos y admite hasta 2000 caracteres. Las cantidades deben ser enteros seguros; si `asistencia` es `si`, adultos >= 1 y niños >= 0. Si es `no`, ambos deben ser 0. No se reciben teléfono ni correo. El navegador no manda una fecha de envío: la genera el servidor.

## Guardado e idempotencia que debe implementar el servicio

1. Limitar el cuerpo JSON, por ejemplo a 16 KB; verificar tipo de contenido, campos, rangos, UUID de la cabecera e invitación autorizada. Rechazar datos inválidos antes de guardar.
2. Normalizar los datos y calcular un hash de los seis campos de negocio: invitación, nombre, asistencia, adultos, niños y mensaje. La clave de idempotencia es independiente. No incluir `antispam` en ese hash: el tiempo puede cambiar entre reintentos.
3. Buscar `(invitacionId, claveIdempotencia)`. Si ya existe y el hash coincide, devolver el recibo original. Si existe con datos distintos, responder `409` sin modificar la respuesta anterior. No consumir cuota por un reintento ya guardado.
4. Aplicar la protección antispam a los envíos nuevos: rechazar un honeypot no vacío; limitar intentos por invitación e IP en almacenamiento compartido (p. ej. 5 por minuto y 30 por hora), devolver `429` y `Retry-After`. El tiempo del formulario es una señal auxiliar, controlada por el cliente, no una prueba de identidad. No confiar en ella como única protección. Evitar registrar cartas o nombres en logs; para rate limit puede usarse un hash de IP con sal privada y caducidad corta.
5. Crear en una transacción un identificador de registro, los campos de negocio, la clave y hash de idempotencia, y `fechaEnvio` generada por la base de datos en UTC. La restricción UNIQUE de la pareja invitación/clave debe resolver también peticiones simultáneas. Si otra petición ganó la carrera, devolver su recibo cuando el hash coincida.
6. **Solo después del commit duradero**, devolver el recibo. Si la escritura falla, devolver un error, nunca `ok: true`.

Ejemplo de tabla PostgreSQL para el servicio (no está instalada):

```sql
CREATE TABLE respuestas_invitacion (
  id uuid PRIMARY KEY,
  invitacion_id text NOT NULL,
  clave_idempotencia uuid NOT NULL,
  hash_datos text NOT NULL,
  nombre_invitado text NOT NULL CHECK (char_length(trim(nombre_invitado)) BETWEEN 1 AND 100),
  asistencia boolean NOT NULL,
  adultos bigint NOT NULL CHECK (adultos BETWEEN 0 AND 9007199254740991),
  ninos bigint NOT NULL CHECK (ninos BETWEEN 0 AND 9007199254740991),
  mensaje text NOT NULL DEFAULT '' CHECK (char_length(mensaje) <= 2000),
  fecha_envio timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (invitacion_id, clave_idempotencia),
  CHECK ((asistencia AND adultos >= 1) OR (NOT asistencia AND adultos = 0 AND ninos = 0))
);
REVOKE ALL ON respuestas_invitacion FROM PUBLIC;
```

El servicio debe generar `id` de forma segura; sus credenciales de escritura viven en variables privadas del servidor. La tabla no debe exponerse a roles anónimos de REST/GraphQL ni a una clave pública del navegador. Si se utiliza un proveedor que publica tablas automáticamente, activar sus reglas de acceso/RLS y negar toda lectura anónima. La familia consulta mediante un rol autenticado específico o exportación privada del proveedor. Habilitar backups y conservar esos registros en el servicio, no en un contenedor o disco efímero.

## Respuestas del endpoint

`201 Created` para un guardado nuevo, o `200 OK` para el reintento del mismo guardado:

```json
{
  "ok": true,
  "id": "d4e317cb-5e60-48b2-8bb0-f5ba40d7f719",
  "invitacionId": "yovana-primer-anito-2026",
  "claveIdempotencia": "UUID recibido en la cabecera",
  "fechaEnvio": "2026-10-01T18:25:30.000Z"
}
```

`fechaEnvio` debe ser UTC terminada en `Z`, generada por el servidor y estable en reintentos. El recibo no incluye el mensaje ni otros registros. El navegador exige todos estos campos, la invitación y la clave coincidentes antes de mostrar agradecimiento o animar el sobre. Un 200 con HTML o un JSON parcial se trata como fallo.

Para errores de validación, `422 Unprocessable Entity`:

```json
{
  "ok": false,
  "errores": {
    "nombreInvitado": "Escribe un nombre de hasta 100 caracteres.",
    "adultos": "Indica al menos un adulto."
  }
}
```

Las claves admitidas para errores junto a campos son `nombreInvitado`, `asistencia`, `adultos`, `ninos`, `mensaje`. No reflejar HTML. Usar también 400 para JSON inválido, 404 para invitación inexistente, 409 para conflicto de clave, 413 para cuerpo excesivo, 429 para límite antispam y 500/503 para fallos de servicio. El cliente conserva el borrador y no anuncia éxito ante ninguno.

Permitir CORS solo a los orígenes de la invitación y, si el servidor está en otro dominio, admitir `Content-Type`, `Accept`, `Idempotency-Key` y OPTIONS. CORS no sustituye controles de acceso: las consultas públicas `GET`, listados y lecturas de registros deben devolver 405/401/403. Evitar cachear solicitudes o recibos. El formulario usa `credentials: omit` y no requiere que el invitado inicie sesión.

## Reintentos y verificación

La clave del cliente se conserva en memoria mientras la página siga abierta y los campos de negocio no cambien. Un error de red o timeout puede ocurrir después de que el servidor haya guardado: el reintento de ese mismo borrador usa la misma clave. Cambiar el borrador crea otra clave. Recargar la página inicia una nueva sesión; el formulario no utiliza almacenamiento del navegador.

Antes de usarlo con invitados, probar sobre el servicio conectado: persistencia tras reiniciar el servidor, consulta privada desde otro dispositivo, solicitudes simultáneas con la misma clave, rechazo de datos inválidos y spam, y denegación de todas las lecturas públicas. Las pruebas locales del frontend usan respuestas interceptadas de prueba; no constituyen guardado ni verificación de una base de datos real.
