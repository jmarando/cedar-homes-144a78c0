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

interface NurtureStepProps {
  /** Plain-text message body, already personalised by the follow-up engine. */
  message?: string
  headline?: string
  ctaLabel?: string
  ctaUrl?: string
}

const NurtureStepEmail = ({
  message = '',
  headline = 'Cedar Homes, Lusegetti',
  ctaLabel = 'Book a showhouse visit',
  ctaUrl = 'https://gapdevelopers.co.ke/cedar-homes/',
}: NurtureStepProps) => (
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
        <Button style={button} href={ctaUrl}>
          {ctaLabel}
        </Button>
        <Hr style={hr} />
        <Text style={footer}>
          Cedar Homes · 4-bedroom homes at Lusegetti, Kikuyu · Reply to this email or WhatsApp us on
          +254 797 964 858.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NurtureStepEmail,
  subject: (data: Record<string, any>) =>
    (data['subject'] as string) || 'An update from Cedar Homes',
  displayName: 'Follow-up sequence step',
  previewData: {
    subject: 'Your Cedar Homes information pack',
    headline: 'Thanks for your interest in Cedar Homes',
    message:
      'Hi Grace,\n\nThanks for reaching out about Cedar Homes at Lusegetti. Our 4-bedroom homes start at Ksh 23.5M, with the showhouse open for viewing daily.\n\nWould you like to book a visit this week?',
  },
} satisfies TemplateEntry

export default NurtureStepEmail

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
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1F3D33', margin: '0 0 18px' }
const text = { fontSize: '15px', color: '#4A4A46', lineHeight: '1.6', margin: '0 0 16px' }
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
