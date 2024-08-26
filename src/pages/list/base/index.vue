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
        >
          <template #line="{ row }">
            <div v-if="row.line">
              <Tag theme="success" v-for="(line, index) in row.line.split('-')" :key="index">{{ line }}</Tag>
            </div>
            <Tag v-else>暂无线路</Tag>
          </template>
          <template #address="{ row }">
            <div v-if="row.address">
              <Tag style="margin-right: 8px; margin-bottom: 8px;" theme="success" v-for="(add, index) in row.address.split('-')" :key="index">{{ add }}</Tag>
            </div>
            <Tag v-else>暂无线路</Tag>
          </template>
          <template #sensitive="{ row }">
            <div v-if="row.sensitive">
              <Tag style="margin-right: 8px; margin-bottom: 8px;" theme="danger" v-for="(item, index) in row.sensitive.split('-')" :key="index">{{ item }}</Tag>
            </div>
            <Tag v-else>无敏感词</Tag>
          </template>
        </t-table>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import { EventSourcePolyfill } from 'event-source-polyfill';
import { MessagePlugin, PrimaryTableCol, RequestMethodResponse, UploadFile, Tag } from 'tdesign-vue-next';
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
  {
    title: '分类',
    colKey: 'tag',
    align: 'left',
  },
  {
    title: '线路',
    colKey: 'line',
    align: 'left',
  },
  {
    title: '站点',
    colKey: 'address',
    align: 'left',
  },
  {
    title: '敏感词',
    colKey: 'sensitive',
    align: 'left',
  }
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
  //EventSourcePolyfill是一个模拟SSE的库，连接到服务器的 /v1/audio/sse 端点，并设置请求头和心跳超时时间
  const source = new EventSourcePolyfill('http://localhost:8080/v1/audio/sse', {
    headers: {
      'x-token': accessToken,
    },
    heartbeatTimeout: 10 * 60 * 1000, // 10分钟心跳超时时间
  });
  // 添加一个事件监听器，用于监听并执行回调函数
  source.addEventListener('message', (e: any) => {
    //尝试解析从服务器接收到的数据
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
    MessagePlugin.error('检测失败，请检查网络连接');
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
