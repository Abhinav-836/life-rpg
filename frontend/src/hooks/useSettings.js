import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as settingsApi from '../services/settings.api.js';

export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: settingsApi.getSettings });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}
