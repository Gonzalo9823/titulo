import { Collection, Loaded, LoadedCollection } from '@mikro-orm/core';

export const isCollectionInitialized = <T extends object, TU extends string>(
  collection: Collection<T, object> | (Collection<T, object> & LoadedCollection<Loaded<T, TU>>)
): collection is Collection<T, object> & LoadedCollection<Loaded<T, TU>> => {
  return collection.isInitialized();
};
