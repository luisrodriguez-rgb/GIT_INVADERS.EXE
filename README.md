# 👾 GIT_INVADERS.EXE

```text
 ██████╗ ██╗████████╗   ██╗███╗   ██╗██╗   ██╗ █████╗ ██████╗ ███████╗██████╗ ███████╗
██╔════╝ ██║╚══██╔══╝   ██║████╗  ██║██║   ██║██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝
██║  ███╗██║   ██║      ██║██╔██╗ ██║██║   ██║███████║██║  ██║█████╗  ██████╔╝███████╗
██║   ██║██║   ██║      ██║██║╚██╗██║╚██╗ ██╔╝██╔══██║██║  ██║██╔══╝  ██╔══██╗╚════██║
╚██████╔╝██║   ██║██╗   ██║██║ ╚████║ ╚████╔╝ ██║  ██║██████╔╝███████╗██║  ██║███████║
 ╚═════╝ ╚═╝   ╚═╝╚═╝   ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝
```

> **"No es un juego sobre GitHub. Es un motor arcade procedural donde la actividad real de GitHub es el motor que genera el juego."**

`GIT_INVADERS.EXE` es una experiencia arcade retro-futurista construida con **TypeScript, Canvas 2D y Web Audio API procedural**. Transforma perfiles, commits, ramas, Pull Requests e Issues en una invasión espacial viva donde cada repositorio produce un reto matemático, estético y táctico único.

---

## ⚡ Arquitectura Desacoplada (Pipeline)

El juego **desconoce completamente la API de GitHub**. Solo interactúa con un contrato tipado `GameData` a través de una tubería de normalización matemática:

```text
                 GITHUB REST API
                        │
                        ▼
                github/GitHubClient
                        │
                        ▼
              github/DataNormalizer
        (Curvas logarítmicas y acotamiento)
                        │ NormalizedGameData
                        ▼
             procedural/WaveGenerator
       (Geometría dinámica & Boss Blueprint)
                        │
                        ▼
                 core/GameEngine
       (Loop 60 FPS, Colisiones, Entidades)
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
     rendering/Canvas         audio/AudioEngine
  (Vector Sprites, CRT)     (Web Audio Chiptune)
```

---

## 🎮 Modos de Juego

### 1. Profile Mode (`@usuario`)
Escanea la actividad pública de cualquier perfil (ej. `luisrodriguez-rgb`, `torvalds`, `shadcn`). Calcula el **Threat Level** según commits anuales y rachas activas, convirtiendo cada repositorio en una oleada progresiva.

### 2. Repository Mode (`usuario/repositorio`)
Incursión directa en un repositorio específico (ej. `luisrodriguez-rgb/sketion`, `facebook/react`). Analiza commits recientes, autores reales y culmina en la confrontación con el **`CODE BOSS`** de ese proyecto.

### 3. Chaos Mode (`⚡ INSTANT ⚡`)
Modo offline sin dependencias de red. Desata una simulación con métricas extremas: `9,999 COMMITS`, `482 PRs`, `731 ISSUES`, cadencia demencial y `CHAOS LEVEL: MAX`.

---

## 👾 Entidades & Mapeo de Actividad

| Entidad GitHub | Invasor Arcade | Comportamiento en Juego |
| :--- | :--- | :--- |
| **Commit** | Basic Invader | Formación rítmica con glifos de código hexadecimal (`0x8F`). Aceleran dinámicamente según se reducen sus números (+25 XP). |
| **Pull Request** | Armored PR | Crucero blindado con 3 capas de escudo rotatorio. Al ser destruido otorga Power-ups (`Multi-Shot`, `Stash Shield`, `XP Boost`). |
| **Issue / Bug** | Issue Bomber | Insectoide cibernético errático que rompe filas para ejecutar maniobras en picada y soltar bombas guiadas. |
| **Refactors / Docs** | Git Bunkers | 4 estructuras defensivas (`.gitignore`, `docs/`, `lockfile`, `tests/`) con **erosión celular destructible por píxel**. |
| **Repository Core** | **`CODE BOSS`** | Nave nodriza colosal cuyas estadísticas (*HP, cañones, escudos, cadencia*) se derivan matemáticamente del repositorio. |

---

## 🛸 El Code Boss (`SKETION // CORE`)

Al alcanzar la fase final, el terminal genera el **Boss Blueprint** con estadísticas técnicas y activa una alarma bifásica:

```text
╔════════════════════════════════════════════════╗
║             CODE BOSS DETECTED                 ║
╠════════════════════════════════════════════════╣
║ TARGET REPOSITORY:  sketion                    ║
║ PRIMARY LANGUAGE:   TypeScript [CYAN CORE]     ║
║ COMMITS:            342   → HP: 1,850          ║
║ CONTRIBUTORS:       4     → CANNONS: 4-WAY     ║
║ PULL REQUESTS:      28    → SHIELD CHARGES: 3  ║
║ OPEN ISSUES:        13    → BUG BOMBS: HIGH    ║
║ THREAT INDEX:       [████████░░] 78%           ║
╚════════════════════════════════════════════════╝
```

