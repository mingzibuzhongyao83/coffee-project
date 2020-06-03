<template>
  <div class="address">
    <!-- 导航 -->
    <div class="nav-box">
      <van-nav-bar title="地址管理" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    </div>
    <div class="address-box">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="AddRegion"
        @edit="editAddress"
        :switchable="false"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { utils } from "../utils/utils";
export default {
  name: "Address",
  data() {
    return {
      chosenAddressId: "0"
    };
  },

  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    ...mapState("addressModule", ["list"])
  },

  created() {
    if (!this.isLogin) {
      this.$router.push({ name: "Login" });
      return;
    }

    let tokenString = localStorage.getItem("_t");
    this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });

    this.axios({
      method: "GET",
      url: "/findAddress",
      params: {
        appkey: this.appkey,
        tokenString
      }
    })
      .then(result => {
         this.$toast.clear();
        

        let list = [];
        result.data.result.forEach((v, i) => {
          let obj = {
            id: i + "",
            aid: v.aid,
            name: v.name,
            tel: v.tel,
            isDefault: Boolean(v.isDefault),
            address: v.province + v.city + v.county + v.addressDetail
          };

          if (obj.isDefault) {
            this.chosenAddressId = obj.id;
          }

          list.push(obj);
          

          // 修改list
          this.$store.commit("addressModule/changeData", {
            key: "list",
            value: list
          });
        });
      })
      .catch(err => {
        this.$toast.clear();
        
      });
  },

  methods: {
    //返回
    goBack() {
      this.$router.go(-1);
    },
    //新增地址
    AddRegion() {
      if (!this.isLogin) {
        this.$router.push({ name: "Login" });
        return;
      }
      this.$router.push({ name: "NewAddress", query: { isAdd: 1 } });
    },

    //编辑地址
    editAddress(item, index) {
      if (!this.isLogin) {
        this.$router.push({ name: "Login" });
        return;
      }
    
      this.$router.push({
        name: "NewAddress",
        query: { isAdd: 0, aid: item.aid }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.address {
  padding-top: 46.01px;
  /deep/.van-nav-bar {
    background-color: #ab7c37;
  }
  /deep/.van-nav-bar .van-icon {
    color: #fff;
    background-color: #ab7c37;
  }
  /deep/.van-hairline--bottom::after {
    border: none;
  }
  /deep/.van-nav-bar__left {
    background-color: #ab7c37;
  }
  /deep/.van-nav-bar__text {
    color: #fff;
    background-color: #ab7c37;
  }
  /deep/.van-button--danger {
    background-color: #ab7c37;
    border-color: #ab7c37;
  }
  /deep/.van-address-item .van-radio__icon--checked .van-icon {
    background-color: #ab7c37;
    border-color: #ab7c37;
  }
  /deep/.van-tag--danger {
    background-color: #ab7c37;
  }
  /deep/.van-address-item__edit {
    color: #ab7c37;
  }
  /deep/.van-nav-bar__title {
    color: #fff;
  }
}
</style>