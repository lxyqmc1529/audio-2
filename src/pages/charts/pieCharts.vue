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
    left: 'left'
  },
  tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
  
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 2, name: '站车卫生' },
        { value: 1, name: '票款差错' },
        { value: 1, name: '服务承诺' },
        { value: 3, name: '闷热' },
        { value: 2, name: '客伤' },
        { value:1, name: '物损' },
        { value: 1, name: '遗失物品' },
        { value: 1, name: '专用通道' },
      ],
      label: {
        normal: {
          formatter: '{b}\n{d}%'
        }
      },
      labelLine: {
        normal: {
          show: true,
          length: 10, // 调整引导线的长度
          length2: 20, // 调整第二段引导线的长度，用于控制标签与扇区的距离
          smooth: false // 是否平滑曲线显示，根据需要设置
        }
      },
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
