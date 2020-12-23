<template>
  <div class='head'>
      <SvgIcon icon-class="Fold" />
  </div>
</template>

<script>
import SvgIcon from '../components/SvgIcon'

export default {
    name: "headLine",
    data() {
        return {

        }
    },
    methods: {

    },
    components: {
        SvgIcon
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
