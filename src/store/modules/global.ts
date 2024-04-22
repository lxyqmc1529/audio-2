import { defineStore } from 'pinia';

import { store } from '@/store';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    collapsed: false,
  }),
});

export function getGlobalStore() {
  return useGlobalStore(store);
}
