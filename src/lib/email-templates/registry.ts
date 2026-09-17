import type { ComponentType } from 'react'

import { template as agentReplyTemplate } from './agent-reply'
import { template as enquiryConfirmationTemplate } from './enquiry-confirmation'
import { template as leadAlertTemplate } from './lead-alert'
import { template as nurtureStepTemplate } from './nurture-step'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'nurture-step': nurtureStepTemplate,
  'enquiry-confirmation': enquiryConfirmationTemplate,
  'lead-alert': leadAlertTemplate,
  'agent-reply': agentReplyTemplate,
}
