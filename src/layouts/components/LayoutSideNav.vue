<template>
  <l-side-nav :menu="menuRouters" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { usePermissionStore } from '@/store';

import LSideNav from './SideNav.vue';

const permissionStore = usePermissionStore();
const { routers: menuRouters } = storeToRefs(permissionStore);
</script>
