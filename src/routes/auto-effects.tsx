import { createFileRoute } from '@tanstack/react-router'
import { AutoEffectDepsRoute } from '../App'

export const Route = createFileRoute('/auto-effects')({
  component: AutoEffectDepsRoute,
})
