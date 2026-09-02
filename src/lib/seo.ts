export const SITE_NAME = 'Puppy Starter Guide';
export const SITE_TAGLINE = 'Practical guides, checklists and tools for first-time puppy owners.';
export const DEFAULT_OG_IMAGE = '/images/og-default.jpg';

export interface SeoProps {
  title: string;
  description: string;
  canonicalUrl: URL;
  ogImage?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

export function pageTitle(title: string): string {
  return title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
}
