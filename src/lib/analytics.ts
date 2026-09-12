export type AnalyticsEvent =
  | { name: 'page_view'; properties: { path: string } }
  | { name: 'article_view'; properties: { article_slug: string } }
  | { name: 'tool_start'; properties: { tool: string } }
  | { name: 'tool_complete'; properties: { tool: string } }
  | {
      name: 'affiliate_click';
      properties: {
        article_slug: string;
        affiliate_provider: string;
        product: string;
        position: string;
        source: string;
      };
    };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Fire an analytics event via Cloudflare Web Analytics' dataLayer-style
 * queue. Swap the implementation here if a different analytics provider
 * is added later — call sites should not need to change.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: event.name, ...event.properties });
}

export interface AffiliateClickParams {
  articleSlug: string;
  affiliateProvider: string;
  product: string;
  position: string;
  source: string;
}

export function buildAffiliateClickEvent(params: AffiliateClickParams): AnalyticsEvent {
  return {
    name: 'affiliate_click',
    properties: {
      article_slug: params.articleSlug,
      affiliate_provider: params.affiliateProvider,
      product: params.product,
      position: params.position,
      source: params.source,
    },
  };
}
