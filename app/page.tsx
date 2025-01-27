'use client';
import { blogPostSchema } from '@/schemas/blog-post';
import buildForm from '@/lib/buildForm';
import { toast } from 'sonner';

export default function Home() {
  const Form = buildForm(blogPostSchema);
  const handleSubmit = (values: unknown) => {
    toast.success("Form submitted with values: " + JSON.stringify(values));
  };

  return (
    <div className="w-full max-w-[600px] p-8 font-mono">
      <h1 className="text-3xl mb-6">Schema Form Builder</h1>
      <Form onSubmit={handleSubmit} />
    </div>
  );
}
