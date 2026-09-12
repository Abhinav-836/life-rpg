import { useQuery } from '@tanstack/react-query';
import * as characterApi from '../services/character.api.js';

export function useCharacter() {
  return useQuery({ queryKey: ['character'], queryFn: characterApi.getCharacter });
}
