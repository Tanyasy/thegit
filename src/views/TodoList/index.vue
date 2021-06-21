<template>
    <el-input v-model="state.input" placeholder='添加任务至"收集箱"，回车即可保存' @keyup.enter="addData"></el-input>
    <div class="todo">
        <el-tree
            :props="state.props"
            :data="state.tableData"
            default-expand-all
            show-checkbox
            @check-change="handleCheckChange"
    >
    </el-tree>
    </div>
    <div class="finished">
            <el-tree
            :props="state.props"
            :data="state.finishedData"
            show-checkbox
            :default-checked-keys="state.defaultCheckedList"
            node-key="id"
    >
    </el-tree>
    </div>
</template>

<script>
    import {reactive, onMounted} from "vue";
    import {ElMessage} from "element-plus";
    import req from "../../http/http";

    export default {
        name: "index",
        setup() {

            const state = reactive({
                input: "",
                createData: {
                    title: "",
                    desc: ""
                },
                tableData: [],
                finishedData: [],
                defaultCheckedList: [],
                props: {
                    label: 'title',
                    children: 'zones'
                },
            });

            function getData(status=0) {
                req(
                    "get",
                    "todo_list/?status=" + status
                ).then((response) => {
                    state.tableData = response
                });
            }

            function getFinishedData(status=2) {
                req(
                    "get",
                    "todo_list/?status=" + status
                ).then((response) => {
                    state.finishedData = response;
                    state.defaultCheckedList = [];
                    for (const index in response) {
                        state.defaultCheckedList.push(response[index].id)
                    }
                    console.log(state.defaultCheckedList)
                });
            }

            function getAllData() {
                getData();
                getFinishedData();
            }

            function addData() {
                if (state.input === "" || !state.input) {
                    return
                } else {
                    state.createData.title = state.input
                }
                req(
                    "post",
                    "todo_list/",
                    JSON.stringify(state.createData)
                ).then(() => {
                    ElMessage.success({
                        message: "添加代办事项成功",
                        type: "success",
                      });
                    state.input = "";
                    getData();
                });
            }

            function updateData(data) {
                req(
                    "put",
                    "todo_list/" + data.id,
                    JSON.stringify(data)
                ).then(() => {
                    ElMessage.success({
                        message: "更新待办事项成功",
                        type: "success",
                      });
                    state.input = "";
                    getAllData();
                });
            }

            function handleCheckChange(data, checked) {
                if (checked) {
                    data.status = 2;
                } else {
                    data.status = 0;
                }
                console.log(data, checked);
                updateData(data);
            }

            onMounted(() => {
                getAllData()
            });

            return {
                state,
                getData,
                addData,
                handleCheckChange
            };
        },
    };
</script>

<style lang="scss" scoped>
    .el-input {
        padding-left: 20px;
    }

    .el-tree {
         ::v-deep .el-tree-node {
             padding: 7px 0;


             .el-checkbox__input {

             }

             .el-tree-node__label {
                 font-size: 15px;
                 /*border-bottom: 1px solid gray;*/
             }

        }
    }


    .todo {

    }

    .finished {
        .el-tree {
            color: rgb(0,0,0,0.3);
        }

    }
</style>