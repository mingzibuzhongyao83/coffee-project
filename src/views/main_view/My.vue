<template>
  <div class="my">
    <div class="head-portrait" :style="{backgroundImage: 'url(' + userInfo.userBg + ')'}">
      <div class="head-portrait-box">
        <div class="head-box">
          <div class="img-box">
            <img class="auto-img i" :src="userInfo.userImg" alt />
          </div>
          <div class="text" v-if="isLogin">
            <span>{{userInfo.nickName}}</span>
          </div>
          <div class="text" v-else>
            <span @click="goLogin">登录</span>
          </div>
          <div class="desc">{{userInfo.desc == '' ? '这个人很懒，什么都没有留下' : userInfo.desc}}</div>
          <div class="mybg">
            <span>更换背景</span>
            <van-uploader class="v-bg" :after-read="upload" />
          </div>
        </div>
      </div>
    </div>

    <div class="information-bar">
      <van-cell
        v-for="(item,index) in myData"
        :key="index"
        :title="item.title"
        :icon="item.icon"
        is-link
        @click="go(item.name)"
      ></van-cell>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { utils } from "../../utils/utils";
export default {
  name: "My",

  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    ...mapState("myModule", ["myData", "userInfo"])
  },

  created() {
    this.$store.commit("myModule/changeData", { key: "userInfo", value: {} });
    this.getUserInfo();
  },

  methods: {
    go(name) {
      if (!this.isLogin) {
        this.$toast("请先登录");
        return;
      }
      this.$router.push({ name });
      // 
    },

    goLogin() {
      this.$router.push({
        name: "Login"
      });
    },

    //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("_t");

      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          // 
          this.$toast.clear();

          this.$store.commit("changeData", {
            key: "isLogin",
            value: result.data.code != 700
          });

          if (result.data.code == 700) {
            return;
          }

          this.$store.commit("myModule/changeData", {
            key: "userInfo",
            value: result.data.result[0]
          });

          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //上传背景
    upload(file) {

      
      if (!this.isLogin) {
        this.$toast("请先登录");
        return;
      }

      //控制上传图片大小不能超过 300KB
      let imgSize = 300 * 1024;
      if (file.file.size > imgSize) {
        this.$toast("上传图片大小不能超过300KB");
        return;
      }

      //将图片上传到服务器

      //获取图片类型
      let imgType = file.file.type.split("/")[1];
      //

      //处理图片的base64
      let serverBase64Img = file.content.replace(
        /data:image\/[A-Za-z]+;base64,/,
        ""
      );
      //

      let tokenString = localStorage.getItem("_t");

      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        },
        transformRequest: utils.transformRequest
      })
        .then(result => {
          this.$toast.clear();

          this.userInfo.userBg = result.data.userBg;
        })
        .catch(err => {
          this.$toast.clear();
        });
    }
  }
};
</script>

<style lang="less" scoped>
.my {
  .van-cell {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    // padding: 0 10px;
    background-color: #f7f7f7;
  }
  .van-uploader__upload {
    margin: 0;
  }
  .mybg {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #fff;
    font-size: 14px;
  }
  .v-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 0;
  }
  .desc {
    width:200px;
    color: #fff;
    font-size: 12px;
    margin-top: 10px;
    text-align: center;
    height: 60px;
  }
  .head-portrait {
    height: 250px;
    // background: url("../../assets/images/bg.jpg") no-repeat center center;
    background-size: cover;
    .head-portrait-box {
      height: 250px;
      background-color: rgba(126, 128, 147, 0.66);
    }
    .head-box {
      width: 200px;
      height: 200px;
      //   background-color: #00ff00;
      padding: 50px 87.5px 0;
      .img-box {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        background-color: #ddd;
        border-radius: 50%;
        .i {
          border-radius: 50%;
        }
      }
      .text {
        height: 24px;
        padding: 3px 0;
        text-align: center;
        line-height: 24px;
        color: #fff;
        font-size: 16px;
      }
    }
  }
  .information-bar {
    padding: 0 10px;
  }
}
</style>