/* eslint-disable react-refresh/only-export-components */

import {
  ViewTransition,
  addTransitionType,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import heroImg from './assets/hero.png'
import './App.css'

export type RoutePath =
  | '/simple'
  | '/medium'
  | '/complex'
  | '/edge'
  | '/perf-tracks'
  | '/compiler-ide'
  | '/auto-effects'
  | '/fragment-refs'
  | '/concurrent-stores'

export const routeOrder: RoutePath[] = [
  '/simple',
  '/medium',
  '/complex',
  '/edge',
  '/perf-tracks',
  '/compiler-ide',
  '/auto-effects',
  '/fragment-refs',
  '/concurrent-stores',
]

export const routeMeta: Record<RoutePath, { label: string; subtitle: string }> = {
  '/simple': {
    label: 'Simple',
    subtitle: 'Cinematic shared-element playground',
  },
  '/medium': {
    label: 'Medium',
    subtitle: 'Kanban reflow with share + update control',
  },
  '/complex': {
    label: 'Complex',
    subtitle: 'Multi-region mission control with async stages',
  },
  '/edge': {
    label: 'Edge',
    subtitle: 'Queue triage with shared detail and urgency pivots',
  },
  '/perf-tracks': {
    label: 'Perf Tracks',
    subtitle: 'Render timeline and interaction trace simulator',
  },
  '/compiler-ide': {
    label: 'Compiler IDE',
    subtitle: 'Mock lint/fix panel for compiler diagnostics',
  },
  '/auto-effects': {
    label: 'Auto Effects',
    subtitle: 'Automatic effect dependency preview board',
  },
  '/fragment-refs': {
    label: 'Fragment Refs',
    subtitle: 'Fragment-level measuring and focus orchestration',
  },
  '/concurrent-stores': {
    label: 'Concurrent Stores',
    subtitle: 'Dual producer snapshot merge visualizer',
  },
}

function normalizePath(pathname: string): RoutePath {
  // fungsi ini memastikan URL selalu salah satu route yang valid
  // kalau URL aneh/tidak dikenal, kita paksa balik ke '/simple'
  if (
    pathname === '/simple' ||
    pathname === '/medium' ||
    pathname === '/complex' ||
    pathname === '/edge' ||
    pathname === '/perf-tracks' ||
    pathname === '/compiler-ide' ||
    pathname === '/auto-effects' ||
    pathname === '/fragment-refs' ||
    pathname === '/concurrent-stores'
  ) {
    return pathname
  }

  return '/simple'
}

export function withTransitionType(type: string, update: () => void) {
  // helper kecil untuk menandai "tipe" transisi aktif
  // tipe ini nanti dipakai selector CSS :active-view-transition-type(...)
  startTransition(() => {
    addTransitionType(type)
    update()
  })
}

function App() {
  const [path, setPath] = useState<RoutePath>(() => normalizePath(window.location.pathname))

  useEffect(() => {
    // sinkronkan state route ke URL browser (replace agar tidak nambah history)
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', path)
    }
  }, [path])

  useEffect(() => {
    // saat user klik tombol back/forward browser, state React ikut berubah
    const onPopState = () => {
      setPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const currentIndex = routeOrder.indexOf(path)

  const handleNavigate = (nextPath: RoutePath) => {
    if (nextPath === path) {
      return
    }

    const nextIndex = routeOrder.indexOf(nextPath)

    // tentukan arah animasi: maju atau mundur
    const type = nextIndex > currentIndex ? 'route-forward' : 'route-backward'

    withTransitionType(type, () => {
      window.history.pushState({}, '', nextPath)
      setPath(nextPath)
    })
  }

  const activeRoute = (() => {
    if (path === '/simple') return <SimpleRoute />
    if (path === '/medium') return <MediumRoute />
    if (path === '/complex') return <ComplexRoute />
    if (path === '/edge') return <EdgeRoute />
    if (path === '/perf-tracks') return <PerformanceTracksRoute />
    if (path === '/compiler-ide') return <CompilerIdeRoute />
    if (path === '/auto-effects') return <AutoEffectDepsRoute />
    if (path === '/fragment-refs') return <FragmentRefsRoute />
    return <ConcurrentStoresRoute />
  })()

  return (
    <div className="app-shell">
      {/*
        ViewTransition topbar:
        - name: identitas elemen untuk dicocokkan antar render
        - default: class transisi default yang di-hook ke CSS
      */}
      <ViewTransition name="topbar" default="vt-topbar">
        <header className="topbar">
          <div>
            <p className="eyebrow">React Canary ViewTransition</p>

            {/*
              Judul route dipisah agar judul bisa punya transisi sendiri,
              tidak ikut penuh dengan seluruh topbar.
            */}
            <ViewTransition name="route-title" default="vt-route-title">
              <h1>{routeMeta[path].label} Route</h1>
            </ViewTransition>
            <p className="subtitle">{routeMeta[path].subtitle}</p>
          </div>

          <nav className="route-nav" aria-label="Transition demos">
            {routeOrder.map((routePath) => (
              <button
                key={routePath}
                type="button"
                className="route-pill"
                data-active={routePath === path}
                onClick={() => handleNavigate(routePath)}
              >
                {routeMeta[routePath].label}
              </button>
            ))}
          </nav>
        </header>
      </ViewTransition>

      {/*
        ViewTransition route-canvas membungkus area konten utama route.
        key={path} memaksa React membuat node baru per route,
        sehingga enter/exit route lebih jelas.
      */}
      <ViewTransition name="route-canvas" default="vt-route-canvas">
        <main key={path} className="route-canvas">
          {activeRoute}
        </main>
      </ViewTransition>
    </div>
  )
}

type Scene = {
  id: string
  title: string
  hue: string
  blurb: string
}

const scenes: Scene[] = [
  {
    id: 'aurora',
    title: 'Aurora Pulse',
    hue: 'linear-gradient(130deg, #082f49, #0f766e, #34d399)',
    blurb: 'Best for hero transitions and storytelling card reveals.',
  },
  {
    id: 'ember',
    title: 'Ember Drift',
    hue: 'linear-gradient(130deg, #3f1d2e, #be123c, #fb923c)',
    blurb: 'Good when UI focus should feel warm, high-energy, and immediate.',
  },
  {
    id: 'atlas',
    title: 'Atlas Glow',
    hue: 'linear-gradient(130deg, #0f172a, #4338ca, #38bdf8)',
    blurb: 'Great for dashboard navigation and layered information shifts.',
  },
]

export function SimpleRoute() {
  // state untuk menyimpan scene yang sedang dipilih user
  const [active, setActive] = useState<Scene>(scenes[0])

  // state untuk kondisi kartu sedang melebar atau tidak
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="panel">
      <div className="copy-block">
        <p className="route-tag">Limit Push 1</p>
        <h2>Cinematic, one-piece shared element choreography</h2>
        <p>
          One stable name, multiple transition classes, and typed transitions for scene swap vs
          content expansion.
        </p>
      </div>

      <div className="simple-layout">
        <div className="scene-list">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              type="button"
              className="scene-chip"
              data-active={scene.id === active.id}
              // saat chip diklik, kita ganti scene aktif dengan tipe transisi "scene-swap"
              onClick={() => withTransitionType('scene-swap', () => setActive(scene))}
            >
              {scene.title}
            </button>
          ))}
        </div>

        <article className="scene-card" data-expanded={expanded}>
          {/*
            Hero visual pada route simple:
            - name: pasangan elemen stabil antar update
            - default: class dasar untuk animasi normal
            - enter/exit: class khusus saat elemen masuk/keluar
            - update: map class per tipe transisi
          */}
          <ViewTransition
            name="simple-hero"
            default="vt-scene-hero"
            enter="vt-scene-enter"
            exit="vt-scene-exit"
            update={{ default: 'vt-scene-update', 'scene-expand': 'vt-scene-expand' }}
          >
            <div className="scene-visual" style={{ background: active.hue }}>
              <img src={heroImg} alt="Decorative orb" />
            </div>
          </ViewTransition>

          <div className="scene-copy">
            {/*
              share="vt-scene-share" artinya judul ini boleh jadi shared element
              saat pasangan name yang sama muncul di render berikutnya.
            */}
            <ViewTransition name="simple-title" default="vt-scene-title" share="vt-scene-share">
              <h3>{active.title}</h3>
            </ViewTransition>
            <p>{active.blurb}</p>
            <button
              type="button"
              className="action"
              // tombol ini untuk buka/tutup detail dengan tipe transisi "scene-expand"
              onClick={() => withTransitionType('scene-expand', () => setExpanded((x) => !x))}
            >
              {expanded ? 'Collapse detail' : 'Expand detail'}
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}

