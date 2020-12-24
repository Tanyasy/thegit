<template>
    <div class='head'>
        <svg-icon @click="setCollapse" :icon-class="isCollapse?'unFold':'Fold'"/>
    </div>
</template>

<script>

    import {useStore} from "vuex";
    import {computed} from "vue";

    export default {
        name: "headLine",
        setup() {
            const store = useStore()

            return {
                isCollapse: computed(()=>store.state.isCollapse),
                // 访问一个 mutation
                setCollapse: () => store.commit("setCollapse")
            }
        }
    }
</script>

<style scoped>
    .head {
        height: 100%;
    }

    .svg-icon {
        height: 24px;
        width: 24px;
        margin-top: 15px;
    }
</style>>
