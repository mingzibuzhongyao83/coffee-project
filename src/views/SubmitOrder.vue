<template>
  <div class="submitorder">
    <!-- 导航 -->
    <div class="nav-box">
      <van-nav-bar title="提交订单" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    </div>

    <div class="receive" @click="showed">{{addressData.address}}</div>

    <div class="pro-box">
      <!-- 选择收货地址 -->

      <div class="pro">
        <div class="a clearfix" v-for="(item,index) in orderData" :key="index">
          <div class="pro-img fl">
            <img class="auto-img" :src="item.small_img" alt />
          </div>
          <div class="pro-info fl">
            <div class="name">{{item.name}}</div>
            <div class="type">{{item.rule}}</div>
            <div class="price-box clearfix">
              <span class="price fl">￥{{item.price}}</span>
              <span class="count fr">X{{item.count}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="describe">
        共
        <span class="allcount">&nbsp;{{orderDesc.count}}&nbsp;</span>件商品 合计:
        <span class="allprice">￥{{orderDesc.total}}</span>
      </div>
    </div>

    <van-action-sheet v-model="show" title="选择收货地址">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        :switchable="true"
        @select="selectAddress"
        @add="AddRegion"
      ></van-address-list>
    </van-action-sheet>
    <van-submit-bar :price="orderDesc.total*100" button-text="立即支付" @submit="submitorder" />
  </div>
</template>

<script>
import { utils } from "../utils/utils";

import { mapState } from "vuex";
export default {
  name: "SubmitOrder",
  data() {
    return {
      show: false,
      chosenAddressId: "0"
    };
  },
  computed: {
    ...mapState("submitorderModule", [
      "list",
      "orderData",
      "orderDesc",
      "isSelect",
      "addressData",
      "sids"
    ])
  },
  created() {
    this.$store.commit("submitorderModule/emptyData");
    let sids = this.$route.query.sids.split("-");
    //

    this.$store.commit("submitorderModule/changeData", {
      key: "sids",
      value: sids
    });

    this.findProduct(sids);
    this.getAddress();
  },
  methods: {
    //查询购买的商品
    findProduct(sids) {
      let tokenString = localStorage.getItem("_t");
      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });
      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
        }
        // transformRequest: utils.transformRequest
      })
        .then(result => {
          this.$toast.clear();

          //
          this.orderDesc.count = 0;
          this.orderDesc.total = 0;

          result.data.result.forEach(v => {
            this.orderDesc.count += v.count;
            this.orderDesc.total += v.count * v.price;
          });

          this.$store.commit("submitorderModule/changeData", {
            key: "orderData",
            value: result.data.result
          });
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    goBack() {
      this.$router.go(-1);
    },
    showed() {
      this.show = true;
    },
    //新增地址
    AddRegion() {
      this.$router.push({ name: "NewAddress", query: { isAdd: 1 } });
    },

    //获取收货地址
    getAddress() {
      let tokenString = localStorage.getItem("_t");

      this.axios({
        method: "GET",
        url: "/findAddress",

        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          let list = [];

          result.data.result.forEach((v, i) => {
            let address = {
              id: i + "",
              name: v.name,
              tel: v.tel,
              address: v.province + v.city + v.county + v.addressDetail
            };
            list.push(address);

            if (v.isDefault == 1) {
              this.$store.commit("submitorderModule/changeData", {
                key: "isSelect",
                value: true
              });

              this.addressData.address = address.address;

              this.chosenAddressId = i + "";
            }
          });

          this.$store.commit("submitorderModule/changeData", {
            key: "list",
            value: list
          });
        })
        .catch(err => {});
    },

    //选择地址
    selectAddress(item, index) {
      if (!this.isSelect) {
        //
        this.$store.commit("submitorderModule/changeData", {
          key: "isSelect",
          value: true
        });
      }
      this.addressData.phone = item.tel;
      this.addressData.receiver = item.name;
      this.addressData.address = item.address;
      //
      this.show = false;
    },

    //结算
    submitorder() {
      if (!this.isSelect) {
        this.$toast(this.address);
        return;
      }
      if (this.orderData.length == 0) {
        return;
      }
      let tokenString = localStorage.getItem("_t");

      let sids = this.sids.concat();

      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
          phone: this.addressData.phone,
          address: this.addressData.address,
          receiver: this.addressData.receiver
        },
        transformRequest: utils.transformRequest
      })
        .then(result => {
          this.$toast.clear();
          //
          this.$router.push({ name: "Order" });
           
        })
        .catch(err => {
          this.$toast.clear();
        });
    }
  }
};
</script>

<style lang="less" scoped>
.submitorder {
  padding-top: 46px;
  padding-bottom: 50px;
  //   height: 100%;
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
  /deep/.van-nav-bar__title {
    color: #fff;
  }
  /deep/.van-cell {
    border-radius: 5px;
  }
  /deep/.van-submit-bar__price {
    color: #652f30;
    font-weight: 600;
  }
  .van-icon-edit::before {
    content: "";
  }
  .van-address-item__value {
    padding: 0;
  }
  .van-submit-bar__button--danger {
    background: #ab7c37;
  }
  .van-submit-bar__text {
    text-align: left;
  }
  .receive {
    background-color: #fff;
    font-size: 16px;
    color: #444;
    height: 46px;
    line-height: 46px;
    margin: 10px;
    border-radius: 5px;
    padding: 0px 10px 0;
  }
  .box {
    padding: 10px;
  }
  .pro-box {
    // margin-top: 10px;
    margin: 10px;
    padding: 10px 10px 0;
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
}
</style>