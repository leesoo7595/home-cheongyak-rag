import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/f/$conversationId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/f/$conversationId"!</div>
}
