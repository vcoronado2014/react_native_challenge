# PocketDex - Registro Nativo con Arquitectura Limpia

Una aplicación de React Native ligera y de alto rendimiento construida con **React 19** y **React Native 0.86 (CLI Core)**. Este proyecto despliega un archivo de registro de criaturas de pokemons utilizando la PokeAPI, implementando principios estrictos de Arquitectura Limpia, pruebas unitarias automatizadas, enrutamiento manual basado en estados (sin librerías de navegación de terceros), persistencia local y etiquetas de accesibilidad nativas.

### Justificación: Elección de React Native CLI vs. Expo

Para el desarrollo de este ecosistema, se optó conscientemente por utilizar **React Native CLI nativo (sin Expo)** debido a las siguientes razones de arquitectura y control de infraestructura:

1. **Control Absoluto sobre el Tamaño del Binario y Performance:** Expo incluye por defecto un ecosistema robusto de librerías precompiladas dentro de su "Go runtime". Para una aplicación enfocada en el rendimiento, la carga incremental y el manejo eficiente de la memoria, usar el CLI puro garantiza que el tamaño final del archivo (`.apk` o `.ipa`) contenga única y estrictamente el código que escribimos, eliminando sobrecarga (overhead) innecesaria de software.

2. **Garantía de Extensibilidad Nativa:**
   Aunque Expo ha evolucionado con sus *Prebuilds*, iniciar el proyecto desde el núcleo nativo con React Native CLI elimina cualquier riesgo de "bloqueo de proveedor" (*vendor lock-in*). Si en el futuro el proyecto requiere SDKs nativos muy específicos (por ejemplo, lectores biométricos avanzados, drivers de hardware por Bluetooth, o módulos personalizados en Kotlin/Swift), la base de código ya está lista para integrarlos directamente en las carpetas `/android` y `/ios` sin procesos traumáticos de migración o configuraciones complejas de plugins.

3. **Simulación de un Entorno Corporativo Real:**
   La gran mayoría de las aplicaciones empresariales de gran escala en producción optan por React Native CLI para mantener el control total de sus pipelines de integración continua (CI/CD) y scripts de automatización nativos (como Gradle o Fastlane). Esta elección demuestra madurez técnica en el manejo de entornos móviles puros.

---

## Inicio Rápido e Instalación

### Prerrequisitos
- Node.js (v18 o superior recomendado)
- Android Studio y Android SDK configurados
- Java Development Kit (JDK 17)

### Instrucciones de Configuración
1. **Clonar o navegar al directorio del proyecto:**
   ```bash
   cd PocketDex

### Instalar dependencias
```bash
npm install

### Dependencias adicionales añadidas
Si bien la premisa era NO instalar dependencias adicionales, fué necesario para el manejo de test, storage
 y persistencia de datos las siguientes librerias adicionales

# Almacenamiento local físico nativo
```npm install @react-native-async-storage/async-storage

# Preset para la suite de pruebas unitarias de Jest
```npm install --save-dev @react-native-jest-preset

# Iniciar metro de ser necesario
```npm start

# Lanzar la aplicacion en el emulador de android
Idealmente este emulador debe estar corriendo en el PC para evitar dificultades de sincronización, o bien 
 debe haber un dispositivo físico conectado mediante cable al PC

```npm run android

# Pruebas unitarias
```npm test

# Arquitectura y otras decisiones técnicas
La base de código sigue estrictamente los principios de Arquitectura Limpia (Clean Architecture) y SOLID para garantizar el desacoplamiento, la testabilidad y la mantenibilidad a largo plazo.

# Principales decisiones
* DI vía ** DependenciesContext **
* Enrutador de Navegación sin librerias basado en estados
* Cache en memoria que utiliza estructuras Map para retener los datos de la sesión activa
* Almacenamiento local persistente para serializar y guardar las listas paginadas y los detalles individuales
* Comportamiento offline cuando la app detecta falla de red
* Paginación y carga incremental para evitar cuellos de botella en el rendimiento
* Optimización de memoria en FlatList mediante configuraciones avanzadas en el componente
* Entidad limpia y modelo fuertemente tipado
* Accesibilidad donde se incluye flujos de lectores de pantalla y asistencia visual
* Conjunto de reglas preconfiguradas mediante Prettier y EsLint para patrones de análisis estático (linting y formateo)
    ```npm run lint

# Mejoras futuras
* Quizás se podría hacer un caché dinámico  de imágenes, ya que las imagenes dependen del caché de red
 de react native, se podría incorporar un caché en el sistema de archivos local para los assets y mejorar
  la presentación offline.

* Escalar la base de datos para registros masivos, migrar AsyncStorage a una solución más empresarial como
 SqlLite o Realm mejorando de todas formas la indexación.

#### Video de funcionamiento
[Haz clic aquí para ver el video en Drive](https://drive.google.com/file/d/1TlVtvFRsIBagmEJabDyF_U7Wym8AlgaH/view?usp=drive_link)

