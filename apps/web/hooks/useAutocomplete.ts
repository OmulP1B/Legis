import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useDebounce } from './useDebounce';

export function useAutocomplete(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['autocomplete', debouncedQuery],
    queryFn: () => apiClient.get('/search/suggest', { params: { q: debouncedQuery } }).then(r => r.data as string[]),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60_000,
  });
}
