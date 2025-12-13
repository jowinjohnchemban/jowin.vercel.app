/**
 * Email utilities and templates
 * @module lib/email
 */

export { generateContactFormEmail } from './templates/contact-form';
export { ContactEmailService, createContactEmailService } from './services/contact-email';
export { EmailProviderFactory } from './providers';
export type { 
  ContactFormData,
  ContactFormMetadata, 
  ContactFormEmailData,
  EmailResult
} from './types';
export type { 
  EmailProvider, 
  EmailMessage, 
  EmailResponse 
} from './providers';
