<template>
  <div>
    <h3>
      角色列表
    </h3>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roles" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(role,index) in scope.row.children" :key="role.id"
                    :class="['borderBottom','vcenter',index === 0?'borderTop':'']">
              <el-col :span="2">
                <el-tag closable @close="removePermissionById(scope.row,role.id)">{{ role.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="22">
                <el-row v-for="(sub,s1) in role.children" :key="sub.id" :class="[s1 === 0?'':'borderTop','vcenter']">
                  <el-col :span="2">
                    <el-tag closable type="success" @close="removePermissionById(scope.row,sub.id)">{{
                        sub.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="22">
                    <el-tag v-for="sub2 in sub.children" :key="sub2.id" closable type="warning"
                            @close="removePermissionById(scope.row,sub2.id)">{{
                        sub2.authName
                      }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色说明" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template scope="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="openEditRoleDialog(scope.row)">编辑
            </el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="openDeleteDialog(scope.row.id)">删除
            </el-button>
            <el-tooltip
              :enterable="false"
              content="分配权限"
              effect="dark"
              placement="top"
            >
              <el-button icon="el-icon-setting" size="mini" type="warning" @click="openPermissionDialog(scope.row)">分配权限
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :visible.sync="addRoleDialogVisible" title="添加角色" width="50%">
      <el-form
        ref="addRoleFormRef"
        :model="roleForm"
        :rules="roleFormRules"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色说明" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetRoleForm">重 置</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="editRoleDialogVisible" title="修改角色" width="50%" @close="roleDialogClose">
      <el-form
        ref="editRoleFormRef"
        :model="roleForm"
        :rules="roleFormRules"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色说明" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span>{{ roleForm }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="permissionDialogVisible" title="分配权限" width="50%" @close="permissionDialogClose">
      <el-tree ref="permissionTreeRef" :data="permissions" :default-checked-keys="currentTreeNodeKeys"
               :default-expanded-keys="currentTreeNodeKeys"
               :props="treeProps"
               node-key="id"
               show-checkbox
               @node-click="handleNodeClick"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermissions">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roles: [],
      permissions: [],
      permissionDialogVisible: false,
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      currentTreeNodeKeys: [],
      currentRoleId: 0,
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      roleForm: {
        id: 0,
        roleName: '',
        roleDesc: ''
      },
      roleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '角色名:3-15位',
            trigger: 'blur'
          }]
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
        // console.log('roles:', this.roles)
      }
    },
    async getPermisssionTree () {
      const { data: result } = await this.$http.get('rights/tree')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.permissions = result.data
    },
    async deletePerminRolebyId (roleId, rightId) {
      const { data: result } = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg)
      } else {
        this.$message.success(result.meta.msg)
        return result.data
      }
    },
    async modifyPermissions (permissions) {
      // const { data: result } = await this.$http.put(
      //   `users/${userInfo.id}/state/${userInfo.mg_state}`
      // )
      // if (result.meta.status !== 200) {
      //   return this.$message.error(result.meta.msg)
      // } else {
      //   this.$message.success(result.meta.msg)
      // }
    },
    async removePermissionById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除?' + role.id + ':' + rightId, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        this.$message.info('取消')
      } else {
        role.children = await this.deletePerminRolebyId(role.id, rightId)
        // await this.getRoles()
      }
    },
    handleNodeClick (data) {
      console.log(data)
    },
    openPermissionDialog (role) {
      this.getLeafKeys(role, this.currentTreeNodeKeys)
      // console.log('role:', role)
      this.getPermisssionTree()
      this.currentRoleId = role.id
      this.permissionDialogVisible = true
    },
    getLeafKeys (node, arr) {
      // node 节点不包含children 属性
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    permissionDialogClose () {
      this.currentTreeNodeKeys = []
      this.currentRoleId = 0
    },
    async submitPermissions () {
      // const arr1 = this.$refs.permissionTreeRef.getCheckedKeys()
      // const arr2 = this.$refs.permissionTreeRef.getHalfCheckedKeys()
      // const allPermissions = arr1.concat(arr2)
      const allPermissions = [
        ...this.$refs.permissionTreeRef.getCheckedKeys(),
        ...this.$refs.permissionTreeRef.getHalfCheckedKeys()
      ]
      const rids = allPermissions.join(',')
      const { data: result } = await this.$http.post(`roles/${this.currentRoleId}/rights`, { rids: rids })
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      } else {
        this.$message.success(result.meta.msg)
        this.getRoles()
        this.permissionDialogVisible = false
      }
      // console.log(allPermissions)
    },
    async deleteRole (roleId) {
      const { data: result } = await this.$http.delete('roles/' + roleId)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      } else {
        this.$message.success(result.meta.msg)
      }
    },
    async openDeleteDialog (roleId) {
      const confirmResult = await this.$confirm('此操作将永久删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        this.$message.info('取消')
      } else {
        await this.deleteRole(roleId)
        await this.getRoles()
      }
    },
    resetRoleForm () {
      this.roleForm = {}
    },
    async addRole () {
      const { data: result } = await this.$http.post('roles', this.roleForm)
      if (result.meta.status !== 201) {
        return this.$message.error(result.meta.msg)
      } else {
        this.$message.success(result.meta.msg)
        this.roleForm = {}
        await this.getRoles()
        this.addRoleDialogVisible = false
      }
    },
    openEditRoleDialog (roleInfo) {
      this.roleForm = JSON.parse(JSON.stringify(roleInfo))
      this.editRoleDialogVisible = true
    },
    roleDialogClose () {
      this.roleForm = {}
    },
    async updateRole () {
      const { data: result } = await this.$http.put(`roles/${this.roleForm.id}`, this.roleForm)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      } else {
        this.$message.success(result.meta.msg)
        await this.getRoles()
        this.editRoleDialogVisible = false
      }
    }
  },
  created () {
    this.getRoles()
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.borderTop {
  border-top: 1px solid #eeeeee;
}

.borderBottom {
  border-bottom: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
