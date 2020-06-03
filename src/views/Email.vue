<template>
  <div class="email">
    <van-nav-bar title="验证码" left-text="返回" left-arrow :fixed="true" @click-left="back" />

    <van-form @submit="next">
      <van-field
        v-model="userInfo.email"
        name="邮箱"
        label="邮箱"
        placeholder="请输入邮箱"
        autocomplete="off"
      />
      <van-field
        v-model="userInfo.validCode"
        center
        clearable
        label="邮箱验证码"
        placeholder="请输入邮箱验证码"
        autocomplete="off"
        maxlength="6"
      >
        <template #button>
          <van-button
            :disabled="userInfo.isSend"
            size="small"
            type="info"
            @click.prevent="sendVaildCode"
          >{{userInfo.text}}</van-button>
        </template>
      </van-field>
      <div class="btn-box">
        <van-button round block type="info" native-type="submit">下一步</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
//导入表单验证模块
import { valid } from "../utils/valid";

import { utils } from "../utils/utils";
export default {
  name: "Email",
  data() {
    return {
      userInfo: {
        email: "",
        validCode: "",
        isSend: false,
        text: "发送验证码"
      }
    };
  },

  created(){
    if (!this.isLogin) {
      this.$router.push({name: 'Login'});
    }
  },

  computed:{
     isLogin() {
      return this.$store.state.isLogin;
    },
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    //发送验证码
    sendVaildCode() {
      //判断邮箱格式是否正确
      if (valid.validForm({ email: this.userInfo.email }, this)) {
        let time = 60;

        this.userInfo.isSend = true;

        this.userInfo.text = `${time}s后重新发送`;

        let timer = setInterval(() => {
          if (time == 0) {
            clearInterval(timer);
            timer = null;
            this.userInfo.isSend = false;
            this.userInfo.text = "发送验证码";
          } else {
            time--;
            this.userInfo.text = `${time}s后重新发送`;
          }
        }, 1000);

        //发起请求
        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

        this.axios({
          method: "POST",
          url: "/emailValidCode",
          data: {
            appkey: this.appkey,
            email: this.userInfo.email
          },
          transformRequest: utils.transformRequest
        })
          .then(result => {
            this.$toast.clear();
            

            this.$toast(result.data.msg);
          })
          .catch(err => {
            
            this.$toast.clear();
          });
      }
    },

    //下一步
    next() {
      //验证验证码
      if (/^[0-9]{6}$/.test(this.userInfo.validCode)) {
        //发起请求
        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });
        this.axios({
          method: "POST",
          url: "/checkValidCode",
          data: {
            appkey: this.appkey,
            validCode: this.userInfo.validCode
          },
          transformRequest: utils.transformRequest
        })
          .then(result => {
            this.$toast.clear();
            if (result.data.code == "K001") {
              this.$router.push({ name: "FindPassword" });
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            
            this.$toast.clear();
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.email {
  padding-top: 96px;
  .van-nav-bar {
    background-color: #ab7c37;
    // margin-bottom: 10px;
  }
  .van-nav-bar .van-icon {
    color: #fff;
    background-color: #ab7c37;
  }
  .van-nav-bar__text {
    color: #fff;
    background-color: #ab7c37;
  }
  .van-nav-bar__title {
    color: #fff;
  }
  .van-button--info {
    background-color: #ab7c37;
    border-color: #ab7c37;
  }
  .btn-box {
    margin-top: 16px;
    padding: 0 10px;
  }
}
</style>