type ColumnId = 'backlog' | 'active' | 'done'

type TaskItem = {
  id: string
  title: string
  energy: number
  column: ColumnId
}

const boardColumns: Array<{ id: ColumnId; label: string }> = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Done' },
]

const seedTasks: TaskItem[] = [
  { id: 't1', title: 'Prototype pairing map', energy: 70, column: 'backlog' },
  { id: 't2', title: 'Handle nested updates', energy: 86, column: 'active' },
  { id: 't3', title: 'Tune image budget gate', energy: 92, column: 'active' },
  { id: 't4', title: 'Audit reordering edge', energy: 78, column: 'done' },
]

function nextColumn(column: ColumnId): ColumnId {
  if (column === 'backlog') return 'active'
  if (column === 'active') return 'done'
  return 'backlog'
}

export function MediumRoute() {
  // daftar task untuk papan kanban
  const [tasks, setTasks] = useState<TaskItem[]>(seedTasks)

  // mode compact untuk mengubah kepadatan layout
  const [compact, setCompact] = useState(false)

  // teks log sederhana agar kita bisa lihat event transisi terakhir
  const [eventLog, setEventLog] = useState('No transition event yet.')

  return (
    <section className="panel">
      <div className="copy-block">
        <p className="route-tag">Limit Push 2</p>
        <h2>Kanban reflow with stable names and controlled updates</h2>
        <p>
          This pattern is a practical best case: cards move across columns via share transitions,
          while layout density toggles update behavior.
        </p>
      </div>

      <div className="toolbar">
        <button
          type="button"
          className="action"
          // toggle layout compact dengan transisi bertipe "kanban-density"
          onClick={() => withTransitionType('kanban-density', () => setCompact((x) => !x))}
        >
          {compact ? 'Comfortable layout' : 'Compact layout'}
        </button>
        <p className="event-log">{eventLog}</p>
      </div>

      <div className="board" data-compact={compact}>
        {boardColumns.map((column) => (
          <ViewTransition key={column.id} name={`col-${column.id}`} default="vt-column">
            {/*
              Satu kolom dibungkus ViewTransition agar layout kolom juga ikut halus
              saat compact mode berubah.
            */}
            <section className="column">
              <h3>{column.label}</h3>
              <ul>
                {tasks
                  .filter((task) => task.column === column.id)
                  .map((task) => (
                    <li key={task.id}>
                      {/*
                        Kartu task utama:
                        - share: aktifkan perpindahan kartu antar kolom sebagai shared element
                        - update map: hanya tipe "kanban-move" yang pakai class vt-task-move
                        - default 'none': update lain dibiarkan tanpa animasi update khusus
                      */}
                      <ViewTransition
                        name={`task-${task.id}`}
                        default="vt-task"
                        share="vt-task-share"
                        update={{ default: 'none', 'kanban-move': 'vt-task-move' }}
                        // callback ini jalan saat elemen melakukan share transition
                        onShare={() => {
                          setEventLog(`Share transition: ${task.title}`)
                        }}
                      >
                        <article className="task-card">
                          {/* judul task punya region transisi sendiri */}
                          <ViewTransition name={`task-title-${task.id}`} default="vt-task-title">
                            <h4>{task.title}</h4>
                          </ViewTransition>

                          {/*
                            energy sengaja update="none" supaya angkanya langsung berubah
                            tanpa animasi tambahan (lebih mudah dilihat untuk pemula).
                          */}
                          <ViewTransition
                            name={`task-energy-${task.id}`}
                            default="vt-task-energy"
                            update="none"
                          >
                            <p>Energy {task.energy}</p>
                          </ViewTransition>
                          <div className="task-actions">
                            <button
                              type="button"
                              className="mini"
                              // memindahkan task ke kolom berikutnya (backlog -> active -> done -> backlog)
                              onClick={() =>
                                withTransitionType('kanban-move', () => {
                                  setTasks((prev) =>
                                    prev.map((item) =>
                                      item.id === task.id
                                        ? { ...item, column: nextColumn(item.column) }
                                        : item,
                                    ),
                                  )
                                })
                              }
                            >
                              Move
                            </button>
                            <button
                              type="button"
                              className="mini"
                              // menaikkan nilai energy task sampai maksimal 100
                              onClick={() =>
                                withTransitionType('kanban-energy', () => {
                                  setTasks((prev) =>
                                    prev.map((item) =>
                                      item.id === task.id
                                        ? { ...item, energy: Math.min(item.energy + 4, 100) }
                                        : item,
                                    ),
                                  )
                                })
                              }
                            >
                              Boost
                            </button>
                          </div>
                        </article>
                      </ViewTransition>
                    </li>
                  ))}
              </ul>
            </section>
          </ViewTransition>
        ))}
      </div>
    </section>
  )
}

