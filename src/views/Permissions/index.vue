<template>
    <el-button class="add-button" type="primary" @click="showAddDialog">新增权限</el-button>
    <div class="table">
        <el-table
                stripe
                :data="state.tableData"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                style="width: 100%"
        >
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
                    label="权限名"
                    width="180"
            >
                <template #default="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="codename"
                    label="权限字段"
                    width="150"
            >
                <template #default="scope">
                    <el-tag>{{scope.row.codename}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    align="right"
                    label="操作"
            >
                <template #default="scope">
                    <el-button
                            size="mini"
                            @click="showEditDialog(scope.row)"
                    >编辑
                    </el-button>

                    <el-popconfirm
                            title="确定删除吗？"
                            @confirm="deleteItem(scope.row)"
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
        <el-dialog
                :title="state.title"
                v-model="editDialogVisible"
                width="20%"
                center>
            <div class="edit-name">
                <span>权限名称: </span>
              <el-input
                prefix-icon="el-icon-user"
                v-model="state.editItem.name">
              </el-input>
            </div>
            <div class="edit-code-name">
                <span>权限字段: </span>
              <el-input
                prefix-icon="el-icon-user"
                v-model="state.editItem.codename">
              </el-input>
            </div>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </span>
            </template>

        </el-dialog>

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
    import {ref, reactive, onMounted} from "vue";
    import {ElMessage} from "element-plus";
    import req from "../../http/http";

    export default {
        name: "index",
        setup() {
            const currentPage = ref(0);
            const limit = ref(10);
            const visible = ref(false);
            const editDialogVisible = ref(false);
            const state = reactive({
                itemList: [],
                tableData: [],
                value: "",
                title: "新增权限",
                editItem: {

                },
                currentPage: 0,
                limit: 10,
                total: 0,
                pageArray: [5, 10, 20, 50, 100],
            });

            function getItems() {
                req(
                    "get",
                    "permission?page=" + state.currentPage + "&limit=" + state.limit
                ).then((response) => {
                    state.tableData = response.data
                    state.total = response.count
                    editDialogVisible.value = false
                });
            }

            function addItem() {
                req(
                    "post",
                    "permission",
                    JSON.stringify([state.editItem])
                ).then((response) => {
                    ElMessage.success({
                        message: "新增权限" + response.name + "成功",
                        type: "success",
                    });
                    getItems();
                });
            }

            function updateItem() {
                req(
                    "put",
                    "permission",
                    JSON.stringify(state.editItem)
                ).then((response) => {
                    ElMessage.success({
                        message: "修改权限" + response.name + "成功",
                        type: "success",
                    });
                    getItems();
                });
            }

            function deleteItem(item) {
                req("delete", "permission/" + item.id).then((response) => {
                    ElMessage.success({
                        message: "删除权限" + response.name + "成功",
                        type: "success",
                    });
                    getItems();
                });
            }

            function handleSubmit() {
                if (state.title === "新增权限") {
                    addItem()
                } else {
                    updateItem()
                }
            }

            function showAddDialog() {
                state.title = "新增权限"
                state.editItem.name = ""
                state.editItem.codename = ""
                editDialogVisible.value = true
            }

            function showEditDialog(item) {
                state.title = "编辑权限"
                state.editItem.id = item.id
                state.editItem.name = item.name
                state.editItem.codename = item.codename
                editDialogVisible.value = true
            }


            const dateFormat = (dateStr) => {
                return dateStr.replace("T", " ");
            };

            const handleSizeChange = (size) => {
                state.limit = size;
                getItems();
            };

            const handleCurrentChange = (page) => {
                if (page) {
                    state.currentPage = page;
                    getItems();
                }
            };

            onMounted(() => {
                getItems();
            });

            return {
                currentPage,
                state,
                limit,
                visible,
                editDialogVisible,
                deleteItem,
                showAddDialog,
                showEditDialog,
                dateFormat,
                handleSubmit,
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

        .el-dialog__body {
            span {
                margin-right: 10px;
            }

            .el-input {
                    width: 75%;
                }
            .edit-name {
                 margin-bottom: 10px;

             }
        }
    }

    .add-button {
        margin-left: 20px;
    }
</style>