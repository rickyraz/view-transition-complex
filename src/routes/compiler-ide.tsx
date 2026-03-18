import { createFileRoute } from '@tanstack/react-router'
import { CompilerIdeRoute } from '../App'

export const Route = createFileRoute('/compiler-ide')({
  component: CompilerIdeRoute,
})
