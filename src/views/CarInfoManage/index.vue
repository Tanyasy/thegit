<template>
    <div class="body">

        <div class="header">
            <div class="search">
                <!--<b>商品名称:</b>-->
                <el-input
                        autosize
                        v-model="state.name"
                        placeholder="请输入车型名称"
                ></el-input>
                <el-button @click="startSearch">搜 索</el-button>
            </div>


            <!--账单数据导入功能-->
            <el-button
                    type="primary"
                    @click="showAddDialog"
            >新增数据
            </el-button>

            <!--重置功能-->
            <el-button
                    v-show="showReset"
                    @click="reset"
                    type="info"
                    icon="el-icon-refresh-right"
                    circle
            ></el-button>

            <div style="clear: both"></div>
        </div>
        <el-divider></el-divider>

        <el-table
                ref="multipleTable"
                :data="state.tableData"
                style="width: 100%"
                :cell-style="rowClass"
                :header-cell-style="headClass"
                @selection-change="handleSelectionChange"
        >
            <el-table-column
                    type="selection"
                    show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                    fixed
                    prop="id"
                    label="序号"
                    width="60"
            >
            </el-table-column>
            <el-table-column
                    fixed
                    prop="name"
                    label="车型"
                    width="150"
            >
            </el-table-column>

            <el-table-column
                    fixed
                    prop="configuration"
                    label="配置"
                    width="250"
            >
            </el-table-column>
            <el-table-column
                    fixed
                    prop="guice_price"
                    label="指导价"
                    width="100"
            >
            </el-table-column>
            <el-table-column
                    prop="property"
                    label="属性"
                    width="100"
            >
            </el-table-column>
            <el-table-column
                    prop="color"
                    label="颜色"
                    width="90"
            >
            </el-table-column>
            <el-table-column
                    prop="emission"
                    label="排放"
                    width="100"
            >
            </el-table-column>
            <el-table-column
                    fixed="right"
                    align="right"
                    prop="price"
                    label="报价"
                    width="120"

            >
                <template #default="scope">
                    <div class="money">
                        {{scope.row.price}}万
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    align="right"
                    prop="remark"
                    label="优惠"
                    width="150"

            >
                <template #default="scope">
                    <div class="remark">
                        {{scope.row.remark}}
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                    fixed="right"
                    align="right"
                    label="操作"
                    width="150"
            >
                <template #default="scope">
                    <!--<el-button-->
                    <!--size="mini"-->
                    <!--@click="handleEdit(scope.$index, scope.row)"-->
                    <!--&gt;编辑-->
                    <!--</el-button>-->
                    <el-button
                            size="mini"
                            @click="showEditDialog(scope.row)"
                    >编辑
                    </el-button>
                    <el-popconfirm
                            title="确定删除吗？"
                            @confirm="handleDelete(scope.$index, scope.row)"
                    >
                        <template #reference>
                            <el-button
                                    size="mini"
                                    type="danger"
                            >删除
                            </el-button>
                        </template>
                    </el-popconfirm>

                    <!--<el-button-->
                    <!--size="mini"-->
                    <!--type="danger"-->
                    <!--@click="handleDelete(scope.$index, scope.row)"-->
                    <!--&gt;删除-->
                    <!--</el-button>-->
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
    <el-dialog
            :title="state.title"
            v-model="editDialogVisible"
            width="400px"
            center>
        <div class="edit-name">
            <span>车型: </span>
            <el-input
                    v-model="state.editItem.name">
            </el-input>
        </div>
        <div class="edit-code-name">
            <span>配置: </span>
            <el-input
                    v-model="state.editItem.configuration">
            </el-input>
        </div>
        <div class="edit-code-name">
            <span>指导价: </span>
            <el-input
                    v-model="state.editItem.guice_price">
            </el-input>
        </div>
        <div class="edit-code-name">
            <span>颜色: </span>
            <el-input
                    v-model="state.editItem.color">
            </el-input>
        </div>
        <div class="edit-code-name">
            <span>车辆属性: </span>
            <el-input
                    v-model="state.editItem.property">
            </el-input>
        </div>
        <div class="edit-code-name">
            <span>排放: </span>
            <el-input
                    v-model="state.editItem.emission">
            </el-input>
        </div>
        <div class="edit-code-name">
            <span>报价: </span>
            <el-input
                    v-model="state.editItem.price">
            </el-input>
        </div>
        <div class="edit-code-name">
            <span>优惠: </span>
            <el-input
                    v-model="state.editItem.remark">
            </el-input>
        </div>
        <div style="clear: both"></div>
        <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </span>
        </template>

    </el-dialog>
</template>

