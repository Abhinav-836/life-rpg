import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../services/task.api.js';

export function useQuests() {
  return useQuery({ queryKey: ['quests'], queryFn: taskApi.listQuests });
}

export function useCreateQuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskApi.createQuest,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quests'] }),
  });
}

export function useUpdateQuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => taskApi.updateQuest(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quests'] }),
  });
}

export function useDeleteQuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskApi.deleteQuest,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quests'] }),
  });
}

export function useCompleteQuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskApi.completeQuest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['quests'] });
      qc.invalidateQueries({ queryKey: ['character'] });
      qc.invalidateQueries({ queryKey: ['streak'] });
      qc.invalidateQueries({ queryKey: ['badges'] });
    },
  });
}