const missions = [
  {
    id: 'm-alpha',
    title: 'Alpha Corridor',
    report: 'Collect entering boundaries in beforeMutation and pin snapshot anchors.',
  },
  {
    id: 'm-beta',
    title: 'Beta Drift',
    report: 'Resolve share names during mutation and avoid off-viewport pair artifacts.',
  },
  {
    id: 'm-gamma',
    title: 'Gamma Flux',
    report: 'Race resource gating against timeout and preserve fluid interaction latency.',
  },
]

export function ComplexRoute() {
  // mission aktif yang sedang dipilih
  const [activeId, setActiveId] = useState(missions[0].id)

  // stage untuk simulasi proses async
  const [stage, setStage] = useState<'idle' | 'syncing' | 'resolved'>('idle')

  // tampil/sembunyikan panel diagnostics
  const [showDiagnostics, setShowDiagnostics] = useState(true)

  // label kecil untuk menampilkan tipe transisi terakhir
  const [typeLabel, setTypeLabel] = useState('last type: none')

  useEffect(() => {
    // effect ini hanya aktif saat stage = syncing
    if (stage !== 'syncing') {
      return
    }

    // simulasi async: setelah 720ms, stage pindah ke resolved
    const timer = window.setTimeout(() => {
      setTypeLabel('last type: async-resolve')
      withTransitionType('async-resolve', () => setStage('resolved'))
    }, 720)

    return () => window.clearTimeout(timer)
  }, [stage])

  const activeMission = useMemo(
    // useMemo dipakai supaya pencarian mission aktif tidak dihitung ulang tanpa kebutuhan
    () => missions.find((mission) => mission.id === activeId) ?? missions[0],
    [activeId],
  )

  const launchSequence = () => {
    // pilih mission berikutnya secara melingkar
    const nextIndex = (missions.findIndex((mission) => mission.id === activeId) + 1) % missions.length

    // mulai sequence: stage jadi syncing lalu ganti mission aktif
    setTypeLabel('last type: sync-seed')
    withTransitionType('sync-seed', () => {
      setStage('syncing')
      setActiveId(missions[nextIndex].id)
    })
  }

  return (
    <section className="panel">
      <div className="copy-block">
        <p className="route-tag">Limit Push 3</p>
        <h2>Mission-control orchestration with typed multi-region transitions</h2>
        <p>
          This demo combines region pairing, asynchronous stage transitions, and independent
          enter/exit diagnostics in one screen.
        </p>
      </div>

      <div className="toolbar">
        <button type="button" className="action" onClick={launchSequence}>
          Launch sync sequence
        </button>
        <button
          type="button"
          className="action ghost"
          // toggle panel diagnostics dengan tipe transisi "diag-toggle"
          onClick={() => {
            setTypeLabel('last type: diag-toggle')
            withTransitionType('diag-toggle', () => setShowDiagnostics((x) => !x))
          }}
        >
          {showDiagnostics ? 'Hide diagnostics' : 'Show diagnostics'}
        </button>
        <p className="event-log">{typeLabel}</p>
      </div>

      <div className="mission-grid">
        {/* panel kiri daftar mission */}
        <ViewTransition name="mission-nav" default="vt-mission-nav">
          <aside className="mission-list">
            {missions.map((mission) => (
              <ViewTransition key={mission.id} name={`mission-${mission.id}`} default="vt-mission-item">
                {/* setiap item mission punya name stabil untuk kemungkinan pairing */}
                <button
                  type="button"
                  className="mission-button"
                  data-active={mission.id === activeId}
                  // klik mission dari sisi kiri untuk fokus ke mission tersebut
                  onClick={() => {
                    setTypeLabel('last type: mission-nav')
                    withTransitionType('mission-nav', () => {
                      setStage('idle')
                      setActiveId(mission.id)
                    })
                  }}
                >
                  {mission.title}
                </button>
              </ViewTransition>
            ))}
          </aside>
        </ViewTransition>

        {/*
          Panel inti mission:
          default berupa object agar class bisa beda per tipe transisi.
          contoh:
          - sync-seed -> vt-core-seed
          - async-resolve -> vt-core-resolve
        */}
        <ViewTransition
          name="mission-core"
          default={{
            default: 'vt-mission-core',
            'sync-seed': 'vt-core-seed',
            'async-resolve': 'vt-core-resolve',
          }}
        >
          <section className="mission-core">
            {/*
              name mission yang sama dipakai di list kiri dan core kanan,
              jadi bisa membuat efek shared element antar region.
            */}
            <ViewTransition name={`mission-${activeMission.id}`} default="vt-mission-item" share="vt-core-share">
              <h3>{activeMission.title}</h3>
            </ViewTransition>
            <p>{activeMission.report}</p>
            <p className="stage" data-stage={stage}>
              {stage === 'idle' && 'Stage: idle'}
              {stage === 'syncing' && 'Stage: syncing, waiting for async resolve...'}
              {stage === 'resolved' && 'Stage: resolved'}
            </p>
          </section>
        </ViewTransition>

        {showDiagnostics && (
          <ViewTransition
            name="mission-diagnostics"
            default="vt-diagnostics"
            enter="vt-diag-enter"
            exit="vt-diag-exit"
          >
            {/* enter/exit dipakai supaya panel diagnostics punya animasi muncul/hilang khusus. */}
            <section className="diagnostics">
              <p>Diagnostics</p>
              <ol>
                <li>beforeMutation: collect pairs and mark candidates</li>
                <li>mutation: apply updates in startViewTransition callback</li>
                <li>afterMutation: measure updates and revert no-op changes</li>
                <li>passive: restore nested boundaries</li>
              </ol>
            </section>
          </ViewTransition>
        )}
      </div>
    </section>
  )
}

