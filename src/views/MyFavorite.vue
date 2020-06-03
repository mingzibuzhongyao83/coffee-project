<template>
  <div class="myfavorite">
    <!-- 导航 -->
    <div class="nav-box">
      <van-nav-bar title="我的收藏" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    </div>

    <template v-if="likeData.length > 0">
      <!-- 收藏的商品 -->
      <van-list finished-text="已经到底了...." :finished="finished" v-model="loading" @load="loadData">
        <div class="pro-box clearfix">
          <div class="message" v-show="likeData.length==0">亲！你还没有收藏过商品哦！</div>

          <div
            class="pro"
            :class="[index % 2 == 0 ? 'a' : 'b']"
            v-for="(item,index) in proData"
            :key="index"
          >
            <div class="img" @click="goDetail(item.pid)">
              <img class="auto-img" :src="item.smallImg" alt />
            </div>
            <div class="pro-name">{{item.name}}</div>
            <div class="en-name">{{item.enname}}</div>
            <div class="clearfix">
              <span class="fl price">￥{{item.price}}</span>
              <span class="fr delete" @click="deleteLikeData(item.pid,index)">
                <van-icon class="v-icon" name="delete" color="#764200" size="22" />
              </span>
            </div>
          </div>
        </div>
      </van-list>
    </template>
    <template v-else>
      <div>
        <div class="not-like">
          <div class="not-like-icon">
            <van-icon name="like" />
          </div>
          <div v-if="isLogin">没有收藏商品，赶紧去逛一逛！</div>
          <div v-else>
            <span class="login-text" @click="goState">登录，查看收藏数据</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { utils } from "../utils/utils";
export default {
  name: "MyFavorite",
  data() {
    return {
      //触底加载
      loading: false
    };
  },
  created() {
    
    this.$store.commit("myfavoriteModule/changeData", {
      key: "likeData",
      value: {}
    });
    this.getLikeData();
  },

  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    ...mapState("myfavoriteModule", [
      "likeData",
      "count",
      "start",
      "finished",
      "proData"
    ])
  },

  methods: {
    //加载商品数据
    loadData() {
      setTimeout(() => {
        this.loading = false;

        if (this.proData.length >= this.likeData.length) {
          //没有数据可加载
          this.$store.commit("myfavoriteModule/changeData", {
            key: "finished",
            value: true
          });

          return;
        }

        this.$store.commit("myfavoriteModule/loadShopcartData");
        // this.isAllSelect = false;
      }, 1000);
    },

    //获取收藏商品
    getLikeData() {
      let tokenString = localStorage.getItem("_t");
      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$store.commit("changeData", {
            key: "isLogin",
            value: result.data.code != 700
          });

          if (result.data.code == 700) {
            return;
          }
          // 

          if (result.data.code == 2000) {
            this.$store.commit("myfavoriteModule/changeData", {
              key: "likeData",
              value: result.data.result
            });
          }
        })
        .catch(err => {
          
        });
    },

    //删除收藏商品
    deleteLikeData(pid, index) {
      let tokenString = localStorage.getItem("_t");
      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          tokenString,
          pid
        },

        transformRequest: utils.transformRequest
      })
        .then(result => {
          // 
          if (result.data.code == 900) {
            this.$store.commit("myfavoriteModule/changeLikeData", index);
          }
  

        })
        .catch(err => {
          
        });
    },

    //返回
    goBack() {
      this.$router.go(-1);
    },

    goState() {
      this.$router.push({ name: "Login" });
    },

    //查看商品
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    }
  }
};
</script>

<style lang="less" scoped>
.myfavorite {
  padding-top: 46px;
  .not-like {
    font-size: 18px;
    margin-top: 50px;
    color: #ab7c37;
    text-align: center;
    > div:last-child {
      color: #444;
    }
  }
  .not-like-icon {
    font-size: 64px;
    color: #ab7c37;
  }

  .login-text {
    color: #444;
  }
  .message {
    color: #555;
    text-align: center;
  }
  /deep/.van-nav-bar__title {
    color: #fff !important;
  }
  // height: 100%;
  /deep/.van-hairline--bottom::after {
    border: none;
  }
  /deep/.van-nav-bar {
    background-color: #ab7c37;
    // margin-bottom: 10px;
  }
  /deep/.van-nav-bar .van-icon {
    color: #fff;
    background-color: #ab7c37;
  }
  /deep/.van-nav-bar__text {
    color: #fff;
    background-color: #ab7c37;
  }
  .pro-box {
    height: 100%;
    padding: 10px 10px;
    // display: flex;
    > .pro {
      float: left;
      width: calc(~"50% - 5px - 20px");
      background-color: #eee;
      padding: 10px;
      margin-bottom: 10px;
      &.a {
        margin-right: 5px;
      }
      &.b {
        margin-left: 5px;
      }
    }
  }
  .pro-name {
    padding: 5px 0 0;
    color: #444;
    font-size: 15px;
  }
  .en-name {
    color: #766034;
    line-height: 16px;
  }
  .price {
    font-size: 14px;
    color: #652f30;
    line-height: 24px;
    font-weight: 600;
  }
  .delete {
    height: 24px;
    width: 24px;
    .v-icon {
      font-size: 24px;
      color: #e0e0e0;
    }
  }
}
</style>