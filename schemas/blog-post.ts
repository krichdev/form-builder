import { z } from 'zod';
import { LEAGUES } from '@/lib/constants';

/*
Use this email zod schema to add to the blogPostSchema below to see how the
form builder adjusts to different fields that are added.

email: z.string({ required_error: 'Email is required', description: 'Enter your email address' }).email({ message: "Invalid email address",  }),
*/

export const blogPostSchema = z.object({
  title: z.string({ required_error: 'Title is required', description: 'Enter a post title' }),
  slug: z.string({ required_error: 'Slug is required', description: 'Enter a unique slug for this post' }),
  publishDate: z.coerce.date({ required_error: 'Publish date is required'}),
  topic: z.enum(LEAGUES, { required_error: 'Topic is required', description: 'Select a topic for this post' }),
  featured: z.boolean({description: 'Will this post be featured?'}).optional(),
});