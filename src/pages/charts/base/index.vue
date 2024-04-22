<template>
  <Select />
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
    <pie-chart />
  </div>
</template>

<script setup lang="jsx">
import { reactive, ref } from 'vue';

import PieChart from '../pieCharts.vue';
import Select from './select.vue';

const data = [];
const TOTAL = 59;
for (let i = 0; i < TOTAL; i++) {
  data.push({
    index: i + 1,
    applicant: ['1', '2', '3'][i % 3],
    status: i % 3,
    channel: ['投诉', '查询'][i % 2],
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    },
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
    classify_1: ['投诉', '查询'][i % 2],
    classify_2: ['呕吐物', '空调', '车厢', '自动扶梯'][i % 3],
    classify_3: ['陆家浜路', '松江大学城', '中山北路', '一大会址黄陂南路'][i % 4],
  });
}

const reserveSelectedRowOnPaginate = ref(true);
const selectedRowKeys = ref([]);

const columns = [
  { colKey: 'serial-number', width: 80, title: '序号' },
  { colKey: 'applicant', title: '语音文件ID', width: '100' },
  { colKey: 'classify_1', title: '分类1', width: '120' },
  { colKey: 'classify_2', title: '分类2', width: '120' },
  { colKey: 'classify_3', title: '分类3', width: '120' },

  // { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
  { colKey: 'createTime', title: '处理时间' },
  { colKey: 'row-select', type: 'multiple', width: 46 },
];

/**
 * 1. 本地分页方式一（非受控用法）：使用 defaultCurrent 和 defaultPageSize 设置默认分页信息，仅第一次有效。
 *
 * 2. 本地分页方式二（受控用法）：使用 current 和 pageSize 设置分页信息，任何时候有效，
 *    此时，注意需要在 onPageChange 中对 pagination.current 和 pagination.pageSize 进行赋值
 * */
const pagination = reactive({
  current: 1,
  pageSize: 10,
  // defaultCurrent: 2,
  // defaultPageSize: 5,
  total: TOTAL,
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
.chart_table {
  width: 55%;
  height: 100%;
  float: left;
}
.pie {
  width: 40%;
  height: 650px;
  float: right;
  /* margin-left: 10px; */
  background-color: white;
}
</style>
