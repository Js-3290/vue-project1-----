<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { queryPageApi, queryAllTypeApi, addApi, queryInfoApi, updateApi,deleteApi } from '@/api/act'

//元数据
const activityType = ref([])


onMounted(() => {
  search()
  queryAllType()
})

//表单数据
const searchAct = ref({
  name: '',
  typeId: '',
  data: [],
  begin: '',
  end: ''
})

//侦听data
watch(() => searchAct.value.data, (newVal, oldVal) => {
  if (newVal.length == 2) {
    searchAct.value.begin = newVal[0]
    searchAct.value.end = newVal[1]
  } else {
    searchAct.value.begin = ''
    searchAct.value.end = ''
  }
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

//查询活动列表
const search = async () => {
  const result = await queryPageApi(searchAct.value.name, searchAct.value.typeId,
    searchAct.value.begin, searchAct.value.end, currentPage.value, pageSize.value)
  if (result.code) {
    actList.value = result.data.rows
    total.value = result.data.total
  }
}

//清空查询条件
const clear = () => {
  searchAct.value = {
    name: '',
    typeId: '',
    data: [],
    begin: '',
    end: ''
  }
  search()
}

const actList = ref([])

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

//定义表单引用
const actFormRef = ref()

//表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  typeId: [
    { required: true, message: '请选择活动类型', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入活动地点', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择活动开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择活动结束时间', trigger: 'change' }
  ],
  maxPeople: [
    { required: true, message: '请输入最大人数', trigger: 'blur' },
    
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ]
}


//新增活动
const addAct = () => {
  dialogVisible.value = true
  dialogTitle.value = '新增活动'
  act.value = {
    name: '',
    typeId: '',
    location: '',
    startTime: '',
    endTime: '',
    maxPeople: '',
    description: ''
  }
  if (actFormRef.value) {
    actFormRef.value.resetFields()
  }
}

//保存活动
const save = async () => {
  // 表单验证
  if (!actFormRef.value) return;
  actFormRef.value.validate(async (valid) => {
    if (valid) {//通过验证

      let result;

      if (act.value.id) {//修改
        result = await updateApi(act.value)
      } else {//新增
        result = await addApi(act.value)
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

//编辑活动
const edit = async (id) => {
  dialogVisible.value = true
  dialogTitle.value = '编辑活动'
  const result = await queryInfoApi(id)
  if (result.code) {
    act.value = result.data
  } else {
    ElMessage.error(result.message)
  }
}

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

//记录勾选用户的id
const selectedIds = ref([]);
//复选框变化时触发 selection为当前选中的行数据数组
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id);
}

//删除用户
const deleteById = async (id) => { 
  ElMessageBox.confirm('此操作将永久删除该活动, 是否继续?', '提示',
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

//批量删除
const deleteByIds = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的活动');
    return;
  }
  ElMessageBox.confirm('此操作将永久删除选中的活动, 是否继续?', '提示',
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
  <el-text type="primary" size="large">活动管理</el-text>

  <!-- 搜索表单 -->
  <div class="container">
    <el-form :inline="true" :model="searchAct" class="demo-form-inline">
      <el-form-item label="活动名称">
        <el-input v-model="searchAct.name" placeholder="活动名称" clearable />
      </el-form-item>

      <el-form-item label="活动类型">
        <el-select v-model="searchAct.typeId" placeholder="活动类型" clearable>
          <el-option v-for="type in activityType" :label="type.name" :value="type.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="活动开始时间">
        <el-date-picker v-model="searchAct.data" type="daterange" range-separator="到" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD" />

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="Info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 功能按钮 -->
  <div class="container">
    <el-button type="primary" @click="addAct">+ 新增活动</el-button>
    <el-button type="danger" @click="deleteByIds">- 批量删除</el-button>
  </div>

  <!-- 表格 -->
  <div class="container">
    <el-table :data="actList" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
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


      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="warning" size="mini" @click="detail(scope.row.id)"><el-icon>
              <View />
            </el-icon>详情</el-button>
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

  <!-- 分页条 -->
  <div class="container">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
      :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
