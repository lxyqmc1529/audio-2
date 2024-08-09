<template>
  <Select @searchById="handleSearchById" @resetData="handleReset" @changeDate="handleChangeDate"
    @changeType="handleSearchByType" @changeTypeTiny="handleSearchByTypeTiny" @exportAllData="handleExportData" />
  <div class="content">
    <t-space>
      <div class="chart_table">
        <t-space direction="vertical">
          <t-table row-key="serial-number" :data="data" :columns="columns" :pagination="{
            current: page,
            pageSize: pageSize,
            total: total,
          }" table-layout="fixed" lazy-load @page-change="reloadAudioData" />
        </t-space>
      </div>
      <div class="pie">
        <lineToChart :dataSource="data"/>
        <pieChart :dataSource="data" />
      </div>
    </t-space>
  </div>
</template>

<script setup lang="jsx">
import dayjs from 'dayjs';
import { reactive, ref, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { listDetect, updateAudio } from '@/api/audio';
import lineToChart from '../lineToCharts.vue';
import Select from './select.vue';
import pieChart from '../pieCharts.vue';
import { columns } from './constant';
import * as XLSX from 'xlsx';

const data = ref([]);
const page = ref(1);
const limit = ref(8);
const totalData = ref(102);
const total = ref(0);
const loading = ref(false);
const baseData = ref([]);
const pageSize = 8;
const pagination = ref();
const nowdataLength = ref(0);
const loadAudioDetact = async () => {
  loading.value = true;
  try {
    const res = await listDetect(page.value, limit.value);
    total.value = res.total;
    data.value = res.data.map(item => {
      const { tag } = item;
      const [class1, class2, class3] = tag?.split('-') || [];
      return {
        ...item,
        class1,
        class2,
        class3
      }
    })
    data.value = data.value.map((item, index) => {
      return {
        index: index,
        applicant: item.filename,
        createTime: dayjs(item.createdAt).format("YYYY-MM-DD"),
        classify_1: item.class1,
        classify_2: item.class2,
        classify_3: item.class3,
      }
    })
    baseData.value = data.value;
  } catch (err) {
    MessagePlugin.error(err.message);
  }
  loading.value = false;
};
const reloadAudioData = (pageInfo) => {
  page.value = pageInfo.current;
  loadAudioDetact();
};
onMounted(loadAudioDetact);
const handleSearchById = (id) => {
  data.value = data.value.filter((item) =>
    item.applicant.includes(id)
  );
}
const handleChangeDate = (date, context) => {
  data.value = data.value.filter((item) => item.createTime >= date[0] && item.createTime <= date[1]);
}
const handleReset = () => {
  data.value = baseData.value;
}
const handleSearchByType = (type) => {
  data.value = baseData.value.filter((item) => type.includes(item.classify_1));
}
const handleSearchByTypeTiny = (type) => {
  data.value = baseData.value.filter((item) =>
    type.includes(item.classify_2)

  );
}
const handleExportData = async () => {
  const loading = MessagePlugin.loading('正在导出数据，请稍后...', 0);
  const allData = data.value;
  const csvData = allData.map((item, index) => {
    return {
      [columns[0].title]: item.index,
      [columns[1].title]: item.applicant,
      [columns[2].title]: item.classify_1,
      [columns[3].title]: item.classify_2,
      [columns[4].title]: item.classify_3,
      [columns[5].title]: dayjs(item.createTime).format("YYYY-MM-DD"),
    }
  })

  const workbook = XLSX.utils.book_new();
  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(csvData);

  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  // 保存为CSV文件
  XLSX.writeFile(workbook, `数据报表.csv`);
  MessagePlugin.close(loading)
}
const reserveSelectedRowOnPaginate = ref(true);
</script>

<style>
.content {
  width: 100%;
  display: flex;
}

.chart_table {
  width: 100%;
  height: 100%;
  float: left;
  flex: 1;
  padding-right: 10px;
}

.pie {
  width: 100%;
  flex: 0.7;
  width: 400px;
  background-color: white;
  padding: 12px;
}
</style>
