<template>
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
                width="300">
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
                width="180">
            <template #default="scope">
                <el-tag>{{scope.row.name}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="email"
                label="邮箱"
        width="250">
        </el-table-column>
        <el-table-column
                align="center"
                prop="telephone"
                label="手机号"
        width="250">
        </el-table-column>
        <el-table-column
                prop="is_superuser"
                label="是否是管理员"
        width="150">
            <template #default="scope">
                <el-tag>{{scope.row.is_superuser?"是":"否"}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column
                align="right"
                label="操作">
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
</template>

<script>
    import {ref, reactive, onMounted} from "vue"
    import req from "../../http/http"

    export default {
        name: "index",
        setup() {
            const currentPage = ref(0)
            const limit = ref(10)
            const state = reactive({
                tableData: []
            })

            function getUsers(skip = 0, limit = 10) {
                req('get', "users?skip=" + skip + "&limit=" + limit).then(
                    (response) => {
                        // console.log(response)
                        state.tableData = response.data
                    }
                )
            }

            const dateFormat = (dateStr) => {

                return dateStr.replace("T", " ")
            }

            onMounted(() => {
                getUsers(currentPage.value * limit.value, limit.value)
            })

            return {
                currentPage,
                state,
                limit,
                dateFormat
            }
        }
    }
</script>

<style scoped>

</style>