<template>
  <div class="main">
    <!-- 二级路由插座 -->
    <router-view></router-view>

    <van-tabbar v-model="active" @change="toggleTabbar" active-color="#f7f7f7">
      <van-tabbar-item
        v-for="(item,index) in tabbarData"
        :key="index"
        :name="item.name"
        :icon="item.icon"
      >{{item.text}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",

  data() {
    return {
      active: "Menu"
    };
  },
  //返回底部高亮
  created() {
    this.active = this.$router.history.current.name;
  },
  computed: {
    tabbarData() {
      return this.$store.state.mainModule.tabbarData;
    }
  },
  methods: {
    toggleTabbar(name) {
      //

      this.$router.push({ name: name });
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  /deep/.van-tabbar {
    background-color: #ab7c37;
  }
  /deep/.van-hairline--top-bottom::after {
    border-color: #ab7c37;
  }
  /deep/.van-tabbar-item {
    color: #444;
  }
}
</style>