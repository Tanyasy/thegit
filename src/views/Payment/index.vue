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
        <el-button type="primary" @click="dialogVisible = true">数据导入<i class="el-icon-upload el-icon--right"></i>
        </el-button>
        <el-dialog
                title="账单数据导入"
                v-model="dialogVisible"
                width="30%"
                :before-close="handleClose">
              <el-radio v-model="source" label="alipay">支付宝</el-radio>
            <el-radio v-model="source" label="weixinpay">微信</el-radio>
            <el-upload
                    class="upload"
                    drag
                    action="http://localhost:8080/api/v1/payments/file/"
                    :on-success="handleOnSuccess"
                    multiple
                    ref="uploadTarget">
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
              <el-button type="primary" @click="handleImportData">导 入</el-button>
            </span>
            </template>
        </el-dialog>
        <el-divider></el-divider>
        <el-table
                :data="state.tableData"
                style="width: 100%">
            <el-table-column v-if="show"
                             prop="id"
                             label="id"
                             width="0">
            </el-table-column>
            <el-table-column
                    prop="create_time"
                    label="日期"
                    width="150">
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
                    prop="money"
                    label="金额"
                    width="150">
                <template #default="scope">
                    <div class="money">
                        {{ (scope.row.payment=="支出"?"-":"+") + " " + scope.row.money.toFixed(2)}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    align="right"
                    label="操作"
                    width="150">
                <template #default="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
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
    import {ref, reactive, onMounted, watch} from "vue"
    import {ElMessage} from 'element-plus'
    import dayjs from "dayjs"
    import req from "../../http/http"

    export default {
        name: "index",
        setup() {
            const fileName = ref("")
            const dialogVisible = ref(false)
            const timeList = ref([])
            const source = ref("alipay")
            const uploadTarget = ref(null)
            const state = reactive({
                currentPage: 0,
                limit: 10,
                pageArray: [10, 20, 50, 100],
                tableData: [],
                count: 0,
                totalPage: 1,
                defaultTime: [
                    new Date(2000, 1, 1, 0, 0, 0),
                    new Date(2000, 2, 1, 23, 59, 59)
                ], // '00:00:00', '23:59:59'
                shortcuts: [{
                    text: '最近一周',
                    value: (() => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        return [start, end]
                    })(),
                }, {
                    text: '最近一个月',
                    value: (() => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        return [start, end]
                    })(),
                }, {
                    text: '最近三个月',
                    value: (() => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        return [start, end]
                    })(),
                }],
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            })

            function getUsers(page = 0, limit = 10, timeList) {
                let url = ""
                if (timeList && timeList.length > 0) {
                    const startTime = dayjs(timeList[0]).format('YYYY-MM-DDTHH:mm:ss')
                    const endTime = dayjs(timeList[1]).format('YYYY-MM-DDTHH:mm:ss')
                    url = "payments/?page=" + page + "&limit=" + limit + "&start_time=" + startTime + "&end_time=" + endTime
                } else {
                    url = "payments/?page=" + page + "&limit=" + limit
                }
                req('get', url).then(
                    (response) => {
                        // console.log(response)
                        state.tableData = response.data
                        state.totalPage = response.total_page
                        state.count = response.count
                    }
                )
            }

            const dateFormat = (dateStr) => {
                return dateStr.replace("T", " ")
            }

            const handleSizeChange = (size) => {
                state.limit = size
                getUsers(state.currentPage, state.limit, timeList.value)
            }

            const handleCurrentChange = (pageNum) => {
                state.currentPage = pageNum
                getUsers(state.currentPage, state.limit, timeList.value)
            }

            const handleDelete = (index, row) => {
                console.log(index)
                req('delete', "payments/" + row.id).then(
                    (response) => {
                        console.log(response)
                        ElMessage.success({
                            message: '删除数据成功',
                            type: 'success'
                        });
                        getUsers(state.currentPage, state.limit, timeList.value)
                    }
                )
            }

            const handleOnSuccess = (response) => {
                if (response) {
                    ElMessage.success({
                        message: '文件上传成功了，请点击开始导入',
                        type: 'success'
                    });
                    fileName.value = response.fileName
                }
            }

            const handleImportData = () => {
                const data = {
                    file_name: fileName.value,
                    data_source: source.value
                }
                req('put', "payments/import/", JSON.stringify(data)).then(
                    (response) => {
                        const total = response.total
                        if (total === 0) {
                            ElMessage.error({
                                message: '数据已存在，不需要重复导入哦😘',
                                type: 'error'
                            })
                        } else {
                            ElMessage.success({
                                message: '成功导入' + response.total + '条数据',
                                type: 'success'
                            })
                            uploadTarget.value.clearFiles()
                            dialogVisible.value = false
                            getUsers(state.currentPage, state.limit, timeList.value)
                        }
                    }
                )
            }

            onMounted(() => {
                getUsers(state.currentPage, state.limit)
            })

            // 监听器
            watch(timeList, (afterValue, beforeValue) => {
                    if (afterValue) {
                        getUsers(state.currentPage, state.limit, afterValue)
                    } else if (beforeValue) {
                        getUsers(state.currentPage, state.limit)
                    }
                }
            )

            return {
                timeList,
                state,
                source,
                dialogVisible,
                fileName,
                uploadTarget,
                dateFormat,
                handleSizeChange,
                handleCurrentChange,
                handleOnSuccess,
                handleImportData,
                handleDelete
            }
        }
    }
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
        }
    }

    .has_gutter .el-table_1_column_1 {
        padding-left: 10px;
    }

    .date, .product_name {
        font: 12px/1.5 tahoma, arial, \5b8b\4f53;
        padding-top: 6px;
    }

    .time, .counter_party {
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
        border-top: 1px solid rgba(0, 21, 41, .08);
        /*box-shadow: 0 1px 4px rgba(0, 21, 41, .08);*/
        padding: 30px 20px 20px 20px;

        .el-upload-dragger {
            width: 570px;
            height: 180px;
        }
    }
</style>