<template>
  <div>
    <h3>
      商品分类
    </h3>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :columns="columns"
        :data="categories"
        :expand-type="false"
        :selection-type="false"
        border
        show-index
        style="margin-top: 20px"
      >
        <template slot="isOk" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success"
             style="color:lightgreen;font-size: 22px;"></i>
          <i v-else class="el-icon-error" style="color:red;font-size: 22px;"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level ===0 " size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level ===1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>

        <template slot="caoZuo" slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger">删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 5, 10]"
        :total="queryInfo.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>

    <el-dialog :visible.sync="addDialogVisible" title="添加分类" width="50%">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="cat_pid">
          <el-cascader
            ref="cascaderHandleRef"
            v-model="selectedKeys"
            :options="parentCategories"
            :props="cascaderCateProps"
            change-on-select
            clearable
            expand-trigger="hover"
            @change="handleCascaderChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddForm">重 置</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="editDialogVisible" title="修改分类" width="50%">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="addFormRules"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="cat_pid">
          <el-input v-model="editForm.cat_pid"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        type: 3,
        pagenum: 1,
        pagesize: 10,
        total: 0
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          width: '80px',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          width: '80px',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          width: '200px',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'caoZuo'
        }
      ],
      categories: [],
      parentCategories: [],
      cascaderCateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
        // checkStrictly: true,
        // expandTrigger: 'hover'
      },
      selectedKeys: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editForm: {},
      addFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输分类名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '分类名称1-20',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategories()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategories()
    },
    handleCascaderChange () {
      // console.log('selectedKeys:', this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addForm.cat_level = this.selectedKeys.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
      this.$refs.cascaderHandleRef.dropDownVisible = false
    },
    async getCategories () {
      const { data: result } = await this.$http.get('categories', { params: this.queryInfo })
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg)
      } else {
        this.$message.success(result.meta.msg)
        this.queryInfo.total = result.data.total
        this.categories = result.data.result
      }
    },
    async getParentCategories () {
      // 获取二级分类列表
      const { data: result } = await this.$http.get('categories', { params: { type: 2 } })
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg)
      } else {
        this.parentCategories = result.data
      }
    },
    async addCate () {
      const { data: result } = await this.$http.post('categories', this.addForm)
      if (result.meta.status !== 201) {
        this.$message.error(result.meta.msg)
        return false
      } else {
        this.$message.success(result.meta.msg)
        return true
      }
    },
    openAddDialog () {
      this.addDialogVisible = true
      this.getParentCategories()
    },
    resetAddForm () {
      this.addForm = {}
      this.selectedKeys = []
    },
    async submitAddForm () {
      await this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const oky = await this.addCate()
        if (oky) {
          this.$refs.addFormRef.resetFields()
          this.selectedKeys = []
          this.addForm = {}
          this.addDialogVisible = false
          await this.getCategories()
        }
      })
    },
    openEditDialog (cateInfo) {
      this.editDialogVisible = true
      this.editForm = JSON.parse(JSON.stringify(cateInfo))
    },
    closeEditDialog () {
      this.editDialogVisible = false
      this.editForm = {}
    },
    submitEditForm () {
    }

  },
  created () {
    this.getCategories()
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
