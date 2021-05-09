<template>
<div class='head'>
    <svg-icon @click="setCollapse" :icon-class="isCollapse?'unFold':'Fold'" />
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in getCurrentRoute()" :key="index" :to="item.path">{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @visible-change="changeValue" style="float: right">
        <div class="user-item">
            <i class="el-icon-arrow-down" :class="{go:rotate , aa :!rotate}"></i>
            <span>{{tikTokName}} </span>
            <el-avatar size="50" :src="circleUrl"></el-avatar>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-button @click="editDialogVisible = true" icon="iconfont icon-extradouyin">设置抖音号</el-button>
            </el-dropdown-menu>
        </template>

    </el-dropdown>
</div>
        <el-dialog
            title="设置抖音号"
            v-model="editDialogVisible"
            width="400px"
            center>
        <div class="edit-name">
            <span>抖音号: </span>
            <el-input
                    v-model="tikTokName">
            </el-input>
        </div>
        <div style="clear: both"></div>
        <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="setTikTokName">确 定</el-button>
                </span>
        </template>

    </el-dialog>

</template>

<script>
import {
    useStore
} from "vuex";
import {
    computed,
    ref
} from "vue";
import {
    useRouter
} from "vue-router";
import { ElMessage } from "element-plus";

export default {
    name: "headLine",
    setup() {
        const store = useStore()
        const circleUrl = ref(require("../assets/duck.jpg"))
        const rotate = ref(false)
        const tikTokName = ref("")
        const editDialogVisible = ref(false)
        const router = useRouter()
        function changeValue(callback) {
            rotate.value = callback
        }

        function getCurrentRoute() {
            let matched = router.currentRoute.value.matched
            const first = matched[0]
            if (first&& first.name !== "home") {
                matched = [{ path: '/home',
                            name: 'home',
                            meta: {title: "首页"}}].concat(matched)
            } else {
                matched = [{ path: '/home',
                             name: 'home',
                             meta: {
                                 title: "首页"
                                 }
                             }
                             ]
            }
            return matched
        }

        const setTikTokName = () => {
            store.commit("setTikTokName", tikTokName.value);
            ElMessage.success({
              message: "修改成功了٩(๑>◡<๑)۶ " ,
              type: "success",
            });
            editDialogVisible.value = false
        };

        return {
            rotate,
            changeValue,
            circleUrl,
            isCollapse: computed(() => store.state.isCollapse),
            userName: computed(() => store.state.userName),
            tikTokName,
            editDialogVisible,
            // 访问一个 mutation
            setCollapse: () => store.commit("setCollapse"),
            backToLogin() {
                store.commit("setUserName", "");
                store.commit("settableData", []);
                store.commit("setTikTokName", "");
                sessionStorage.removeItem("token");
                router.push("/login")
            },
            getCurrentRoute,
            setTikTokName
        }
    }
}
</script>

<style lang="scss" scoped>
.head {
    height: 100%;

    .svg-icon {
        float: left;
        height: 24px;
        width: 24px;
        margin-top: 15px;
    }

    .el-breadcrumb {
        float: left;
        margin: 20px 0 0 20px;
    }
}

.user-item {
    /*width: 150px;*/

    &:hover {
        cursor: pointer;
    }

    span {
        float: right;
        line-height: 55px;
        font-weight: 700;
    }
    i {
        float: right;
        margin-top: 22px;
        margin-left: 4px;
        font-size: 12px;
    }

    > .el-avatar {
        margin: 7px 7px 0 0;
    }
}

.el-button {
    border: white;
    padding: 8px 15px;

    i {
        font-size: 14px;
    }
}

.el-dropdown-menu {
    padding: 6px 0;
}

.aa {
    transition: all .2s;
}

.go {
    transform: rotate(180deg);
    transition: all .2s;
}
</style>>
