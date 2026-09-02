export interface AffiliateLink {
  url: string;
  provider: string;
  campaign: string;
}

/**
 * Central registry of affiliate offers. Never hardcode affiliate URLs
 * directly in article content — reference a key from this object and
 * build the outbound link with `buildAffiliateUrl` so tracking params
 * and provider swaps stay in one place.
 */
export const affiliateLinks: Record<string, AffiliateLink> = {
  puppyTrainingCourse: {
    url: 'https://example.com/puppy-training-course',
    provider: 'example-partner',
    campaign: 'puppy-training-course',
  },
};

export function buildAffiliateUrl(
  linkKey: keyof typeof affiliateLinks,
  trackingId: string,
): string {
  const link = affiliateLinks[linkKey];
  const url = new URL(link.url);
  url.searchParams.set('tid', trackingId);
  return url.toString();
}