<script>
    import {ref, reactive, onMounted, computed} from "vue";
    import {ElMessage} from "element-plus";
    import req from "../../http/http";

    export default {
        name: "index",
        props: {
            visible: String,
        },
        setup() {
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
                name: "",
                pageArray: [10, 20, 50, 100, 500],
                title: "新增车辆信息",
                editItem: {},
                tableData: [],
                tableSelectionData: [],
                options: [],

                filterOption: "",
                value: "",
                count: 0,
                totalPage: 1,
                defaultTime: [
                    new Date(2000, 1, 1, 0, 0, 0),
                    new Date(2000, 2, 1, 23, 59, 59),
                ], // '00:00:00', '23:59:59'
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token"), //从cookie里获取token，并赋值  Authorization ，而不是token
                },
            });

            function getCars(
                name = null,
                page = 0,
                limit = 10
            ) {
                let url = "car/?page=" + page + "&limit=" + limit;

                // 有则传入查询，没有则不查
                if (name) {
                    url += "&name=" + name;
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
                getCars(
                    state.name,
                    state.currentPage,
                    state.limit
                );
            };

            const handleCurrentChange = (pageNum) => {
                state.currentPage = pageNum;
                getCars(
                    state.name,
                    state.currentPage,
                    state.limit
                );
            };

            const handleDelete = (index, row) => {
                console.log(index);
                req("delete", "car/" + row.id).then((response) => {
                    console.log(response);
                    ElMessage.success({
                        message: "删除数据成功",
                        type: "success",
                    });
                    getCars(
                        state.name,
                        state.currentPage,
                        state.limit
                    );
                });
            };

            function addItem() {
                req(
                    "post",
                    "car",
                    JSON.stringify(state.editItem)
                ).then((response) => {
                    ElMessage.success({
                        message: "新增车辆信息" + response.name + "成功",
                        type: "success",
                    });
                    getCars(
                        state.name,
                        state.currentPage,
                        state.limit
                    );
                    editDialogVisible.value = false;
                });
            }

            function updateItem() {
                req(
                    "put",
                    "car",
                    JSON.stringify(state.editItem)
                ).then((response) => {
                    ElMessage.success({
                        message: "修改车辆信息" + response.name + "成功",
                        type: "success",
                    });
                    getCars(
                        state.name,
                        state.currentPage,
                        state.limit
                    );
                    editDialogVisible.value = false;
                });
            }

            function handleSubmit() {
                if (state.title === "新增车辆信息") {
                    addItem()
                } else {
                    updateItem()
                }
            }

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
                        getCars(
                            state.name,
                            state.currentPage,
                            state.limit
                        );
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
                                getCars(
                                    state.name,
                                    state.currentPage,
                                    state.limit
                                );
                            }
                        }
                    );
                }
            };

            const handleSearch = () => {
                searchVisible.value = !searchVisible.value;
            };

            const startSearch = () => {
                if (
                    state.name === ""
                ) {
                    ElMessage.warning({
                        message: "请输入关键字哦",
                        type: "warning",
                    });
                } else {
                    getCars(
                        state.name,
                        state.currentPage,
                        state.limit
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

            function showEditDialog(item) {
                state.title = "编辑车辆信息";
                state.editItem.id = item.id;
                state.editItem.name = item.name;
                state.editItem.configuration = item.configuration;
                state.editItem.guice_price = item.guice_price;
                state.editItem.color = item.color;
                state.editItem.property = item.property;
                state.editItem.emission = item.emission;
                state.editItem.price = item.price;
                state.editItem.remark = item.remark;
                editDialogVisible.value = true
            }

            function showAddDialog() {
                state.title = "新增车辆信息";
                // state.editItem.id = item.id;
                // state.editItem.name = item.name;
                // state.editItem.configuration = item.configuration;
                // state.editItem.guice_price = item.guice_price;
                // state.editItem.color = item.color;
                // state.editItem.property = item.property;
                // state.editItem.emission = item.emission;
                // state.editItem.price = item.price;
                // state.editItem.remark = item.remark;
                state.editItem = {}
                editDialogVisible.value = true
            }

            onMounted(() => {
                getCars(
                    state.name,
                    state.currentPage,
                    state.limit
                );
            });

            // 监听器
            // watch(timeList, (afterValue, beforeValue) => {
            //     if (afterValue) {
            //         getCars(state.currentPage, state.limit, afterValue);
            //     } else if (beforeValue) {
            //         getCars(state.currentPage, state.limit);
            //     }
            // });

            const headClass = () => {
                return "background-color: rgb(35, 33, 38);color: white;font:600 18px/1.5 tahoma, arial, Microsoft Yahei;border-color: rgb(133, 131, 136)"
            };

            const rowClass = () => {
                return "background-color: rgb(35, 33, 38);color: rgb(255,255,255,0.8);font:500 15px/1.5 tahoma, arial, Microsoft Yahei;border-color: rgb(133, 131, 136)"
            };

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
                handleSubmit,
                showEditDialog,
                startSearch,
                filterPayment,
                reset,
                headClass,
                rowClass,
                showAddDialog
            };
        },
    };
</script>

<style lang="scss" scoped>
    .body {
        width: 80%;
        margin: 0 150px;
        background-color: rgb(35, 33, 38);


        .page {
            float: right;
            margin-top: 20px;
        }

        > .header {
            > .search {
                float: left;

                .el-input {
                    border-radius: 1px;
                    display: inline-block;
                    width: 200px;
                }

                .el-button {
                    background-color: rgb(35, 33, 38);
                }
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
        /*border-top: 1px solid rgba(0, 21, 41, 0.08);*/
        /*box-shadow: 0 1px 4px rgba(0, 21, 41, .08);*/
        /*padding: 20px 20px 20px 20px;*/

        .searchChoice {
            margin-bottom: 10px;
        }

        .el-upload-dragger {
            width: 28vw;
            height: 180px;
        }

        span {
            line-height: 40px;
            float: left;
            margin-right: 10px;
        }

        .el-input {
            float: right;
            width: 270px;
        }

        .edit-name {
            margin-bottom: 10px;

        }
    }

    .card-panel-icon {
        /*float: left;*/
        font-size: 30px;
    }

    .aa {
        transition: all 0.2s;
    }

    .go {
        transform: rotate(180deg);
        transition: all 0.2s;
    }


</style>