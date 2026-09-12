import { useQuery } from '@tanstack/react-query';
import * as streakApi from '../services/streak.api.js';

export function useStreak() {
  return useQuery({ queryKey: ['streak'], queryFn: streakApi.getStreak });
}
