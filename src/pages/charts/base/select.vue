<template>
  <div class="select">
    <div class="select_type">
      <t-space direction="vertical">
       <t-select style="width: 300px;" v-model="value1" :options="options1" placeholder="请选择分类1" multiple @focus="onFocus" @blur="onBlur" @change="searchByType" />
      <t-select v-model="value2" placeholder="请选择分类2" multiple @change="changeTypeTiny">
          <t-option label="全选" :check-all="true" />
          <t-option v-for="item in options2" :key="item.value" :value="item.value" :label="item.label"></t-option>
        </t-select>
      </t-space>
    </div>
    <div class="select_right">
      <div class="select_date">
        <t-space direction="vertical">
          <t-date-range-picker allow-input clearable @pick="onPick" @change="onChange" />
        </t-space>
      </div>
      <div class="searchById">
        <t-input @change="handleInput" placeholder="请输入查询ID" />
        <div style="margin-top: 10px">
          <t-button type="primary" @click="handleReset">重置查询条件</t-button>
          <t-button @click="handleExport">  <template #icon> <cloud-download-icon /></template>导出数据</t-button>
        </div>
      </div>
    </div>

      <div class="dataShow">
        <!-- <div class="dataShow_item">{{ now }} 来电投诉总量：{{ allTodayData}}</div> -->
        <div class="dataShow_item">2024-08-13 来电投诉总量：10 </div>
        <div>
        </div>
        
      </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, defineEmits } from 'vue';
import {  CloudDownloadIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { getAllDetect } from '@/api/audio';
import { columns } from './constant';
import { thirdClassifyOptionsMap } from '@/pages/information/base/Casecader.ts'
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
const now = dayjs().startOf('day').format('YYYY-MM-DD');
const emit = defineEmits(['searchById'],['resetData'],['changeDate'],['changeType'],['changeTypeTiny'],['exportAllData']);

const options1 = [
  { label: '全选', checkAll: true },
  { label: '综合类', value: '1' },
  { label: '规范服务', value: '2' },
  { label: '呕吐物', value: '3' },
  { label: '优质服务', value: '4' },
  { label: '站车环境', value: '5' },
  { label: '列车运行', value: '6' },
  { label: '设施设备', value: '7' },
];
const options2 = Object.keys(thirdClassifyOptionsMap).map((item,index) =>{
  return {
    label: item,
    value: index.toString()
  }
})
const value1 = ref([]);
const value2 = ref([]);
const getTodayNumber = async() => {
  const data = await getAllDetect();
  allTodayData.value = data.filter(item => dayjs(item.createdAt).format('YYYY-MM-DD') === now).length;
}
getTodayNumber()
const onFocus = (ctx) => {
  console.log('focus:', ctx);
};
const searchByType = (values) => {
  // 使用 map() 对每个 value 进行查找，返回对应的 label 数组
  const labels = values.map(value => {
    // 找到匹配的 value，返回对应的 label
    const option = options1.find(option => option.value === value);
    return option ? option.label : null; // 如果没有找到，返回 null 或其他占位值
  });
  // emit 一个包含所有 label 的数组
  emit('changeType', labels);
};

const onBlur = (ctx) => {
  console.log('blur:', ctx);
};
const allTodayData = ref(0);
const onPick = (value, context) => console.log('onPick:', value, context);
const handleInput = (value) => {
  emit('searchById', value);
};
const changeTypeTiny = (values) => {
  const labels = values.map(value => {
    // 找到匹配的 value，返回对应的 label
    const option = options2.find(option => option.value === value);
    return option ? option.label : null; // 如果没有找到，返回 null 或其他占位值
  });
  console.log(labels);
    emit('changeTypeTiny', labels);
};
const handleReset = () => {
  // emit('resetData');
  window.location.reload()
}
const onChange = (value, context) => {
  emit('changeDate', value, context);
};

const handleExport = () => {
  emit('exportAllData');
}
</script>
<style scoped>
.select {
  width: 100%;
  background-color: white;
  margin-bottom: 30px;
  padding: 20px 20px 30px 30px;
  display: flex;
  flex-direction: row;
}

.select_type {
  flex: 0.6;
  width: 50%;
}

.select_right {
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
}

.select_date {
  flex: 1;
}

.searchById {
  flex: 1;
  margin: 15px 0 30px 0;
}
.dataShow{
  flex: 0.5;
  padding-left: 20px;
  padding-top: 5px;
}
.dataShow_item{
  font-family: 'Courier New', Courier, monospace;
  font-size: larger;
  font-weight: 1000;
}
</style>
