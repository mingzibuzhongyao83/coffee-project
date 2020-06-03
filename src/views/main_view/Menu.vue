<template>
  <div class="menu">
    
    <div class="boc">
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in bannerData" :key="index">
        <img class="auto-img" :src="item.bannerImg" alt />
      </van-swipe-item>
    </van-swipe>

    <van-tabs
      v-model="activeName"
      background="#f7f7f7"
      color="#ab7c37"
      @click="toggleProduct"
      title-active-color="#ab7c37"
    >
      <van-tab
        :title="item.typeDesc"
        :name="item.type"
        v-for="(item,index) in typeData"
        :key="index"
        @click="a(item)"
      ></van-tab>
    </van-tabs>
</div>
    <div class="product-box">
      <van-list finished-text="已经到底了...." :finished="finished" v-model="loading" @load="loadData">
        <div class="bigbox clearfix">
          <div class="logo">
            <img class="auto-img" src="../../assets/images/coffee3.jpg" alt />
          </div>

          <div
            class="pro-data fl clearfix"
            v-for="(item,index) in proData"
            :key="index"
            @click=" goDetail(item.pid)"
          >
            <div class="pro-img fl">
              <img class="auto-img" :src="item.smallImg" alt />
            </div>
            <div class="pro-desc fl">
              <div class="pro-name">
                <div class="ch-name">{{item.name}}</div>
                <div class="en-name">{{item.enname}}</div>
              </div>
              <div class="pro-price">￥{{item.price}}</div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
//导入辅助函数
import { mapState } from "vuex";
export default {
  name: "Menu",
  data() {
    return {
      activeName: "isHot",
      //触底加载
      loading: false
    };
  },

  created() {

    
    
    if (this.menuIsloaded) {
      this.activeName = this.isActive;
      return;
    }

    //加载提示
    this.$toast.loading({
      forbidClick: true,
      duration: 0,
      message: "加载中..."
    });
    //获取banner数据
    this.getBanner();
    //获取商品类型
    this.getType();
    //获取最热商品数据
    this.getHot();

    this.$store.commit("changeData", { key: "menuIsloaded", value: true });
  },

  computed: {
    ...mapState("menuModule", [
      "bannerData",
      "typeData",
      "products",
      "isActive",
      "proData",
      "count",
      "start",
      "finished"
    ]),

    menuIsloaded() {
      return this.$store.state.menuIsloaded;
    }
  },

  methods: {
    //加载商品数据
    loadData() {
      setTimeout(() => {
        this.loading = false;

        if (this.proData.length >= this.products.length) {
          //没有数据可加载
          this.$store.commit("menuModule/changeData", {
            key: "finished",
            value: true
          });

          return;
        }

        this.$store.commit("menuModule/loadShopcartData");
        // this.isAllSelect = false;
      }, 1000);
    },
    //获取轮播图片
    getBanner() {
      this.axios({
        method: "GET",
        url: "/banner",
        //get请求携带的参数
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          //  

          if (result.data.code == 300) {
            this.$store.commit("menuModule/changeData", {
              key: "bannerData",
              value: result.data.result
            });
          }
        })
        .catch(err => {
          
        });
    },

    //获取商品类型
    getType() {
      this.axios({
        method: "GET",
        url: "/type",

        //get请求携带的参数
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          let types = result.data.result;
          // 
          types.unshift({
            type: "isHot",
            typeDesc: "最新推荐"
          });

          if (result.data.code == 400) {
            this.$store.commit("menuModule/changeData", {
              key: "typeData",
              value: types
            });
          }

          // 
        })
        .catch(err => {
          
        });
    },

    //获取最新商品
    getHot() {
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1
        }
      })
        .then(result => {
          // 
          this.$toast.clear();
          if (result.data.code == 500) {
            this.$store.commit("menuModule/changeData", {
              key: "proData",
              value: result.data.result
            });
          }

          // 
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    //切换商品数据
    toggleProduct(name) {
      this.$store.commit("menuModule/changeData", {
        key: "isActive",
        value: name
      });
      

      // 
      let params = {
        appkey: this.appkey
      };

      if (name == "isHot") {
        params.key = "isHot";
        params.value = 1;
      } else {
        params.key = "type";
        params.value = name;
      }

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params
      })
        .then(result => {
          // 

          if (result.data.code == 500) {
            this.$store.commit("menuModule/changeData", {
              key: "proData",
              value: result.data.result
            });
          }

          // 
        })
        .catch(err => {
          
        });
    },

    //跳转商品详情
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
     
    }
  }
};
</script>

<style lang="less" scoped>
.menu {
  .boc{
    position: sticky;
    top: 0;
  }
  height: 100%;
  // padding-top: 163.04px;
  // background-color: #ab7c37;
  padding-bottom: 50.03px;
  /deep/.van-tabs__line {
    bottom: 3px;
  }
  /deep/.van-tabs__nav--line {
    padding-bottom: 0;
  }
  /deep/.van-tabs__wrap {
    overflow: visible;
  }
  /deep/.van-hairline--top-bottom::after {
    border-color: #f7f7f7;
  }
  /deep/.van-list {
    height: 100%;
  }
  .logo {
    padding: 0 5px 5px;
    > img {
      border-radius: 5px;
    }
  }
  .product-box {
    // height: 389.97px;

    overflow-y: auto;
    padding: 10px;

    // background-color: #ab7c37;
    .pro-data {
      width: calc(100% / 3 - 20px);

      margin: 5px 5px 5px;
      padding: 5px;
      background-color: #fff;
      border-radius: 3px;

      .pro-desc {
        width: 100%;
        margin-top: 5px;
        .ch-name {
          width: 100%;
          text-align: center;
          font-size: 13px;
          color: #444;
        }
        .en-name {
          width: 100%;
          text-align: center;
          font-size: 10px;
          color: #766034;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pro-price {
          width: 100%;
          text-align: center;
          height: 20px;
          font-size: 13px;
          line-height: 20px;
          color: #652f30;
        }
      }
    }
  }
}
</style>