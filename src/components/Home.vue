<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" class="logo"/>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true"> -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模版 -->
            <template slot="title">
              <!-- <i class="el-icon-location"></i> -->
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!-- <router-link :to="subItem.path"> -->
                <span> {{ subItem.authName }} </span>
                <!-- </router-link> -->
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- Main -->
          <router-view/>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: result } = await this.$http.get('menus')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.menuList = result.data
      // console.log('menuList:', this.menuList)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (path) {
      // sessionStorage.removeItem("activePath");
      sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  },
  created () {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
    // console.log("router:", this.$router);
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  color: white;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin: 20px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.el-footer {
  background-color: #c4c9cf;
  height: 10%;
}

.logo {
  height: 15%;
  width: 15%;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.breadcrumb {
  padding-left: -200px;
}
</style>
