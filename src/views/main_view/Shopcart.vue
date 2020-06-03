<template>
  <div class="shopcart">
    <template v-if="allShocartData.length > 0">
    <van-nav-bar :fixed="true" :right-text="isManage?'完成':'管理'" @click-right="manage" />
    <!--  -->
    <div class="swipe-box">
      <van-list finished-text="已经到底了...." :finished="finished" v-model="loading" @load="loadData">
        <van-swipe-cell v-for="(item,index) in shopcartData" :key="index" :disabled="!isManage">
          <van-cell>
            <div class="v-cell">
              <!-- 选择框 -->
              <div class="v-checkbox">
                <van-checkbox
                  v-model="item.isChecked"
                  shape="round"
                  checked-color="#ab7c37"
                  @click="simpleSelect(item)"
                ></van-checkbox>
              </div>
              <!-- 图片 -->
              <div class="pro-img" @click="goDtail(item.pid)">
                <van-image :src="item.small_img" />
              </div>

              <!-- 商品信息 -->
              <div class="pro-info">
                <!-- 商品名称 -->
                <div class="pro-name">{{item.name}}</div>

                <!-- 商品类型-->
                <div class="pro-type">{{item.enname}}</div>

                <!-- 商品规格 -->
                <div class="pro-rule">{{item.rule}}</div>
                <!-- 商品价格和数量 -->
                <div class="clearfix price-box">
                  <span class="fl price">￥{{item.price}}</span>
                  <div class="count clearfix fr">
                    <span class="ico fl left" @click="subCount(item)"></span>
                    <input class="pro-count fl" type="text" readonly v-model="item.count" />
                    <span class="ico fl right" @click="addCount(item)"></span>
                  </div>
                </div>
              </div>
            </div>
          </van-cell>
          <template #right>
            <van-button
              class="v-button"
              color="#946c39"
              square
              text="删除"
              @click="removeOne(item.sid, index)"
            />
          </template>
        </van-swipe-cell>
      </van-list>
    </div>

    <!-- 提交订单 -->
    <van-submit-bar
      :price="total"
      button-text="提交订单"
      class="v-submit-bar"
      :safe-area-inset-bottom="true"
      v-show="!isManage"
      @submit="goSubmitOrder"
    >
      <van-checkbox
        :v-model="true"
        v-model="isAllchecked"
        @click="allSelect"
        checked-color="#ab7c37"
      >全选</van-checkbox>
    </van-submit-bar>

    <!-- 删除 -->
    <van-submit-bar
      button-text="全部删除"
      class="v-submit"
      :safe-area-inset-bottom="true"
      v-show="isManage"
      @submit="removeMore"
    >
      <van-checkbox
        :v-model="true"
        v-model="isAllchecked"
        @click="allSelect"
        checked-color="#ab7c37"
      >全选</van-checkbox>
    </van-submit-bar>
 </template>

 <template v-else>
       <div>
         <div class="not-shopcart">
          <div class="not-shopcart-icon">
            <van-icon name="cart-o" />
          </div>
          <div v-if="isLogin">购物车没有商品，赶紧去逛一逛！</div>
          <div v-else>
            <span class="login-text" @click="goState">登录，查看购物车数据</span>
          </div>
        </div>

      </div>
    </template>

  </div>
</template>

