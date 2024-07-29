<template>
  <div class="chart-container"  ref="main" style="width:100%; height: 280px"></div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'; //  按需引入 echarts
import { onMounted, ref,watch} from 'vue';

const main = ref(); // 使用ref创建虚拟DOM引用，使用时用main.value
const props = defineProps({
  dataSource: {
    type: Array,
    default: () => []
  }
});
const xAxisData = Array.from({ length: 24 }, (_, i) => i ).map(item => `${item}:00`);
const yAxisData = ref(new Array(24).fill(0));
const yAxisData2 = ref(new Array(24).fill(0));
const yAxisData3 = ref(new Array(24).fill(0));
const myChart = ref(null);
const chartsData = ref([]);
onMounted(() => {
  init();
});
watch(() => props.dataSource, (newVal) => {
    console.log('数据变更',newVal)
    updateChartData(newVal);
  });
//定义一个函数，计算所有数据中类别3占比最大的3个类别并且返回其数据
function findTopThreeClassesWithTimeCounts(arr) {
  // 用于统计每个classify_3类别的出现次数
  const classCounts = arr.reduce((acc, obj) => {
    const { classify_3, createTime } = obj;
    // 将createTime转换为小时点，例如：'2024-07-29T12:00:00' -> 12
    const hour = new Date(createTime).getHours();
    // 如果acc中没有这个classify_3类别，则初始化它
    if (!acc[classify_3]) {
      acc[classify_3] = { count: 0, hours: new Array(24).fill(0) };
    }
    // 更新这个类别的出现次数和对应小时点的计数
    acc[classify_3].count++;
    acc[classify_3].hours[hour]++;
    return acc;
  }, {});

  // 将对象转换为数组，并根据count排序
  const sortedClasses = Object.keys(classCounts).map(key => ({
    classify_3: key,
    count: classCounts[key].count,
    hours: classCounts[key].hours
  })).sort((a, b) => b.count - a.count);

  // 获取出现次数最多的三个类别
  const topThreeClasses = sortedClasses.slice(0, 3);

  // 准备返回结果
  const result = topThreeClasses.map(cls => ({
    classify_3: cls.classify_3,
    hours: cls.hours
  }));

  return result;
}
function renderChart() {
  const myChart = ref(echarts.init(main.value));
  const newOption = {
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
      data: yAxisData.value,
      type: 'line',
      smooth: true,
      name: findTopThreeClassesWithTimeCounts(props.dataSource)[0].classify_3,
    },
    {
      data: yAxisData2.value,
      type: 'line',
      smooth: true,
      name: findTopThreeClassesWithTimeCounts(props.dataSource)[1].classify_3,
    },{
      data: yAxisData3.value,
      type: 'line',
      smooth: true,
      name: findTopThreeClassesWithTimeCounts(props.dataSource)[2].classify_3,
    },
  ]
};
  myChart.value.setOption(newOption);
}
function updateChartData(dataSource) {
  chartsData.value = findTopThreeClassesWithTimeCounts(dataSource) || [];
  yAxisData.value = chartsData.value[0]?.hours || new Array(24).fill(0);
  yAxisData2.value = chartsData.value[1]?.hours || new Array(24).fill(0);
  yAxisData3.value = chartsData.value[2]?.hours || new Array(24).fill(0);
  renderChart(); // 手动触发图表的重新渲染
}
function init() {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(main.value);
  // 指定图表的配置项和数据
const xAxisData = Array.from({ length: 24 }, (_, i) => i ).map(item => `${item}:00`);
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
      data: yAxisData.value,
      type: 'line',
      smooth: true,
      // name: findTopThreeClassesWithTimeCounts(props.dataSource)[0].classify_3,
    },
    {
      data: yAxisData2.value,
      type: 'line',
      smooth: true,
      // name: findTopThreeClassesWithTimeCounts(props.dataSource)[1].classify_3,
    },{
      data: yAxisData3.value,
      type: 'line',
      smooth: true,
      // name: findTopThreeClassesWithTimeCounts(props.dataSource)[2].classify_3,
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
