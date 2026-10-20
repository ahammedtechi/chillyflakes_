import { apiClient, type ApiResponse } from './client';

export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
}

/**
 * Django Newsletter API Service
 * Maps to Django endpoint:
 * - POST /api/newsletter/subscribe/
 */
export const newsletterApi = {
  /**
   * Subscribe email to Django newsletter mailing list.
   */
  async subscribe(email: string): Promise<ApiResponse<NewsletterSubscribeResponse>> {
    const fallback: NewsletterSubscribeResponse = {
      success: true,
      message: 'Subscribed to the Chilly Flakes journal successfully.',
    };

    return apiClient.post<NewsletterSubscribeResponse>(
      'newsletter/subscribe/',
      { email },
      fallback
    );
  },
};
