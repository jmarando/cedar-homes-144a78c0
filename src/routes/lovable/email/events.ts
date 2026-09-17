import { createEmailWebhookHandler } from '@lovable.dev/email-js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/lovable/email/events")({
  server: {
    handlers: {
      POST: ({ request }) => {
        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) {
          console.error('Missing required environment variables')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }
        const record = async (
          kind: 'bounced' | 'complaint' | 'unsubscribed',
          event: { event_id: string; data: { recipient?: string } },
        ) => {
          const { recordEmailEvent } = await import('@/lib/email-events.server')
          await recordEmailEvent(kind, event.data.recipient ?? null, event.event_id)
        }
        const handler = createEmailWebhookHandler({
          apiKey,
          on: {
            'email.bounced': async (event) => {
              await record('bounced', event as never)
            },
            'email.complaint': async (event) => {
              await record('complaint', event as never)
            },
            'email.unsubscribed': async (event) => {
              await record('unsubscribed', event as never)
            },
          },
        })
        return handler(request)
      },
    },
  },
})
