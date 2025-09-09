<script setup>
import router from "@/router";
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'


//当前登录用户
const loginName = ref()


onMounted(() => {
  const loginUser = JSON.parse(localStorage.getItem('loginUser'));
  if (loginUser && loginUser.name) {
    loginName.value = loginUser.name
  }
})

// 退出登录方法
const logout = () => {
  ElMessageBox.confirm('即将退出登录, 是否继续?', '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {// 确定
    ElMessage.success('退出登录成功')
    localStorage.removeItem('loginUser')
    router.push('/login')
  }).catch(() => {// 取消
    ElMessage.info('已取消退出登录');
  });

}

const route = useRoute()

</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header区域 -->
      <el-header class="header">
        <span class="title">校园活动一体化管理平台</span>
        <span class="right-tool">
          
          <a href="javascript:;" class="link-style" @click.prevent="logout">
            <el-icon>
              <SwitchButton />
            </el-icon>退出登录[{{ loginName }}]
          </a>
          
        </span>

      </el-header>

      <!-- Body区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px" class="aside">
          <el-menu router>

            <!-- 首页 -->

            <el-menu-item index="/UserIndex">
              <el-icon>
                <Grid />
              </el-icon> 首页
            </el-menu-item>



            <!-- 活动信息管理 -->
            <el-sub-menu index="/message">
              <template #title>
                <el-icon>
                  <HomeFilled />
                </el-icon>活动信息管理
              </template>
              <el-menu-item index="/UserActRegister"><el-icon>
                  <User />
                </el-icon>活动报名</el-menu-item>
              <el-menu-item index="/UserActCreate"><el-icon>
                  <Notification />
                </el-icon>我创建的活动</el-menu-item>
                <el-menu-item index="/UserActJoin"><el-icon>
                  <Notification />
                </el-icon>我参加的活动</el-menu-item>
            </el-sub-menu>


            <!-- 个人信息 -->
            <el-menu-item index="/UserInfo">
              <el-icon>
                <User />
              </el-icon> 个人信息
            </el-menu-item>
            

            
            
          </el-menu>
        </el-aside>

        <!-- 中间核心展示区域 -->
        <el-main class="main-content" :class="{ 'no-padding': route.name === 'UserIndex' }">
          <router-view></router-view>
        </el-main>

      </el-container>

    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100vh;
  margin: 0;
}

.el-container {
  height: 100%;
}

.header {
  background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
  color: white;
  line-height: 60px;
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.el-aside {
  background-color: #e0f7ff; /* 浅蓝色 */
  color: #333;
  text-align: center;
  line-height: 200px;
}



/* 修改密码和退出登录靠右 */
.right-tool {
  float: right;
  margin-right: 20px;
  font-size: 20px;
  line-height: 100px;

}

.link-style {
  text-decoration: none;
  /* 楷体 */
  font-family: "楷体";
}


.title {
  font-size: 60px;
  font-weight: bold;
  /* 设置为楷体 */
  font-family: "楷体";
  /* 上下间居中 */
  line-height: 100px;
}

.main-content {
  padding: 20px;
}

.no-padding {
  padding: 0;
}
</style>
