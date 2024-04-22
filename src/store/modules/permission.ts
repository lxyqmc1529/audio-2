import { defineStore } from 'pinia';

import { homepageRouterList } from '@/router';
import { store } from '@/store';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [],
    removeRoutes: [],
  }),
  actions: {
    async initRoutes() {
      // 在菜单展示全部路由
      this.routers = [...homepageRouterList];
    },
  },
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
