<template>
<div class="home">
    <el-container>
        <el-menu :default-active="$route.path" class="el-menu-vertical" :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" collapse-transition="false" router>
            <div v-for="(item, index) in routers" :key="index">
                <div v-if="!item.hidden&&item.meta">
                    <el-menu-item v-if="hasOneShowingChild(item.children)" :index="item.path">
                        <i :class="item.meta&&item.meta.icon"></i>
                        <template #title>{{ item.meta.title }}</template>
                    </el-menu-item>
                    <el-submenu v-else :index="item.path">
                        <template #title>
                            <i :class="item.meta&&item.meta.icon"></i>
                            <!-- 用v-show修复导航栏缩进时文字不隐藏的问题 -->
                            <span v-show='!isCollapse'>{{ item.meta.title }}</span>
                        </template>

                        <el-menu-item v-for="(child, childIndex) in item.children" :key="childIndex" :index="child.path" v-show="!hasOneShowingChild(item.children)">
                            {{ child.meta.title }}
                        </el-menu-item>
                    </el-submenu>
                </div>
            </div>
        </el-menu>
        <el-container>
            <el-header>
                <Header></Header>
            </el-header>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</div>
</template>

<script>
import Header from "./HeadLine"
import {
    computed,
    reactive
} from 'vue'
import {
    useStore
} from 'vuex'
import {
    useRouter
} from "vue-router"

export default {
    name: 'Home',
    components: {
        Header
    },
    setup() {
        // 获取store对象
        const store = useStore()
        const route = useRouter()
        let routers = reactive(route.options.routes)
        console.log(routers.values)

        function hasOneShowingChild(children = []) {
            const showingChildren = children.filter(item => {
                if (item.hidden) {
                    return false
                } else {
                    return true
                }
            })
            if (showingChildren.length === 1) {
                return true
            }
            if (showingChildren.length === 0) {
                return true
            }

            return false
        }

        return {
            //  computed方法传一个getter，并返回一个ref对象
            isCollapse: computed(() => store.state.isCollapse),
            routers,
            hasOneShowingChild
        }
    }
}
</script>

<style lang="scss" scoped>
$a:200px;

.home,
.el-container {
    height: 100%;
}

.el-aside {
    background-color: #545c64;

}

.el-header {
    /* border-bottom: 1px solid gray; */
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
}

.el-menu-vertical {
    border: 0;
}

.el-menu-vertical:not(.el-menu--collapse) {
    width: $a;
    min-height: 400px;
}
</style>>
