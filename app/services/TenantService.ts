/**
 * Tenant Service
 *
 * Handles tenant management API calls: CRUD operations, member management,
 * join by code, invitation acceptance, and invite-code regeneration.
 *
 * @see docs/swagger.yml — Tenant endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse } from '~~/shared/types/api'
import type {
  TenantResponse,
  CreateTenantRequest,
  UpdateTenantRequest,
  JoinTenantRequest,
  AcceptInvitationRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
  MemberResponse,
} from '~~/shared/types/tenant'

export class TenantService extends DashboardApiService {
  /**
   * List all tenants the current user belongs to
   */
  async listTenants(): Promise<ApiResponse<TenantResponse[]>> {
    return this.get<TenantResponse[]>('/tenants')
  }

  /**
   * Create a new tenant
   */
  async createTenant(payload: CreateTenantRequest): Promise<ApiResponse<TenantResponse>> {
    return this.post<TenantResponse>('/tenants', payload)
  }

  /**
   * Get a single tenant by ID
   */
  async getTenant(id: string): Promise<ApiResponse<TenantResponse>> {
    return this.get<TenantResponse>(`/tenants/${id}`)
  }

  /**
   * Update tenant details
   */
  async updateTenant(id: string, payload: UpdateTenantRequest): Promise<ApiResponse<TenantResponse>> {
    return this.put<TenantResponse>(`/tenants/${id}`, payload)
  }

  /**
   * Join an existing tenant using an invite code
   */
  async joinTenant(payload: JoinTenantRequest): Promise<ApiResponse<TenantResponse>> {
    return this.post<TenantResponse>('/tenants/join', payload)
  }

  /**
   * Accept a tenant invitation via token
   */
  async acceptInvite(payload: AcceptInvitationRequest): Promise<ApiResponse<TenantResponse>> {
    return this.post<TenantResponse>('/tenants/accept-invite', payload)
  }

  /**
   * Regenerate the join code for a tenant
   */
  async regenerateCode(id: string): Promise<ApiResponse<TenantResponse>> {
    return this.post<TenantResponse>(`/tenants/${id}/regenerate-code`)
  }

  /**
   * Get all members of a tenant
   */
  async getMembers(id: string): Promise<ApiResponse<MemberResponse[]>> {
    return this.get<MemberResponse[]>(`/tenants/${id}/members`)
  }

  /**
   * Invite a new member to the tenant via email
   */
  async inviteMember(tenantId: string, payload: InviteMemberRequest): Promise<ApiResponse<MemberResponse>> {
    return this.post<MemberResponse>(`/tenants/${tenantId}/members/invite`, payload)
  }

  /**
   * Update a member's role within the tenant
   */
  async updateMemberRole(
    tenantId: string,
    userId: string,
    payload: UpdateMemberRoleRequest,
  ): Promise<ApiResponse<MemberResponse>> {
    return this.put<MemberResponse>(`/tenants/${tenantId}/members/${userId}`, payload)
  }

  /**
   * Remove a member from the tenant
   */
  async removeMember(tenantId: string, userId: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/tenants/${tenantId}/members/${userId}`)
  }
}

export const tenantService = new TenantService()