### Fases de Combate del Boss:
1. **Fase 1: Staging Core (100% - 65% HP)**: Desplazamiento horizontal senoidal con ráfagas frontales de plasma coordinadas.
2. **Fase 2: Merge Conflict Matrix (65% - 30% HP)**: Despliegue de escudos rotatorios orbitales y lásers diagonales cruzados.
3. **Fase 3: CI/CD Pipeline Overdrive (< 30% HP)**: Alerta roja, aceleración del arpegiador sonoro y oleada de bombas de bugs suicidas.

---

## 🛒 Tienda & Progresión (`GIT_STORE.EXE`)

Acumula **XP y Git Bytes** en combate para desbloquear mejoras persistentes en `localStorage`:

### Mejoras de Nave:
- **Blaster Overclock (Lvl 1 - 5)**: Reduce el tiempo de recarga del disparo principal.
- **Thruster Velocity (Lvl 1 - 5)**: Aumenta la velocidad de traslación lateral.
- **Quantum Piercing Lasers**: Los disparos atraviesan al primer invasor impactando un segundo objetivo.
- **Stash Shield Reserves**: Comienza cada incursión con un escudo de emergencia activo.

### Poderes Tácticos:
- `[SPACE]` **Blaster Fire**: Disparo láser frontal (o doble con power-up).
- `[Q]` **`GIT REBASE -i` (Slow-Motion)**: Ralentiza a todos los enemigos y proyectiles un 60% durante 4 segundos.
- `[E]` **`GIT STASH`**: Despliega un escudo de energía que absorbe el siguiente impacto letal.
- `[SHIFT]` **`GIT PUSH --FORCE`**: Rayo cósmico devastador Overdrive que aniquila columnas completas.
- `[ESC]` / `[P]` **Pause Process**: Pausa la simulación mostrando estadísticas en tiempo real y acceso directo a la tienda.

### Skins & Aleaciones:
- *Compiler Delta* (Cian cuántico predeterminado)
- *Phantom Violet* (Blindaje oscuro y plasma ultravioleta)
- *Solar Gold* (Aleación dorada con propulsores de fuego)
- *Emerald Glitch* (Nave de código Matrix puro)
- *Neon Overdrive* (Estilo Synthwave magenta)

---

## 🎨 Selector de Temas Visuales

Adaptación instantánea tanto de la interfaz como del renderizado vectorial en Canvas:
- **Matrix Phosphor (Oscuro)**: Fósforo verde terminal monocromático (`#00ff66`).
- **Modo Claro (GitHub Light)**: Paleta limpia oficial de GitHub con acentos verdes y contraste nítido.
- **Cyberpunk Neon (Fucsia)**: Saturación magenta y cian neón (`#ff007f`).
- **Cyber Cyan (Azul)**: Estética cuántica espacial (`#00e5ff`).
- **Amber CRT (Terminal)**: Recreación de monitores de fósforo ámbar vintage de los 80s (`#ffb000`).

---

## 🔊 Audio Procedural (Web Audio API)

**Cero archivos de audio externos (0 KB de assets pesados)**:
- **Lásers**: Osciladores con barrido de frecuencia descendente.
- **Explosiones**: Buffer de ruido blanco procedural filtrado con decaimiento exponencial.
- **Arpegiador Reactivo**: Línea de bajo en escala menor cuyo tempo (BPM) acelera automáticamente con el Threat Level y en el combate contra el Code Boss.

---

## ⌨️ Controles

| Tecla / Control | Acción |
| :--- | :--- |
| `A` / `D` o `←` / `→` | Mover la nave |
| `SPACE` | Disparar láser principal (mantener para ráfaga continua) |
| `Q` | Activar **`GIT REBASE`** (Slow-Motion 4s) |
| `E` | Activar **`GIT STASH`** (Escudo de emergencia) |
| `SHIFT` | Activar **`GIT PUSH --FORCE`** (Overdrive Beam) |
| `ESC` o `P` | Pausar / Reanudar el juego |
| *Touch Controls* | Controles virtuales táctiles integrados para móviles |

---

## 🚀 Instalación y Ejecución Local

Requiere **Node.js** y **pnpm**:

```bash
# 1. Clonar el repositorio
git clone https://github.com/usuario/git-invaders.git
cd git-invaders

# 2. Instalar dependencias con pnpm
pnpm install

# 3. Iniciar servidor de desarrollo en Vite
pnpm dev

# 4. Construir versión de producción optimizada
pnpm build
```

---

## 📄 Licencia

MIT © 2026 Luis Felipe Rodríguez — Diseñado como motor interactivo de datos y simulación procedural.
