<template>
  <t-layout :class="`${prefix}-layout`">
    <t-content :class="`${prefix}-content-layout`">
      <l-breadcrumb />
      <l-content />
    </t-content>
    <t-footer :class="`${prefix}-footer-layout`">
      <l-footer />
    </t-footer>
  </t-layout>
</template>

<script setup lang="ts">
import { prefix } from '@/config/global';

import LBreadcrumb from './Breadcrumb.vue';
import LContent from './Content.vue';
import LFooter from './Footer.vue';
</script>
