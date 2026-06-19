import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useDocument(id: number | string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => apiClient.get(`/documents/${id}`).then(r => r.data),
    enabled: !!id,
    staleTime: 300_000,
  });
}
