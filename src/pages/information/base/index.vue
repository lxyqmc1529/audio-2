<template>
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
    >
      <template #class1="{ row }">
        <Tag v-if="row.id !== editId">{{row.class1 || '暂无分类'}}</Tag>
        <Select v-else v-model="editClassfiy[0]">
          <Option v-for="(item, index) of firstClassifyOptions" :key="index" :value="item">{{ item }}</Option>
        </Select>
      </template>
      <template #class2="{ row }">
        <Tag v-if="row.id !== editId">{{row.class2 || '暂无分类'}}</Tag>
        <Select v-else v-model="editClassfiy[1]">
          <Option v-for="(item, index) of (secondClassifyOptionsMap[editClassfiy[0]] || [])" :key="index" :value="item">{{ item }}</Option>
        </Select>
      </template>
      <template #class3="{ row }">
        <Tag v-if="row.id !== editId">{{row.class3 || '暂无分类'}}</Tag>
        <Select v-else v-model="editClassfiy[2]">
          <Option v-for="(item, index) of (thirdClassifyOptionsMap[editClassfiy[1]] || [])" :key="index" :value="item">{{ item }}</Option>
        </Select>
      </template>
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
        <Tag v-else>暂无站点</Tag>
      </template>
      <template #sensitive="{ row }">
        <div v-if="row.sensitive">
          <Tag style="margin-right: 8px; margin-bottom: 8px;" theme="danger" v-for="(item, index) in row.sensitive.split('-')" :key="index">{{ item }}</Tag>
        </div>
        <Tag v-else>无敏感信息</Tag>
      </template>
      <template #createdAt="{ row }">
        <div>{{ dayjs(row.createdAt).format('YYYY-MM-DD hh:mm:ss') }}</div>
      </template>
      <template #operation="{ row }">
        <div class="table-operations">
          <t-link theme="primary" hover="color" :data-id="row.key" @click="onHandleEdit(row)">
            {{ row.id === editId ? '保存' : '编辑' }}
          </t-link>
        </div>
      </template>
    </t-table>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { MessagePlugin, PageInfo, Select, Tag, Option } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';
import { listDetect, updateAudio } from '@/api/audio';
import { AudioInfo } from '@/api/model';
import { firstClassifyOptions, secondClassifyOptionsMap, thirdClassifyOptionsMap } from './Casecader'

const dataSource = ref<AudioInfo[]>([]);
const page = ref(1);
const limit = ref(5);
const total = ref(0);
const loading = ref(false);
const loadAudioDetact = async () => {
  loading.value = true;
  try {
    const res = await listDetect(page.value, limit.value);
    total.value = res.total;
    dataSource.value = res.data.map(item => {
      const { tag } = item;
      const [class1, class2, class3] = tag?.split('-') || [];
      return {
        ...item,
        class1,
        class2,
        class3
      }
    })
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

const tableRef = ref();
const editClassfiy = ref<string[]>([]);
const editId = ref('');

const onSave = async (row: AudioInfo) => {
  const tags = editClassfiy.value.filter(Boolean);
  if (tags.some(item => /\-/g.test(item))) {
    MessagePlugin.warning('分类不能包含 "-" 符号')
    return;
  }
  const tag = tags.join('-');
  try {
    await updateAudio(row.id, { tag })
    editId.value = '';
    const [class1, class2, class3] = editClassfiy.value;
    row.class1 = class1;
    row.class2 = class2;
    row.class3 = class3;
    MessagePlugin.success('更新数据成功')
  } catch (err) {
    MessagePlugin.error('更新数据失败，请重试')
  }
};

const onHandleEdit = (row: AudioInfo) => {
  if (row.id === editId.value) {
    // 保存
    if (editClassfiy.value[0] && editClassfiy.value[1]) {
      onSave(row);
    } else {
      MessagePlugin.warning('请选择第一级分类和第二级分类');
      return;
    }
  } else {
    editId.value = row.id;
    editClassfiy.value = [row.class1, row.class2, row.class3];
  }
}
const columns: any = [
  {
    title: '语音文件名称',
    colKey: 'filename',
    align: 'left',
    width: 120,
    fixed: 'left'
  },
  {
    title: '识别文本',
    colKey: 'result',
    align: 'left',
    width: 400,
  },
  {
    title: '分类1',
    colKey: 'class1',
    width: 120,
  },
  {
    title: '分类2',
    colKey: 'class2',
    width: 120,
  }, 
  {
    title: '分类3',
    colKey: 'class3',
    width: 120,
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
  },
  {
    title: '创建日期',
    colKey: 'createdAt',
    className: 't-demo-col__datepicker',
    width: 200,
  },
  {
    title: '操作栏',
    colKey: 'operation',
    width: 150,
    fixed: 'right',
  },
];
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
