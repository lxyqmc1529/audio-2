<template>
  <div class="login-wrapper">
    <login-header />

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">{{ '欢迎使用' }}</h1>
        <h1 class="title">上海地铁乘客智能交互与信息分类系统</h1>
        <div class="sub-title">
          <p class="tip">{{ type == 'register' ? '已有账户？' : '没有账户？' }}</p>
          <p class="tip" @click="switchType(type == 'register' ? 'login' : 'register')">
            {{ type == 'register' ? '去登陆' : '去注册' }}
          </p>
        </div>
      </div>

      <login v-if="type === 'login'" />
      <register v-else @register-success="switchType('login')" />
    </div>

    <footer class="copyright">Copyright @ 2023 All Rights Reserved</footer>
  </div>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="ts">
import { ref } from 'vue';

import LoginHeader from './components/Header.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

const type = ref('login');
const switchType = (val: string) => {
  type.value = val;
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
