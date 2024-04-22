<template>
  <div :class="`${prefix}-sidebar-layout`">
    <t-menu
      :class="`${prefix}-side-nav`"
      theme="light"
      :value="active"
      :collapsed="collapsed"
      :default-expanded="defaultExpanded"
    >
      <template #logo>
        <span :class="`${prefix}-side-nav-logo-wrapper`" @click="goHome">
          <img :src="getLogo()" alt="" />
        </span>
      </template>
      <menu-content :nav-data="menu" />
      <template #operations>
        <span class="version-container"> {{ !collapsed ? '上海地铁' : '' }} </span>
      </template>
    </t-menu>
    <div :class="`${prefix}-side-nav-placeholder${collapsed ? '-hidden' : ''}`"></div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, onMounted, toRefs } from 'vue';
import { useRouter } from 'vue-router';

import { prefix } from '@/config/global';
import { getActive } from '@/router';
import { getGlobalStore } from '@/store';
import type { MenuRoute } from '@/types/interface';

import MenuContent from './MenuContent.vue';

const MIN_POINT = 992 - 1;

const props = defineProps({
  menu: {
    type: Array as PropType<MenuRoute[]>,
    default: () => [],
  },
});
const { menu } = toRefs(props);
const globalStore = getGlobalStore();
const collapsed = computed(() => globalStore.collapsed);

const active = computed(() => getActive());

const defaultExpanded = computed(() => {
  const path = getActive();
  const parentPath = path.substring(0, path.lastIndexOf('/'));
  return [parentPath];
});

const router = useRouter();

const autoCollapsed = () => {
  globalStore.collapsed = window.innerWidth <= MIN_POINT;
};

const getLogo = () => {
  if (collapsed.value) {
    return '/assets-logo-full.svg';
  }
  return '/logo.png';
};

onMounted(() => {
  autoCollapsed();
  window.onresize = () => {
    autoCollapsed();
  };
});

const goHome = () => {
  router.push('/list/base');
};
</script>

<style lang="less" scoped>
.detect-audio-side-nav-logo-wrapper {
  height: 80%;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
