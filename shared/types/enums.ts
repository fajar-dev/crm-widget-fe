/**
 * Shared Enums
 *
 * Enums and literal types used across the application.
 * Must match the backend API contract defined in docs/swagger.yml.
 */

/**
 * Form field types for pre-chat form customization
 */
export type FormFieldType = 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select'

/**
 * Knowledge base entry types
 */
export type EntryType = 'faq' | 'document_chunk'

/**
 * Conversation status
 */
export type ConversationStatus = 'active' | 'ended'

/**
 * Chat message roles
 */
export type MessageRole = 'user' | 'assistant' | 'system'
