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
        <el-dialog
                title="用户编辑"
                v-model="editDialogVisible"
                width="20%"
                center>
            <div class="edit-name">
                <span>用户名: </span>
              <el-input
                prefix-icon="el-icon-user"
                v-model="state.editUser.name">
              </el-input>
            </div>
            <div class="edit-role">
                <span>角色名: </span>
                <el-select
                        v-model="state.editUser.role_id"
                        placeholder="请选择"
                >
                    <el-option
                            v-for="item in state.itemList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    >
                    </el-option>
                </el-select>
            </div>

            <div class="edit-is-superuser">
                <span>管理员: </span>
              <el-switch
                  v-model="state.editUser.is_superuser"
                  active-color="#13ce66">
                </el-switch>
            </div>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="updateUser">确 定</el-button>
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
                editUser: {
                    role_id: null,
                    is_active: true,
                    telephone: "",
                    email: null,
                    id: "",
                    is_superuser: false,
                    name: "",
                },
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
                    state.tableData = response.data;
                    state.total = response.count;
                });
            }

            function updateUser() {
                req(
                    "put",
                    "users/"
                ).then((response) => {
                    state.tableData = response.data;
                    state.total = response.count;
                });
            }

            function getRoles() {
                req(
                    "get",
                    "role"
                ).then((response) => {
                    state.itemList = response
                });

            }

            function handleEdit(index, item) {
                console.log(index);
                state.editUser = item
                editDialogVisible.value = true
            }

            function deleteUser(index, item) {

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
                getRoles();

            });

            return {
                currentPage,
                state,
                limit,
                visible,
                editDialogVisible,
                getRoles,
                dateFormat,
                deleteUser,
                updateUser,
                handleEdit,
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
             .edit-name {
                .el-input {
                    width: 80%;
                }
                }
            .edit-role {
                margin: 15px 0;
                .el-select {
                    width: 80%;
                }
            }
            .edit-is-superuser {
                .el-switch {
                    display: inline-flex;
                }
            }
        }
    }
</style>