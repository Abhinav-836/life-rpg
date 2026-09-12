import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as rewardApi from '../services/reward.api.js';

export function useRewards() {
  return useQuery({ queryKey: ['rewards'], queryFn: rewardApi.listRewards });
}

export function useRedeemReward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rewardApi.redeemReward,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['character'] });
      qc.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
