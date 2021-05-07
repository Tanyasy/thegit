<template>
    <div class="body">

        <div class="header">
            <div class="search">
                <!--<b>商品名称:</b>-->
                <el-input
                        autosize
                        v-model="state.name"
                        placeholder="请输入车型名称"
                        clearable
                ></el-input>
                <el-button @click="startSearch">搜 索</el-button>
            </div>

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
        <!--<el-divider></el-divider>-->

        <div class="mid">
            <p class="mid-icons">抖音名</p>
            <p class="mid-message">将车型打公屏上 8秒出车价</p>
        </div>
        <el-table
                ref="multipleTable"
                border
                :data="tableData"
                :cell-style="rowClass"
                :header-cell-style="headClass"
                style="width: 723px"
        >
            <el-table-column
                    align="center"
                    prop="id"
                    label="序号"
                    width="80"
            >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="name"
                    label="车型"
                    width="120"
            >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="configuration"
                    label="配置"
                    width="200"
            >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="property"
                    label="属性"
                    width="120"
            >
                <template #default="scope">
                    <!--<div class="product_name">-->
                    {{ scope.row.property }}
                    <!--</div>-->
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="price"
                    label="指导价(W)"
                    width="100"

            >
                <template #default="scope">
                    <div class="money">
                        {{scope.row.price}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="remark"
                    label="优惠"
                    width="100"

            >
                <template #default="scope">
                    <div class="remark">
                        {{scope.row.remark}}
                    </div>
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
    import {ref, reactive, onMounted, computed} from "vue";
    import {ElMessage} from "element-plus";
    // import dayjs from "dayjs";
    import req from "../../http/http";
    import {useStore} from "vuex";

    export default {
        name: "index",
        props: {
            visible: String,
        },
        setup() {
            const store = useStore();
            const fileName = ref("");
            const dialogVisible = ref(false);
            const editDialogVisible = ref(false);
            const timeList = ref([]);
            const multipleTable = ref("");
            const source = ref("alipay");
            const uploadTarget = ref(null);
            const state = reactive({
                currentPage: 0,
                limit: 5,
                name: "",
                pageArray: [10, 20, 50, 100, 500],
                tableData: [],
                tableSelectionData: [],
                options: [],
                filterOption: "",
                value: "",
                count: 0,
                totalPage: 1,
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token"), //从cookie里获取token，并赋值  Authorization ，而不是token
                },
            });

            function getCars(
                name = null,
                page = 0,
                limit = 5
            ) {
                let url = "car/?page=" + page + "&limit=" + limit;

                // 有则传入查询，没有则不查
                if (name) {
                    url += "&name=" + name;
                }

                req("get", url).then((response) => {
                    // state.tableData = response.data;

                    if (name) {
                        let arrayList = response.data;
                        arrayList.push(...store.state.tableData);
                        store.commit("settableData", arrayList.slice(0, state.limit));
                    } else {
                        store.commit("settableData", response.data);
                    }
                    state.totalPage = response.total_page;
                    state.count = response.count;
                });
            }

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

            const headClass = () => {
                return "background-color: rgb(35, 33, 38);color: white;font:600 20px/1.5 tahoma, arial, Microsoft Yahei;border-color: rgb(133, 131, 136)"
            };

            const rowClass = () => {
                return "background-color: rgb(35, 33, 38);color: white;font:500 18px/1.5 tahoma, arial, Microsoft Yahei;border-color: rgb(133, 131, 136)"
            };

            onMounted(() => {
                if (store.state.tableData && store.state.tableData.length === 0) {
                    getCars(
                    state.name,
                    state.currentPage,
                    state.limit
                );
                }
            });

            return {
                timeList,
                state,
                source,
                dialogVisible,
                editDialogVisible,
                fileName,
                uploadTarget,
                multipleTable,
                tableData: computed(() => store.state.tableData),
                showReset: computed(() => {
                    return (
                        timeList.value.length !== 0 ||
                        state.counterParty ||
                        state.productName ||
                        state.filterOption
                    );
                }),
                handleSizeChange,
                handleCurrentChange,
                handleOnSuccess,
                handleImportData,
                handleDelete,
                handleSelectionChange,
                handleEditData,
                startSearch,
                filterPayment,
                reset,
                rowClass,
                headClass
            };
        },
    };
</script>

<style lang="scss" scoped>
    .body {
        width: 723px;
        margin: 0 100px;
        background-color: rgb(35, 33, 38);

        > .header {
            > .search {
                float: right;
                padding: 10px 0;

                .el-input {
                    border-radius: 1px;
                    display: inline-block;
                    width: 200px;
                }
            }

            .el-button {
                background-color: rgb(35, 33, 38);
                color: white;
            }
        }

        > .mid {
            .mid-icons {
                float: left;
                color: white;
                font: 500 25px/1.2 tahoma, arial, Microsoft Yahei;
            }

            .mid-message {
                float: right;
                color: white;
                font: 500 25px/1.2 tahoma, arial, Microsoft Yahei;
            }
        }
    }

    .money, .remark {
        color: rgb(252, 225, 27);
        font-size: 24px;
    }

    .el-table--border:after,
    .el-table--group:after,
    .el-table:before {
        background-color: rgb(221, 69, 61);
    }


    .el-table--border,
    .el-table--group {
        border-color: rgb(221, 69, 61);
    }


    .el-table td,
    .el-table th.is-leaf {
        border-bottom: 1px solid rgb(221, 69, 61);
    }


    .el-table--border th,
    .el-table--border th.gutter:last-of-type {
        border-bottom: 1px solid rgb(221, 69, 61);
    }


    .el-table--border td,
    .el-table--border th {
        border-right: 1px solid rgb(221, 69, 61);
    }

    .el-table {
        border-left: 2px solid rgb(221, 69, 61);
        border-top: 2px solid rgb(221, 69, 61);
        border-bottom: 1px solid rgb(221, 69, 61);
        border-right: 1px solid rgb(221, 69, 61);
    }
</style>