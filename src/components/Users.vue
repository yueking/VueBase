<template>
  <div>
    <h3>用户列表</h3>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" @keydown.enter.native="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip
              effect="dark"
              content="设置权限"
              placement="top"
              :enterable="false"
            >
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
    };
  },
  methods: {
    async getUserList() {
      const { data: result } = await this.$http.get("users", { params: this.queryInfo });
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg);
      } else {
        // this.$message.success(result.meta.msg);
        this.userList = result.data.users;
        this.total = result.data.total;
      }
      // console.log("userList:", result);
    },
    handleSizeChange(newSize) {
      console.log("newSize", newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      console.log("newPage", newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChange(userInfo) {
      const { data: result } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (result.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error(result.meta.msg);
      }else{
        this.$message.success(result.meta.msg);
      }
    },
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped></style>
