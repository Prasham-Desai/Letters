'use client';
import { useLocalStorage } from './useLocalStorage';

export type LetterLocation = 'mailbox' | 'desk' | 'collection';

export function useLetterState(allLetterIds: string[]) {
  const [locations, setLocations] = useLocalStorage<Record<string, LetterLocation>>(
    'wnym-locations-v4', {}
  );

  const deskIdsUncapped = allLetterIds.filter(id => locations[id] === 'desk');
  const validDeskIds = new Set(deskIdsUncapped.slice(0, 5));

  const getLocation = (id: string): LetterLocation => {
    const loc = locations[id] ?? 'mailbox';
    // If there are more than 5 letters on the desk from old localStorage, push overflow back to mailbox
    if (loc === 'desk' && !validDeskIds.has(id)) return 'mailbox';
    return loc;
  };

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
