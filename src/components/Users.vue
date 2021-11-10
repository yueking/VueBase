<template>
  <div>
    <h3>用户列表</h3>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @keydown.enter.native="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true"
            >添加用户</el-button
          >
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
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="openEditDialog(scope.row.id)"
            ></el-button>
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

    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddForm">重 置</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

<<<<<<< HEAD
    <el-dialog title="修改用户" :visible.sync="editUserDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="登录密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item> -->
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyUser">确 定</el-button>
=======
    <el-dialog
      title="删除"
      :visible.sync="delUserDialogVisible"
      width="50%"
    >
     <span>确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
>>>>>>> users
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义数据验证规则
    var checkMobile = (rule, value, callback) => {
      // const regMobile = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])d{8}$/;
      // const regMobile = /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])d{8}$/
      const regMobile = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("输入合法的手机号"));
      }
    };

    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
       editForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        id:0
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "用户名3-15", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "密码3-15", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "用户名3-15", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "密码3-15", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getUserList() {
      const { data: result } = await this.$http.get("users", {
        params: this.queryInfo,
      });
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
      } else {
        this.$message.success(result.meta.msg);
      }
    },
    //重置表单
    resetAddForm() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //todo working
        const { data: result } = await this.$http.post("users", this.addForm);
        if (result.meta.status !== 201) {
          this.$message.error(result.meta.msg);
        } else {
          this.$message.success(result.meta.msg);
          this.addUserDialogVisible = false;
          this.getUserList();
        }
      });
    },
    async openEditDialog(id) {
      const { data: result } = await this.$http.get(`users/${id}`);
      if (result.meta.status !== 200) return;
      this.editUserDialogVisible = true;
      this.editForm = result.data;
      console.log("getUser:", result);
      console.log("editForm:", this.editForm);
    },
    async modifyUser(){
      const {data:result} = await this.$http.put('users/'+this.editForm.id,this.editForm)
      if(result.meta.status !== 200){
        this.$message.error(result.meta.msg)
      }else{
        this.$message.success(result.meta.msg)
        this.editUserDialogVisible = false;
        this.editForm = {}
        this.getUserList();
      }
    }
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped></style>
