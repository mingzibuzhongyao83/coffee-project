<template>
  <div class="newaddress">
    <!-- 导航 -->
    <div class="nav-box">
      <van-nav-bar :title="title" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    </div>
    <van-address-edit
      :area-list="addressList"
      :show-postal="isPostal"
      :show-delete="isDelete"
      :show-set-default="isDefault"
      :address-info="addressInfo"
      detail-rows="2"
      detail-maxlength="100"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="saveAddress"
      @delete="deleteAddress"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import { utils } from "../utils/utils";
import addressList from "../data/addressList";
export default {
  name: "NewAddress",
  data() {
    return {
      //初始化地址信息
      addressInfo: {
        aid: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false
      }
    };
  },

  computed: {
      isLogin() {
      return this.$store.state.isLogin;
    },
    ...mapState("newaddressModule", [
      "isAdd",
      "aid",
      "isDefault",
      "isDelete",
      "isPostal",
      "addressList",
      "title",
      "temporaryAddressData"
    ])
  },
  created() {
     if (!this.isLogin) {
        this.$router.push({name:'Login'});
        return;
      }
    let query = this.$route.query;
    

    //根据aid获取地址数据
    if (query.isAdd == 0) {
      let tokenString = localStorage.getItem('_t');

      this.axios({
        method: "GET",
        url: "./findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: query.aid
        }
      })
        .then(result => {
          // 
          let data = result.data.result[0];
          data.isDefault = Boolean(data.isDefault);

          for (let key in this.addressInfo) {
            this.addressInfo[key] = data[key];
          }
          // 

          //拷贝地址数据
          let addressData = Object.assign({}, this.addressInfo);

          this.$store.commit("newaddressModule/changeData", {
            key: "temporaryAddressData",
            value: addressData
          });

          
        })
        .catch(err => {
          
        });
    }
    this.$store.commit("newaddressModule/changeData", {
      key: "isAdd",
      value: query.isAdd
    });

    this.$store.commit("newaddressModule/changeData", {
      key: "aid",
      value: query.aid
    });

    this.$store.commit("newaddressModule/changeData", {
      key: "isDelete",
      value: !query.isAdd
    });

    this.$store.commit("newaddressModule/changeData", {
      key: "title",
      value: query.isAdd == 0 ? "编辑地址" : "新增地址"
    });
  },
  methods: {
    //判断数据方法
    isSame(o1, o2) {
      //o1: 当前地址数据
      //o2: 编辑前的地址数据

      for (let key in o2) {
        if (o2[key] != o1[key]) {
          //存在数据不一样
          return false;
        }
      }

      return true;
    },
    //返回
    goBack() {
      this.$router.go(-1);
    },

    //保存地址
    saveAddress(content) {
      // 

       if (!this.isLogin) {
        this.$toast("请先登录");
        return;
      }

      delete content.country;

      //拷贝对象
      let data = Object.assign({}, content);
      // 

      let url = "";

      if (this.isAdd == 1) {
        //新增地址
        delete data.aid;
        url = "/addAddress";
      } else {
        //编辑地址
        //判断当前地址数据是否跟编辑前的地址数据是否一样，如果一样，则不请求
        if (this.isSame(content, this.temporaryAddressData)) {
          // 
          return this.$router.push({ name: "Address" });
        } else {
          //不一样编辑地址
          url = "/editAddress";
        }
      }

      //获取token
      let tokenString = localStorage.getItem('_t');
      data.tokenString = tokenString;
      data.appkey = this.appkey;
      //将isdefault转化为数值
      data.isDefault = Number(data.isDefault);

       this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

      this.axios({
        method: "POST",
        url,
        data,
        transformRequest: utils.transformRequest
      })
        .then(result => {
             this.$toast.clear();
          // 
           this.goBack();
        })
        .catch(err => {
             this.$toast.clear();
          
        });
    },

    //删除地址
    deleteAddress(){
       if (!this.isLogin) {
         this.$router.push({name:'Login'});
        return;
      }
       this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

      let tokenString = localStorage.getItem('_t');
      this.axios({
        method:'POST',
        url:'/deleteAddress',
        data:{
          appkey:this.appkey,
          tokenString,
          aid:this.aid
        },
        transformRequest:utils.transformRequest
      }).then(result=>{
           this.$toast.clear();
        // 
        this.$router.push({name:'Address'});
      }).catch(err=>{
           this.$toast.clear();
        
      })
    }
  }
};
</script>

<style lang="less" scoped>
.newaddress {
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
  /deep/.van-nav-bar__title {
    color: #fff !important;
  }
  /deep/.van-switch--on {
    background-color: #ab7c37;
  }
  /deep/.van-button--danger {
    background-color: #ab7c37;
    border-color: #ab7c37;
  }
}
</style>