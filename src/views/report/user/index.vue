<template>
  <!-- 图表容器：设置宽度和高度 -->
  <div ref="chartRef" style="width: 1200px; height: 700px;"></div>
</template>

<script setup>
// 引入 Vue 的 Composition API
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 引入 echarts 库
import * as echarts from 'echarts'
import { getUserSexCount } from '@/api/report'

// 获取 DOM 元素的引用（用于初始化图表）
const chartRef = ref(null)
// 存储 ECharts 实例
let chartInstance = null

// 存储图表数据
const chartData = ref([])

// 初始化图表的方法
const initChart = () => {
  if (chartRef.value) {
    // 初始化 echarts 实例
    chartInstance = echarts.init(chartRef.value)

    // 配置项
    const option = {
      title: {
        text: '用户性别统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '用户性别',
          type: 'pie',
          radius: '50%',
          data: chartData.value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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
      series: [
        {
          data: chartData.value
        }
      ]
    }
    chartInstance.setOption(option)
  }
}

// 获取用户性别统计数据
const fetchUserSexData = () => {
  getUserSexCount().then(res => {
    if (res && res.data) {
      // 根据返回的数据格式，直接使用res.data作为图表数据
      chartData.value = res.data || []
      // 如果图表已初始化，则更新数据；否则初始化图表
      if (chartInstance) {
        updateChart()
      } else {
        initChart()
      }
    }
  }).catch(error => {
    console.error('获取用户性别数据失败:', error)
  })
}

// 窗口大小变化时调整图表尺寸
const resizeChart = () => {
  chartInstance?.resize()
}

// 组件挂载后执行初始化
onMounted(() => {
  fetchUserSexData()
  // 监听窗口大小变化事件以支持响应式
  window.addEventListener('resize', resizeChart)
})

// 组件卸载前清理资源，防止内存泄漏
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose() // 销毁 echarts 实例
})
</script>