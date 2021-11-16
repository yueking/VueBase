<template>
  <div>
    <h3>
      权限列表
    </h3>
    <el-card class="box-card">
      <el-table :data="rights" border stripe>
        <el-table-column type="index"></el-table-column>
        <!--        <el-table-column label="id" prop="id"></el-table-column>-->
        <el-table-column label="名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="level" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level ==='0' ">一级</el-tag>
            <el-tag v-else-if="scope.row.level ==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column label="pid" prop="pid"></el-table-column>-->
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rights: []
    }
  },
  methods: {
    async getRightList () {
      const { data: result } = await this.$http.get('rights/list')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.rights = result.data
    }
  },
  created () {
    this.getRightList()
  }
}
</script>
