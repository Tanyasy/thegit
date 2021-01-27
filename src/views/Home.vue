<template>
    <div class="home">
        <el-container>
            <el-menu :default-active="$route.path" class="el-menu-vertical" :collapse="isCollapse"
                     background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
                     collapse-transition="false" router>
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

                            <el-menu-item v-for="(child, childIndex) in item.children" :key="childIndex"
                                          :index="child.path" v-show="!hasOneShowingChild(item.children)">
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
                    <router-view/>
                    <WallE/>
                </el-main>
                <div class="back-top">
                    <el-button v-show="goTopShow" @click="backTop" type="info" icon="el-icon-caret-top"
                               circle></el-button>
                </div>

            </el-container>
        </el-container>

    </div>
</template>

<script>
    import Header from "./HeadLine"
    import WallE from "./WallE";
    import {
        computed,
        reactive,
        ref,
        onMounted
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
            Header, WallE
        },
        setup() {
            // 获取store对象
            const store = useStore()
            const route = useRouter()
            const scrollTop = ref(0)
            const goTopShow = ref(false)
            let routers = reactive(route.options.routes)

            const scrollToTop = () => {
                // 获取el-main元素的scrollTop属性，判断单前移动位置
                scrollTop.value = window.pageYOffset || document.getElementsByClassName("el-main")[0].scrollTop
                console.log(scrollTop.value)
                // 下移400的时候才显示
                if (scrollTop.value > 400) {
                    goTopShow.value = true;
                } else {
                    goTopShow.value = false;
                }
            }


            const backTop = () => {

                let timer = setInterval(() => {
                    let ispeed = Math.floor(-scrollTop.value / 5)
                    document.getElementsByClassName("el-main")[0].scrollTop = scrollTop.value + ispeed
                    if (scrollTop.value === 0) {
                        clearInterval(timer)
                    }
                }, 16)

            }

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

            onMounted(() => {
                window.addEventListener('scroll', scrollToTop, true)
            })

            return {
                //  computed方法传一个getter，并返回一个ref对象
                isCollapse: computed(() => store.state.isCollapse),
                routers,
                goTopShow,
                scrollTop,
                hasOneShowingChild,
                scrollToTop,
                backTop
            }
        }
    }
</script>

<style lang="scss" scoped>
    $a: 200px;

    .home, .el-container {
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

    .back-top {
        position: fixed;
        right: 22%;
        bottom: 20%;

        .el-button {
            box-shadow: 0 5px 7px rgba(0, 21, 41, .3);
        }

        .el-button:hover {
            box-shadow: 0 10px 10px rgba(0, 21, 41, .3);
            transform: scale(1.2, 1.2);
        }
    }
</style>>