type AlertItem = {
  id: string
  title: string
  owner: string
  severity: 'low' | 'medium' | 'high'
  queue: 'incoming' | 'investigating' | 'resolved'
  notes: string
}

const alertSeed: AlertItem[] = [
  {
    id: 'a-11',
    title: 'Latency burst on shard-11',
    owner: 'Ira',
    severity: 'high',
    queue: 'incoming',
    notes: 'Spike appears right after deploy; rollback candidate pending.',
  },
  {
    id: 'a-26',
    title: 'Auth refresh mismatch',
    owner: 'Mona',
    severity: 'medium',
    queue: 'investigating',
    notes: 'Token clock skew reproduces only on mobile web sessions.',
  },
  {
    id: 'a-31',
    title: 'Stale CDN profile image',
    owner: 'Rey',
    severity: 'low',
    queue: 'resolved',
    notes: 'Cache invalidation complete; monitor for late edge regions.',
  },
  {
    id: 'a-44',
    title: 'Checkout tax locale fallback',
    owner: 'Tia',
    severity: 'high',
    queue: 'incoming',
    notes: 'VAT precision differs from backend serializer for one locale.',
  },
]

export function EdgeRoute() {
  // list alert di route edge
  const [alerts, setAlerts] = useState<AlertItem[]>(alertSeed)

  // id alert yang sedang dipilih untuk ditampilkan detailnya
  const [selectedId, setSelectedId] = useState(alertSeed[0].id)

  // filter visual: jika true, alert non-high dibuat lebih redup
  const [highlightHighOnly, setHighlightHighOnly] = useState(false)

  const selectedAlert = useMemo(
    // ambil data alert aktif berdasarkan selectedId
    () => alerts.find((alert) => alert.id === selectedId) ?? alerts[0],
    [alerts, selectedId],
  )

  return (
    <section className="panel">
      <div className="copy-block">
        <p className="route-tag">Limit Push 4</p>
        <h2>Queue triage with route-local share transitions</h2>
        <p>
          This case simulates alert triage: selecting cards shares title chips into a details panel,
          while urgency filter and queue moves use independent typed updates.
        </p>
      </div>

      <div className="toolbar">
        <button
          type="button"
          className="action"
          // toggle mode highlight severity high
          onClick={() => withTransitionType('edge-filter', () => setHighlightHighOnly((x) => !x))}
        >
          {highlightHighOnly ? 'Show all severities' : 'Highlight high severity only'}
        </button>
      </div>

      <div className="edge-layout" data-filtered={highlightHighOnly}>
        <aside className="edge-list" aria-label="Alert queue">
          {alerts.map((alert) => (
            /* kartu alert list dibungkus agar perubahan filter/focus terasa halus */
            <ViewTransition key={alert.id} name={`edge-alert-${alert.id}`} default="vt-edge-card">
              <button
                type="button"
                className="edge-card"
                data-active={alert.id === selectedAlert.id}
                data-severity={alert.severity}
                // saat card dipilih, detail panel akan fokus ke alert ini
                onClick={() =>
                  withTransitionType('edge-focus', () => {
                    setSelectedId(alert.id)
                  })
                }
              >
                {/*
                  judul alert list dan judul detail memakai name sama,
                  sehingga bisa melakukan shared transition saat fokus item berubah.
                */}
                <ViewTransition name={`edge-title-${alert.id}`} default="vt-edge-title" share="vt-edge-share">
                  <h3>{alert.title}</h3>
                </ViewTransition>
                <p>
                  {alert.owner} · {alert.queue}
                </p>
              </button>
            </ViewTransition>
          ))}
        </aside>

        <ViewTransition
          name="edge-detail"
          // object default dipakai agar tiap tipe update bisa punya class berbeda
          default={{
            default: 'vt-edge-detail',
            'edge-queue': 'vt-edge-queue-update',
            'edge-severity': 'vt-edge-severity-update',
            'edge-focus': 'vt-edge-focus-detail',
          }}
        >
          <article className="edge-detail" data-severity={selectedAlert.severity}>
            {/* pasangan shared title dari list -> detail */}
            <ViewTransition name={`edge-title-${selectedAlert.id}`} default="vt-edge-title" share="vt-edge-share">
              <h3>{selectedAlert.title}</h3>
            </ViewTransition>

            {/*
              badge severity punya transisi sendiri:
              - default none: update biasa tidak dianimasikan di badge
              - edge-severity: baru pakai class vt-edge-severity-pill
            */}
            <ViewTransition
              name={`edge-severity-${selectedAlert.id}`}
              default={{ default: 'none', 'edge-severity': 'vt-edge-severity-pill' }}
            >
              <p className="edge-severity-label">Severity: {selectedAlert.severity}</p>
            </ViewTransition>
            <p>
              Owner: <strong>{selectedAlert.owner}</strong>
            </p>
            <p>{selectedAlert.notes}</p>
            <div className="task-actions">
              <button
                type="button"
                className="mini"
                // pindahkan status queue secara berurutan: incoming -> investigating -> resolved -> incoming
                onClick={() =>
                  withTransitionType('edge-queue', () => {
                    setAlerts((prev) =>
                      prev.map((item) =>
                        item.id === selectedAlert.id
                          ? {
                              ...item,
                              queue:
                                item.queue === 'incoming'
                                  ? 'investigating'
                                  : item.queue === 'investigating'
                                    ? 'resolved'
                                    : 'incoming',
                            }
                          : item,
                      ),
                    )
                  })
                }
              >
                Cycle queue
              </button>
              <button
                type="button"
                className="mini"
                // rotasi tingkat severity: low -> medium -> high -> low
                onClick={() =>
                  withTransitionType('edge-severity', () => {
                    setAlerts((prev) =>
                      prev.map((item) =>
                        item.id === selectedAlert.id
                          ? {
                              ...item,
                              severity:
                                item.severity === 'low'
                                  ? 'medium'
                                  : item.severity === 'medium'
                                    ? 'high'
                                    : 'low',
                            }
                          : item,
                      ),
                    )
                  })
                }
              >
                Rotate severity
              </button>
            </div>
          </article>
        </ViewTransition>
      </div>
    </section>
  )
}

