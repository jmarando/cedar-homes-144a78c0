import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

interface LeadAlertProps {
  name?: string
  email?: string
  phone?: string
  interest?: string
  persona?: string
  score?: number | string
  source?: string
  message?: string
  leadUrl?: string
}

const LeadAlertEmail = ({
  name = 'New enquiry',
  email = '',
  phone = '',
  interest = '',
  persona = '',
  score = '',
  source = '',
  message = '',
  leadUrl = 'https://cedar-homes.lovable.app/admin/leads',
}: LeadAlertProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New Cedar Homes enquiry: ${name}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>CEDAR HOMES · SALES DESK</Text>
        <Heading style={h1}>{name}</Heading>
        <Text style={text}>
          <strong>Phone:</strong> {phone || '—'}
          <br />
          <strong>Email:</strong> {email || '—'}
          <br />
          <strong>Interest:</strong> {interest || '—'}
          <br />
          <strong>Persona:</strong> {persona || '—'}
          <br />
          <strong>Score:</strong> {String(score || '—')}
          <br />
          <strong>Source:</strong> {source || '—'}
        </Text>
        {message ? <Text style={quote}>{message}</Text> : null}
        <Button style={button} href={leadUrl}>
          Open in the sales desk
        </Button>
        <Hr style={hr} />
        <Text style={footer}>Respond within five minutes wherever possible.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: LeadAlertEmail,
  subject: (data: Record<string, any>) =>
    `New Cedar Homes enquiry: ${(data['name'] as string) || 'website form'}`,
  displayName: 'Internal new-lead alert',
  to: 'justin@glab.africa',
  previewData: {
    name: 'Grace Wambui',
    email: 'grace@example.com',
    phone: '+254712345678',
    interest: 'showhouse-visit',
    persona: 'diaspora',
    score: 72,
    source: 'website',
    message: 'I would like to view the show house this weekend.',
  },
} satisfies TemplateEntry

export default LeadAlertEmail

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
const text = { fontSize: '14px', color: '#4A4A46', lineHeight: '1.7', margin: '0 0 16px' }
const quote = {
  fontSize: '14px',
  color: '#1F3D33',
  lineHeight: '1.6',
  margin: '0 0 16px',
  padding: '12px 14px',
  backgroundColor: '#F7F4EE',
  borderRadius: '8px',
  whiteSpace: 'pre-wrap' as const,
}
const button = {
  backgroundColor: '#1F3D33',
  color: '#ffffff',
  fontSize: '14px',
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 0',
}
const hr = { borderColor: '#E7E1D6', margin: '28px 0 16px' }
const footer = { fontSize: '12px', color: '#8A8A85', margin: 0 }
