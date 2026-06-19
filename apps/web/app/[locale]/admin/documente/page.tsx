import { AdminDocumentsClient } from '@/components/admin/AdminDocumentsClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Documente | Admin' };
export default function AdminDocumentsPage() { return <AdminDocumentsClient />; }
