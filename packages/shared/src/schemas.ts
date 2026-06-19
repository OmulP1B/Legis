import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalid'),
  password: z.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Numele este prea scurt').max(100),
  email: z.string().email('Email invalid'),
  password: z.string().min(8, 'Parola trebuie să aibă cel puțin 8 caractere'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Parolele nu coincid', path: ['confirmPassword'],
});

export const createDocumentSchema = z.object({
  titleRo: z.string().min(5, 'Titlul este prea scurt'),
  titleRu: z.string().optional(),
  bodyRo: z.string().min(10, 'Conținutul este prea scurt'),
  bodyRu: z.string().optional(),
  number: z.string().min(1, 'Numărul este obligatoriu'),
  typeId: z.number().int().positive(),
  emitentId: z.number().int().positive(),
  dateIssued: z.string().min(1, 'Data emiterii este obligatorie'),
  datePublished: z.string().optional(),
  moNumber: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
