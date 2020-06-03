<template>
  <div class="personaldata">
    <!-- 导航 -->
    <div class="nav-box">
      <van-nav-bar title="个人资料" left-text="返回" left-arrow :fixed="true" @click-left="goBack" />
    </div>

    <!-- 个人信息 -->
    <van-cell-group>
      <van-cell class="avatar" title="头像" size="large">
        <template #right-icon>
          <div class="person-img">
            <img class="auto-img" :src="userInfo.userImg" alt />
            <van-uploader class="v-uploader" :after-read="upload" />
          </div>
        </template>
      </van-cell>
      <van-cell title="用户id" size="large" :value="userInfo.userId" />
      <van-cell title="手机号" size="large" :value="userInfo.phone" />
      <van-cell class="avatar" title="昵称" size="large">
        <template #right-icon>
          <div>
            <van-field
              class="v-field"
              input-align="right"
              v-model="userInfo.nickName"
              @change="changeUserinfo('/updateNickName','nickName',userInfo.nickName)"
            />
          </div>
        </template>
      </van-cell>
      <van-cell title="简介" size="large">
        <template #right-icon>
          <div>
            <van-field
              class="v-textarea"
              type="textarea"
              rows="2"
              autosize
              maxlength="30"
              v-model="userInfo.desc"
              @change="changeUserinfo('/updateDesc','desc',userInfo.desc)"
            />
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { utils } from "../utils/utils";
export default {
  name: "PersonalData",
  data() {
    return {
      userInfo: {
        userImg: "",
        phone: "",
        userId: "",
        nickName: "",
        desc: ""
      }
    };
  },
  created() {
    this.getUserInfo();
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    }
  },
  methods: {
    //返回
    goBack() {
      this.$router.go(-1);
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
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          // 
          this.userInfo = result.data.result[0];
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //修改昵称，简介
    changeUserinfo(url, key, value) {
       if (!this.isLogin) {
        this.$toast("请先登录");
        return;
      }
      let tokenString = localStorage.getItem("_t");
      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });

      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          tokenString,
          [key]: value
        },
        transformRequest: utils.transformRequest
      })
        .then(result => {
          this.$toast.clear();
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //上传头像
    upload(file) {
       if (!this.isLogin) {
        this.$toast("请先登录");
        return;
      }
      
      //控制大小
      let imgSize = 300 * 1024;
      if (file.file.size > imgSize) {
        this.$toast("上传图片不能超过300KB");
        return;
      }

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
        url: "/updateAvatar",
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
          
          this.userInfo.userImg = result.data.userImg;
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
.personaldata {
  padding-top: 46px;
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
  .personal-box {
    margin: 10px;
    padding: 10px;
    // height: 500px;
    background-color: #fff;
  }
  .avatar {
    padding-top: 0;
    padding-bottom: 0;
    line-height: 48px;
    .person-img {
      width: 40px;
      margin-top: 3.5px;
      position: relative;
    }
    .v-uploader {
      position: absolute;
      width: 40px;
      height: 40px;
      left: 0;
      top: 0;
      overflow: hidden;
      z-index: 2;
      opacity: 0;
    }
  }
}
</style>