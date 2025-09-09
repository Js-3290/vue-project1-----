<script setup>
import { ref, onMounted } from 'vue'
import { getAllApi, addApi, getByIdApi, updateApi, deleteApi } from '@/api/actType'
import { ElMessage, ElMessageBox } from 'element-plus'

const typeList = ref([]);

const search = async () => {
  const result = await getAllApi();
  if (result.code) {
    typeList.value = result.data;
  } else {
    ElMessage.error(result.message);
  }
}

onMounted(() => {
  search();
})

// dialog对话框
const dialogTitle = ref('新增活动类型')
const dialogVisible = ref(false)

// 表单数据
const actType = ref({
  id: '',
  name: '',
  createTime: ''
})


const actTypeFormRef = ref();

// 表单验证
const rules = ref({
  name: [
    { required: true, message: '请输入活动类型', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ]
})

// 新增
const addType = async () => {
  dialogVisible.value = true;
  dialogTitle.value = '新增活动类型';
  actType.value = { id: '', name: '' }
  if (actTypeFormRef.value) {
    actTypeFormRef.value.resetFields();
  }

}

// 保存
const save = async () => {
  // 表单验证
  if (!actTypeFormRef.value) return;
  actTypeFormRef.value.validate(async (valid) => {
    if (valid) {//通过验证
      let result;
      if (actType.value.id) {//修改
        result = await updateApi(actType.value)
        if (result.code) {
          ElMessage.success('修改成功')
          dialogVisible.value = false;
          search();
        } else {
          ElMessage.error(result.message)
        }
      } else {//新增
        result = await addApi(actType.value)
        if (result.code) {
          ElMessage.success('新增成功')
          dialogVisible.value = false;
          search();
        } else {
          ElMessage.error(result.message)
        }
      }
    } else {//未通过验证
      ElMessage.error('请填写正确的数据')
    }
  })

}

// 编辑
const edit = async (id) => {
  const result = await getByIdApi(id);
  if (result.code) {
    dialogVisible.value = true;
    dialogTitle.value = '编辑活动类型';
    actType.value = result.data;
  } else {
    ElMessage.error(result.message);
  }
}


// 删除
const deleteById = async (id) => {
  ElMessageBox.confirm('此操作将永久删除该活动类型, 是否继续?', '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
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

</script>

<template>

  <el-text type="primary" size="large">活动类型管理</el-text>

  <!-- 功能按钮 -->
  <div class="container">
    <el-button type="primary" @click="addType">+ 新增活动类型</el-button>
  </div>

  <!-- 表格 -->
  <div class="container">
    <el-table :data="typeList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="150" align="center" />
      <el-table-column prop="name" label="活动类型" width="250" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="300" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row.id)"><el-icon>
              <EditPen />
            </el-icon>编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteById(scope.row.id)"><el-icon>
              <Delete />
            </el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 新增活动类型/修改活动类型对话框 -->
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="40%">

    <el-form :model="actType" :rules="rules" label-width="80px" ref="actTypeFormRef">

      <el-form-item label="活动类型" prop="name" width="80px">
        <el-input v-model="actType.name" placeholder="请输入活动类型"></el-input>
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