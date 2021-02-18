<template>
  <div class="table">
    <el-table
      stripe
      :data="state.tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%"
    >
      <el-table-column
        v-if="show"
        prop="id"
        label="id"
        width="0"
      >
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="日期"
        width="250"
      >
        <template #default="scope">
          <div>
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ dateFormat(scope.row.create_time) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名"
        width="180"
      >
        <template #default="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="email"
        label="邮箱"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="telephone"
        label="手机号"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="role_name"
        label="角色"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="is_superuser"
        label="是否是管理员"
        width="150"
      >
        <template #default="scope">
          <el-tag>{{scope.row.is_superuser?"是":"否"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        label="操作"
      >
        <template #default="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>

          <el-popconfirm
            title="确定删除吗？"
            @confirm="deleteUser(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button
                size="mini"
                type="danger"
              >删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        :page-sizes="state.pageArray"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:currentPage="state.currentPage"
        :total="state.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import req from "../../http/http";

export default {
  name: "index",
  setup() {
    const currentPage = ref(0);
    const limit = ref(10);
    const visible = ref(false);
    const state = reactive({
      tableData: [],
      currentPage: 0,
      limit: 10,
      total: 0,
      pageArray: [5, 10, 20, 50, 100],
    });

    function getUsers() {
      req(
        "get",
        "users/?page=" + state.currentPage + "&limit=" + state.limit
      ).then((response) => {
        // console.log(response)
        state.tableData = response.data;
        state.total = response.count;
      });
    }

    function deleteUser(index, item) {
      console.log(index);
      console.log(item.id);
      req("delete", "users/" + item.id).then((response) => {
        ElMessage.success({
          message: "删除用户" + response.name + "成功",
          type: "success",
        });
        getUsers();
      });
    }

    const dateFormat = (dateStr) => {
      return dateStr.replace("T", " ");
    };

    const handleSizeChange = (size) => {
      state.limit = size;
      getUsers();
    };

    const handleCurrentChange = (page) => {
      if (page) {
        state.currentPage = page;
        getUsers();
      }
    };

    onMounted(() => {
      getUsers(currentPage.value * limit.value, limit.value);
    });

    return {
      currentPage,
      state,
      limit,
      visible,
      dateFormat,
      deleteUser,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.table {
  font: 15px/1.5 tahoma, arial, \5b8b\4f53;
  margin: 10px 20px;

  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  /*box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);*/
  /*height: 680px;*/
  padding: 10px;
  /*background-color: rgba(0, 0, 0, .1);*/
  .page {
    margin-left: 50%;
    margin-top: 20px;
  }
}
</style>