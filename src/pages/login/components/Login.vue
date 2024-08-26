<template>
  <t-form
    ref="form"
    :class="['item-container']"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="username">
      <t-input v-model="formData.username" size="large" placeholder="请输入用户名">
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="password">
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        placeholder="请输入密码"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <!-- <t-form-item name="captcha" class="captcha-code-form">
      <t-input v-model="formData.captcha" size="large" placeholder="请输入验证码"></t-input>
      <div class="captcha-url" @click="loadCaptchaUrl">
        <img :src="captchaUrl" alt="" />
      </div>
    </t-form-item> -->

    <div class="check-container remember-pwd" >
      <t-checkbox>{{ '记住密码' }}</t-checkbox>
      <span class="tip">{{ '忘记密码？' }}</span>
    </div>
    <t-form-item class="btn-container">
      <t-button block size="large" type="submit"> {{ '登录' }} </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import type { FormInstanceFunctions, FormRule, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// import { getCaptcha } from '@/api/user';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const INITIAL_DATA = {
  username: '',
  password: '',
  // captcha: '',
  checked: false,
};

const FORM_RULES: Record<string, FormRule[]> = {
  username: [{ required: true, message: '账户登录需要输入账号', type: 'error' }],
  password: [{ required: true, message: '账户登录需要输入密码', type: 'error' }],
  // captcha: [{ required: true, message: '请输入验证码', type: 'error' }],
};

const form = ref<FormInstanceFunctions>();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);
// const captchaUrl = ref('');

const router = useRouter();
const route = useRoute();

const onSubmit = async (ctx: SubmitContext) => {
  if (ctx.validateResult === true) {
    try {
      await userStore.login({
        username: formData.value.username,
        password: formData.value.password,
        // captcha: formData.value.captcha,
      });

      MessagePlugin.success('登录成功');
      const redirect = route.query.redirect as string;
      const redirectUrl = redirect ? decodeURIComponent(redirect) : '/list';
      router.push(redirectUrl);
    } catch (e) {
      MessagePlugin.error(e.message);
    }
  }
};
// const loadCaptchaUrl = async () => {
//   try {
//     const res = await getCaptcha();
//     captchaUrl.value = res.imgUrl;
//   } catch (err) {
//     MessagePlugin.error(err.message);
//   }
// };
// onBeforeMount(loadCaptchaUrl);
</script>

<style lang="less" scoped>
@import '../index.less';

::v-deep(.captcha-code-form .t-form__controls-content) {
  display: flex;
  .captcha-url {
    width: 120px;
    flex: none;
    height: 40px;
    margin-left: 12px;
    border: 1px solid var(--td-gray-color-4);
    border-radius: var(--td-radius-default);
    cursor: pointer;
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
