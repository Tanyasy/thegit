<template>
<div class="home">
    <el-container>
        <el-menu default-active="1-0-0" class="el-menu-vertical" :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" collapse-transition="false">
            <el-submenu index="1">
                <template #title>
                    <i class="el-icon-location"></i>
                    <span>导航一</span>
                </template>
                <el-menu-item-group>
                    <template #title>分组一</template>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                    <template #title>选项4</template>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <template #title>导航二</template>
            </el-menu-item>
            <el-menu-item index="3" disabled>
                <i class="el-icon-document"></i>
                <template #title>导航三</template>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <template #title>导航四</template>
            </el-menu-item>
        </el-menu>
        <el-container>
            <el-header>
                <Header></Header>
            </el-header>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</div>
</template>

<script>
import Header from "./HeadLine"
import {
    computed
} from 'vue'
import {
    useStore
} from 'vuex'

export default {
    name: 'Home',
    components: {
        Header
    },
    setup() {
        // 获取store对象
        const store = useStore()

        return {
            //  computed方法传一个getter，并返回一个ref对象
            isCollapse: computed(() => store.state.isCollapse)
        }
    }
}
</script>

<style scoped>
.home,
.el-container {
    height: 100%;
}

.el-aside {
    background-color: #545c64;

}

.el-header {
    /* border-bottom: 1px solid gray; */
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.el-menu-vertical {
    border: 0;
}

.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>>
