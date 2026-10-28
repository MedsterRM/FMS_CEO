<p align="center">
  <img src="build/icon.png" width="160" alt="FMS CEO">
</p>

<h1 align="center">FMS CEO</h1>
<p align="center"><b>Sé el CEO de la FMS.</b> Un manager de batallas de freestyle al estilo Football Manager.<br>
Juego de fans · gratuito · sin ánimo de lucro · funciona sin internet</p>

---

## 🎮 Descargar y jugar

### Windows
1. Ve a **[Releases](../../releases)** y descarga **`FMS_CEO.exe`**.
2. Haz doble clic. No hace falta instalar nada (la primera vez tarda unos segundos en abrirse).

> ⚠️ Como el juego no está firmado digitalmente, Windows puede mostrar *"Windows protegió su PC"*.
> Pulsa **"Más información" → "Ejecutar de todas formas"**.

### Navegador (Windows, Mac, Linux)
Descarga **`index.html`** y ábrelo con Chrome, Edge, Firefox o Safari. Funciona sin internet.

### 📱 Android / iPhone (se juega en horizontal)
1. Abre la web del juego: **https://medsterrm.github.io/FMS_CEO/** (GitHub Pages).
2. **Android (Chrome):** menú ⋮ → **"Instalar aplicación"** (o "Añadir a pantalla de inicio").
   **iPhone (Safari):** botón Compartir → **"Añadir a pantalla de inicio"**.
3. Ábrelo desde el icono: se abre a pantalla completa y en horizontal, como una app. Tras la primera carga funciona sin internet.

> Si tienes el móvil en vertical, el juego te pedirá que lo gires.

## 💾 Partidas
- La partida se guarda sola.
- Desde el juego puedes **exportar** la partida a un archivo e **importarla** en otro ordenador o navegador.
- En el ⚙️ (arriba a la derecha) puedes **reiniciar el juego** y **añadir tus propios competidores** (nombre, nacionalidad, foto y estilo).

## 🏆 Qué incluye
- **Ligas nacionales**: España, Argentina, México, Chile, Perú, Colombia y Caribe, más la **FMS Internacional** y la **FMS World Series**.
- **Más de 470 freestylers** reales, cada uno con su nivel, fama, hype y estilo (Punchline, Ingenio, Métrico, Flow, Showman, Disonante, Teatral, Coherencia, Poético).
- **Jornadas en directo** con formato corto y largo (Easy, Hard, Temáticas, Random, Minutos, Deluxe), réplicas y PTB.
- **Red Bull Batalla** (nacionales, Torneo de Plazas e Internacional) y **competiciones Under** (Monster Fu, Cuna de Oro, General Rap, BDM…).
- **Gestión de la empresa**: estrellas, fichajes, salarios, patrocinadores, speakers/hosts, exhibiciones, calendario y visitas.
- **Eventos únicos**: rechazos, bajas, rivalidades, polémicas, edits de Ryker, streamers…
- **Twitter/X dentro del juego**: la comunidad reacciona a los line ups, a los cruces de cada jornada y a los campeones, con más de 180 tuiteros reales y su forma de hablar según el país.

## 🌐 Activar la web en GitHub (para jugar en móvil)
1. En tu repositorio: **Settings → Pages**.
2. En *Branch* elige **`main`** y carpeta **`/ (root)`** → **Save**.
3. En 1-2 minutos el juego estará en `https://medsterrm.github.io/FMS_CEO/`.

## 🤖 App de Android (Android Studio)
El proyecto está en la carpeta **`android/`**. Es una app que abre el juego a pantalla completa y siempre en horizontal, sin internet.

1. Abre **Android Studio → File → Open** y elige la carpeta `android`.
2. Espera a que termine *Gradle sync* (la primera vez descarga cosas, tarda unos minutos).
3. Para probar: conecta el móvil con *Depuración USB* activada y pulsa ▶️ **Run**.
4. Para sacar el APK: **Build → Build App Bundle(s) / APK(s) → Build APK(s)**. Sale en `android/app/build/outputs/apk/debug/app-debug.apk`.

> Si cambias el juego, copia el `index.html` nuevo en `android/app/src/main/assets/index.html` y vuelve a compilar.

## 🛠️ Compilar el .exe tú mismo (opcional)
Necesitas [Node.js](https://nodejs.org/) instalado.

```bash
npm install
npm start           # abre el juego en una ventana
npm run build:win   # genera dist/FMS_CEO.exe
```
> Compílalo desde Windows. En Linux/Mac, `electron-builder` necesita Wine para poner el icono al ejecutable.

## 📁 Archivos
| Archivo | Qué es |
|---|---|
| `index.html` | El juego completo (todo incluido en un solo archivo) |
| `main.js` | Ventana de escritorio (Electron) |
| `package.json` | Configuración para compilar el `.exe` |
| `manifest.webmanifest` | Configuración de la app para móvil (pantalla completa, horizontal, icono) |
| `sw.js` | Hace que el juego funcione sin internet en el móvil |
| `build/` | Iconos del juego |
| `android/` | Proyecto de Android Studio (app para móvil) |
| `AVISO_LEGAL.md` | Aviso de juego de fans |

## 🐛 Fallos y sugerencias
Escríbeme por X: **[@MedsterRM](https://x.com/MedsterRM)**. ¡Gracias por jugar!

## ⚖️ Aviso
Proyecto **hecho por fans, gratuito y sin ánimo de lucro**. No está afiliado a FMS, Urban Roosters, Red Bull ni a ninguna de las personas o marcas que aparecen. Todas las marcas e imágenes pertenecen a sus propietarios. Más detalles en [AVISO_LEGAL.md](AVISO_LEGAL.md).
