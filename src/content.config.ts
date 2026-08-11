import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    url: z.string(),
    silo: z.string(),
    siloName: z.string(),
    kind: z.enum(['article', 'hub']),
    ogImage: z.string().optional(),
    noindex: z.boolean().optional(),
    datePublished: z.string().optional(),
    dateModified: z.string().optional(),
  }),
});

export const collections = { articles };
