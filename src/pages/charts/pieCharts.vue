<template>
  <div class="chart-container"  ref="main" style="width:100%; height: 300px"></div>
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
  const option = {
  title: {
    text: '类别占比',
    left: 'right'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1, name: '规范用语' },
        { value: 2, name: '票款差错' },
        { value: 1, name: '服务承诺' },
        { value: 4, name: '服务态度' },
        { value: 1, name: '客伤' },
        { value:3, name: '物损' },
        { value: 0, name: '遗失物品' },
        { value: 1, name: '专用通道' },
        { value: 1, name: '秩序管理' },
        { value: 0, name: '吸烟' },
        { value: 1, name: '车站导向' },
        { value: 1, name: '车站张贴物' },
        { value: 2, name: '携带物品' },
        { value:3, name: '逃票' },
        { value: 1, name: '同站进出' },
        { value: 1, name: '发票' },
        { value: 1, name: '车站广播' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
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
