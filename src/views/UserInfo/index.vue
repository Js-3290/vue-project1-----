<script setup>
import { ref, onMounted } from 'vue'
import { queryInfoApi, updateApi } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

// 用户信息
const userId = ref()
const userInfo = ref({
  id: '',
  username: '',
  name: '',
  gender: '',
  phone: '',
  createTime: '',
  password: ''
})

// 获取当前登录用户Id
const getLoginUserId = () => {
  const loginUser = JSON.parse(localStorage.getItem('loginUser'))
  if (loginUser && loginUser.id) {
    userId.value = loginUser.id
  }
}
// 查询用户信息
const queryUserInfo = async (Id) => {
  const Info = await queryInfoApi(parseInt(Id))
  if (Info.code) {
    const userData = Info.data
    userInfo.value = userData
  } else {
    ElMessage.error(Info.message)
  }
}

// 密码表单
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})


const dialogVisible = ref(false)

//点击修改密码
const changePasswordClick = () => { 
  dialogVisible.value = true
  form.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 修改密码
const changePassword = () => {
  if(userInfo.value.password !== form.value.oldPassword){
    ElMessage.error('旧密码错误，请联系管理员重置密码')
    return
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    ElMessage.error('两次密码不一致')
    return
  }

  ElMessageBox.confirm('此操作将修改密码, 是否继续?', '提示',
    {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {// 确定
    userInfo.value.password = form.value.newPassword
    const result = await updateApi(userInfo.value)
    if(result.code){
      ElMessage.success('修改密码成功')
      dialogVisible.value = false
    }else{
      ElMessage.error(result.message)
    }
    
  }).catch(() => {// 取消
    ElMessage.info('已取消修改密码');
  });
}




//时间格式化
const formatTime = (time) => {
  if (!time) return ''
  return time.replace('T', ' ')
}

onMounted(() => {
  getLoginUserId()
  queryUserInfo(userId.value)
})
</script>

<template>
  <el-text type="primary" size="large">个人信息</el-text>

  <div class="container">
    <el-descriptions title="用户信息" :column="1" border>
      <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{ userInfo.name }}</el-descriptions-item>
      <!-- 性别 1为男 2为女 -->
       <el-descriptions-item label="性别">{{ userInfo.gender === 1 ? '男' : '女' }}</el-descriptions-item>
      <el-descriptions-item label="电话号码">{{ userInfo.phone }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ formatTime(userInfo.createTime) }}</el-descriptions-item>
    </el-descriptions>

    <div style="margin-top: 20px;">
      <el-button type="primary" @click="changePasswordClick">修改密码</el-button>
    </div>

    


    <!-- 密码修改弹窗 -->
    <el-dialog title="修改密码" v-model="dialogVisible">
      <el-form  :model="form" label-width="120px">
        <el-form-item label="旧密码">
          <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码"
            show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码"
            show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码"
            show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="changePassword">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
        
      
        
      </el-form>
    </el-dialog>

  </div>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>