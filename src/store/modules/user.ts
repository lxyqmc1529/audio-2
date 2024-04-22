import { defineStore } from 'pinia';

import { LoginInfo, UserInfo } from '@/api/model';
import { getUserInfo, login } from '@/api/user';
import { ACCESS_TOKEN_KEY } from '@/constants';
import { usePermissionStore } from '@/store';

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      token: localStorage.getItem(ACCESS_TOKEN_KEY), // 默认token不走权限
      userInfo: null,
    } as {
      token: string;
      userInfo: UserInfo | null;
    }),
  getters: {
    roles: (state) => {
      return state.userInfo?.role;
    },
  },
  actions: {
    async login(userInfo: LoginInfo) {
      const res = await login(userInfo);
      this.token = res.token;
      localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
    },
    async getUserInfo() {
      this.userInfo = await getUserInfo();
    },
    async logout() {
      this.token = '';
      this.userInfo = null;
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: ['token'],
  },
});
