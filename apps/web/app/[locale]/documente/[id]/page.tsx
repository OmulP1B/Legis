import { PublicLayout } from '@/components/layout/PublicLayout';
import { DocumentDetailClient } from '@/components/document/DocumentDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props { params: { id: string; locale: string } }

// ISR: regenerate every hour
export const revalidate = 3600;

async function getDocument(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/documents/${id}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getDocument(params.id);
  if (!data?.data) return { title: 'Document' };
  const doc = data.data;
  return {
    title: doc.titleRo ?? doc.title,
    description: `${doc.type} nr. ${doc.number}, emis de ${doc.emitent} la ${doc.dateIssued}`,
    openGraph: { title: doc.titleRo, description: `Document legislativ - ${doc.type}`, type: 'article' },
  };
}

export default async function DocumentPage({ params }: Props) {
  const data = await getDocument(params.id);
  if (!data?.data) notFound();

  return (
    <PublicLayout>
      <DocumentDetailClient doc={data.data} />
    </PublicLayout>
  );
}
