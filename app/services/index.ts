/**
 * Services — Barrel Export
 *
 * Re-exports all service classes and singleton instances
 * for convenient imports across the application.
 *
 * @example
 *   import { authService, ApiError } from '~/services'
 *   import { BaseApiService } from '~/services'
 */

export { BaseApiService } from './BaseApiService'
export { ApiError } from './ApiError'
export { AuthService, authService } from './AuthService'
export { TenantService, tenantService } from './TenantService'
export { ContactService, contactService } from './ContactService'
export { WidgetSettingsService, widgetSettingsService } from './WidgetSettingsService'
export { ChatbotSettingsService, chatbotSettingsService } from './ChatbotSettingsService'
export { FormFieldService, formFieldService } from './FormFieldService'
export { SessionService, sessionService } from './SessionService'
export { ConversationService, conversationService } from './ConversationService'
export { KnowledgeService, knowledgeService } from './KnowledgeService'
export { PlaygroundService, playgroundService } from './PlaygroundService'
export { ChatService, chatService } from './ChatService'
