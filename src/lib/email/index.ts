/**
 * Email utilities and templates
 * @module lib/email
 */

export { default as generateContactFormEmail } from './templates/contact';
export { ContactEmailService, createContactEmailService } from './services/contact';
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
