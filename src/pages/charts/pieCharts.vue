<template>
  <div class="chart-container"  ref="mainPie" style="width:100%; height: 300px"></div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'; //  按需引入 echarts
import { onMounted, ref, defineProps,watch } from 'vue';
const props = defineProps({
  dataSource: {
    type: Array,
    default: () => []
  }
});
const mainPie = ref(null);
const pieData = ref([]);
watch(() => props.dataSource, (newVal) => {
    console.log('数据变更',newVal)
    updateChartData();
  });

function updateChartData(){
  const myChart = ref(echarts.init(mainPie.value));
  console.log('更新数据',props.dataSource)
  const newOption ={
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
      data: countClass3Occurrences(props.dataSource),
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
  myChart.value.setOption(newOption);
}
function countClass3Occurrences(arr) {
  const occurrences = {}; // 用于存储每个class3的出现次数
  // 遍历数组中的每个对象
  arr.forEach(item => {
    if (item.classify_3) { // 检查对象是否有class3属性
      if (occurrences[item.classify_3]) {
        occurrences[item.classify_3]++; // 如果已经存在，则次数加1
      } else {
        occurrences[item.classify_3] = 1; // 如果不存在，则初始化为1
      }
    }
  });
  // 转换为所需的格式
  const result = Object.keys(occurrences).map(key => {
    return { value: occurrences[key], name: key };
  });

  return result;
}

onMounted(() => {
  init();
});
function init() {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(mainPie.value);
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
      data: [],
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
