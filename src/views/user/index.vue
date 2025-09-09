<script setup>
import { ref, onMounted } from 'vue'
import { queryPageApi, addApi, queryInfoApi, updateApi, deleteApi } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

//元数据
const genders = ref([{ name: '男', value: '1' }, { name: '女', value: '2' }])

//搜索表单对象
const searchUser = ref({
  name: '',
  gender: ''
})

//查询用户列表
const search = async () => {
  const result = await queryPageApi(searchUser.value.name, searchUser.value.gender, currentPage.value, pageSize.value);
  if (result.code) {
    userList.value = result.data.rows;
    total.value = result.data.total;
  }
}

onMounted(() => {
  search();
})

//清空表单
const clear = () => {
  searchUser.value = { name: '', gender: '' };
  search();
}

//用户列表数据
const userList = ref([])

//分页参数
const currentPage = ref(1)//当前页码
const pageSize = ref(10)//每页数据量
const background = ref(true)//是否显示背景颜色
const total = ref(0)//总数据量
//每页数据量改变时触发
const handleSizeChange = (val) => {
  // pageSize.value = val;
  search();
}
//当前页码改变时触发
const handleCurrentChange = (val) => {
  // currentPage.value = val;
  search();
}

//新增用户
const addUser = () => {
  dialogVisible.value = true;
  dialogTitle.value = '新增用户';
  user.value = {
    name: '',
    username: '',
    gender: '',
    phone: '',
    password: '',
  }

  // 重置表单
  if (userFormRef.value) {
    userFormRef.value.resetFields();
  }

}

// 新增修改表单
const user = ref({
  name: '',
  username: '',
  gender: '',
  phone: '',
  password: '',
})

//控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')


//保存用户
const save = async () => {
  // 表单验证
  if (!userFormRef.value) return;
  userFormRef.value.validate(async (valid) => {
    if (valid) {//通过验证

      let result;

      if (user.value.id) {//修改
        result = await updateApi(user.value)
      } else {//新增
        result = await addApi(user.value)

      }

      if (result.code) {
        ElMessage.success('保存成功')
        dialogVisible.value = false;
        search();
      } else {
        ElMessage.error(result.message)
      }
    } else {//未通过验证
      ElMessage.error('请填写正确的数据')
    }

  })


}

//定义表单引用
const userFormRef = ref()

//表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名(学号)', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
  ]
}

//编辑功能
const edit = async (id) => {
  const result = await queryInfoApi(id);
  if (result.code) {
    dialogVisible.value = true;
    dialogTitle.value = '编辑用户';
    const userData = result.data;
    // userData.gender = userData.gender == '1' ? '男' : '女'; // 转换性别值
    userData.gender = String(userData.gender);
    user.value = userData;
  }
}

//删除功能
const deleteById = async (id) => {
  ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示',
    {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {// 确定
    const result = await deleteApi(id);
    if (result.code) {
      ElMessage.success('删除成功');
      search();
    } else {
      ElMessage.error(result.message);
    }
  }).catch(() => {// 取消
    ElMessage.info('已取消删除');
  });
}


//记录勾选用户的id
const selectedIds = ref([]);
//复选框变化时触发 selection为当前选中的行数据数组
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id);
}

//批量删除
const deleteByIds = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的用户');
    return;
  }
  ElMessageBox.confirm('此操作将永久删除选中的用户, 是否继续?', '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {// 确定
    const result = await deleteApi(selectedIds.value);
    if (result.code) {
      ElMessage.success('删除成功');
      search();
    } else {
      ElMessage.error(result.message);
    }
  }).catch(() => {// 取消
    ElMessage.info('已取消删除');
  });
}



</script>

<template>
  <el-text type="primary" size="large">用户管理</el-text>

  <!-- 搜索表单 -->
  <div class="container">
    <el-form :inline="true" :model="searchUser" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchUser.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="searchUser.gender" placeholder="请选择性别" clearable>
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="Info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 功能按钮 -->
  <div class="container">
    <el-button type="primary" @click="addUser">+ 新增用户</el-button>
    <el-button type="danger" @click="deleteByIds">- 批量删除</el-button>
  </div>

  <!-- 表格 -->
  <div class="container">
    <el-table :data="userList" border style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="姓名" width="150" align="center" />
      <el-table-column prop="username" label="用户名" width="150" align="center" />
      <el-table-column prop="gender" label="性别" width="150" align="center">
        <template #default="scope">
          {{ scope.row.gender == 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话号码" width="200" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="250" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row.id)"><el-icon><EditPen /></el-icon>编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteById(scope.row.id)"><el-icon><Delete /></el-icon>删除</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>

  <!-- 分页条 -->
  <div class="container">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
      :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>

  <!-- 新增用户/修改用户对话框 -->
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="40%">
    <el-form :model="user" label-width="80px" :rules="rules" ref="userFormRef">

      <el-form-item label="姓名" prop="name">
        <el-input v-model="user.name" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username" placeholder="请输入用户名(学号)"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="user.password" placeholder="请输入密码" type="password" show-password></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="user.gender" placeholder="请选择性别">
          <!-- <el-option v-for="g in genders" :label="g.name" :value="g.value" :key="g.value" /> -->
          <el-option v-for="g in genders" :label="g.name" :value="g.value" :key="g.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="info" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>


</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
