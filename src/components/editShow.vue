<template>
  <t-dialog
    v-model:visible="visible"
    header="编辑语音识别结果"
    width="70vw"
    top="120px"
    @cancel="backEdit"
    @confirm="backSave"
  >
    <div class="editContent">
      <div class="title">请在以下区域修改识别文本，并在修改完成后保存</div>
      <div class="audioPlay">
        <audio :src="audioUrl" controls></audio>
      </div>
      <t-form ref="formIns" :class="['item-container']" :data="editData" label-width="0">
        <t-form-item name="result">
          <t-textarea v-model="editData.result" :autofocus="true" :autosize="true" />
        </t-form-item>
      </t-form>
    </div>
  </t-dialog>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core';
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, reactive, ref, watchEffect } from 'vue';

import { updateAudio } from '@/api/audio';
import { AudioInfo } from '@/api/model';
import { BASE_SERVER_HOST } from '@/constants';

const props = defineProps<{
  visible: boolean;
  audio: AudioInfo;
}>();
const emit = defineEmits(['update:visible', 'save']);
const visible = useVModel(props, 'visible', emit);
const editData = reactive({
  result: '',
});
const formIns = ref();
const audioUrl = computed(() => `${BASE_SERVER_HOST}${props.audio?.fileKey}`);

watchEffect(() => {
  if (visible.value) {
    editData.result = props.audio.result;
  }
});
const backSave = async () => {
  try {
    await updateAudio(props.audio.id, editData);
    emit('save', { id: props.audio.id, editData });
    visible.value = false;
  } catch (err) {
    MessagePlugin.error(err.message);
  }
};
const backEdit = () => {
  visible.value = false;
};
</script>

<style lang="less" scoped>
.editContent {
  padding: 16px;
  flex: 1;
  height: 600px;
  z-index: 1000;
  background-color: white;
  .title {
    font-size: 17;
    line-height: 24px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
  }
  .audioPlay {
    margin: 16px 0;
  }
}
</style>