type PerfSample = {
  id: number
  renderMs: number
  commitMs: number
  interactions: number
}

function createPerfSample(id: number): PerfSample {
  return {
    id,
    renderMs: Number((10 + Math.random() * 18).toFixed(1)),
    commitMs: Number((3 + Math.random() * 8).toFixed(1)),
    interactions: Math.floor(1 + Math.random() * 6),
  }
}

export function PerformanceTracksRoute() {
  const [samples, setSamples] = useState<PerfSample[]>([createPerfSample(1), createPerfSample(2), createPerfSample(3)])
  const [autoStream, setAutoStream] = useState(false)
  const [focus, setFocus] = useState<'render' | 'commit'>('render')

  const pushSample = () => {
    withTransitionType('perf-sample', () => {
      setSamples((prev) => [...prev.slice(-5), createPerfSample(prev[prev.length - 1].id + 1)])
    })
  }

  useEffect(() => {
    if (!autoStream) return
    const timer = window.setInterval(pushSample, 950)
    return () => window.clearInterval(timer)
  }, [autoStream])

  return (
    <section className="panel">
      <div className="copy-block">
        <p className="route-tag">Labs Update 1</p>
        <h2>React Performance Tracks simulator</h2>
        <p>Memvisualkan sampel render/commit seperti timeline performa di DevTools modern.</p>
      </div>

      <div className="toolbar">
        <button type="button" className="action" onClick={pushSample}>
          Capture sample
        </button>
        <button
          type="button"
          className="mini"
          onClick={() => withTransitionType('perf-stream', () => setAutoStream((x) => !x))}
        >
          {autoStream ? 'Stop stream' : 'Auto stream'}
        </button>
        <button
          type="button"
          className="mini"
          onClick={() => withTransitionType('perf-focus', () => setFocus((x) => (x === 'render' ? 'commit' : 'render')))}
        >
          Focus: {focus}
        </button>
      </div>

      <ViewTransition name="perf-track-board" default="vt-lab-board">
        <div className="lab-grid two">
          <section className="lab-card">
            <h3>Timeline</h3>
            <ul className="metric-list">
              {samples.map((sample) => (
                <ViewTransition
                  key={sample.id}
                  name={`perf-sample-${sample.id}`}
                  default={{ default: 'vt-lab-item', 'perf-sample': 'vt-perf-sample' }}
                >
                  <li>
                    s{sample.id} · render {sample.renderMs}ms · commit {sample.commitMs}ms · interactions{' '}
                    {sample.interactions}
                  </li>
                </ViewTransition>
              ))}
            </ul>
          </section>

          <ViewTransition
            name="perf-focus-panel"
            default={{ default: 'vt-lab-item', 'perf-focus': 'vt-perf-focus' }}
          >
            <section className="lab-card" data-focus={focus}>
              <h3>Focus Track</h3>
              <p>
                {focus === 'render'
                  ? 'Track render menyorot waktu komputasi komponen per commit.'
                  : 'Track commit menyorot biaya commit DOM per update.'}
              </p>
            </section>
          </ViewTransition>
        </div>
      </ViewTransition>
    </section>
  )
}

