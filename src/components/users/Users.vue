<template>
  <div>
    <h3>Hello</h3>
    <h3>用户列表</h3>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            clearable
            placeholder="请输入内容"
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
          >添加用户
          </el-button
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
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="openDelDialog(scope.row.id)"
            ></el-button>
            <el-tooltip
              :enterable="false"
              content="设置权限"
              effect="dark"
              placement="top"
            >
              <el-button icon="el-icon-setting" size="mini" type="warning"
                         @click="openPermissionDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 5, 10]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>

    <el-dialog :visible.sync="addUserDialogVisible" title="添加用户" width="50%">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        class="demo-ruleForm"
        label-width="100px"
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

    <el-dialog :visible.sync="editUserDialogVisible" title="修改用户" width="50%">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        class="demo-ruleForm"
        label-width="100px"
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
      </span>
    </el-dialog>

    <el-dialog :visible.sync="permissionDialogVisible" title="分配权限" width="50%" @close="closePermissionDialog">
      <el-form
        ref="permissionForm"
        :model="userInfo"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名称:" prop="username">
          {{ userInfo.username }}
        </el-form-item>
        <el-form-item label="当前角色:" prop="role_name">
          {{ userInfo.role_name }}
        </el-form-item>
        <el-form-item label="选择角色:" prop="option">
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义数据验证规则
    var checkMobile = (rule, value, callback) => {
      // const regMobile = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])d{8}$/;
      // const regMobile = /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])d{8}$/
      const regMobile = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('输入合法的手机号'))
      }
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      selectRoleId: '',
      roles: [],
      userList: [],
      total: 0,
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      permissionDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        id: 0
      },
      userInfo: {
        username: '',
        id: 0,
        role_name: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '用户名3-15',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '密码3-15',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getRoles () {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg)
      } else {
        this.roles = result.data
      }
    },
    async getUserList () {
      const { data: result } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg)
      } else {
        // this.$message.success(result.meta.msg);
        this.userList = result.data.users
        this.total = result.data.total
      }
      // console.log("userList:", result);
    },
    handleSizeChange (newSize) {
      // console.log("newSize", newSize);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      // console.log("newPage", newPage);
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange (userInfo) {
      const { data: result } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (result.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(result.meta.msg)
      } else {
        this.$message.success(result.meta.msg)
      }
    },
    // 重置表单
    resetAddForm () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // todo working
        const { data: result } = await this.$http.post('users', this.addForm)
        if (result.meta.status !== 201) {
          this.$message.error(result.meta.msg)
        } else {
          this.$message.success(result.meta.msg)
          this.addUserDialogVisible = false
          this.addForm = {}
          this.getUserList()
        }
      })
    },
    async openEditDialog (id) {
      const { data: result } = await this.$http.get(`users/${id}`)
      if (result.meta.status !== 200) return
      this.editUserDialogVisible = true
      this.editForm = result.data
    },
    async modifyUser () {
      await this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        if (result.meta.status !== 200) {
          this.$message.error(result.meta.msg)
        } else {
          this.$message.success(result.meta.msg)
          this.editUserDialogVisible = false
          this.editForm = {}
          await this.getUserList()
        }
      })
    },
    async deleteUser (id) {
      const { data: result } = await this.$http.delete(`users/${id}`)
      if (result.meta.status !== 200) return false
      this.$message.success('删除成功')
      return true
    },
    //   async openDelDialog (id) {
    //     await this.$confirm('此操作将永久删除?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.deleteUser(id)
    //       this.getUserList()
    //     }).catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       })
    //     })
    //   }
    async openDelDialog (id) {
      const confirmResult = await this.$confirm('此操作将永久删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        this.$message.info('取消')
      } else {
        await this.deleteUser(id)
        await this.getUserList()
      }
    },
    openPermissionDialog (user) {
      this.getRoles()
      this.userInfo = user
      this.permissionDialogVisible = true
    },
    closePermissionDialog () {
      this.selectRoleId = ''
      this.userInfo = {}
      this.permissionDialogVisible = false
    },
    async updateUserRole () {
      if (!this.selectRoleId) {
        this.$message.error('请选择用户角色')
      } else {
        const { data: result } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
        if (result.meta.status !== 200) {
          this.$message.error(result.meta.msg)
        } else {
          this.$message.success(result.meta.msg)
          await this.getUserList()
          // console.log('updateRole:', result)
          this.closePermissionDialog()
        }
      }
    }
  },
  created () {
    this.getUserList()
    this.getRoles()
  }
}
</script>

<style lang="less" scoped></style>
