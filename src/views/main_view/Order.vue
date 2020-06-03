<template>
  <div class="order">
    <van-tabs
      v-model="activeName"
      color="#ab7c37"
      :sticky="true"
      title-active-color="#ab7c37"
      @change="toggleTab"
    >
      <van-tab :title="item.title" :name="item.name" v-for="(item,index) in navData" :key="index"></van-tab>
    </van-tabs>
    <template v-if="orderData.length > 0">
      <div class="bigbox">
         <van-list finished-text="已经到底了...." :finished="finished" v-model="loading" @load="loadData">
        <!-- 每一个订单 -->
        <div class="pro-box" v-for="(item,index) in orderData" :key="index">
          <div class="deal clearfix">
            <div class="number fl">{{item.oid}}</div>
            <template v-if="item.status==1">
              <div class="fr" @click="affirmorder(item.oid,index)">确认收货</div>
            </template>
            <template v-else>
              <div class="fr clearfix">
                已收货
                <span class="fr delete-icon">
                  <van-icon name="delete" @click="deleteOrder(item.oid,index)" />
                </span>
              </div>
            </template>
          </div>
          <div class="pro">
            <div class="a clearfix" v-for="(v,i) in item.data" :key="i">
              <div class="pro-img fl">
                <img class="auto-img" :src="v.smallImg" alt />
              </div>
              <div class="pro-info fl">
                <div class="name">{{v.name}}</div>
                <div class="type">{{v.rule}}</div>
                <div class="price-box clearfix">
                  <span class="price fl">￥{{v.price}}</span>
                  <span class="count fr">X{{v.count}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="describe clearfix">
            <div class="time fl">{{item.orderTime}}</div>
            <div class="fr">
              共
              <span class="allcount">&nbsp;{{item.count}}&nbsp;</span>件商品 合计:
              <span class="allprice">￥{{item.total}}</span>
            </div>
          </div>
        </div>
         </van-list>
      </div>
    </template>
    <template v-else>
      <div class="not-order">
        <div>
          <div class="not-order-icon">
            <van-icon name="description" />
          </div>
          <div v-if="isLogin">没有订单，赶紧去逛一逛！</div>
          <div v-else>
            <span class="login-text" @click="goState">登录，查看订单数据</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { utils } from "../../utils/utils";

import { mapState } from "vuex";
export default {
  name: "Order",
  data() {
    return {
      activeName: "0",
        //触底加载
      loading: false
    };
  },
  created() {
     this.$store.commit("orderModule/changeData", {key: "orderData", value: {} });
    this.getorderData(0);
  },

  computed: {
     isLogin() {
        return this.$store.state.isLogin;
      },

    ...mapState("orderModule", ["navData", "orderData","count","finished","start","orderproData"])
  },

  methods: {
    //加载商品数据
    loadData() {
      setTimeout(() => {
        this.loading = false;

        if (this.orderproData.length >= this.orderData.length) {
          //没有数据可加载
          this.$store.commit("orderModule/changeData", {
            key: "finished",
            value: true
          });

          return;
        }

        this.$store.commit("orderModule/loadShopcartData");
        // this.isAllSelect = false;
      }, 1000);
    },
     goState() {
        this.$router.push({name: 'Login'});
      },

    //获取订单数据
    getorderData(status) {
      let tokenString = localStorage.getItem("_t");
      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });

      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status
        }
      })
        .then(result => {
          this.$toast.clear();
            this.$store.commit('changeData', {key: 'isLogin', value: result.data.code != 700});

          if (result.data.code == 700) {
            return;
          }

          // 

          //获取所有订单号数据
          let orderData = [];

          //查询订单oid
          let orderoids = [];

          result.data.result.forEach(v => {
            if (orderoids.indexOf(v.oid) === -1) {
              orderoids.push(v.oid);
            }
          });

          // 

          orderoids.forEach(v => {
            //当前订单数据
            let currentData = {
              oid: v,
              count: 0,
              total: 0,

              //当前订单的所有商品数据
              data: []
            };

            result.data.result.forEach(i => {
              if (i.oid == v) {
                currentData.data.push(i);
                currentData.count += i.count;
                currentData.total += i.count * i.price;
              }
            });

            //时间
            currentData.orderTime = utils.formatDate(
              new Date(currentData.data[0].createdAt),
              "yyyy-MM-dd hh:mm:ss"
            );

            currentData.status = currentData.data[0].status;

            orderData.push(currentData);
          });

          //按时间排序
          orderData.sort((a, b) => {
            return new Date(b.orderTime) - new Date(a.orderTime);
          });

          this.$store.commit("orderModule/changeData", {
            key: "orderData",
            value: orderData
          });

          // 
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //确认收货
    affirmorder(oid, index) {
      let tokenString = localStorage.getItem("_t");
      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });
      this.axios({
        method: "POST",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        },
        transformRequest: utils.transformRequest
      })
        .then(result => {
          this.$toast.clear();
          // 
          this.orderData[index].status = 2;

          if (this.activeName == 1) {
            //删除orderData数组的元素
            this.$store.commit("orderModule/removeOrderData", index);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //切换
    toggleTab(status) {
      // 

      this.getorderData(status);
    },

    // 删除订单
    deleteOrder(oid, index) {
      let tokenString = localStorage.getItem("_t");
      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });

      this.axios({
        method: "POST",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        },
        transformRequest: utils.transformRequest
      })
        .then(result => {
          this.$toast.clear();
          // 
          this.$store.commit("orderModule/removeOrderData", index);
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
.order {
  padding-bottom: 50px;
  padding-top: 44px;
  .not-order{
      font-size: 18px;
      margin-top: 50px;
      color: #ab7c37;
      text-align: center;
      >div:last-child{
        color: #444;
      }
    }
    .not-order-icon{
      font-size: 64px;
      color: #ab7c37;
    }

    .login-text{
      color: #444;
    }
  /deep/.van-tabs {
    position: fixed;
    top: 0;
    width: 100%;
  }
  /deep/.van-icon {
    position: static;
    line-height: 30px;
  }
   
  .delete-icon {
    font-size: 16px;
    // position: relative;
    margin-left: 10px;
  }
  .bigbox {
    padding: 10px;
    // padding-top: 10px;
  }
  .pro-box {
    // margin-top: 10px;
    // margin: 10px;
    padding: 10px 10px 0;
    margin-bottom: 10px;
    // height: 467px;
    border-radius: 5px;
    background-color: #fff;
  }
  .a {
    height: 70px;
    margin-bottom: 10px;
    // background-color: #e4393c;
  }
  .pro-img {
    width: 60px;
    height: 60px;
    padding: 5px;
  }
  .pro-info {
    width: calc(~"100% - 80px");
    height: 60px;
    padding: 5px;
  }
  .name {
    font-size: 14px;
    line-height: 19px;
    margin-top: 2px;
    // color: #652f30;
  }
  .type {
    color: #766034;
  }
  .price-box {
    font-size: 14px;
    margin-top: 5px;
  }
  .price {
    line-height: 19px;
    color: #652f30;
    font-weight: 600;
  }
  .count {
    font-size: 12px;
    color: #652f30;
  }
  .describe {
    border-top: 1px solid #ddd;
    height: 30px;
    line-height: 30px;
    text-align: right;
  }
  .allcount {
    color: #652f30;
  }
  .allprice {
    font-size: 14px;
    color: #652f30;
    font-weight: 600;
  }
  .deal {
    height: 30px;
    border-bottom: 1px solid #ddd;
    line-height: 30px;
    margin-bottom: 10px;
  }
}
</style>