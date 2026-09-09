import { Sprites } from '../rendering/Sprites';
import { ARCHETYPE_DATABASE } from '../procedural/BossGenerator';
import { Security } from '../utils/Security';
import { SFX } from '../audio/SFX';
import { Store } from '../store/Store';

export interface CodexEntry {
  id: string;
  category: 'STANDARD' | 'ELITE' | 'BOSS' | 'SHIP';
  codeNumber: string;
  name: string;
  typeTag: string;
  gitOrigin: string;
  threatRating: number; // 0 - 100
  behavior: string;
  attack: string;
  weakness: string;
  lore: string;
  encounteredCount: number;
  destroyedCount: number;
}

export const CODEX_DATABASE: CodexEntry[] = [
  {
    id: 'commit_invader',
    category: 'STANDARD',
    codeNumber: 'E-01',
    name: 'COMMIT INVADER',
    typeTag: 'Dron de Vanguardia // Unidad Básica',
    gitOrigin: 'Git Commit Historial (`git commit -m`)',
    threatRating: 35,
    behavior: 'Formación en rejilla coordinada. Aumenta su velocidad exponencialmente a medida que disminuye el número de supervivientes.',
    attack: 'Pulsos de plasma cinético de baja cadencia calibrados al volumen de cambios.',
    weakness: 'Fuego concentrado y ráfagas de interceptor. No posee deflectores cinéticos.',
    lore: 'Cada commit en el árbol representa una unidad de trabajo que intenta consolidarse en la rama principal.',
    encounteredCount: 428,
    destroyedCount: 386,
  },
  {
    id: 'armored_pr',
    category: 'ELITE',
    codeNumber: 'E-02',
    name: 'ARMORED PULL REQUEST',
    typeTag: 'Crucero Pesado // Fusión de Ramas',
    gitOrigin: 'Pull Request con Code Review (`gh pr create`)',
    threatRating: 65,
    behavior: 'Despliega un escudo deflector segmentado en 4 cuadrantes. Resiste múltiples impactos frontales directos.',
    attack: 'Disparos dobles de antimateria y despliegue de drones de escolta.',
    weakness: 'Vulnerable tras agotar las 4 capas de escudo. Al morir pasa por la secuencia OPEN -> REVIEW -> APPROVED -> MERGED.',
    lore: 'Un pull request no es una victoria hasta superar la revisión. Su blindaje refleja la rigurosidad de las políticas de CI/CD.',
    encounteredCount: 112,
    destroyedCount: 94,
  },
  {
    id: 'issue_bomber',
    category: 'ELITE',
    codeNumber: 'E-03',
    name: 'ISSUE BUG BOMBER',
    typeTag: 'Entidad Biomecánica // Dron Asesino',
    gitOrigin: 'Issue Tracker & Bug Reports (`gh issue create`)',
    threatRating: 75,
    behavior: 'Movimiento independiente fuera de formación con oscilación senoidal. Ejecuta picadas acrobáticas hacia la posición del jugador.',
    attack: 'Proyectil teledirigido `BUG BOMB` con retícula de advertencia `TARGETING...` sobre la nave.',
    weakness: 'Baja integridad de casco. Un solo disparo certero antes de iniciar la picada lo neutraliza.',
    lore: 'Nacido de fugas de memoria y errores no controlados. Su comportamiento es errático y altamente disruptivo.',
    encounteredCount: 88,
    destroyedCount: 76,
  },
  {
    id: 'branch_drone',
    category: 'ELITE',
    codeNumber: 'E-04',
    name: 'BRANCH DRONE',
    typeTag: 'Nave Bifurcada // División Concurrente',
    gitOrigin: 'Git Branching (`git checkout -b`)',
    threatRating: 70,
    behavior: 'Nave en forma de V bifurcada. Al recibir daño crítico se divide en 2 micro-drones rápidos e independientes (`BRANCH SPLIT`).',
    attack: 'Salvas divergentes de plasma dorado que cubren los flancos de la arena.',
    weakness: 'Eliminar los micro-drones resultantes antes de que completen su vector de flanqueo.',
    lore: 'La ramificación concurrente permite explorar múltiples futuros... o duplicar las amenazas en el espacio de combate.',
    encounteredCount: 54,
    destroyedCount: 48,
  },
  {
    id: 'security_sentinel',
    category: 'ELITE',
    codeNumber: 'E-05',
    name: 'SECURITY SENTINEL',
    typeTag: 'Aegis de Encriptación // Tanque Defensivo',
    gitOrigin: 'Security Policies & Dependabot (`security.md`)',
    threatRating: 85,
    behavior: 'Tanque espacial con blindaje hexagonal y glifo de candado digital. Despliega periódicamente una barrera `FIREWALL` impenetrable.',
    attack: 'Cañones gemelos de alta densidad balística y pulsos de interferencia electromagnética.',
    weakness: 'Esperar la ventana de recarga tras la desactivación del firewall para descargar el armamento principal.',
    lore: 'Protege secretos industriales y tokens de autenticación mediante encriptación zero-trust.',
    encounteredCount: 32,
    destroyedCount: 26,
  },
  {
    id: 'mystery_octocat',
    category: 'ELITE',
    codeNumber: 'E-06',
    name: 'MYSTERY OCTOCAT',
    typeTag: 'Dron de Reconocimiento // Recompensa Legendaria',
    gitOrigin: 'GitHub Global Contributor Network',
    threatRating: 20,
    behavior: 'Cruza la parte superior de la pantalla a velocidad hipersónica. No ataca directamente.',
    attack: 'Evasión cinemática y dispersión de señuelos holográficos.',
    weakness: 'Disparos de precisión anticipados a su trayectoria. Otorga +500 XP y multiplicadores masivos.',
    lore: 'El emblema cósmico de GitHub. Su aparición señala un flujo masivo de contribuciones en la red.',
    encounteredCount: 19,
    destroyedCount: 17,
  },
  {
    id: 'ship_cyber_falcon',
    category: 'SHIP',
    codeNumber: 'S-01',
    name: 'CYBER FALCON',
    typeTag: 'Interceptor Delta // Caza Equilibrado',
    gitOrigin: 'Flujo Continuo de Integración (`git commit & push`)',
    threatRating: 78,
    behavior: 'Fuselaje delta clásico con canards aerodinámicos delanteros, espina dorsal biselada y reactores iónicos duales simétricos.',
    attack: 'COMPILER BURST: Salvas triples de plasma de precisión calibradas a cadencia estándar.',
    weakness: 'Defensa deflector estándar; requiere maniobrabilidad continua para evadir fuego pesado.',
    lore: 'La columna vertebral de la flota estelar de GitHub. Diseñada para pilotos que buscan un equilibrio perfecto entre aceleración, blindaje y maniobra.',
    encounteredCount: 120,
    destroyedCount: 114,
  },
  {
    id: 'ship_phantom_violet',
    category: 'SHIP',
    codeNumber: 'S-02',
    name: 'PHANTOM VIOLET',
    typeTag: 'Sigilo Furtivo // Flecha Invertida Berkut',
    gitOrigin: 'Aislamiento Temporal de Cambios (`git stash & pop`)',
    threatRating: 84,
    behavior: 'Alas de flecha negativa invertida hacia adelante y cabina facetada antirradar con toberas de ranura iónica embutidas.',
    attack: 'GIT STASH: Fase de invisibilidad e intangibilidad cuántica temporal durante 3.5 segundos.',
    weakness: 'Blindaje ligero; el casco puede fracturarse si recibe impactos directos fuera de la fase de sigilo.',
    lore: 'Nave de operaciones encubiertas construida para infiltrarse detrás de enjambres masivos de bugs sin ser detectada por los sensores enemigos.',
    encounteredCount: 85,
    destroyedCount: 79,
  },
  {
    id: 'ship_solar_gold',
    category: 'SHIP',
    codeNumber: 'S-03',
    name: 'SOLAR GOLD',
    typeTag: 'Ariete Blindado // Asedio Pesado',
    gitOrigin: 'Fusión de Historiales Críticos (`git merge --squash`)',
    threatRating: 88,
    behavior: 'Morro frontal en forma de "T" masiva reforzada con matriz de remaches pesados, blindaje multicapa y bloque de 3 toberas de asedio.',
    attack: 'MERGE BURST: Absorbe proyectiles frontales entrantes y desata una onda de choque cinética demoledora.',
    weakness: 'Baja velocidad angular de giro y velocidad de traslación reducida debido al peso de su armadura.',
    lore: 'Un coloso acorazado forjado en las refinerías solares. Su placa frontal puede soportar impactos concentrados de cruceros PR sin inmutarse.',
    encounteredCount: 92,
    destroyedCount: 86,
  },
  {
    id: 'ship_emerald_glitch',
    category: 'SHIP',
    codeNumber: 'S-04',
    name: 'EMERALD GLITCH',
    typeTag: 'Fractal Asimétrico // Multiplicador de Clones',
    gitOrigin: 'Bifurcación Concurrente Experimental (`git branch & checkout`)',
    threatRating: 86,
    behavior: 'Fuselaje completamente asimétrico con ala izquierda de doble hoja escalonada, ala derecha con bahía de sensores y núcleo de datos hexagonal.',
    attack: 'BRANCH SPLIT: Despliega 2 drones tácticos holográficos que duplican la potencia balística de la nave.',
    weakness: 'Firmas de energía inestables que generan fluctuaciones menores en los deflectores de casco.',
    lore: 'Nacida de una anomalía en un rebase concurrente. Sus pilotos dominan el arte de multiplicar su presencia para saturar las defensas del rival.',
    encounteredCount: 74,
    destroyedCount: 70,
  },
  {
    id: 'ship_neon_overdrive',
    category: 'SHIP',
    codeNumber: 'S-05',
    name: 'NEON OVERDRIVE',
    typeTag: 'Dragster Ramjet // Hiperaceleración Vectorial',
    gitOrigin: 'Reescritura Lineal de Ramas (`git rebase --onto`)',
    threatRating: 85,
    behavior: 'Fuselaje de aguja hiper-estrecho, tomas de aire laterales anchas, dos aletas estabilizadoras a 45° y una colosal turbina central.',
    attack: 'GIT REBASE: Embestida de hiperdash cinético penetrante que destruye cualquier invasor en su vector de avance.',
    weakness: 'Capacidad de escudos reducida al mínimo para priorizar la entrega bruta de energía a la tobera de postcombustión.',
    lore: 'El vehículo más veloz jamás ensamblado en el Hangar. Su turbina central ruge con la energía de miles de commits reescritos.',
    encounteredCount: 68,
    destroyedCount: 65,
  },
  {
    id: 'ship_quantum_wing',
    category: 'SHIP',
    codeNumber: 'S-06',
    name: 'QUANTUM WING',
    typeTag: 'Trimarán Cuántico // Vuelo Desconectado',
    gitOrigin: 'Punteros Gravitacionales Cuánticos (`git cherry-pick`)',
    threatRating: 89,
    behavior: 'Tres cuerpos físicamente desarticulados: cápsula de mando central levitante y dos estabilizadores alares flotando por suspensión magnética.',
    attack: 'QUANTUM PIERCE: Rayos continuos de plasma cuántico perforante que atraviesan formaciones enteras de invasores.',
    weakness: 'Vulnerable a descargas electromagnéticas que interrumpan temporalmente el vínculo de levitación de las alas.',
    lore: 'Una maravilla de la física de partículas. Al no tener uniones mecánicas rígidas, absorbe torsiones extremas sin sufrir fatiga estructural.',
    encounteredCount: 76,
    destroyedCount: 72,
  },
  {
    id: 'ship_quantum_citadel',
    category: 'SHIP',
    codeNumber: 'S-07',
    name: 'QUANTUM CITADEL',
    typeTag: 'Plato Toroidal 360° // Defensa Autónoma',
    gitOrigin: 'Red de Seguridad y Políticas Organizacionales (`.github/workflows`)',
    threatRating: 92,
    behavior: 'Anillo toroidal cerrado de doble perímetro con conectores radiales, domo de mando central y 4 vainas de estabilización orbital en rotación.',
    attack: 'OCTO PROTOCOL: Genera un enjambre de 8 micro-drones de intercepción perimetral activa.',
    weakness: 'Perfil de silueta amplio y mayor área transversal expuesta al fuego balístico concentrado.',
    lore: 'Estación de combate autónoma miniaturizada. Funciona como una fortaleza móvil capaz de asegurar el espacio aéreo frente a incursiones masivas.',
    encounteredCount: 62,
    destroyedCount: 59,
  },
  {
    id: 'ship_codebreaker_x',
    category: 'SHIP',
    codeNumber: 'S-08',
    name: 'CODEBREAKER // X',
    typeTag: 'Dreadnought en Aspas X // Cañón Destructor',
    gitOrigin: 'Escritura Forzada en Rama Principal (`git push --force`)',
    threatRating: 96,
    behavior: 'Estructura masiva en aspas de cruz "X", 4 alas divergentes con cañones pesados, puente de mando dorsal escalonado y 4 reactores independientes.',
    attack: 'GIT PUSH --FORCE: Desata un megarrayo aniquilador de pantalla completa que pulveriza cualquier estructura invasora.',
    weakness: 'Elevado tiempo de recarga tras la descarga del superláser y aceleración lateral pesada.',
    lore: 'El arma definitiva del arsenal espacial de GitHub. Cuando un repositorio se encuentra en caos irreversible, el Dreadnought impone orden por fuerza bruta.',
    encounteredCount: 55,
    destroyedCount: 53,
  },
  {
    id: 'ship_hyper_void',
    category: 'SHIP',
    codeNumber: 'S-09',
    name: 'VOID STALKER',
    typeTag: 'Aguja Furtiva // Asesino Temporal',
    gitOrigin: 'Depuración Forense de Fugas de Memoria (`git bisect`)',
    threatRating: 93,
    behavior: 'Aguja furtiva de titanio obsidiana mate con bordes de ataque en ángulo diedro negativo, óptica carmesí y propulsores iónicos vectoriales.',
    attack: 'TEMPORAL RIFT: Fisura en el espacio-tiempo que ralentiza un 80% todos los proyectiles hostiles y teletransporta la nave.',
    weakness: 'Requiere precisión milimétrica del piloto durante la salida de la anomalía temporal.',
    lore: 'Nave de caza furtiva diseñada para operaciones de eliminación quirúrgica. Sus sensores rastrean errores en el tiempo antes de que se manifiesten.',
    encounteredCount: 42,
    destroyedCount: 40,
  },
  {
    id: 'ship_solar_flare',
    category: 'SHIP',
    codeNumber: 'S-10',
    name: 'SOLAR PHOENIX',
    typeTag: 'Fénix Termonuclear // Onda Omnidireccional',
    gitOrigin: 'Reconstrucción Total de Pipeline (`git reset --hard HEAD~1`)',
    threatRating: 95,
    behavior: 'Fuselaje en plumaje aerodinámico triple, reactores de combustión solar en tándem y placas de blindaje compuesto refractario dorado y cian.',
    attack: 'SUPERNOVA NOVA: Descarga una explosión termonuclear omnidireccional de 360° que calcina proyectiles e invasores en toda el área.',
    weakness: 'Generación masiva de calor residual tras el pulso térmico supernova.',
    lore: 'Inspirada en el ciclo de regeneración estelar. Capaz de renacer de sus cenizas energéticas para incinerar oleadas enemigas en segundos.',
    encounteredCount: 48,
    destroyedCount: 46,
  },
  {
    id: 'boss_commit_core',
    category: 'BOSS',
    codeNumber: 'B-01',
    name: 'THE COMMIT CORE',
    typeTag: 'Arquetipo 01 // Titán de CI/CD',
    gitOrigin: 'Repositorios con alta velocidad de commits (>800)',
    threatRating: 80,
    behavior: 'Núcleo rotatorio mecánico con engranajes cinéticos y despliegue masivo de drones de historial.',
    attack: 'Lluvia torrencial de mini-commits, anillos de choque orbitales y rayo térmico central.',
    weakness: 'Concentrar fuego en el núcleo central cuando se abren los engranajes para disparar.',
    lore: 'Cada commit fortalece su estructura. Si no se depura a tiempo, el historial devora el sistema.',
    encounteredCount: 14,
    destroyedCount: 12,
  },
  {
    id: 'boss_the_fortress',
    category: 'BOSS',
    codeNumber: 'B-02',
    name: 'THE FORTRESS',
    typeTag: 'Arquetipo 02 // Bastión de Pull Requests',
    gitOrigin: 'Repositorios de alta colaboración y revisiones masivas',
    threatRating: 85,
    behavior: 'Acorazado colosal con 4 placas deflectoras orbitales giratorias y torretas de PRs independientes.',
    attack: 'Láseres entrelazados, barrera horizontal de merge y salvas de contención pesada.',
    weakness: 'Destruir las placas orbitales secuencialmente para exponer el núcleo de fusión.',
    lore: 'No todo PR es una victoria. Algunos se defienden hasta el final.',
    encounteredCount: 9,
    destroyedCount: 7,
  },
  {
    id: 'boss_issue_swarm',
    category: 'BOSS',
    codeNumber: 'B-03',
    name: 'THE ISSUE SWARM',
    typeTag: 'Arquetipo 03 // Enjambre Biomecánico',
    gitOrigin: 'Repositorios con alta densidad de issues y bugs reportados',
    threatRating: 90,
    behavior: 'Entidad viviente biomecánica con tentáculos articulados y ojos compuestos reactivos.',
    attack: 'Bombardeo masivo de bombas biológicas, dispersión caótica y ráfagas en picada múltiple.',
    weakness: 'Armas de área y disparos de penetración cuántica que atraviesan los tentáculos protectores.',
    lore: 'Un issue no es un problema... hasta que se multiplica exponencialmente.',
    encounteredCount: 8,
    destroyedCount: 6,
  },
  {
    id: 'boss_dependency_hydra',
    category: 'BOSS',
    codeNumber: 'B-04',
    name: 'THE DEPENDENCY HYDRA',
    typeTag: 'Arquetipo 04 // Dragón Modular Multicéfalo',
    gitOrigin: 'Árboles de dependencias multi-módulo (`node_modules`, `Cargo.lock`)',
    threatRating: 92,
    behavior: 'Dragón cibernético de 5 cabezas interconectadas por cadenas de flujo de energía cuántica.',
    attack: 'Fuego cruzado de plasma esmeralda, fragmentación explosiva de nodos y ráfagas de asedio.',
    weakness: 'Destruir las cabezas laterales para quebrar la cadena de reducción de daño del núcleo central.',
    lore: 'Una dependencia lleva a otra, y a otra, y a otra... hasta crear una hidra incontrolable.',
    encounteredCount: 11,
    destroyedCount: 9,
  },
  {
    id: 'boss_merge_conflict',
    category: 'BOSS',
    codeNumber: 'B-05',
    name: 'THE MERGE CONFLICT',
    typeTag: 'Arquetipo 05 // Entidad Bifurcada <<<<<<< HEAD',
    gitOrigin: 'Ramas en conflicto divergente no resuelto',
    threatRating: 88,
    behavior: 'Chasis dividido en dos realidades paralelas (Cyan HEAD / Rojo Branch) que se separan y convergen.',
    attack: 'Láser en X cruzado, shockwave de reconvergencia y bombardeo de diffs conflictivos.',
    weakness: 'Golpear el nodo central de resolución cuando las dos mitades intentan fusionarse.',
    lore: 'Dos caminos. Un solo destino. El conflicto es inevitable.',
    encounteredCount: 6,
    destroyedCount: 5,
  },
  {
    id: 'boss_contributor_overlord',
    category: 'BOSS',
    codeNumber: 'B-06',
    name: 'THE CONTRIBUTOR OVERLORD',
    typeTag: 'Arquetipo 06 // Portaaviones Imperial',
    gitOrigin: 'Red global de contribuidores concurrentes',
    threatRating: 90,
    behavior: 'Portaaviones cósmico con puente Octocat. Despliega enjambres de micro-drones y brazos mecánicos articulados.',
    attack: 'Salvas orbitales de plasma índigo y lanzamiento masivo de cazas.',
    weakness: 'Concentrar fuego en el puente de mando central entre oleadas de drones.',
    lore: 'La fuerza colectiva de miles de desarrolladores concentrada en una sola mente de colmena.',
    encounteredCount: 4,
    destroyedCount: 3,
  },
  {
    id: 'boss_branchlord',
    category: 'BOSS',
    codeNumber: 'B-07',
    name: 'THE BRANCHLORD',
    typeTag: 'Arquetipo 07 // Seraph Fractal Dorado',
    gitOrigin: 'Árboles de git complejos con múltiples niveles de bifurcación',
    threatRating: 86,
    behavior: 'Alas fractales doradas de tres capas con nodos de linaje que generan campos de energía resonante.',
    attack: 'Haces de luz coherente fractal y ráfagas de nodos en cascada.',
    weakness: 'Destruir los emisores en las puntas de las alas para desestabilizar su armadura.',
    lore: 'Custodio del árbol genealógico del código. Cada rama es un universo alternativo.',
    encounteredCount: 5,
    destroyedCount: 4,
  },
  {
    id: 'boss_rebase_phantom',
    category: 'BOSS',
    codeNumber: 'B-08',
    name: 'THE REBASE PHANTOM',
    typeTag: 'Arquetipo 08 // Daga Furtiva de Reescritura',
    gitOrigin: 'Reescritura de historial destructiva (`git rebase -i`)',
    threatRating: 92,
    behavior: 'Nave de ataque furtiva con 3 ecos cromáticos que borra su posición física en el espacio-tiempo.',
    attack: 'Disparos de francotirador hipersónicos precedidos por retículas láser rojas.',
    weakness: 'Disparar a la silueta real identificable por su firma de calor central.',
    lore: 'Reescribe el pasado para que nunca hayas existido.',
    encounteredCount: 3,
    destroyedCount: 2,
  },
  {
    id: 'boss_security_sentinel',
    category: 'BOSS',
    codeNumber: 'B-09',
    name: 'THE SECURITY SENTINEL',
    typeTag: 'Arquetipo 09 // Bastión Criptográfico Zero-Trust',
    gitOrigin: 'Políticas de seguridad corporativa y auditorías de vulnerabilidad',
    threatRating: 89,
    behavior: 'Aegis cibernético con chevrones de advertencia y candado con diales giratorios. Despliega cortafuegos orbitales.',
    attack: 'Campos de fuerza repulsores, pulsos EMP y barreras láser impenetrables.',
    weakness: 'Atacar durante la rotación de los diales criptográficos.',
    lore: 'Ningún paquete pasa sin verificación criptográfica de clave pública.',
    encounteredCount: 4,
    destroyedCount: 3,
  },
  {
    id: 'boss_code_abyss',
    category: 'BOSS',
    codeNumber: 'B-10',
    name: 'THE CODE ABYSS',
    typeTag: 'Arquetipo 10 // Singularidad Gravitacional NullPointer',
    gitOrigin: 'Errores fatales irrecuperables (Kernel Panic, SIGSEGV, Out of Memory)',
    threatRating: 98,
    behavior: 'Agujero negro cuántico con disco de acreción doble que distorsiona la gravedad y absorbe proyectiles.',
    attack: 'Chorros de plasma relativistas polares y fragmentos de código sintáctico desintegradores.',
    weakness: 'Impactar el horizonte de sucesos en el instante de máxima emisión de radiación Hawking.',
    lore: 'Donde van a morir todos los punteros nulos y las referencias circulares.',
    encounteredCount: 2,
    destroyedCount: 1,
  },
];

