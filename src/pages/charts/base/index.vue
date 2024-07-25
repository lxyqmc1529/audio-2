<template>
  <Select @searchById="handleSearchById" @resetData="handleReset" @changeDate="handleChangeDate" @changeType="handleSearchByType" @changeTypeTiny="handleSearchByTypeTiny" />
  <div class="content">
    <t-space>
      <div class="chart_table">
        <t-space direction="vertical">
        <t-table
          v-model:selected-row-keys="selectedRowKeys"
          row-key="index"
          :data="data"
          :columns="columns"
          :pagination="pagination"
          :reserve-selected-row-on-paginate="true"
          lazy-load
          @page-change="onPageChange"
          @change="onChange"
          @select-change="onSelectChange"
        />
      </t-space>
      </div>
      <div class="pie">
        <lineToChart />
        <pieChart />
      </div>
    </t-space>
  </div>
</template>

<script setup lang="jsx">
import { reactive, ref } from 'vue';

import lineToChart from '../lineToCharts.vue';
import Select from './select.vue';
import pieChart from '../pieCharts.vue';
const data = ref([]);
const totalData = ref(102);
const TOTAL = 8;
for (let i = 0; i < TOTAL; i++) {
  data.value.push({
    index: i + 1,
    applicant: ['18917508475', '15721565601', '15145896222','18516245369','13661919436','13137787898','13916469214','13917762277'][i % 8],
    status: i % 3,
    channel: ['规范服务'][i % 1],
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    },
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2024-07-01', '2024-07-01'][i % 2],
    classify_1: ['呕吐物','综合类','列车运行','致歉信','规范服务','夹人','列车运行','规范服务'][i % 8],
    classify_2: ['站车环境', '重复投诉', '客运组织','规范服务','作业规范','列车运行','列车延误','服务质量'][i % 8],
    classify_3: ['站车卫生', '服务质量', '列车自动广播', '服务质量','求助等候','客运组织','线路拥堵','服务态度'][i % 5],
  });
}
const baseData = ref([]);
baseData.value = data.value;
const handleSearchById = (id) => {
  data.value = baseData.value.filter((item) => item.index == id);
}
const handleChangeDate = (date,context) => {
  data.value = baseData.value.filter((item) => item.createTime >= date[0] && item.createTime <= date[1]);
}
const handleReset = () => {
  console.log('reset');
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
const selectedRowKeys = ref([]);

const columns = [
  { colKey: 'serial-number', width: 100, title: '序号' },
  { colKey: 'applicant', title: '语音文件ID', width: 200 },
  { colKey: 'classify_1', title: '分类1', width: 200 },
  { colKey: 'classify_2', title: '分类2', width: 200},
  { colKey: 'classify_3', title: '分类3', width: 200 },

  // { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
  { colKey: 'createTime', title: '处理时间',width: 200  },
];

const pagination = reactive({
  current: 1,
  pageSize: 8,
  // defaultCurrent: 2,
  // defaultPageSize: 5,
  total: TOTAL + 4,
  showJumper: true,
});

const onChange = (params, context) => {
  console.log('change', params, context);
};

const onPageChange = (pageInfo, context) => {
  console.log('page-change', pageInfo, context);
  // 受控用法需要下面两行代码
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
};

const onSelectChange = (selectedRowKeys, context) => {
  console.log(selectedRowKeys, context);
};
</script>

<style>
.content{
  width: 100%;
  display: flex;
}
.chart_table {
  width: 100%;
  height: 100%;
  float: left;
  flex:1;
  padding-right: 10px;
}
.pie {
  width: 100%;
  flex:0.7 ;
  width: 400px;
  background-color: white;
  padding: 12px;
}

</style>
