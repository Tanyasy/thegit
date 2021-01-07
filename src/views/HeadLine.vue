<template>
<div class='head'>
    <svg-icon @click="setCollapse" :icon-class="isCollapse?'unFold':'Fold'" />
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in getCurrentRoute()" :key="index" :to="item.path">{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @visible-change="changeValue" style="float: right">
        <div class="user-item">
            <el-avatar size="50" :src="circleUrl"></el-avatar>
            <span>admin </span>
            <i class="el-icon-arrow-down" :class="{go:rotate , aa :!rotate}"></i>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-button @click="backToLogin" icon="iconfont icon-extralog-out"> 退出登录</el-button>
            </el-dropdown-menu>
        </template>

    </el-dropdown>
</div>
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

export default {
    name: "headLine",
    setup() {
        const store = useStore()
        const circleUrl = ref(require("../assets/duck.jpg"))
        const rotate = ref(false)
        const router = useRouter()
        function changeValue(callback) {
            rotate.value = callback
        }

        function getCurrentRoute() {
            let matched = router.currentRoute.value.matched
            const first = matched[0]
            if (first&& first.name != "home") {
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

        return {
            rotate,
            changeValue,
            circleUrl,
            isCollapse: computed(() => store.state.isCollapse),
            // 访问一个 mutation
            setCollapse: () => store.commit("setCollapse"),
            backToLogin() {
                // todo:清除session之类的
                router.push("/login")
            },
            getCurrentRoute
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
    width: 110px;

    &:hover {
        cursor: pointer;
    }

    span {
        float: left;
        margin-top: 20px;
        font-weight: 700;
    }

    i {
        float: left;
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
