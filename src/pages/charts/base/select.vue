<template>
  <div class="select">
    <div class="select_type">
      <t-space direction="vertical">
        <!-- 方式一：使用 options 输出下拉选项。优先级高于 t-option-->
        <t-select v-model="value1" :options="options1" placeholder="请选择" multiple @focus="onFocus" @blur="onBlur" />

        <!-- 方式二：使用 t-option 输出下拉选项。options 和 t-option 两种实现方式二选一即可 -->
        <t-select v-model="value2" placeholder="请选择分类2" multiple>
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
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="jsx">
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['searchById'],['resetData']);
const options1 = [
  { label: '全选', checkAll: true },
  { label: '投诉', value: '1' },
  { label: '查询', value: '2' },
  // 可以使用渲染函数自定义下拉选项内容和样式
  // {
  //   label: '计算场景',
  //   value: '6',
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   content: (h) => <span>计算场景（高性能计算）</span>,
  // },
];
const options2 = [
  { label: '呕吐物', value: '1' },
  { label: '空调', value: '2' },
  { label: '遗失物', value: '3' },
  { label: '费用', value: '4' },
];

const value1 = ref(['1', '2']);
const value2 = ref(['1', '2', '3', '4']);

const onFocus = (ctx) => {
  console.log('focus:', ctx);
};

const onBlur = (ctx) => {
  console.log('blur:', ctx);
};

const onPick = (value, context) => console.log('onPick:', value, context);
const handleInput = (value) => {
  emit('searchById', value);
};
const handleReset = () => {
  emit('resetData');
}
const onChange = (value, context) => {
  console.log('onChange:', value, context);
  console.log(
    'timestamp:',
    context.dayjsValue.map((d) => d.valueOf()),
  );
  console.log(
    'YYYYMMDD:',
    context.dayjsValue.map((d) => d.format('YYYYMMDD')),
  );
};
</script>
<style scoped>
.select {
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
  margin: 20px 0 30px 0;
}</style>
