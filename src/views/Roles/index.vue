<template>
    <div class="table">
        <el-table
                stripe
                :data="state.tableData"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                style="width: 100%"
        >
<!--            <el-table-column-->
<!--                    prop="id"-->
<!--                    label="id"-->
<!--                    width="250"-->
<!--            >-->
<!--            </el-table-column>-->
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
                    label="角色名"
                    width="180"
            >
                <template #default="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="role_name"
                    label="权限"
                    width="450"
            >
                <template #default="scope">
                    {{showPermission(scope.row.permissions)}}
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
                            @confirm="deleteRole(scope.$index, scope.row)"
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
                prefix-icon="el-icon-Role"
                v-model="state.editRole.name">
              </el-input>
            </div>
            <div class="edit-role">
                <span>角色名: </span>
                <el-select
                        v-model="state.editRole.role_id"
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
                  v-model="state.editRole.is_superuser"
                  active-color="#13ce66">
                </el-switch>
            </div>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="updateRole">确 定</el-button>
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
                editRole: {
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

            function getRoles() {
                req(
                    "get",
                    "role?page=" + state.currentPage + "&limit=" + state.limit
                ).then((response) => {
                    state.tableData = response.data
                    state.total = response.count
                });
            }

            function updateRole() {
                req(
                    "put",
                    "role",
                    JSON.stringify(state.editRole)
                ).then((response) => {
                    ElMessage.success({
                        message: "修改用户" + response.name + "成功",
                        type: "success",
                    });
                    getRoles(currentPage.value * limit.value, limit.value);
                });
            }

            // function getRoles() {
            //     req(
            //         "get",
            //         "role"
            //     ).then((response) => {
            //         state.itemList = response
            //     });
            //
            // }

            function handleEdit(index, item) {
                console.log(index);
                state.editRole = item
                editDialogVisible.value = true
            }

            function deleteRole(index, item) {

                console.log(item.id);
                req("delete", "Roles/" + item.id).then((response) => {
                    ElMessage.success({
                        message: "删除用户" + response.name + "成功",
                        type: "success",
                    });
                    getRoles();
                });
            }

            const dateFormat = (dateStr) => {
                return dateStr.replace("T", " ");
            };

            const handleSizeChange = (size) => {
                state.limit = size;
                getRoles();
            };

            const handleCurrentChange = (page) => {
                if (page) {
                    state.currentPage = page;
                    getRoles();
                }
            };

            const showPermission = (permissionList) => {
                    let permissionStr = ""

                    for (const i in permissionList) {
                        console.log(i)
                        permissionStr += (permissionList[i].codename + ", ")
                    }
                    return permissionStr
            }


            onMounted(() => {
                getRoles(currentPage.value * limit.value, limit.value);
                // getRoles();

            });

            return {
                currentPage,
                state,
                limit,
                visible,
                editDialogVisible,
                getRoles,
                dateFormat,
                deleteRole,
                updateRole,
                handleEdit,
                handleSizeChange,
                handleCurrentChange,
                showPermission
            }
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
            .edit-is-superRole {
                .el-switch {
                    display: inline-flex;
                }
            }
        }
    }
</style>