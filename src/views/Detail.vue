<template>
  <div class="detail">
    <!-- 导航 -->
    <div class="nav-box">
      <van-nav-bar title="商品详情" left-text="返回" left-arrow :fixed="true" @click-left="back" />
    </div>

    <!-- 商品详情 -->
    <div class="product-box">
      <!-- 商品图片 -->
      <div class="img-box">
        <img class="auto-img" :src="detailData.large_img" alt />
      </div>

      <div class="box">
        <!-- 商品名称与收藏 -->
        <ul class="name-box">
          <li class="pro-name">{{detailData.name}}</li>
          <li class="pro-like" :class="{active:isLike}" @click="like"></li>
        </ul>

        <!-- 商品规格 -->
        <div class="pro-rule">
          <div class="rule-item" v-for="(item,index) in rules" :key="index">
            <span class="fl rule-title">{{item.title}}</span>
            <ul class="rule-list">
              <li
                v-for="(v,i) in item.rule"
                :key="i"
                :class="{active:v.isActive}"
                @click="toggleRuleData(v,index)"
              >{{v.text}}</li>
            </ul>
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="pro-desc">
          <div class="desc-title">商品描述:</div>
          <div class="desc-info">
            <p v-for="(item,index) in desc" :key="index">{{item}}</p>
          </div>
        </div>

        <!-- 价格数量 -->
        <div class="pro-price-count">
          <div class="price">￥{{detailData.price}}</div>
          <div class="count clearfix">
            <span class="ico fl left" @click="subPro"></span>
            <input class="pro-count fl" type="text" readonly v-model="count" />
            <span class="ico fl right" @click="addPro"></span>
          </div>
        </div>
      </div>

      <van-goods-action :color="'#ddd'">
        <van-goods-action-icon
          icon="cart-o"
          text="购物车"
          :badge="shopcartCount == 0 ? '' : shopcartCount >= 100 ? '99+' : shopcartCount"
          @click="gocart"
        />
        <van-goods-action-button
          color="rgb(185, 139, 82)"
          type="info"
          text="加入购物车"
          @click="addShopcart"
        />
        <van-goods-action-button color="#955913" type="danger" text="立即购买" @click="buy" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import { utils } from "../utils/utils";
