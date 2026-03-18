/* eslint-disable react-refresh/only-export-components */

import { Link, Navigate, Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { routeMeta, routeOrder } from '../App'
import '../App.css'

function resolveRouteTypes(fromPath: string | undefined, toPath: string) {
  const fromIndex = fromPath ? routeOrder.indexOf(fromPath as (typeof routeOrder)[number]) : -1
  const toIndex = routeOrder.indexOf(toPath as (typeof routeOrder)[number])

  if (fromIndex === -1 || toIndex === -1) {
    return ['route-forward']
  }

  return [toIndex > fromIndex ? 'route-forward' : 'route-backward']
}

function resolveActivePath(pathname: string) {
  const directMatch = routeOrder.find((routePath) => pathname === routePath)
  if (directMatch) return directMatch

  const nestedMatch = routeOrder.find((routePath) => pathname.startsWith(`${routePath}/`))
  if (nestedMatch) return nestedMatch

  return '/simple'
}

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const activePath = resolveActivePath(pathname)

  const navRef = useRef<HTMLElement | null>(null)
  const pillRefs = useRef<Partial<Record<(typeof routeOrder)[number], HTMLAnchorElement | null>>>({})
  const hasMountedRef = useRef(false)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, top: 0, height: 0, ready: false })

  const updateIndicator = useCallback(() => {
    const navEl = navRef.current
    const activeEl = pillRefs.current[activePath]

    if (!navEl || !activeEl) {
      return
    }

    const navRect = navEl.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()

    const left = activeRect.left - navRect.left + navEl.scrollLeft
    const width = activeRect.width
    const top = activeRect.top - navRect.top + navEl.scrollTop
    const height = activeRect.height

    setIndicator((prev) => ({
      left,
      width,
      top,
      height,
      ready: prev.ready,
    }))
  }, [activePath])

  useLayoutEffect(() => {
    updateIndicator()
    const frame = window.requestAnimationFrame(() => {
      setIndicator((prev) => ({ ...prev, ready: true }))
    })

    const navEl = navRef.current
    const activeEl = pillRefs.current[activePath]

    // Biang kerok bug sebelumnya:
    // active tab memang berubah (class/data-active), tapi posisi scroll container tetap.
    // Elemen aktif di ujung kanan/kiri tidak otomatis masuk viewport.
    // Fix: saat route aktif berubah, scroll container diarahkan ke tab aktif.
    if (navEl && activeEl) {
      const navRect = navEl.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()
      const isFullyVisible = activeRect.left >= navRect.left && activeRect.right <= navRect.right

      if (!isFullyVisible) {
        activeEl.scrollIntoView({
          behavior: hasMountedRef.current ? 'smooth' : 'auto',
          inline: 'center',
          block: 'nearest',
        })

        window.requestAnimationFrame(() => updateIndicator())
      }
    }

    hasMountedRef.current = true

    const onResize = () => updateIndicator()
    const onScroll = () => updateIndicator()
    window.addEventListener('resize', onResize)
    navEl?.addEventListener('scroll', onScroll)

    const observer = new ResizeObserver(() => updateIndicator())
    if (navEl) observer.observe(navEl)
    if (activeEl) observer.observe(activeEl)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      navEl?.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [activePath, updateIndicator])

  const navStyle = {
    '--active-left': `${indicator.left}px`,
    '--active-width': `${indicator.width}px`,
    '--active-top': `${indicator.top}px`,
    '--active-height': `${indicator.height}px`,
    '--active-opacity': indicator.width > 0 && indicator.height > 0 ? 1 : 0,
    '--active-duration': indicator.ready ? '320ms' : '0ms',
  } as CSSProperties

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-copy">
          <p className="eyebrow">React Canary ViewTransition + TanStack Router</p>
          <h1>{routeMeta[activePath].label} Route</h1>
          <p className="subtitle">{routeMeta[activePath].subtitle}</p>
        </div>

        <nav ref={navRef} className="route-nav" style={navStyle} aria-label="Transition demos">
          {routeOrder.map((routePath) => (
            <Link
              key={routePath}
              to={routePath}
              preload="render"
              ref={(el) => {
                pillRefs.current[routePath] = el
              }}
              className="route-pill"
              data-active={routePath === activePath}
              aria-current={routePath === activePath ? 'page' : undefined}
              viewTransition={{
                types: ({ fromLocation, toLocation }) =>
                  resolveRouteTypes(fromLocation?.pathname, toLocation.pathname),
              }}
            >
              {routeMeta[routePath].label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="route-canvas">
        <Outlet />
      </main>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <Navigate to="/simple" viewTransition replace />,
})
