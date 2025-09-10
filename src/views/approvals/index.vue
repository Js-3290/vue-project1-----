<!-- views/approval/ApprovalList.vue -->
<template>
  <div class="approval-list-container">
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="审批状态">
          <el-select v-model="filterForm.approvalStatus" placeholder="请选择审批状态" clearable>
            <el-option label="待审批" :value="0"></el-option>
            <el-option label="已通过" :value="1"></el-option>
            <el-option label="未通过" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchApprovalsWithFilter">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="待审批" name="pending"></el-tab-pane>
        <el-tab-pane label="全部审批" name="all"></el-tab-pane>
      </el-tabs>

      <el-table :data="approvalList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="activityName" label="活动名称" ></el-table-column>
        <el-table-column label="申请人" >
          <template #default="scope">
            {{ scope.row.creatorName || scope.row.approverName }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="180">
          <template #default="scope">
            {{ scope.row.createTime ? formatDateTime(scope.row.createTime) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="approvalStatus" label="审批状态" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.approvalStatus === 0" type="warning">待审批</el-tag>
            <el-tag v-else-if="scope.row.approvalStatus === 1" type="success">已通过</el-tag>
            <el-tag v-else-if="scope.row.approvalStatus === 2" type="danger">未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approverName" label="审批人" ></el-table-column>
        <el-table-column prop="approvalTime" label="审批时间" width="180">
          <template #default="scope">
            {{ scope.row.approvalTime ? formatDateTime(scope.row.approvalTime) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="viewApprovalDetail(scope.row)">审批详情</el-button>
            <el-button size="small" @click="viewActivityDetail(scope.row)">活动详情</el-button>
            <el-button 
              v-if="scope.row.approvalStatus === 0" 
              size="small" 
              type="primary" 
              @click="openApproveDialog(scope.row)"
            >
              审批
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        style="margin-top: 20px; text-align: right;"
      />
    </el-card>

    <!-- 审批详情对话框 -->
    <el-dialog title="审批详情" v-model="approvalDetailDialogVisible" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="活动名称">{{ detailData.activityName }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ activityDetail.creatorName }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ detailData.createTime ? formatDateTime(detailData.createTime) : '' }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <el-tag v-if="detailData.approvalStatus === 0" type="warning">待审批</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 1" type="success">已通过</el-tag>
          <el-tag v-else-if="detailData.approvalStatus === 2" type="danger">未通过</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审批人">{{ detailData.approverName }}</el-descriptions-item>
        <el-descriptions-item label="审批时间">{{ detailData.approvalTime ? formatDateTime(detailData.approvalTime) : '' }}</el-descriptions-item>
        <el-descriptions-item label="审批意见">{{ detailData.approvalComment }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approvalDetailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 活动详情对话框 -->
    <el-dialog title="活动详情" v-model="activityDetailDialogVisible" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="活动名称">{{ activityDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="活动类型">{{ activityDetail.typeName }}</el-descriptions-item>
        <el-descriptions-item label="活动地点">{{ activityDetail.location }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ activityDetail.startTime ? formatDateTime(activityDetail.startTime) : '' }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ activityDetail.endTime ? formatDateTime(activityDetail.endTime) : '' }}</el-descriptions-item>
        <el-descriptions-item label="最大人数">{{ activityDetail.maxPeople }}</el-descriptions-item>
        <el-descriptions-item label="当前人数">{{ activityDetail.currentPeople }}</el-descriptions-item>
        <el-descriptions-item label="活动描述">{{ activityDetail.description }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ activityDetail.creatorName }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="activityDetailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 审批对话框 -->
    <el-dialog title="审批活动" v-model="approveDialogVisible" width="500px">
      <el-form :model="approveForm" ref="approveFormRef" label-width="80px">
        <el-form-item label="活动名称">
          <span>{{ currentApproval.activityName }}</span>
        </el-form-item>
        <el-form-item label="申请人">
          <span>{{ currentApproval.approverName }}</span>
        </el-form-item>
        <el-form-item label="审批结果" prop="approvalStatus" :rules="{ required: true, message: '请选择审批结果', trigger: 'change' }">
          <el-radio-group v-model="approveForm.approvalStatus">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="approvalComment">
          <el-input 
            type="textarea" 
            v-model="approveForm.approvalComment" 
            placeholder="请输入审批意见"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApproval">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  getPendingApprovals, 
  getApprovalsByStatus, 
  approveActivity, 
  getApprovalByActivityId 
} from '@/api/approval'
import { queryInfoApi } from '@/api/act'

// 时间格式化函数
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  try {
    const date = new Date(dateTimeString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-')
  } catch (error) {
    console.error('时间格式化错误:', error)
    return dateTimeString
  }
}

// 响应式数据
const activeTab = ref('pending')
const loading = ref(false)
const approvalList = ref([])
const approveDialogVisible = ref(false)
const approvalDetailDialogVisible = ref(false)
const activityDetailDialogVisible = ref(false)

const filterForm = reactive({
  approvalStatus: null
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const approveForm = reactive({
  approvalStatus: null,
  approvalComment: ''
})

const approveFormRef = ref(null)
const currentApproval = reactive({})
const detailData = reactive({})

// 活动详情数据
const activityDetail = ref({})

// 获取审批列表
const fetchApprovals = async () => {
  loading.value = true
  try {
    let response
    if (activeTab.value === 'pending') {
      response = await getPendingApprovals(pagination.currentPage, pagination.pageSize)
    } else {
      response = await getApprovalsByStatus(
        pagination.currentPage, 
        pagination.pageSize, 
        filterForm.approvalStatus
      )
    }
    
    // 为每个审批记录获取活动详情，以获取创建人信息
    const approvalListWithCreator = await Promise.all(response.data.rows.map(async (approval) => {
      try {
        const activityResponse = await queryInfoApi(approval.activityId)
        return {
          ...approval,
          creatorName: activityResponse.data.creatorName
        }
      } catch (error) {
        // 如果获取活动详情失败，返回原始审批数据
        return approval
      }
    }))
    
    approvalList.value = approvalListWithCreator
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取审批列表失败')
  } finally {
    loading.value = false
  }
}

// 处理标签页切换
const handleTabChange = () => {
  pagination.currentPage = 1
  fetchApprovals()
}

// 处理查询按钮点击事件
const fetchApprovalsWithFilter = () => {
  pagination.currentPage = 1
  fetchApprovals()
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  fetchApprovals()
}

// 处理当前页变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchApprovals()
}

// 重置筛选条件
const resetFilter = () => {
  filterForm.approvalStatus = null
  pagination.currentPage = 1
  fetchApprovals()
}

// 打开审批对话框
const openApproveDialog = (row) => {
  Object.assign(currentApproval, row)
  approveForm.approvalStatus = null
  approveForm.approvalComment = ''
  approveDialogVisible.value = true
}

// 提交审批
const submitApproval = async () => {
  if (!approveForm.approvalStatus) {
    ElMessage.warning('请选择审批结果')
    return
  }
  
  try {
    await approveActivity(
      currentApproval.id,
      approveForm.approvalStatus,
      approveForm.approvalComment
    )
    ElMessage.success('审批成功')
    approveDialogVisible.value = false
    fetchApprovals()
  } catch (error) {
    ElMessage.error('审批失败')
  }
}

// 查看审批详情
const viewApprovalDetail = async (row) => {
  try {
    // 获取审批详情
    const response = await getApprovalByActivityId(row.activityId)
    Object.assign(detailData, response.data)
    
    // 获取活动详情以获取正确的创建人信息
    const activityResponse = await queryInfoApi(row.activityId)
    activityDetail.value = activityResponse.data
    
    approvalDetailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取审批详情失败')
  }
}

// 查看活动详情
const viewActivityDetail = async (row) => {
  try {
    // 获取活动详情
    const activityResponse = await queryInfoApi(row.activityId)
    activityDetail.value = activityResponse.data
    activityDetailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取活动详情失败')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchApprovals()
})
</script>

<style scoped>
.approval-list-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>