type CompilerIssue = {
  id: string
  file: string
  rule: string
  message: string
  fixed: boolean
}

const compilerIssueSeed: CompilerIssue[] = [
  {
    id: 'c1',
    file: 'src/dashboard/Stats.tsx',
    rule: 'react-compiler/memo-hoist',
    message: 'Ekspresi turunan bisa dihoist untuk mengurangi render cost.',
    fixed: false,
  },
  {
    id: 'c2',
    file: 'src/feed/Card.tsx',
    rule: 'react-compiler/stable-input',
    message: 'Objek props berubah setiap render, buat referensi stabil.',
    fixed: false,
  },
  {
    id: 'c3',
    file: 'src/cart/Summary.tsx',
    rule: 'react-compiler/effect-cleanup',
    message: 'Cleanup effect bisa diturunkan dari dependensi stabil.',
    fixed: false,
  },
]

export function CompilerIdeRoute() {
  const [issues, setIssues] = useState<CompilerIssue[]>(compilerIssueSeed)
  const [activeFile, setActiveFile] = useState(compilerIssueSeed[0].file)

  const files = useMemo(() => Array.from(new Set(issues.map((issue) => issue.file))), [issues])
  const openCount = issues.filter((issue) => !issue.fixed).length

  const fixNext = () => {
    const next = issues.find((issue) => issue.file === activeFile && !issue.fixed)
    if (!next) return
    withTransitionType('compiler-fix', () => {
      setIssues((prev) => prev.map((issue) => (issue.id === next.id ? { ...issue, fixed: true } : issue)))
    })
  }

  return (
    <section className="panel">
      <div className="copy-block">
        <p className="route-tag">Labs Update 2</p>
        <h2>Compiler IDE Extension mock</h2>
        <p>Contoh alur file diagnostics: lihat issue, klik fix, lalu status sinkron ke panel.</p>
      </div>

      <div className="toolbar">
        <button type="button" className="action" onClick={fixNext}>
          Fix next in file
        </button>
        <p className="event-log">Open issues: {openCount}</p>
      </div>

      <div className="lab-grid two">
        <section className="lab-card">
          <h3>Files</h3>
          <div className="pill-wrap">
            {files.map((file) => (
              <button
                key={file}
                type="button"
                className="scene-chip"
                data-active={file === activeFile}
                onClick={() => withTransitionType('compiler-focus', () => setActiveFile(file))}
              >
                {file.split('/').at(-1)}
              </button>
            ))}
          </div>
        </section>

        <section className="lab-card">
          <h3>Diagnostics</h3>
          <ul className="metric-list">
            {issues
              .filter((issue) => issue.file === activeFile)
              .map((issue) => (
                <ViewTransition
                  key={issue.id}
                  name={`compiler-issue-${issue.id}`}
                  default={{ default: 'vt-lab-item', 'compiler-fix': 'vt-compiler-fix' }}
                >
                  <li data-fixed={issue.fixed}>
                    <strong>{issue.rule}</strong> - {issue.message}
                  </li>
                </ViewTransition>
              ))}
          </ul>
        </section>
      </div>
    </section>
  )
}

