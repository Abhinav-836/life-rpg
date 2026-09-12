import { useQuery } from '@tanstack/react-query';
import * as progressionApi from '../services/progression.api.js';

export function useLevelCurve(fromLevel = 1, count = 10) {
  return useQuery({
    queryKey: ['levelCurve', fromLevel, count],
    queryFn: () => progressionApi.getLevelCurve(fromLevel, count),
  });
}
