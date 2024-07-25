<template>
  <div class="chart-container"  ref="main" style="width:100%; height: 280px"></div>
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
  // 指定图表的配置项和数据
const xAxisData = Array.from({ length: 24 }, (_, i) => i ).map(item => `${item}:00`);
const yAxisData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,1,0,0,0,0,0,0]
  const yAxisData2 =  [0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0]
  const yAxisData3 =  [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0]
  const option = {
    title:{
      text: '来电投诉问题类别TOP3',
      left: 'left'
    },
    legend:{
      right: 10,
      top: 30,
    },
    grid:{
      top: 70,
      bottom:20
    },
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
    data: xAxisData,
    interval: 4,
  },
  yAxis: {
    type: 'value',
    show:true,
    minInterval: 1,
    axisLabel: {
            show: true,
            color: '#333' // 设置 y 轴刻度标签颜色
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#999' // 设置 y 轴轴线颜色
            }
        },
        axisTick: {
            show: true,
            length: 10 // 设置 y 轴刻度线长度
        }
  },
  series: [
    {
      data: yAxisData,
      type: 'line',
      smooth: true,
      name: '闷热',
    },
    {
      data: yAxisData2,
      type: 'line',
      smooth: true,
      name: '客伤',
    },{
      data: yAxisData3,
      type: 'line',
      smooth: true,
      name: '站车卫生',
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