export function AutoEffectDepsRoute() {
  const [query, setQuery] = useState('status:open')
  const [sort, setSort] = useState<'recent' | 'priority'>('recent')
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState<'manual' | 'automatic'>('manual')
  const [manualDeps, setManualDeps] = useState<string[]>(['query', 'sort'])

  const allDeps = ['query', 'sort', 'page']
  const missingDeps = allDeps.filter((dep) => mode === 'manual' && !manualDeps.includes(dep))

  return (
    <section className="panel">
      <div className="copy-block">
        <p className="route-tag">Labs Update 3</p>
        <h2>Automatic Effect Dependencies playground</h2>
        <p>Bandingkan mode manual vs automatic untuk melihat dependensi yang terlewat.</p>
      </div>

      <div className="toolbar">
        <button
          type="button"
          className="action"
          onClick={() => withTransitionType('auto-mode', () => setMode((x) => (x === 'manual' ? 'automatic' : 'manual')))}
        >
          Mode: {mode}
        </button>
        <button
          type="button"
          className="mini"
          onClick={() => withTransitionType('auto-page', () => setPage((x) => x + 1))}
        >
          Next page ({page})
        </button>
      </div>

      <div className="lab-grid two">
        <section className="lab-card">
          <h3>State Inputs</h3>
          <div className="input-stack">
            <input value={query} onChange={(event) => setQuery(event.target.value)} />
            <button
              type="button"
              className="mini"
              onClick={() => withTransitionType('auto-sort', () => setSort((x) => (x === 'recent' ? 'priority' : 'recent')))}
            >
              sort: {sort}
            </button>
          </div>
        </section>

        <ViewTransition name="auto-deps" default={{ default: 'vt-lab-item', 'auto-mode': 'vt-auto-mode' }}>
          <section className="lab-card">
            <h3>Effect Dependencies</h3>
            <div className="pill-wrap">
              {(mode === 'automatic' ? allDeps : manualDeps).map((dep) => (
                <button
                  key={dep}
                  type="button"
                  className="mini"
                  onClick={() =>
                    withTransitionType('auto-manual-edit', () => {
                      if (mode !== 'manual') return
                      setManualDeps((prev) => (prev.includes(dep) ? prev.filter((x) => x !== dep) : [...prev, dep]))
                    })
                  }
                >
                  {dep}
                </button>
              ))}
            </div>
            <p className="event-log">
              {missingDeps.length > 0
                ? `Missing deps (manual): ${missingDeps.join(', ')}`
                : 'Tidak ada dependency yang hilang.'}
            </p>
          </section>
        </ViewTransition>
      </div>
    </section>
  )
}

