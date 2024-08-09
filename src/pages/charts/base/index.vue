<template>
  <Select @searchById="handleSearchById" @resetData="handleReset" @changeDate="handleChangeDate"
    @changeType="handleSearchByType" @changeTypeTiny="handleSearchByTypeTiny" />
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
import { columns } from './constant'

const data = ref([]);
const page = ref(1);
const limit = ref(8);
const totalData = ref(102);
const total = ref(0);
const loading = ref(false);
const baseData = ref([]);
const pageSize = 8;
const pagination = ref();
const loadAudioDetact = async () => {
  loading.value = true;
  try {
    const res = await listDetect(page.value, limit.value);
    total.value = res.total
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
