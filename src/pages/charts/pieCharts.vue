<template>
  <div class="chart-container"  ref="main" style="width:100%; height: 400px"></div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'; //  按需引入 echarts
import { onMounted, ref } from 'vue';

const main = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value
onMounted(() => {
  init();
});
function init() {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(main.value);
  const datas = [
    [
      { name: '正常', value: 32 },
      { name: '异常', value: 1 },
    ],
  ];
  // 指定图表的配置项和数据
const xAxisData = Array.from({ length: 24 }, (_, i) => i + 1).map(item => `${item}:00`);
const yAxisData = Array.from({ length: 24 }, (_, i) => ({
    value: Math.floor(Math.random() * 100 * i),
    name: `数据${i + 1}`
  }));
const yAxisData2 = Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 11*i));
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
  xAxis: {
    type: 'category',
    boundarygap: false,
    showAllTickLabels: true,
    data: xAxisData
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: yAxisData,
      type: 'line',
      smooth: true
    },
  ]
};
  myChart.setOption(option);
  // 使用刚指定的配置项和数据显示图表。
  window.onresize = function () {
    // 自适应大小
    myChart.resize();
  };
}
</script>
<style scoped>
.chart-container{
  margin:auto
}</style>
