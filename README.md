# Schema Form Builder

## Idea

Almost every app or website will have forms, newsletter signups, a blog post editor, bug ticket creation, and many more. This led me to the idea of creating a `Form Builder` that would be schema driven, and easily reused and consumed by dev teams. This is not a new idea and there are tools that already do this, such as [React JSON Schema Form](https://rjsf-team.github.io/react-jsonschema-form/). However, I wanted to build something for myself that would leverage Zod for schema validation and Shadcn for components.

To start, create the form's schema. IE: `@/schemas/newsletter-schema.ts`

```typescript
import { z } from 'zod';
import { LEAGUES } from '@/lib/constants';

export const newsletterSchema = z.object({
  name: z.string({ required_error: 'Name is required', description: 'Enter your name' }),
  email: z.string().email({ message: "Invalid email address", required_error: 'Email address is required', description: 'Enter your email address' }),
  birthDate: z.coerce.date({ required_error: 'Birth date is required'}),
  favoriteLeague: z.enum(LEAGUES, { required_error: 'Favorite League is required', description: 'Select a favorite league' }),
});

```

Within the schema, the developer is allowed to add config for error messaging, descriptions, and there is more that could be extend apon.

The heavy lifting will now be done in `@/lib/buildForm.tsx` which will recieve the schema and will generate the specific input fields, which utilizes a Shadcn component, based on the specific ZodType of that field.

The goal is to create a great developer experience and consistency across the team while building forms.

## Screen Walk Through

https://github.com/user-attachments/assets/e8e9cbf7-d3dc-4c7d-af1c-a8fd260049e8


## Tech Used

- [Next.js](https://nextjs.org) for React framework. Admittedly overkill for this project, originally had ideas of utilizing the API routes to mock server side validation as well.
- [Tailwind CSS](https://tailwindcss.com/docs/installation) for styling. Quickly compose utility classes to add styles and responsivness for the form.
- [Shadcn UI](https://ui.shadcn.com/docs) for UI components. Not a typical component library that is imported, these are copied to your project via a CLI tool and allows you to fully customize as you need.
- [Zod](https://zod.dev/?id=introduction) for schema validation.

## Running Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
