<template>
  <header class="login-header">
    <div class="shanghaiLogo">
      <img src="/logo.png" alt="" />
    </div>
    <div class="operations-container">
      <t-button theme="default" shape="square" variant="text" @click="navToHelper">
        <t-icon name="help-circle" class="icon" />
      </t-button>
    </div>
  </header>
</template>

<script setup lang="ts">
const navToHelper = () => {
  window.open('http://tdesign.tencent.com/starter/docs/get-started');
};
</script>

<style lang="less" scoped>
.login-header {
  padding: 0 var(--td-comp-paddingLR-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  color: var(--td-text-color-primary);
  height: var(--td-comp-size-xxxl);
  .shanghaiLogo {
    img {
      width: 178px;
    }
  }
  .logo {
    width: 178px;
    height: var(--td-comp-size-s);
  }

  .operations-container {
    display: flex;
    align-items: center;
    .t-button {
      margin-left: var(--td-comp-margin-l);
    }
  }
}
</style>