<script>
import { mapState } from "vuex";
import { utils } from "../../utils/utils";
export default {
  name: "Shopcart",
  data() {
    return {
      // count: 1,

      //触底加载
      loading: false,

      isAllchecked: false
    };
  },
  created() {
    //获取购物车商品数据
    this.getShopcartData();
    //清空数据
    this.$store.commit("shopcartModule/emptyData");
  },

  computed: {
    isLogin() {
        return this.$store.state.isLogin;
      },
    ...mapState("shopcartModule", [
      "shopcartData",
      "finished",
      "count",
      "allShocartData",
      "isManage",
      "total"
    ])
  },
  methods: {
     goState() {
        this.$router.push({name: 'Login'});
      },
    //查看商品详情
    goDtail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
    //加载商品数据
    loadData() {
      setTimeout(() => {
        this.loading = false;

        if (this.shopcartData.length >= this.allShocartData.length) {
          //没有数据可加载
          this.$store.commit("shopcartModule/changeData", {
            key: "finished",
            value: true
          });

          return;
        }

        this.$store.commit("shopcartModule/loadShopcartData");
        // this.isAllSelect = false;
      }, 1000);
    },

    //获取购物车商品数据
    getShopcartData() {
       //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: '加载中...'
        })
      let tokenString = localStorage.getItem('_t');
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString
        }

        // transformRequest: utils.transformRequest
      })
        .then(result => {
            this.$toast.clear();
            this.$store.commit('changeData', {key: 'isLogin', value: result.data.code != 700});

          if (result.data.code == 700) {
            return;
          }
          if (result.data.code == 5000) {
            //添加判断勾选的属性
            result.data.result.forEach(v => {
              v.isChecked = false;
            });

            this.$store.commit("shopcartModule/changeData", {
              key: "allShocartData",
              value: result.data.result
            });

            
             
          }
        })
        .catch(err => {
            this.$toast.clear();
          
        });
    },

    //修改购物车商品数量
    modifyShopcartCount(sid, count) {
       //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: '处理中...'
        })
      let tokenString = localStorage.getItem('_t');
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid,
          count
        },
        transformRequest: utils.transformRequest
      })
        .then(result => {
            this.$toast.clear();
          
          this.sum();
        })
        .catch(err => {
            this.$toast.clear();
          
        });
    },

    //增加商品数量
    addCount(item) {
      ++item.count;
      this.modifyShopcartCount(item.sid, item.count);
    },

    //减少商品数量
    subCount(item) {
      if (item.count == 1) {
        return;
      }
      --item.count;

      this.modifyShopcartCount(item.sid, item.count);
    },

    //切换
    manage() {
      this.$store.commit("shopcartModule/changeData", {
        key: "isManage",
        value: !this.isManage
      });
    },

    //全选
    allSelect() {
      this.isAllchecked = !this.isAllchecked;
      this.shopcartData.forEach(v => {
        v.isChecked = this.isAllchecked;
      });
      this.sum();
      // 
    },

    //单选
    simpleSelect(item) {
      // 
      item.isChecked = !item.isChecked;
      this.sum();

      for (let i = 0; i < this.shopcartData.length; i++) {
        if (!this.shopcartData[i].isChecked) {
          //没有全选
          this.isAllchecked = false;
          return;
        }
      }

      this.isAllchecked = true;
    },

    //删除商品
    removeShopcart(sids) {
      //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: '处理中...'
        })
      let tokenString = localStorage.getItem('_t');
      return this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids
        },
        transformRequest: utils.transformRequest
      });
    },

    //删除一个商品
    removeOne(sid, index) {
      let sids = JSON.stringify([sid]);
      

      this.removeShopcart(sids)
        .then(result => {
           this.$toast.clear();
          
          this.$store.commit("shopcartModule/removeShopcartData", [sid]);
          this.sum();

          if (this.shopcartData.length == 0) {
            this.isAllchecked = false;
          }
        })
        .catch(err => {
           this.$toast.clear();
          
        });
    },

    //删除多个商品
    removeMore() {
      //获取勾选的商品
      let sids = [];
      this.shopcartData.forEach(v => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      if (sids.length == 0) {
        this.$toast({
          message: "没有选择商品"
        });

        return;
      }
      
      this.removeShopcart(JSON.stringify(sids)).then(result => {
         this.$toast.clear();
        
        this.$store.commit("shopcartModule/removeShopcartData", sids);
        this.sum();
        if (this.shopcartData.length == 0) {
          this.isAllchecked = false;
        }
      }).catch(err => {
          this.$toast.clear();
          
        })
    },

    // 计算总价
    sum() {
      let total = 0;
      this.shopcartData.forEach(v => {
        if (v.isChecked) {
          total += v.price * v.count * 100;
        }
      });

      this.$store.commit("shopcartModule/changeData", {
        key: "total",
        value: total
      });
    },

    //跳转提交订单页面
    goSubmitOrder(){
      //获取勾选商品的购物车的sid
      let sids=[];
      this.shopcartData.forEach(v=>{
        if(v.isChecked){
          sids.push(v.sid);
        }
      });
        if (sids.length == 0) {
        this.$toast({
          message: "没有选择商品"
        });

        return;
      }
      this.$router.push({name:'SubmitOrder',query:{sids:sids.join('-')}});
    }
  }
};
</script>
<style lang="less" scoped>
.shopcart {
  height: 100%;
  padding-top: 46.01px;
  padding-bottom: 110.06px;
  // height: 100%;
  
  /deep/.van-submit-bar__price{
    color: #652f30;
    font-weight: 600;
  }
  /deep/.van-nav-bar {
    background-color: #ab7c37;
  }
  /deep/.van-nav-bar__text {
    color: #fff;
    background-color: #ab7c37;
  }
  /deep/.van-submit-bar__button--danger{
    background: #ab7c37;
  }

  .not-shopcart{
      font-size: 18px;
      margin-top: 50px;
      color: #ab7c37;
      text-align: center;
      >div:last-child{
        color: #444;
      }
    }
    .not-shopcart-icon{
      font-size: 64px;
    }

    .login-text{
      color: #444;
    }
 
  .van-cell{
    background-color: #f7f7f7;
  }
  .manage {
    text-align: right;
    font-size: 14px;
    color: #fff;
  }
  .v-cell {
    display: flex;

    .pro-img {
      width: 80px;
      height: 80px;
    }
    .v-checkbox {
      margin-top: 32px;
      margin-right: 16px;
    }
    .pro-info {
      width: calc(~"100% - 20px - 100px - 16px - 16px");
      margin-left: 16px;
    }
    .pro-name {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 15px;
      // margin-top: 5px;
      //   margin-bottom: 5px;
    }
    .pro-rule {
      //   margin-top: 5px;
      height: 16px;
      line-height: 16px;
      font-size: 11px;
      color: #766034;
    }
  }
  .v-button {
    height: 100%;
  }
  .v-submit-bar {
    bottom: 49.98px;
  }
  .v-submit {
    bottom: 49.98px;
    .van-checkbox {
      margin-right: auto;
    }
  }

  .price {
    color: #652f30;
    font-weight: 600;
  }
  .pro-type {
    height: 16px;
    line-height: 16px;
    font-size: 11px;
    color: #766034;
  }
  .price-box {
    width: 100%;
    height: 24px;
  }
  .count {
    margin-right: auto;
    font-size: 14px;
    > input {
      background-color: #ffffff00;
    }
  }
  .ico {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    &.left {
      background-image: url("../../assets/images/sub2.png");
    }
    &.right {
      background-image: url("../../assets/images/add2.png");
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