export default {
  name: "Detail",

  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    ...mapState("detailModule", [
      "detailData",
      "rules",
      "count",
      "desc",
      "isLike",
      "shopcartCount"
    ])
  },

  created() {
    //加载提示
    this.$toast.loading({
      forbidClick: true,
      duration: 0,
      message: "加载中..."
    });

    //置空
    this.$store.commit("detailModule/emptyData");

    //截取路由参数
    let pid = this.$route.params.pid;
    // 

    //获取商品详情信息
    this.axios({
      method: "GET",
      url: "/productDetail",
      params: {
        appkey: this.appkey,
        pid
      }
    })
      .then(result => {
        //关闭加载提示
        this.$toast.clear();
        

        if (result.data.code == 600) {
          this.$store.commit(
            "detailModule/changeDetaildata",
            result.data.result[0]
          );
          //   

          this.findlike();

          this.shopcartnum();
        }
      })
      .catch(err => {
        //关闭加载提示
        this.$toast.clear();
        
      });
  },

  methods: {
    //跳转购物车
    gocart(){
      this.$router.push({name:'Shopcart'});
       
    },
    //增加商品数量
    addPro() {
      if (!this.isLogin) {
        this.$toast("请先登录");
        return;
      }
      let count = this.count + 1;
      this.$store.commit("detailModule/changeData", {
        key: "count",
        value: count
      });
    },

    //减少商品数量
    subPro() {
      if (!this.isLogin) {
        this.$toast("请先登录");
        return;
      }
      if (this.count == 1) {
        return;
      }

      let count = this.count - 1;
      this.$store.commit("detailModule/changeData", {
        key: "count",
        value: count
      });
    },

    //切换规格
    toggleRuleData(item, i) {
      // 

      if (item.isActive) {
        
        return;
      }

      let l = this.rules[i];
      //   

      for (let i = 0; i < l.rule.length; i++) {
        if (l.rule[i].isActive) {
          l.rule[i].isActive = false;
          break;
        }
      }

      item.isActive = true;
    },

    //查看当前商品是否被收藏
    findlike() {
      let tokenString = localStorage.getItem("_t");

      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.detailData.pid,
          tokenString
        }
      })
        .then(result => {
          if (result.data.code == 1000) {
            this.$store.commit("detailModule/changeData", {
              key: "isLike",
              value: result.data.result.length > 0
            });
          }
        })
        .catch(err => {
          
        });
    },

    //点击收藏，取消收藏
    like() {
      
      if (!this.isLogin) {
        this.$toast("请先登录");
        return;
      }
      // 加载提示;
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });
      let tokenString = localStorage.getItem("_t");
      let url = this.isLike ? "/notlike" : "/like";

      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.detailData.pid,
          tokenString
        },

        transformRequest: utils.transformRequest
      })
        .then(result => {
          // 关闭加载提示
          this.$toast.clear();

          //加载提示
          this.$toast({
            message: result.data.msg
          });

          //修改islike
          this.$store.commit("detailModule/changeData", {
            key: "isLike",
            value: !this.isLike
          });
        })
        .catch(err => {
          
          //关闭加载提示
          this.$toast.clear();
        });
    },

    //加入购物车
    addShopcart(type) {
      if (!this.isLogin) {
        this.$toast("请先登录");
        return;
      }
      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });
      let tokenString = localStorage.getItem("_t");
      // let url = this.isLike ? "/notlike" : "/like";
      

      let rulesdata = [];

      this.rules.forEach(v => {
        for (let i = 0; i < v.rule.length; i++) {
          if (v.rule[i].isActive) {
            rulesdata.push(v.rule[i].text);
            break;
          }
        }
      });

      // 
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          pid: this.detailData.pid,
          count: this.count,
          rule: rulesdata.join("/"),
          tokenString
        },

        transformRequest: utils.transformRequest
      })
        .then(result => {
          //关闭加载提示
          this.$toast.clear();

          //加载提示
          this.$toast({
            message: result.data.msg
          });
          if (result.data.code == 3000) {
            if (result.data.status == 1) {
              //修改数量
              this.$store.commit("detailModule/changeData", {
                key: "shopcartCount",
                value: this.shopcartCount + 1
              });
            }
            //立即购买携带sid到结算页面
            if (type == "buy") {
              this.$router.push({
                name: "SubmitOrder",
                query: { sids: result.data.sid }
              });
            }
          }
        })
        .catch(err => {
          
          // 关闭加载提示
          this.$toast.clear();
        });
    },
    //返回
    back() {
      this.$router.go(-1);
    },

    //立即购买
    buy() {
      this.addShopcart("buy");
    },

    //获取购物车总数量
    shopcartnum() {
      let tokenString = localStorage.getItem("_t");
      this.axios({
        method: "GET",
        url: "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          
          if (result.data.code == 8000) {
            //修改数量
            this.$store.commit("detailModule/changeData", {
              key: "shopcartCount",
              value: result.data.result
            });
          }
        })
        .catch(err => {
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
.detail {
  /deep/.van-nav-bar {
    background-color: #ab7c37;
  }
  /deep/.van-nav-bar .van-icon {
    color: #fff;
    background-color: #ab7c37 !important;
  }
  /deep/.van-hairline--bottom::after {
    border: none;
  }
  /deep/.van-nav-bar__left {
    background-color: #ab7c37 !important;
  }
  /deep/.van-nav-bar__text {
    color: #fff;
    background-color: #ab7c37 !important;
  }
  /deep/.van-goods-action {
    background-color: #f8f8f8;
  }
  /deep/.van-goods-action-icon {
    background-color: #f8f8f8;
  }
  /deep/.van-nav-bar__title {
    color: #fff;
  }
  padding-top: 46px;
  padding-bottom: 60px;
  .product-box {
    background-color: #fff;
  }
  .box {
    padding: 0px 10px;
  }
  .name-box {
    display: flex;
    padding-top: 15px;
  }
  .pro-name {
    font-size: 16px;
    line-height: 24px;
    color: #955913;
  }
  .pro-like {
    margin-left: auto;
    width: 27px;
    height: 24px;
    background: url("../assets/images/xin.png") no-repeat center center;
    background-size: cover;
    &.active {
      background-image: url("../assets/images/chengxin.png");
    }
  }
  .pro-rule {
    margin-top: 15px;
    font-weight: 500;
  }
  .rule-item {
    height: 30px;
    padding: 10px 0;
  }
  .rule-list > li {
    float: left;
    width: 70px;
    height: 30px;
    line-height: 30px;
    color: #ab7c37;
    background-color: #ddd;
    margin-right: 20px;
    border-radius: 3px;
    text-align: center;
    font-size: 13px;
    &.active {
      background-color: #ab7c37;
      color: #fff;
    }
  }
  .rule-title {
    line-height: 30px;
    width: 60px;
    font-size: 16px;
    color: #a5a5a5;
  }
  .pro-desc {
    margin-top: 15px;
    padding-bottom: 15px;
  }
  .desc-title {
    color: #955913;
    font-size: 16px;
  }
  .desc-info {
    color: #515259;
    font-size: 14px;
    > p {
      margin: 10px 0 0;
      color: #ab7c37;
    }
  }
  .pro-price-count {
    display: flex;
    height: 50px;
  }
  .price {
    color: #ab7c37;
    font-weight: 600;
    font-size: 16px;
    line-height: 50px;
  }
  .count {
    margin-top: 13px;
    margin-left: auto;
    font-size: 14px;
  }
  .ico {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    &.left {
      background-image: url("../assets/images/sub2.png");
    }
    &.right {
      background-image: url("../assets/images/add2.png");
    }
  }
  .pro-count {
    height: 24px;
    width: 30px;
    margin: 0 5px;
    text-align: center;
  }
}
</style>