import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildAffiliateClickEvent, trackEvent } from './analytics';

describe('buildAffiliateClickEvent', () => {
  it('maps affiliate CTA context to an affiliate_click analytics event', () => {
    const event = buildAffiliateClickEvent({
      articleSlug: 'first-week-with-a-puppy',
      affiliateProvider: 'example-partner',
      product: 'puppyTrainingCourse',
      position: 'mid-article',
      source: 'guide-body',
    });

    expect(event).toEqual({
      name: 'affiliate_click',
      properties: {
        article_slug: 'first-week-with-a-puppy',
        affiliate_provider: 'example-partner',
        product: 'puppyTrainingCourse',
        position: 'mid-article',
        source: 'guide-body',
      },
    });
  });
});

describe('trackEvent', () => {
  beforeEach(() => {
    (globalThis as { window?: { dataLayer?: unknown[] } }).window = {};
  });

  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it('pushes the event name and properties onto window.dataLayer', () => {
    trackEvent({ name: 'article_view', properties: { article_slug: 'puppy-daily-routine' } });

    expect(window.dataLayer).toEqual([{ event: 'article_view', article_slug: 'puppy-daily-routine' }]);
  });

  it('appends to an existing dataLayer instead of replacing it', () => {
    window.dataLayer = [{ event: 'page_view' }];

    trackEvent({
      name: 'affiliate_click',
      properties: {
        article_slug: 'puppy-daily-routine',
        affiliate_provider: 'example-partner',
        product: 'puppyTrainingCourse',
        position: 'mid-article',
        source: 'guide-body',
      },
    });

    expect(window.dataLayer).toEqual([
      { event: 'page_view' },
      {
        event: 'affiliate_click',
        article_slug: 'puppy-daily-routine',
        affiliate_provider: 'example-partner',
        product: 'puppyTrainingCourse',
        position: 'mid-article',
        source: 'guide-body',
      },
    ]);
  });
});
