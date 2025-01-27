import React, { useState } from 'react';
import { z } from 'zod';
import { formatFieldName, generateSlug, unwrapFieldType } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns"
import { Switch } from '@/components/ui/switch';

type FieldProps = {
  name: string;
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
  optional: boolean;
};

const buildForm = (schema: z.ZodObject<Record<string, z.ZodTypeAny>>) => {
  return function FormComponent({ onSubmit }: { onSubmit: (values: z.infer<typeof schema>) => void }) {
    const [formData, setFormData] = useState<z.infer<typeof schema>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fields: FieldProps[] = Object.entries(schema.shape).map(([key, value]) => ({
      name: key,
      label: value._def.label || key,
      type: unwrapFieldType(value),
      options: 'values' in value._def ? value._def.values : undefined,
      placeholder: value._def.description || undefined,
      optional: value.isOptional(),
    }));

    const handleChange = (name: string, value: string | boolean | Date) => {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        if (name === 'title') {
          newData.slug = generateSlug(value as string);
        }
        if (value instanceof Date) {
          newData[name] = format(value, 'yyyy-MM-dd');
        }
        return newData;
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const result = schema.safeParse(formData);
      if (result.success) {
        setErrors({});
        onSubmit(result.data);
        setFormData({});
      } else {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          newErrors[issue.path[0]] = issue.message;
        });
        setErrors(newErrors);
      }
    };

    const renderField = (field: FieldProps) => {
      switch (field.type) {
        case 'ZodString':
          if (field.name === 'slug') {
            return (
              <Input
                type="text"
                name={field.name}
                data-errors={errors[field.name]}
                className="data-[errors]:border-red-500"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder={field.placeholder}
              />
            );
          }
          return (
            <Input
              type="text"
              data-errors={errors[field.name]}
              className="data-[errors]:border-red-500"
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          );
        case 'ZodBoolean':
          return (
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
              <span>{field.placeholder}</span>
              <Switch
                name={field.name}
                checked={formData[field.name] || false}
                onCheckedChange={(checked) => handleChange(field.name, checked)}
              />
            </div>
          );
        case 'ZodEnum':
          return (
            <Select
              onValueChange={(value) => handleChange(field.name, value)}
              value={formData[field.name] || ''}
            >
              <SelectTrigger
                data-errors={errors[field.name]}
                className="data-[errors]:border-red-500"
              >
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case 'ZodDate':
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  data-errors={errors[field.name]}
                  className="justify-start text-left font-normal data-[errors]:border-red-500"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData[field.name] ?? <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  disabled={{ before: new Date() }}
                  selected={formData[field.name]}
                  onSelect={(date) => handleChange(field.name, date!)}
                  // onSelect={(date) => console.log(typeof new Date(date!))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )
        default:
          return (
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.label}
            />
          );
      }
    };

    return (
      <form onSubmit={handleSubmit} className="gap-4 flex flex-col">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <Label className="text-xs font-bold italic" htmlFor={field.name}>{formatFieldName(field.label)} {!field.optional && <span className="text-red-500">*</span>}</Label>
            {renderField(field)}
            {errors[field.name] && <p className='text-red-500 text-xs'>{errors[field.name]}</p>}
          </div>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    );
  };
};

export default buildForm;