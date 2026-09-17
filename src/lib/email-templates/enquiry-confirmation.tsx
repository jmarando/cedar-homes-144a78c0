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

interface EnquiryConfirmationProps {
  firstName?: string
  interest?: string
  ctaUrl?: string
}

const EnquiryConfirmationEmail = ({
  firstName = 'there',
  interest = '',
  ctaUrl = 'https://cedar-homes.lovable.app/',
}: EnquiryConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We have your Cedar Homes enquiry — here is what happens next.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>CEDAR HOMES · GAP DEVELOPERS</Text>
        <Heading style={h1}>Thanks, {firstName}</Heading>
        <Text style={text}>
          We have your enquiry{interest ? ` about ${interest}` : ''} and a member of the Cedar Homes
          team will be in touch shortly.
        </Text>
        <Text style={text}>
          Cedar Homes is a small collection of 4-bedroom homes at Lusegetti, Kikuyu. Each home is
          266 sqm on its own plot of approximately 1/8 acre, with a private garden and a freehold
          title in your name.
        </Text>
        <Text style={text}>
          The show house is complete and open for viewing. If a particular day suits you, reply to
          this email and we will hold the slot.
        </Text>
        <Button style={button} href={ctaUrl}>
          Book a show house visit
        </Button>
        <Hr style={hr} />
        <Text style={footer}>
          Cedar Homes · Lusegetti, Kikuyu · WhatsApp +254 797 964 858
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: EnquiryConfirmationEmail,
  subject: 'We have your Cedar Homes enquiry',
  displayName: 'Enquiry confirmation',
  previewData: { firstName: 'Grace', interest: 'a show house visit' },
} satisfies TemplateEntry

export default EnquiryConfirmationEmail

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
