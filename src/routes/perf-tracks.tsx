import { createFileRoute } from '@tanstack/react-router'
import { PerformanceTracksRoute } from '../App'

export const Route = createFileRoute('/perf-tracks')({
  component: PerformanceTracksRoute,
})
