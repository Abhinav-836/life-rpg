import { useQuery } from '@tanstack/react-query';
import * as badgeApi from '../services/badge.api.js';

export function useBadges() {
  return useQuery({ queryKey: ['badges'], queryFn: badgeApi.listBadges });
}
