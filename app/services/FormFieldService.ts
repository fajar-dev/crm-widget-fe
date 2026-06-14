/**
 * Form Field Service
 *
 * Handles pre-chat form field API calls: listing, creation,
 * update, deletion, and reordering of form fields.
 *
 * @see docs/swagger.yml — Chatbot Form Field endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse } from '~~/shared/types/api'
import type {
  FormFieldResponse,
  CreateFormFieldRequest,
  UpdateFormFieldRequest,
  ReorderItem,
} from '~~/shared/types/form-field'

export class FormFieldService extends DashboardApiService {
  /**
   * List all form fields for the active tenant
   */
  async list(): Promise<ApiResponse<FormFieldResponse[]>> {
    return this.get<FormFieldResponse[]>('/chatbot-form-fields')
  }

  /**
   * Create a new form field
   */
  async create(payload: CreateFormFieldRequest): Promise<ApiResponse<FormFieldResponse>> {
    return this.post<FormFieldResponse>('/chatbot-form-fields', payload)
  }

  /**
   * Update an existing form field
   */
  async update(id: string, payload: UpdateFormFieldRequest): Promise<ApiResponse<FormFieldResponse>> {
    return this.put<FormFieldResponse>(`/chatbot-form-fields/${id}`, payload)
  }

  /**
   * Delete a form field by ID
   */
  async remove(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/chatbot-form-fields/${id}`)
  }

  /**
   * Reorder form fields by updating their sort positions
   */
  async reorder(items: ReorderItem[]): Promise<ApiResponse<FormFieldResponse[]>> {
    return this.put<FormFieldResponse[]>('/chatbot-form-fields/reorder', { items })
  }
}

export const formFieldService = new FormFieldService()
