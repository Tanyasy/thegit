<template>
    <el-input v-model="input" placeholder='添加任务至"收集箱"，回车即可保存'></el-input>
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
                    state.tableData = response.data
                    state.total = response.count
                    editDialogVisible.value = false
                });
            }

            function updateUser() {
                req(
                    "put",
                    "users/",
                    JSON.stringify(state.editUser)
                ).then((response) => {
                    ElMessage.success({
                        message: "修改用户" + response.name + "成功",
                        type: "success",
                    });
                    getUsers(currentPage.value * limit.value, limit.value);
                });
            }

            function getRoles() {
                req(
                    "get",
                    "role"
                ).then((response) => {
                    state.itemList = response.data
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