type FragmentPanel = { id: string; title: string; body: string }

const fragmentPanels: FragmentPanel[] = [
  {
    id: 'f-left',
    title: 'Left rail',
    body: 'Menampung daftar shortcut dan status ringkas.',
  },
  {
    id: 'f-main',
    title: 'Main content',
    body: 'Area utama untuk detail data dan interaksi pengguna.',
  },
  {
    id: 'f-right',
    title: 'Inspector',
    body: 'Panel info kontekstual saat elemen dipilih.',
  },
]

export function FragmentRefsRoute() {
  const [activeId, setActiveId] = useState(fragmentPanels[0].id)
  const [measureTick, setMeasureTick] = useState(0)

  return (
    <section className="panel">
      <div className="copy-block">
        <p className="route-tag">Labs Update 4</p>
        <h2>Fragment Refs simulator</h2>
        <p>Mencontohkan satu referensi lintas beberapa blok untuk fokus dan pengukuran.</p>
      </div>

      <div className="toolbar">
        <button
          type="button"
          className="action"
          onClick={() => withTransitionType('fragment-measure', () => setMeasureTick((x) => x + 1))}
        >
          Re-measure fragment
        </button>
        <p className="event-log">measure cycle #{measureTick}</p>
      </div>

      <div className="lab-grid three">
        {fragmentPanels.map((panel) => (
          <ViewTransition
            key={panel.id}
            name={`fragment-panel-${panel.id}`}
            default={{ default: 'vt-lab-item', 'fragment-measure': 'vt-fragment-measure' }}
          >
            <article className="lab-card" data-active={panel.id === activeId}>
              <h3>{panel.title}</h3>
              <p>{panel.body}</p>
              <button
                type="button"
                className="mini"
                onClick={() => withTransitionType('fragment-focus', () => setActiveId(panel.id))}
              >
                Focus panel
              </button>
            </article>
          </ViewTransition>
        ))}
      </div>
    </section>
  )
}

type StoreEvent = { id: number; source: 'A' | 'B'; value: number }

export function ConcurrentStoresRoute() {
  const [sourceA, setSourceA] = useState(10)
  const [sourceB, setSourceB] = useState(14)
  const [queue, setQueue] = useState<StoreEvent[]>([])
  const [version, setVersion] = useState(1)
  const [autoFlush, setAutoFlush] = useState(false)

  const merged = Math.round((sourceA + sourceB) / 2)

  const enqueue = (source: 'A' | 'B') => {
    withTransitionType('store-enqueue', () => {
      setQueue((prev) => [...prev, { id: Date.now(), source, value: source === 'A' ? sourceA : sourceB }])
      if (source === 'A') setSourceA((x) => x + 1)
      if (source === 'B') setSourceB((x) => x + 1)
    })
  }

  const flush = useCallback(() => {
    if (queue.length === 0) return
    withTransitionType('store-flush', () => {
      setQueue((prev) => prev.slice(1))
      setVersion((x) => x + 1)
    })
  }, [queue.length])

  useEffect(() => {
    if (!autoFlush) return
    const timer = window.setInterval(flush, 850)
    return () => window.clearInterval(timer)
  }, [autoFlush, flush])

  return (
    <section className="panel">
      <div className="copy-block">
        <p className="route-tag">Labs Update 5</p>
        <h2>Concurrent Stores merge simulator</h2>
        <p>Dua producer mengirim update ke antrean, lalu snapshot konsisten diterapkan saat flush.</p>
      </div>

      <div className="toolbar">
        <button type="button" className="action" onClick={() => enqueue('A')}>
          Push source A
        </button>
        <button type="button" className="mini" onClick={() => enqueue('B')}>
          Push source B
        </button>
        <button type="button" className="mini" onClick={flush}>
          Flush once
        </button>
        <button
          type="button"
          className="mini"
          onClick={() => withTransitionType('store-auto', () => setAutoFlush((x) => !x))}
        >
          {autoFlush ? 'Stop auto flush' : 'Auto flush'}
        </button>
      </div>

      <div className="lab-grid two">
        <section className="lab-card">
          <h3>Queue ({queue.length})</h3>
          <ul className="metric-list">
            {queue.map((event) => (
              <ViewTransition
                key={event.id}
                name={`store-event-${event.id}`}
                default={{ default: 'vt-lab-item', 'store-enqueue': 'vt-store-enqueue' }}
              >
                <li>
                  source {event.source} to value {event.value}
                </li>
              </ViewTransition>
            ))}
          </ul>
        </section>

        <ViewTransition
          name="store-snapshot"
          default={{ default: 'vt-lab-item', 'store-flush': 'vt-store-flush' }}
        >
          <section className="lab-card">
            <h3>Snapshot v{version}</h3>
            <p>A: {sourceA}</p>
            <p>B: {sourceB}</p>
            <p>Merged: {merged}</p>
          </section>
        </ViewTransition>
      </div>
    </section>
  )
}

export default App
