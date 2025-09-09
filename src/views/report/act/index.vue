<template>
  <!-- 图表容器：设置宽度和高度 -->
  <div ref="chartRef" style="width: 1200px; height: 700px;"></div>
</template>

<script setup>
// 引入 Vue 的 Composition API
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 引入 echarts 库
import * as echarts from 'echarts'
import { getActTypeCount } from '@/api/report'

// 获取 DOM 元素的引用（用于初始化图表）
const chartRef = ref(null)
// 存储 ECharts 实例
let chartInstance = null

const typeList = ref([])
const dataList = ref([])



// 初始化图表的方法
const initChart = () => {
  if (chartRef.value) {
    // 初始化 echarts 实例
    chartInstance = echarts.init(chartRef.value)

    // 配置项
    const option = {
      title: {
        text: '活动类型统计' // 图表标题
      },
      tooltip: {}, // 默认提示框配置
      legend: {
        data: ['活动个数'] // 图例名称
      },
      xAxis: {
        data: typeList.value // X 轴数据
      },
      yAxis: {}, // Y 轴默认配置
      series: [
        {
          name: '活动个数', // 系列名称
          type: 'bar', // 图表类型为柱状图
          data: dataList.value // 数据值
        }
      ]
    }

    // 使用配置项渲染图表
    chartInstance.setOption(option)
  }
}


// 更新图表数据
const updateChart = () => {
  if (chartInstance) {
    const option = {
      xAxis: {
        data: typeList.value
      },
      series: [
        {
          data: dataList.value
        }
      ]
    }
    chartInstance.setOption(option)
  }
}

// 获取活动类型统计数据
const fetchActTypeData = () => {
  getActTypeCount().then(res => {
    if (res && res.data) {
      typeList.value = res.data.typeList || []
      dataList.value = res.data.dataList || []
      // 如果图表已初始化，则更新数据；否则初始化图表
      if (chartInstance) {
        updateChart()
      } else {
        initChart()
      }
    }
  }).catch(error => {
    console.error('获取活动类型数据失败:', error)
  })
}

// 窗口大小变化时调整图表尺寸
const resizeChart = () => {
  chartInstance?.resize()
}


// 组件挂载后执行初始化
onMounted(() => {
  fetchActTypeData()

  initChart()
  // 监听窗口大小变化事件以支持响应式
  window.addEventListener('resize', resizeChart)


})

// 组件卸载前清理资源，防止内存泄漏
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose() // 销毁 echarts 实例
})
</script>
