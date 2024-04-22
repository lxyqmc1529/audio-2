<template>
  <router-view :class="['light']" />
</template>

<style lang="less" scoped>
#nprogress .bar {
  background: var(--td-brand-color) !important;
}
</style>