export class CodexModal {
  private overlay: HTMLElement;
  private activeEntryId: string = 'ship_cyber_falcon';
  private activeCategoryFilter: 'ALL' | 'SHIP' | 'ENEMY' | 'BOSS' = 'ALL';
  private animFrameId: number | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animTime: number = 0;

  constructor(overlay: HTMLElement) {
    this.overlay = overlay;
  }

  public show(initialEntryId?: string): void {
    if (initialEntryId) {
      this.activeEntryId = initialEntryId;
      const target = CODEX_DATABASE.find(e => e.id === initialEntryId);
      if (target) {
        if (target.category === 'SHIP') this.activeCategoryFilter = 'SHIP';
        else if (target.category === 'BOSS') this.activeCategoryFilter = 'BOSS';
        else this.activeCategoryFilter = 'ENEMY';
      }
    }
    this.overlay.style.display = 'flex';
    this.render();
    this.initCanvas();
    this.startAnimation();
  }

  public hide(): void {
    this.stopAnimation();
    this.overlay.style.display = 'none';
  }

  private getActiveEntry(): CodexEntry {
    return CODEX_DATABASE.find(e => e.id === this.activeEntryId) || CODEX_DATABASE[0];
  }

  private render(): void {
    const active = this.getActiveEntry();

    const shipListHtml = CODEX_DATABASE.filter(e => e.category === 'SHIP').map(entry => {
      const isSelected = entry.id === this.activeEntryId;
      return `
        <div class="codex-item-card ship-entry ${isSelected ? 'selected' : ''}" data-codex-id="${Security.escapeHtml(entry.id)}">
          <div class="codex-item-code cyan">${Security.escapeHtml(entry.codeNumber)}</div>
          <div class="codex-item-text">
            <div class="codex-item-name">${Security.escapeHtml(entry.name)}</div>
            <div class="codex-item-sub">${Security.escapeHtml(entry.typeTag.split('//')[0]?.trim() || entry.typeTag)}</div>
          </div>
          ${isSelected ? '<span class="codex-chevron cyan">&gt;</span>' : ''}
        </div>
      `;
    }).join('');

    const standardListHtml = CODEX_DATABASE.filter(e => e.category === 'STANDARD' || e.category === 'ELITE').map(entry => {
      const isSelected = entry.id === this.activeEntryId;
      return `
        <div class="codex-item-card ${isSelected ? 'selected' : ''}" data-codex-id="${Security.escapeHtml(entry.id)}">
          <div class="codex-item-code green">${Security.escapeHtml(entry.codeNumber)}</div>
          <div class="codex-item-text">
            <div class="codex-item-name">${Security.escapeHtml(entry.name)}</div>
            <div class="codex-item-sub">${Security.escapeHtml(entry.typeTag.split('//')[0]?.trim() || entry.typeTag)}</div>
          </div>
          ${isSelected ? '<span class="codex-chevron">&gt;</span>' : ''}
        </div>
      `;
    }).join('');

    const bossListHtml = CODEX_DATABASE.filter(e => e.category === 'BOSS').map(entry => {
      const isSelected = entry.id === this.activeEntryId;
      return `
        <div class="codex-item-card boss-entry ${isSelected ? 'selected' : ''}" data-codex-id="${Security.escapeHtml(entry.id)}">
          <div class="codex-item-code magenta">${Security.escapeHtml(entry.codeNumber)}</div>
          <div class="codex-item-text">
            <div class="codex-item-name">${Security.escapeHtml(entry.name)}</div>
            <div class="codex-item-sub">${Security.escapeHtml(entry.typeTag.split('//')[0]?.trim() || entry.typeTag)}</div>
          </div>
          ${isSelected ? '<span class="codex-chevron magenta">&gt;</span>' : ''}
        </div>
      `;
    }).join('');

    const showShips = this.activeCategoryFilter === 'ALL' || this.activeCategoryFilter === 'SHIP';
    const showEnemies = this.activeCategoryFilter === 'ALL' || this.activeCategoryFilter === 'ENEMY';
    const showBosses = this.activeCategoryFilter === 'ALL' || this.activeCategoryFilter === 'BOSS';

    const isShip = active.category === 'SHIP';
    const isBoss = active.category === 'BOSS';

    this.overlay.innerHTML = `
      <div class="modal-card codex-master-modal">
        <!-- MODAL TOP BAR -->
        <div class="codex-top-header">
          <div class="codex-header-title-group">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00e5ff" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <div class="codex-header-titles">
              <span class="codex-title-main">CODEX // ARCHIVO DE INTELIGENCIA DE COMBATE</span>
              <span class="codex-title-sub">BASE DE DATOS FORENSE DE AMENAZAS GIT & FLOTA DE COMBATE</span>
            </div>
          </div>
          <button class="modal-close-btn" id="btnCloseCodex">&times;</button>
        </div>

        <!-- CATEGORY FILTER ROW -->
        <div class="codex-filter-bar">
          <button class="codex-filter-pill ${this.activeCategoryFilter === 'ALL' ? 'active' : ''}" data-cat="ALL">
            TODAS (${CODEX_DATABASE.length})
          </button>
          <button class="codex-filter-pill cyan ${this.activeCategoryFilter === 'SHIP' ? 'active' : ''}" data-cat="SHIP">
            FLOTA ALIADA (10)
          </button>
          <button class="codex-filter-pill green ${this.activeCategoryFilter === 'ENEMY' ? 'active' : ''}" data-cat="ENEMY">
            ENEMIGOS (6)
          </button>
          <button class="codex-filter-pill magenta ${this.activeCategoryFilter === 'BOSS' ? 'active' : ''}" data-cat="BOSS">
            CODE BOSSES (10)
          </button>
        </div>

        <!-- TWO-COLUMN WORKSPACE -->
        <div class="codex-workspace-grid">
          <!-- LEFT COLUMN: ENTITY ROSTER -->
          <aside class="codex-roster-col">
            ${showShips ? `
              <div class="roster-section-title">
                <span>FLOTA ALIADA (NAVAS DE JUGADOR)</span>
                <span class="roster-count cyan">10</span>
              </div>
              <div class="roster-items-list" style="margin-bottom: 10px;">
                ${shipListHtml}
              </div>
            ` : ''}

            ${showEnemies ? `
              <div class="roster-section-title">
                <span>UNIDADES Y CRUCEROS ENEMIGOS</span>
                <span class="roster-count green">6</span>
              </div>
              <div class="roster-items-list" style="margin-bottom: 10px;">
                ${standardListHtml}
              </div>
            ` : ''}

            ${showBosses ? `
              <div class="roster-section-title">
                <span>CODE BOSSES PROCEDURALES</span>
                <span class="roster-count magenta">10</span>
              </div>
              <div class="roster-items-list">
                ${bossListHtml}
              </div>
            ` : ''}
          </aside>

          <!-- RIGHT COLUMN: HOLOGRAPHIC DOSSIER -->
          <section class="codex-dossier-col">
            <!-- Top Viewport & Identity Line -->
            <div class="dossier-identity-row">
              <div class="dossier-title-col">
                <div class="dossier-badge-row">
                  <span class="dossier-code-chip ${isShip ? 'cyan' : isBoss ? 'magenta' : 'green'}">${Security.escapeHtml(active.codeNumber)}</span>
                  <span class="dossier-threat-chip ${isShip ? 'cyan' : ''}">
                    ${isShip ? 'POTENCIAL DE COMBATE' : 'AMENAZA'}: ${active.threatRating}/100
                  </span>
                  <span class="dossier-category-badge ${isShip ? 'cyan' : isBoss ? 'magenta' : 'green'}">
                    ${isShip ? 'NAVE DE FLOTA' : isBoss ? 'CODE BOSS' : 'UNIDAD HOSTIL'}
                  </span>
                </div>
                <h2 class="dossier-name">${Security.escapeHtml(active.name)}</h2>
                <div class="dossier-type-tag">${Security.escapeHtml(active.typeTag)}</div>
              </div>

              <!-- Live Canvas Viewport -->
              <div class="dossier-viewport-box">
                <canvas id="codexEntityCanvas" width="280" height="150" class="codex-canvas-elem"></canvas>
                <div class="viewport-scanlines-overlay"></div>
                <div class="viewport-hud-tag">[ 60 FPS LIVE PROJECTION ]</div>
              </div>
            </div>

            <!-- Dossier Technical Spec Grid -->
            <div class="dossier-specs-grid">
              <div class="dossier-field-box">
                <div class="d-field-label">ORIGEN EN REPOSITORIO GIT</div>
                <div class="d-field-val highlight-cyan">${Security.escapeHtml(active.gitOrigin)}</div>
              </div>

              <div class="dossier-field-box">
                <div class="d-field-label">${isShip ? 'AERODINÁMICA / ESTRUCTURA' : 'PATRÓN DE COMPORTAMIENTO'}</div>
                <div class="d-field-val">${Security.escapeHtml(active.behavior)}</div>
              </div>

              <div class="dossier-field-box">
                <div class="d-field-label">${isShip ? 'SISTEMA DE ARMAS / HABILIDAD' : 'SISTEMA BALÍSTICO / ATAQUE'}</div>
                <div class="d-field-val">${Security.escapeHtml(active.attack)}</div>
              </div>

              <div class="dossier-field-box">
                <div class="d-field-label">${isShip ? 'LIMITACIÓN TÁCTICA' : 'VULNERABILIDAD TÁCTICA'}</div>
                <div class="d-field-val highlight-yellow">${Security.escapeHtml(active.weakness)}</div>
              </div>
            </div>

            <!-- Lore Quote Block -->
            <div class="dossier-lore-quote">
              <span class="quote-mark">“</span>
              <span class="quote-body">${Security.escapeHtml(active.lore)}</span>
              <span class="quote-mark">”</span>
            </div>

            <!-- Telemetry Combat Counter -->
            <div class="dossier-telemetry-strip">
              <div class="telemetry-stat">
                <span class="t-lbl">${isShip ? 'MISIONES DESPLEGADAS:' : 'CONTACTOS REGISTRADOS:'}</span>
                <span class="t-val">${active.encounteredCount}</span>
              </div>
              <div class="telemetry-stat">
                <span class="t-lbl">${isShip ? 'VICTORIAS REGISTRADAS:' : 'UNIDADES DEPURADAS:'}</span>
                <span class="t-val val-green">${active.destroyedCount}</span>
              </div>
              <div class="telemetry-stat">
                <span class="t-lbl">RATIO DE EFICACIA:</span>
                <span class="t-val val-cyan">${Math.round((active.destroyedCount / (active.encounteredCount || 1)) * 100)}%</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const closeBtn = this.overlay.querySelector('#btnCloseCodex');
    closeBtn?.addEventListener('click', () => {
      this.hide();
    });

    const filterBtns = this.overlay.querySelectorAll('.codex-filter-pill');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat') as 'ALL' | 'SHIP' | 'ENEMY' | 'BOSS';
        if (cat && cat !== this.activeCategoryFilter) {
          SFX.playPowerup();
          this.activeCategoryFilter = cat;
          const currentActive = this.getActiveEntry();
          let shouldSwitch = false;
          if (cat === 'SHIP' && currentActive.category !== 'SHIP') shouldSwitch = true;
          if (cat === 'ENEMY' && (currentActive.category === 'BOSS' || currentActive.category === 'SHIP')) shouldSwitch = true;
          if (cat === 'BOSS' && currentActive.category !== 'BOSS') shouldSwitch = true;

          if (shouldSwitch) {
            const first = CODEX_DATABASE.find(e => {
              if (cat === 'SHIP') return e.category === 'SHIP';
              if (cat === 'ENEMY') return e.category === 'STANDARD' || e.category === 'ELITE';
              if (cat === 'BOSS') return e.category === 'BOSS';
              return true;
            });
            if (first) this.activeEntryId = first.id;
          }

          this.render();
          this.initCanvas();
        }
      });
    });

    const cards = this.overlay.querySelectorAll('.codex-item-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-codex-id');
        if (id && id !== this.activeEntryId) {
          SFX.playLaser('player');
          this.activeEntryId = id;
          this.render();
          this.initCanvas();
        }
      });
    });
  }

  private initCanvas(): void {
    this.canvas = this.overlay.querySelector('#codexEntityCanvas') as HTMLCanvasElement | null;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
  }

  private startAnimation(): void {
    const loop = () => {
      this.animTime += 0.03;
      this.drawEntity();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  private stopAnimation(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private drawEntity(): void {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = this.animTime;

    ctx.clearRect(0, 0, w, h);

    // Background Hologram Grid & Radial Glow
    const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
    grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2;
    const hover = Math.sin(t * 3) * 4;

    // Render Player Ships if activeEntryId is a ship
    if (this.activeEntryId.startsWith('ship_')) {
      const skinId = this.activeEntryId.replace('ship_', '');
      const skin = Store.getInstance().SKINS.find(s => s.id === skinId) || Store.getInstance().SKINS[0];
      Sprites.drawPlayer(
        ctx,
        cx - 40,
        cy - 30 + hover,
        80,
        60,
        false,
        false,
        skin.hullColor,
        skin.glowColor,
        t,
        1.0,
        true,
        skin.id,
        0,
        false,
        0
      );
      return;
    }

    switch (this.activeEntryId) {
      case 'commit_invader':
        Sprites.drawCommitInvader(ctx, cx - 24, cy - 18 + hover, 48, 36, Math.floor(t * 3) % 2, '#10b981', '7f3a2c');
        break;

      case 'armored_pr':
        Sprites.drawArmoredPR(ctx, cx - 32, cy - 24 + hover, 64, 48, 3, 3, 42, 'REVIEW');
        break;

      case 'issue_bomber':
        Sprites.drawIssueBomber(ctx, cx - 25, cy - 22 + hover, 50, 44, t, true);
        break;

      case 'branch_drone':
        Sprites.drawBranchDrone(ctx, cx - 28, cy - 20 + hover, 56, 40, t, false, 'feat/split');
        break;

      case 'security_sentinel':
        Sprites.drawSecuritySentinel(ctx, cx - 34, cy - 24 + hover, 68, 48, t, Math.sin(t * 2) > 0, 1.0);
        break;

      case 'mystery_octocat':
        Sprites.drawMysteryOctocat(ctx, cx - 30, cy - 20 + hover, 60, 40, t);
        break;

      case 'boss_commit_core':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#00e5ff', 'commit_core');
        break;

      case 'boss_the_fortress':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#38bdf8', 'the_fortress');
        break;

      case 'boss_issue_swarm':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#ef4444', 'issue_swarm');
        break;

      case 'boss_dependency_hydra':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#10b981', 'dependency_hydra');
        break;

      case 'boss_merge_conflict':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#f59e0b', 'merge_conflict');
        break;

      case 'boss_contributor_overlord':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#6366f1', 'contributor_overlord');
        break;

      case 'boss_branchlord':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#eab308', 'branchlord');
        break;

      case 'boss_rebase_phantom':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#f43f5e', 'rebase_phantom');
        break;

      case 'boss_security_sentinel':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#0284c7', 'security_sentinel');
        break;

      case 'boss_code_abyss':
        Sprites.drawBoss(ctx, cx - 40, cy - 35 + hover, 80, 70, 2, t, '#a855f7', 'code_abyss');
        break;

      default:
        Sprites.drawCommitInvader(ctx, cx - 24, cy - 18 + hover, 48, 36, 0, '#00e5ff', '0x7F');
        break;
    }
  }
}
