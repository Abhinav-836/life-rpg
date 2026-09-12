import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as profileApi from '../services/profile.api.js';

export function useProfile() {
  return useQuery({ queryKey: ['profile'], queryFn: profileApi.getProfile });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: profileApi.changePassword });
}
