/**
 * Contact Service
 *
 * Handles contact management API calls: paginated listing,
 * creation, retrieval, update, and deletion.
 *
 * @see docs/swagger.yml — Contact endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse, PaginatedApiResponse, PaginationParams } from '~~/shared/types/api'
import type {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from '~~/shared/types/contact'

export class ContactService extends DashboardApiService {
  /**
   * List contacts with pagination and optional search/sort
   */
  async list(params?: PaginationParams): Promise<PaginatedApiResponse<ContactResponse>> {
    return this.getPaginated<ContactResponse>('/contacts', { params })
  }

  /**
   * Create a new contact
   */
  async create(payload: CreateContactRequest): Promise<ApiResponse<ContactResponse>> {
    return this.post<ContactResponse>('/contacts', payload)
  }

  /**
   * Get a single contact by ID
   */
  async getById(id: string): Promise<ApiResponse<ContactResponse>> {
    return this.get<ContactResponse>(`/contacts/${id}`)
  }

  /**
   * Update an existing contact
   */
  async update(id: string, payload: UpdateContactRequest): Promise<ApiResponse<ContactResponse>> {
    return this.put<ContactResponse>(`/contacts/${id}`, payload)
  }

  /**
   * Delete a contact by ID
   */
  async remove(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/contacts/${id}`)
  }
}

export const contactService = new ContactService()
