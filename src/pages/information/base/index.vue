<template>
  <editShow v-model:visible="showChild" :audio="editAudio" @save="confirmEditrAudioHandler" />

  <div class="t-table-demo__editable-row audio-detect-table-wrap">
    <t-table
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :data="dataSource"
      table-layout="fixed"
      bordered
      lazy-load
      :pagination="{
        current: page,
        pageSize: limit,
        total: total,
      }"
      :loading="loading"
      @page-change="reloadAudioData"
    />
  </div>
</template>

<script setup lang="tsx">
import dayjs from 'dayjs';
import { MessagePlugin, PageInfo, PrimaryTableCol,Input, Select, Textarea } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import { getAllDetect } from '@/api/audio';
import { AudioInfo, AudioStatus } from '@/api/model';
import editShow from '@/components/editShow.vue';

const dataSource = ref<AudioInfo[]>([]);
const page = ref(1);
const limit = ref(5);
const total = ref(0);
const loading = ref(false);
const mockData = {
  'class1': '车站规范',
  'class2': '地铁运行',
  'class3': '设施故障',
}
const loadAudioDetact = async () => {
  loading.value = true;
  try {
    const res = await getAllDetect(page.value, limit.value);
    total.value = res.total;
    dataSource.value = res.data;
  } catch (err) {
    MessagePlugin.error(err.message);
  }
  loading.value = false;
};

const reloadAudioData = (pageInfo: PageInfo) => {
  page.value = pageInfo.current;
  loadAudioDetact();
};

onMounted(loadAudioDetact);

const showChild = ref(false);
const tableRef = ref();
const align = ref('left');
const editAudio = ref<AudioInfo | null>(null);

const onEdit = (row: AudioInfo) => {
  // editAudio.value = row;
  // showChild.value = true;
  alert('可编辑分类')
};
const onSave = (row: AudioInfo) => {
  alert('保存成功')
};
const confirmEditrAudioHandler = ({ id, editData }: { id: string; editData: any }) => {
  const audio = dataSource.value.find((item) => item.id === id);
  if (audio) {
    Object.assign(audio, editData);
  }
};

const columns = computed<PrimaryTableCol[]>(() => [
  {
    title: '语音文件名称',
    colKey: 'filename',
    align: align.value,
    width: 120,
    fixed: 'left'
  },
  {
    title: '识别文本',
    colKey: 'letters',
    cell: (_h, { row }) => row.result,
    align: align.value,
    width: 400,
  },
  {
    title: '分类1',
    colKey: 'status',
    width: 120,
    cell: (_h, { row }) => <Input v-model={mockData.class1} />
  }, {
    title: '分类2',
    colKey: 'status',
    width: 120,
    cell: (_h, { row }) => <Input v-model={mockData.class2} />
  }, {
    title: '分类3',
    colKey: 'status',
    width: 120,
    cell: (_h, { row }) => <Input v-model={mockData.class3} />
  },
  {
    title: '创建日期',
    colKey: 'createdAt',
    className: 't-demo-col__datepicker',
    width: 200,
    cell: (_h, { row }) => <div>{dayjs(row.createdAt).format('YYYY-MM-DD hh:mm:ss')}</div>,
  },
  {
    title: '操作栏',
    colKey: 'operate',
    width: 150,
    fixed: 'right',
    cell: (_h, { row }) => {
      return (
        <div class="table-operations">
          <t-link theme="primary" hover="color" data-id={row.key} onClick={() => onEdit(row)}>
            编辑
          </t-link>
          <div class="table-operations__line"></div>
          <t-link theme="primary" hover="color" data-id={row.key} onClick={() => onSave(row)}>
            保存
          </t-link>
        </div>
      );
    },
  },
]);
</script>

<style lang="less" scoped>
.t-table-demo__editable-row .table-operations > .t-link {
  margin-right: 8px;
}
.t-table-demo__editable-row .t-demo-col__datepicker .t-date-picker {
  width: 120px;
}
.audio-detect-table-wrap {
  padding: 40px;
  box-sizing: border-box;
  background: white;
}
</style>
