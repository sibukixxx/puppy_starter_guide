import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Puppy Starter Guide'),
    featuredImage: z.string().optional(),
    pinterestImage: z.string().optional(),
    pinterestTitle: z.string().optional(),
    pinterestDescription: z.string().optional(),
    affiliate: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { guides };
