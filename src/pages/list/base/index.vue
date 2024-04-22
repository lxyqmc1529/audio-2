<template>
  <div class="audio-detect-page">
    <t-space direction="vertical">
      <t-upload
        v-model="files"
        placeholder="支持批量上传文件，文件格式应为音频格式，文件名不可重复,若文件数量过多，上传可能需要较长时间，请耐心等待"
        theme="file-flow"
        multiple
        :auto-upload="false"
        :max="5"
        :show-upload-progress="false"
        :allow-upload-duplicate-file="false"
        :is-batch-upload="false"
        :upload-all-files-in-one-request="false"
        accept="audio/*"
        :request-method="audioUpload"
      ></t-upload>
    </t-space>
    <template v-if="fileIds.length">
      <t-divider>音频检测</t-divider>
      <div class="audio-detect-operator-wrapper">
        <t-button @click="startDetect">开始检测</t-button>
        <loading v-if="detecting" />
      </div>
      <div v-if="detectResults.length" class="detect-result-content">
        <t-table
          row-key="index"
          :data="detectResults"
          :foot-data="null"
          :columns="columns"
          bordered
          lazy-load
        ></t-table>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import { EventSourcePolyfill } from 'event-source-polyfill';
import type { PrimaryTableCol, RequestMethodResponse, UploadFile } from 'tdesign-vue-next';
import { computed, ref } from 'vue';

import { detectAudio, uploadAudio } from '@/api/audio';
import { AudioInfo } from '@/api/model';
import Loading from '@/components/loading.vue';
import { ACCESS_TOKEN_KEY } from '@/constants';
import { parseJSONWithCatch } from '@/utils/tools';

const files = ref([]);
const detectResults = ref<(AudioInfo & { name: string })[]>([]);
const detecting = ref(false);
const fileIds = computed(() => files.value.map((item) => item.id).filter(Boolean));

const columns: PrimaryTableCol[] = [
  {
    title: '文件名',
    colKey: 'filename',
    align: 'left',
    width: 150,
  },
  {
    colKey: 'fileKey',
    title: '识别文件key',
    align: 'left',
    width: 150,
  },
  {
    title: '识别文本',
    colKey: 'result',
    align: 'left',
  },
];

const audioUpload = async (files: UploadFile[]): Promise<RequestMethodResponse> => {
  const formData = new FormData();
  const uploadFile = files[0];
  formData.append('audio', uploadFile.raw);
  try {
    const res = await uploadAudio(formData);
    return {
      status: 'success',
      response: {
        files: files.map((file, index) => {
          file.id = res[index].id;
          file.url = res[index].fileKey;
          file.status = 'success';
          return file;
        }),
      },
    };
  } catch (err) {
    return { status: 'fail', error: '上传失败', response: err };
  }
};
const startDetect = async () => {
  if (!fileIds.value.length) {
    return;
  }
  console.log('开始执行sse连接检测');
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const source = new EventSourcePolyfill('http://localhost:8080/v1/audio/sse', {
    headers: {
      'x-token': accessToken,
    },
  });
  source.addEventListener('message', (e: any) => {
    const data = parseJSONWithCatch(e.data);
    if (!data) {
      return;
    }
    const { audioInfo, done } = data;
    detectResults.value.push(audioInfo);
    if (done) {
      source.close();
      detecting.value = false;
    }
  });
  source.addEventListener('error', () => {
    source.close();
    detecting.value = false;
  });
  try {
    detecting.value = true;
    await detectAudio({ ids: fileIds.value });
  } catch (err) {
    source.close();
    detecting.value = false;
  }
};
</script>

<style lang="less" scoped>
.audio-detect-page {
  background-color: white;
  padding: 40px;
  width: 100%;
  height: 100%;
  overflow: auto;
  .detect-result-content {
    width: 100%;
    margin-top: 24px;
  }
}
.audio-detect-operator-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
