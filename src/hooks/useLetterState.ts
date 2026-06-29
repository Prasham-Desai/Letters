'use client';
import { useLocalStorage } from './useLocalStorage';

export type LetterLocation = 'mailbox' | 'desk' | 'collection';

export function useLetterState(allLetterIds: string[]) {
  const [locations, setLocations] = useLocalStorage<Record<string, LetterLocation>>(
    'wnym-locations-v2', {}
  );

  const getLocation = (id: string): LetterLocation => locations[id] ?? 'mailbox';

  const mailboxIds  = allLetterIds.filter(id => getLocation(id) === 'mailbox');
  const deskIds     = allLetterIds.filter(id => getLocation(id) === 'desk');
  const collectionIds = allLetterIds.filter(id => getLocation(id) === 'collection');

  const dropToDesk = (ids: string[]) => {
    const next = { ...locations };
    ids.forEach(id => { next[id] = 'desk'; });
    setLocations(next);
  };

  const moveToCollection = (id: string) => {
    setLocations({ ...locations, [id]: 'collection' });
  };

  const resetLetters = () => {
    setLocations({});
  };

  return {
    getLocation,
    mailboxIds,
    deskIds,
    collectionIds,
    dropToDesk,
    moveToCollection,
    resetLetters,
  };
}
