import {
  ViewTransition,
  addTransitionType,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from 'react'
import heroImg from './assets/hero.png'
import './App.css'

type RoutePath = '/simple' | '/medium' | '/complex'

const routeOrder: RoutePath[] = ['/simple', '/medium', '/complex']

const routeMeta: Record<RoutePath, { label: string; subtitle: string }> = {
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
}

function normalizePath(pathname: string): RoutePath {
  if (pathname === '/simple' || pathname === '/medium' || pathname === '/complex') {
    return pathname
  }

  return '/simple'
}

function withTransitionType(type: string, update: () => void) {
  startTransition(() => {
    addTransitionType(type)
    update()
  })
}

function App() {
  const [path, setPath] = useState<RoutePath>(() => normalizePath(window.location.pathname))

  useEffect(() => {
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', path)
    }
  }, [path])

  useEffect(() => {
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
    const type = nextIndex > currentIndex ? 'route-forward' : 'route-backward'

    withTransitionType(type, () => {
      window.history.pushState({}, '', nextPath)
      setPath(nextPath)
    })
  }

  const activeRoute =
    path === '/simple' ? <SimpleRoute /> : path === '/medium' ? <MediumRoute /> : <ComplexRoute />

  return (
    <div className="app-shell">
      <ViewTransition name="topbar" default="vt-topbar">
        <header className="topbar">
          <div>
            <p className="eyebrow">React Canary ViewTransition</p>
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

function SimpleRoute() {
  const [active, setActive] = useState<Scene>(scenes[0])
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
              onClick={() => withTransitionType('scene-swap', () => setActive(scene))}
            >
              {scene.title}
            </button>
          ))}
        </div>

        <article className="scene-card" data-expanded={expanded}>
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
            <ViewTransition name="simple-title" default="vt-scene-title" share="vt-scene-share">
              <h3>{active.title}</h3>
            </ViewTransition>
            <p>{active.blurb}</p>
            <button
              type="button"
              className="action"
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

function MediumRoute() {
  const [tasks, setTasks] = useState<TaskItem[]>(seedTasks)
  const [compact, setCompact] = useState(false)
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
          onClick={() => withTransitionType('kanban-density', () => setCompact((x) => !x))}
        >
          {compact ? 'Comfortable layout' : 'Compact layout'}
        </button>
        <p className="event-log">{eventLog}</p>
      </div>

      <div className="board" data-compact={compact}>
        {boardColumns.map((column) => (
          <ViewTransition key={column.id} name={`col-${column.id}`} default="vt-column">
            <section className="column">
              <h3>{column.label}</h3>
              <ul>
                {tasks
                  .filter((task) => task.column === column.id)
                  .map((task) => (
                    <li key={task.id}>
                      <ViewTransition
                        name={`task-${task.id}`}
                        default="vt-task"
                        share="vt-task-share"
                        update={{ default: 'none', 'kanban-move': 'vt-task-move' }}
                        onShare={() => {
                          setEventLog(`Share transition: ${task.title}`)
                        }}
                      >
                        <article className="task-card">
                          <ViewTransition name={`task-title-${task.id}`} default="vt-task-title">
                            <h4>{task.title}</h4>
                          </ViewTransition>
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

function ComplexRoute() {
  const [activeId, setActiveId] = useState(missions[0].id)
  const [stage, setStage] = useState<'idle' | 'syncing' | 'resolved'>('idle')
  const [showDiagnostics, setShowDiagnostics] = useState(true)
  const [typeLabel, setTypeLabel] = useState('last type: none')

  useEffect(() => {
    if (stage !== 'syncing') {
      return
    }

    const timer = window.setTimeout(() => {
      setTypeLabel('last type: async-resolve')
      withTransitionType('async-resolve', () => setStage('resolved'))
    }, 720)

    return () => window.clearTimeout(timer)
  }, [stage])

  const activeMission = useMemo(
    () => missions.find((mission) => mission.id === activeId) ?? missions[0],
    [activeId],
  )

  const launchSequence = () => {
    const nextIndex = (missions.findIndex((mission) => mission.id === activeId) + 1) % missions.length

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
        <ViewTransition name="mission-nav" default="vt-mission-nav">
          <aside className="mission-list">
            {missions.map((mission) => (
              <ViewTransition key={mission.id} name={`mission-${mission.id}`} default="vt-mission-item">
                <button
                  type="button"
                  className="mission-button"
                  data-active={mission.id === activeId}
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

        <ViewTransition
          name="mission-core"
          default={{
            default: 'vt-mission-core',
            'sync-seed': 'vt-core-seed',
            'async-resolve': 'vt-core-resolve',
          }}
        >
          <section className="mission-core">
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

export default App
