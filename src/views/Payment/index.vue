<template>
  <div class="body">
    <el-date-picker
      v-model="timeList"
      type="daterange"
      format="YYYY 年 MM 月 DD 日"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="state.defaultTime"
      :shortcuts="state.shortcuts"
      :disabled-date="state.disabledDate"
    >
    </el-date-picker>

    <!--账单数据导入功能-->
    <el-button
      type="primary"
      @click="dialogVisible = true"
    >数据导入<i class="el-icon-upload el-icon--right"></i>
    </el-button>
    <el-dialog
      title="账单数据导入"
      v-model="dialogVisible"
      width="30%"
    >
      <div class="searchChoice">
        <el-radio
          v-model="source"
          label="alipay"
        >支付宝</el-radio>
        <el-radio
          v-model="source"
          label="weixinpay"
        >微信</el-radio>
      </div>
      <el-upload
        class="upload"
        drag
        action="http://localhost:8080/api/v1/payments/file/"
        :on-success="handleOnSuccess"
        multiple
        :headers="state.headers"
        ref="uploadTarget"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 xls/csv 文件，且不超过 500kb
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleImportData"
          >导 入</el-button>
        </span>
      </template>
    </el-dialog>

    <!--批量编辑功能-->
    <el-button @click="editDialogVisible = true">批量编辑<i class="el-icon-edit el-icon--right"></i>
    </el-button>
    <el-dialog
      title="批量编辑"
      v-model="editDialogVisible"
      width="30%"
    >
      <span>交易类型: </span>
      <el-select
        v-model="state.value"
        placeholder="请选择"
      >
        <el-option
          v-for="item in state.options"
          :key="item.id"
          :label="item.type_name"
          :value="item.id"
        >
          <!--                    <svg-icon :icon-class="item.type_name?item.type_name:'未知'" class-name="option-icon" />-->
          <!--                    <span style="float: left">{{ item.type_name }}</span>-->
        </el-option>

      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleEditData"
          >修 改</el-button>
        </span>
      </template>
    </el-dialog>

    <!--重置功能-->
    <el-button
      v-show="showReset"
      @click="reset"
      type="info"
      icon="el-icon-refresh-right"
      circle
    ></el-button>
    <el-divider></el-divider>
    <div class="search">
      <el-collapse-transition>
        <div
          v-if="searchVisible"
          class="testshow"
        >
          <div class="searchType">
            <b>交易类型:</b>
            <el-radio-group
              v-model="state.filterOption"
              size="small"
            >
              <el-radio-button
                v-for="option in state.options"
                :label="option.id"
                :key="option.type_flag"
              >{{option.type_name}}</el-radio-button>
              <el-radio-button label=null>未知</el-radio-button>
            </el-radio-group>
          </div>
          <div class="searchLineOne">
            <b>交易方:</b>
            <el-input
              autosize
              v-model="state.counterParty"
              placeholder="请输入交易方名称"
            ></el-input>
          </div>
          <div class="searchLineTwo">
            <b>商品名称:</b>
            <el-input
              autosize
              v-model="state.productName"
              placeholder="请输入商品名称"
            ></el-input>
            <el-button @click="startSearch">搜 索</el-button>
          </div>

        </div>
      </el-collapse-transition>
      <i
        class="el-icon-caret-bottom"
        :class="{go:searchVisible , aa :!searchVisible}"
      ></i>
      <span @click="handleSearch">{{ searchVisible?"基本筛选":"高级筛选" }}</span>
    </div>

    <el-table
      ref="multipleTable"
      :data="state.tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="分类"
        width="55"
      >
        <template #default="scope">
          <svg-icon
            :icon-class="scope.row.type?scope.row.type.type_name:'未知'"
            class-name="card-panel-icon"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="日期"
        width="150"
      >
        <template #default="scope">
          <div class="date">
            <span>{{ scope.row.create_time.split("T")[0] }}</span>
          </div>
          <div class="time">
            <span>{{ scope.row.create_time.slice(11, 16) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="product_name"
        label="商品名称&nbsp;&nbsp;|&nbsp;&nbsp;交易方"
      >
        <template #default="scope">
          <div class="product_name">
            {{ scope.row.product_name }}
          </div>
          <div class="counter_party">
            {{ scope.row.counter_party }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        prop="payment"
        label="金额"
        width="150"
        :filters="[{ text: '支出', value: '支出' }, { text: '收入', value: '收入' }]"
        :filter-method="filterPayment"
      >
        <template #default="scope">
          <div class="money">
            {{ (scope.row.payment=="支出"?"-":"+") + " " + scope.row.money.toFixed(2)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        label="操作"
        width="150"
      >
        <template #default="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
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
        :total="state.count"
      ></el-pagination>
    </div>
  </div>

</template>

<script>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import req from "../../http/http";

export default {
  name: "index",
  props: {
    visible: String,
  },
  setup(props) {
    const fileName = ref("");
    const dialogVisible = ref(false);
    const editDialogVisible = ref(false);
    const searchVisible = ref(false);
    const timeList = ref([]);
    const multipleTable = ref("");
    const source = ref("alipay");
    const uploadTarget = ref(null);
    const state = reactive({
      currentPage: 0,
      limit: 10,
      pageArray: [10, 20, 50, 100, 500],
      tableData: [],
      tableSelectionData: [],
      options: [],
      filterOption: "",
      value: "",
      count: 0,
      totalPage: 1,
      counterParty: "",
      productName: "",
      defaultTime: [
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 2, 1, 23, 59, 59),
      ], // '00:00:00', '23:59:59'
      shortcuts: [
        {
          text: "最近一周",
          value: (() => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          })(),
        },
        {
          text: "最近一个月",
          value: (() => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          })(),
        },
        {
          text: "最近三个月",
          value: (() => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
          })(),
        },
      ],
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"), //从cookie里获取token，并赋值  Authorization ，而不是token
      },
    });

    function getUsers(
      page = 0,
      limit = 10,
      timeList,
      counterParty = null,
      productName = null,
      filterOption = ""
    ) {
      let url = "";
      if (timeList && timeList.length > 0) {
        const startTime = dayjs(timeList[0]).format("YYYY-MM-DDTHH:mm:ss");
        const endTime = dayjs(timeList[1]).format("YYYY-MM-DDTHH:mm:ss");
        url =
          "payments/?page=" +
          page +
          "&limit=" +
          limit +
          "&start_time=" +
          startTime +
          "&end_time=" +
          endTime;
      } else {
        url = "payments/?page=" + page + "&limit=" + limit;
      }

      // 有则传入查询，没有则不查
      if (counterParty) {
        url += "&counter_party=" + counterParty;
      }
      if (productName) {
        url += "&product_name=" + productName;
      }

      if (filterOption) {
        url += "&trade_type=" + filterOption;
      }

      req("get", url).then((response) => {
        state.tableData = response.data;
        state.totalPage = response.total_page;
        state.count = response.count;
      });
    }

    const dateFormat = (dateStr) => {
      return dateStr.replace("T", " ");
    };

    const handleSizeChange = (size) => {
      state.limit = size;
      getUsers(
        state.currentPage,
        state.limit,
        timeList.value,
        state.counterParty,
        state.productName,
        state.filterOption
      );
    };

    const handleCurrentChange = (pageNum) => {
      state.currentPage = pageNum;
      getUsers(
        state.currentPage,
        state.limit,
        timeList.value,
        state.counterParty,
        state.productName,
        state.filterOption
      );
    };

    const handleDelete = (index, row) => {
      console.log(index);
      req("delete", "payments/" + row.id).then((response) => {
        console.log(response);
        ElMessage.success({
          message: "删除数据成功",
          type: "success",
        });
        getUsers(
          state.currentPage,
          state.limit,
          timeList.value,
          state.counterParty,
          state.productName,
          state.filterOption
        );
      });
    };

    const handleOnSuccess = (response) => {
      if (response) {
        ElMessage.success({
          message: "文件上传成功了，请点击开始导入",
          type: "success",
        });
        fileName.value = response.fileName;
      }
    };

    const handleImportData = () => {
      const data = {
        file_name: fileName.value,
        data_source: source.value,
      };
      req("put", "payments/import/", JSON.stringify(data)).then((response) => {
        const total = response.total;
        if (total === 0) {
          ElMessage.error({
            message: "数据已存在，不需要重复导入哦😘",
            type: "error",
          });
        } else {
          ElMessage.success({
            message: "成功导入" + response.total + "条数据",
            type: "success",
          });
          uploadTarget.value.clearFiles();
          dialogVisible.value = false;
          getUsers(state.currentPage, state.limit, timeList.value);
        }
      });
    };

    const handleSelectionChange = (val) => {
      // 勾选时，将勾选项赋值给tableSelectionData
      state.tableSelectionData = val;
    };

    const handleEditData = () => {
      if (state.tableSelectionData.length === 0 || state.value === "") {
        ElMessage.warning({
          message: "未勾选数据哦",
          type: "warning",
        });
      } else {
        state.tableSelectionData = state.tableSelectionData.map((item) => {
          item.trade_type = state.value;
          return item;
        });
        req("put", "payments/", JSON.stringify(state.tableSelectionData)).then(
          (response) => {
            const total = response.total;
            if (total === 0) {
              ElMessage.error({
                message: "修改数据失败咯",
                type: "error",
              });
            } else {
              ElMessage.success({
                message: "成功修改" + response.total + "条数据",
                type: "success",
              });
              editDialogVisible.value = false;
              getUsers(
                state.currentPage,
                state.limit,
                timeList.value,
                state.counterParty,
                state.productName,
                state.filterOption
              );
            }
          }
        );
      }
    };

    const getTypeOptions = () => {
      req("get", "trade_type/").then((response) => {
        state.options = response;
      });
    };

    const handleSearch = () => {
      searchVisible.value = !searchVisible.value;
    };

    const startSearch = () => {
      if (
        state.counterParty === "" &&
        state.productName === "" &&
        state.filterOption === ""
      ) {
        ElMessage.warning({
          message: "请输入关键字哦",
          type: "warning",
        });
      } else {
        getUsers(
          state.currentPage,
          state.limit,
          timeList.value,
          state.counterParty,
          state.productName,
          state.filterOption
        );
      }
    };

    const filterPayment = (value, row) => {
      return row.payment === value;
    };

    const reset = () => {
      timeList.value = [];
      state.counterParty = "";
      state.productName = "";
      state.filterOption = "";
    };

    onMounted(() => {
      console.log(props);
      if (props.visible) {
        dialogVisible.value = true;
      }
      getUsers(state.currentPage, state.limit);
      getTypeOptions();
    });

    // 监听器
    watch(timeList, (afterValue, beforeValue) => {
      if (afterValue) {
        getUsers(state.currentPage, state.limit, afterValue);
      } else if (beforeValue) {
        getUsers(state.currentPage, state.limit);
      }
    });

    return {
      timeList,
      state,
      source,
      dialogVisible,
      editDialogVisible,
      searchVisible,
      fileName,
      uploadTarget,
      multipleTable,
      showReset: computed(() => {
        return (
          timeList.value.length !== 0 ||
          state.counterParty ||
          state.productName ||
          state.filterOption
        );
      }),
      dateFormat,
      handleSizeChange,
      handleCurrentChange,
      handleOnSuccess,
      handleImportData,
      handleDelete,
      handleSelectionChange,
      handleEditData,
      handleSearch,
      startSearch,
      filterPayment,
      reset,
    };
  },
};
</script>

