<template>
  <div class="select">
    <div class="select_type">
      <t-space direction="vertical">
       请选择分类1:<t-select v-model="value1" :options="options1" placeholder="请选择" multiple @focus="onFocus" @blur="onBlur" @change="searchByType" />
      请选择分类2: <t-select v-model="value2" placeholder="请选择分类2" multiple @change="changeTypeTiny">
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
          <t-button>  <template #icon> <cloud-download-icon /></template>导出数据</t-button>
        </div>
      </div>
    </div>

      <div class="dataShow">
        <div class="dataShow_item">2024-7-1 来电投诉总量：{{ 12 }}</div>
        <div>
        </div>
        
      </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, defineEmits } from 'vue';
import {  CloudDownloadIcon } from 'tdesign-icons-vue-next';

const emit = defineEmits(['searchById'],['resetData'],['changeDate'],['changeType'],['changeTypeTiny']);
const options1 = [
  { label: '全选', checkAll: true },
  { label: '综合类', value: '1' },
  { label: '规范服务', value: '2' },
  { label: '呕吐物', value: '3' },
  { label: '投诉全选', value: '4' }
];
const options2 = [
  { label: '站车环境', value: '1' },
  { label: '重复投诉', value: '2' },
  { label: '客运组织', value: '3' },
  { label: '规范服务', value: '4' },
];

const value1 = ref(['1', '2']);
const value2 = ref(['1', '2', '3', '4']);

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
  emit('resetData');
}
const onChange = (value, context) => {
  emit('changeDate', value, context);
};
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
  width: 20%;
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
