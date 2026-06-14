/**
 * Knowledge Service
 *
 * Handles knowledge base API calls: category CRUD, entry CRUD,
 * and bulk entry creation for FAQ and document chunk management.
 *
 * @see docs/swagger.yml — Knowledge Category & Knowledge Base endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse } from '~~/shared/types/api'
import type {
  KnowledgeCategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  KnowledgeBaseResponse,
  CreateKnowledgeBaseRequest,
  UpdateKnowledgeBaseRequest,
} from '~~/shared/types/knowledge'

export class KnowledgeService extends DashboardApiService {
  // ── Categories ───────────────────────────────────────────────

  /**
   * List all knowledge categories
   */
  async listCategories(): Promise<ApiResponse<KnowledgeCategoryResponse[]>> {
    return this.get<KnowledgeCategoryResponse[]>('/knowledge-categories')
  }

  /**
   * Create a new knowledge category
   */
  async createCategory(payload: CreateCategoryRequest): Promise<ApiResponse<KnowledgeCategoryResponse>> {
    return this.post<KnowledgeCategoryResponse>('/knowledge-categories', payload)
  }

  /**
   * Get a single knowledge category by ID
   */
  async getCategory(id: string): Promise<ApiResponse<KnowledgeCategoryResponse>> {
    return this.get<KnowledgeCategoryResponse>(`/knowledge-categories/${id}`)
  }

  /**
   * Update a knowledge category
   */
  async updateCategory(id: string, payload: UpdateCategoryRequest): Promise<ApiResponse<KnowledgeCategoryResponse>> {
    return this.put<KnowledgeCategoryResponse>(`/knowledge-categories/${id}`, payload)
  }

  /**
   * Delete a knowledge category by ID
   */
  async removeCategory(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/knowledge-categories/${id}`)
  }

  // ── Entries (Knowledge Base) ─────────────────────────────────

  /**
   * List all entries within a specific category
   */
  async listEntries(categoryId: string): Promise<ApiResponse<KnowledgeBaseResponse[]>> {
    return this.get<KnowledgeBaseResponse[]>(`/knowledge-categories/${categoryId}/knowledge-bases`)
  }

  /**
   * Create a new entry in a category
   */
  async createEntry(
    categoryId: string,
    payload: CreateKnowledgeBaseRequest,
  ): Promise<ApiResponse<KnowledgeBaseResponse>> {
    return this.post<KnowledgeBaseResponse>(
      `/knowledge-categories/${categoryId}/knowledge-bases`,
      payload,
    )
  }

  /**
   * Bulk-create entries in a category
   */
  async bulkCreateEntries(
    categoryId: string,
    items: CreateKnowledgeBaseRequest[],
  ): Promise<ApiResponse<KnowledgeBaseResponse[]>> {
    return this.post<KnowledgeBaseResponse[]>(
      `/knowledge-categories/${categoryId}/knowledge-bases/bulk`,
      { items },
    )
  }

  /**
   * Get a single knowledge base entry by ID
   */
  async getEntry(id: string): Promise<ApiResponse<KnowledgeBaseResponse>> {
    return this.get<KnowledgeBaseResponse>(`/knowledge-bases/${id}`)
  }

  /**
   * Update a knowledge base entry
   */
  async updateEntry(id: string, payload: UpdateKnowledgeBaseRequest): Promise<ApiResponse<KnowledgeBaseResponse>> {
    return this.put<KnowledgeBaseResponse>(`/knowledge-bases/${id}`, payload)
  }

  /**
   * Delete a knowledge base entry by ID
   */
  async removeEntry(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/knowledge-bases/${id}`)
  }
}

export const knowledgeService = new KnowledgeService()
