import { AdminDashboard } from '@/components/admin/AdminDashboard';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Panou principal | Admin' };
export default function AdminPage() { return <AdminDashboard />; }
