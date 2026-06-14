/**
 * Widget Settings Service
 *
 * Handles widget settings API calls: retrieval and update
 * of the embeddable chat widget configuration.
 *
 * @see docs/swagger.yml — Widget Settings endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse } from '~~/shared/types/api'
import type {
  WidgetSettingsResponse,
  UpdateWidgetSettingsRequest,
} from '~~/shared/types/widget-settings'

export class WidgetSettingsService extends DashboardApiService {
  /**
   * Get the current widget settings for the active tenant
   */
  async getSettings(): Promise<ApiResponse<WidgetSettingsResponse>> {
    return this.get<WidgetSettingsResponse>('/widget-settings')
  }

  /**
   * Update widget settings for the active tenant
   */
  async updateSettings(payload: UpdateWidgetSettingsRequest): Promise<ApiResponse<WidgetSettingsResponse>> {
    return this.put<WidgetSettingsResponse>('/widget-settings', payload)
  }
}

export const widgetSettingsService = new WidgetSettingsService()
