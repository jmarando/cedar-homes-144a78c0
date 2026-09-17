import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

interface AgentReplyProps {
  headline?: string
  message?: string
  agentName?: string
}

const AgentReplyEmail = ({
  headline = 'Cedar Homes',
  message = '',
  agentName = 'The Cedar Homes team',
}: AgentReplyProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{message.slice(0, 120) || headline}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>CEDAR HOMES · GAP DEVELOPERS</Text>
        <Heading style={h1}>{headline}</Heading>
        {message
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((paragraph, i) => (
            <Text key={i} style={text}>
              {paragraph}
            </Text>
          ))}
        <Text style={text}>{agentName}</Text>
        <Hr style={hr} />
        <Text style={footer}>
          Cedar Homes · Lusegetti, Kikuyu · WhatsApp +254 797 964 858 · Reply to this email and it
          reaches us directly.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AgentReplyEmail,
  subject: (data: Record<string, any>) =>
    (data['subject'] as string) || 'A message from Cedar Homes',
  displayName: 'Sales desk reply',
  previewData: {
    headline: 'About your show house visit',
    message: 'Hi Grace,\n\nSaturday at 11am works well for us. See you then.',
    agentName: 'Justin, Cedar Homes',
  },
} satisfies TemplateEntry

export default AgentReplyEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = {
  padding: '32px 28px',
  maxWidth: '560px',
  border: '1px solid #E7E1D6',
  borderRadius: '12px',
}
const brand = {
  fontSize: '11px',
  letterSpacing: '1.5px',
  color: '#C07A45',
  margin: '0 0 12px',
  fontWeight: 'bold' as const,
}
const h1 = { fontSize: '20px', fontWeight: 'bold' as const, color: '#1F3D33', margin: '0 0 18px' }
const text = { fontSize: '15px', color: '#4A4A46', lineHeight: '1.6', margin: '0 0 16px' }
const hr = { borderColor: '#E7E1D6', margin: '28px 0 16px' }
const footer = { fontSize: '12px', color: '#8A8A85', margin: 0 }
