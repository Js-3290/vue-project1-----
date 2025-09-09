<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { queryAllTypeApi, queryInfoApi, queryRegisteredApi, deleteRegistrationApi } from '@/api/act'

//元数据
const activityType = ref([])

//当前登录用户
const loginId = ref()



onMounted(() => {
  const loginUser = JSON.parse(localStorage.getItem('loginUser'));
  if (loginUser && loginUser.id) {
    loginId.value = loginUser.id
  }
  search()
  queryAllType()
})

//查询所有活动类型
const queryAllType = async () => {
  let result = await queryAllTypeApi()
  if (result.code) {
    activityType.value = result.data
  } else {
    ElMessage.error(result.message)
  }
}

//查询我已经报名的活动列表
const search = async () => {
  const result = await queryRegisteredApi(loginId.value)
  if (result.code) {
    actList.value = result.data
  } else {
    ElMessage.error(result.message)
  }
}



const actList = ref([])



//对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增活动')
const detailVisible = ref(false)

// 新增/修改活动表单
const act = ref({
  name: '',
  typeId: '',
  location: '',
  startTime: '',
  endTime: '',
  maxPeople: '',
  currentPeople: '',
  description: '',
  creatorName: ''
})


//查看活动
const detail = async (id) => {
  detailVisible.value = true
  const result = await queryInfoApi(id)
  if (result.code) {
    act.value = result.data
  } else {
    ElMessage.error(result.message)
  }
}


//删除活动
const deleteById = async (id) => {
  ElMessageBox.confirm('即将退出该活动, 是否继续?', '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {// 确定
    const result = await deleteRegistrationApi(id)
    if (result.code) {
      ElMessage.success('退出成功')
      search()
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {// 取消
    ElMessage.info('已取消');
  });
}

</script>

<template>
  <el-text type="primary" size="large">我参加的活动</el-text>

  <br>
  <br>

  <!-- 表格 -->
  <div class="container">
    <el-table :data="actList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="120" align="center" />
      <el-table-column prop="name" label="活动名称" width="150" align="center" />
      <el-table-column prop="location" label="活动地点" width="150" align="center" />
      <el-table-column prop="typeName" label="活动类型" width="150" align="center" />
      <el-table-column prop="status" label="活动状态" width="150" align="center">
        <template #default="scope">
          <span v-if="scope.row.status == 1">未开始</span>
          <span v-if="scope.row.status == 2">进行中</span>
          <span v-if="scope.row.status == 3">已结束</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="发起人" width="150" align="center" />
      <el-table-column prop="signupTime" label="报名时间" width="220" align="center" />


      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="warning" size="mini" @click="detail(scope.row.activityId)"><el-icon>
              <View />
            </el-icon>详情</el-button>
          <el-button type="danger" size="mini" @click="deleteById(scope.row.activityId)"><el-icon>
              <Delete />
            </el-icon>退出</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>




  <!-- 新增用户/修改活动对话框 -->
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="40%">
    <el-form :model="act" label-width="80px" :rules="rules" ref="actFormRef">

      <el-form-item label="活动名称" prop="name">
        <el-input v-model="act.name" placeholder="请输入活动名称"></el-input>
      </el-form-item>

      <el-form-item label="活动地点" prop="location">
        <el-input v-model="act.location" placeholder="请输入活动地点"></el-input>
      </el-form-item>

      <el-form-item label="活动类型" prop="typeId">
        <el-select v-model="act.typeId" placeholder="请选择活动类型">
          <el-option v-for="type in activityType" :key="type.id" :label="type.name" :value="type.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="最大人数" prop="maxPeople">
        <el-input v-model="act.maxPeople" placeholder="请输入活动最大人数"></el-input>
      </el-form-item>

      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="act.startTime" type="date" placeholder="请选择活动开始时间" format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" />
      </el-form-item>

      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="act.endTime" type="date" placeholder="请选择活动结束时间" format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="活动描述" prop="description">
        <el-input v-model="act.description" style="width: 80%" autosize type="textarea" placeholder="请输入活动描述" />
      </el-form-item>


      <el-form-item>
        <el-button type="info" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>

  <!-- 查看详情对话框 -->
  <el-dialog title="活动详情" v-model="detailVisible" width="40%">
    <el-descriptions :column="2">
      <el-descriptions-item label="活动名称">{{ act.name }}</el-descriptions-item>
      <el-descriptions-item label="活动地点">{{ act.location }}</el-descriptions-item>
      <el-descriptions-item label="活动类型">{{ act.typeName }}</el-descriptions-item>
      <el-descriptions-item label="发起人">{{ act.creatorName }}</el-descriptions-item>
      <el-descriptions-item label="最大人数">{{ act.maxPeople }}</el-descriptions-item>
      <el-descriptions-item label="当前人数">{{ act.currentPeople }}</el-descriptions-item>
      <el-descriptions-item label="开始时间">{{ act.startTime }}</el-descriptions-item>
      <el-descriptions-item label="结束时间">{{ act.endTime }}</el-descriptions-item>
      <el-descriptions-item label="活动描述">{{ act.description }}</el-descriptions-item>
      <el-descriptions-item label="活动状态">
        <span v-if="act.status == 1">未开始</span>
        <span v-if="act.status == 2">进行中</span>
        <span v-if="act.status == 3">已结束</span>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>



</template>

<style scoped>
.container {
  margin: 15px 0;
}
</style>
