<template>
  <div ref="main" style="width:100%; height: 400px"></div>
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
  const option = {
    tooltip: {
      trigger: 'item',
      // formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      data: ['投诉', '咨询', '表扬', '建议', '求助'],
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        // label: {
        //   position: 'inner',
        //   fontSize: 14,
        // },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1548, name: '投诉' },
          { value: 775, name: '咨询' },
          { value: 679, name: '表扬', selected: true },
        ],
      },
      {
        // name: '',
        type: 'pie',
        radius: ['45%', '60%'],
        // label: {
        //   position: 'inner',
        //   fontSize: 14,
        // },
        // labelLine: {
        //   show: false,
        // },
        // labelLine: {
        //   length: 30,
        // },
        label: {
          backgroundColor: '#F6F8FC',
          borderColor: '#8C8D8E',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: '#6E7079',
              lineHeight: 22,
              align: 'center',
            },
            hr: {
              borderColor: '#8C8D8E',
              width: '100%',
              borderWidth: 1,
              height: 0,
            },
            b: {
              color: '#4C5058',
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 33,
            },
            per: {
              color: '#fff',
              backgroundColor: '#4C5058',
              padding: [3, 4],
              borderRadius: 4,
            },
          },
        },
        data: [
          { value: 1048, name: '环境卫生' },
          { value: 335, name: '服务质量' },
          { value: 310, name: '列车设施' },
          { value: 310, name: '作业规范' },
          { value: 310, name: '车站管理' },
        ],
      },
    ],
  };
  myChart.setOption(option);
  // 使用刚指定的配置项和数据显示图表。
  window.onresize = function () {
    // 自适应大小
    myChart.resize();
  };
}
</script>
<style scoped></style>