<style lang="scss" scoped>
.body {
  width: 60%;
  margin: 0 250px;

  .page {
    float: right;
    margin-top: 20px;
  }

  > .el-divider {
    margin: 14px 0;
  }

  > .el-button {
    float: right;
    margin-left: 10px;
  }

  > .is-circle {
    background-color: white;
    border-color: white;
    color: #2b4b6b;
    font-weight: 800;
    font-size: 20px;
    margin-top: -4px;
  }

  > .is-circle:hover {
    background-color: #b3d4fc;
    border-color: #b3d4fc;
    color: white;
    font-weight: 900;
    font-size: 22px;
  }
}

.has_gutter .el-table_1_column_1 {
  padding-left: 10px;
}

.date,
.product_name {
  font: 12px/1.5 tahoma, arial, \5b8b\4f53;
  padding-top: 6px;
}

.time,
.counter_party {
  font: 12px/1.5 tahoma, arial, \5b8b\4f53;
  color: rgba(0, 0, 0, 0.3);
  padding-bottom: 6px;
}

.product_name {
  font-weight: 400;
}

.money {
  font-size: 16px;
  font-weight: 400;
}

.el-dialog__body {
  border-top: 1px solid rgba(0, 21, 41, 0.08);
  /*box-shadow: 0 1px 4px rgba(0, 21, 41, .08);*/
  padding: 20px 20px 20px 20px;

  .searchChoice {
    margin-bottom: 10px;
  }

  .el-upload-dragger {
    width: 28vw;
    height: 180px;
  }
}

.card-panel-icon {
  /*float: left;*/
  font-size: 30px;
}

.search {
  font: 12px/1.5 tahoma, arial, \5b8b\4f53;

  span,
  i {
    float: right;
    color: rgb(0, 170, 238);
  }

  i {
    font-size: 20px;
  }

  span:hover {
    cursor: pointer;
    color: rgb(0, 136, 204);
  }

  .el-input {
    border-radius: 1px;
    display: inline-block;
    width: 200px;
  }

  .searchType {
    margin-bottom: 10px;
    .el-radio-group {
      margin-left: 18px;

      span {
        color: black;
        font-weight: 600;
      }
    }
  }

  .searchLineOne {
    b {
      margin-right: 30px;
    }
  }

  .searchLineTwo {
    margin-top: 10px;
    .el-input {
      margin-left: 18px;
      margin-right: 20px;
    }
    .el-button {
      display: inline-flex;
    }
  }
}

.aa {
  transition: all 0.2s;
}

.go {
  transform: rotate(180deg);
  transition: all 0.2s;
}
</style>