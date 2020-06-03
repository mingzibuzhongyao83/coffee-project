<template>
  <div class="register">
    <div class="box">
      <div class="logo">
        <img class="auto-img" src="../assets/images/logo.png" alt />
      </div>

      <div class="text">喝一杯苦咖啡，为了和生活相遇</div>
      <div class="register-box">
        <van-form @submit="register" color="#fff">
          <van-field
            v-model="userInfo.phone"
            color="'#fff'"
            class="input"
            name="手机号"
            label="手机号"
            placeholder="请输入您的手机号码"
            autocomplete="off"
          />
          <van-field
            v-model="userInfo.nickName"
            class="input"
            name="用户名"
            label="用户名"
            placeholder="请输入您的用户名"
            autocomplete="off"
          />
          <van-field
            v-model="userInfo.password"
            class="input"
            type="text"
            name="密码"
            label="密码"
            placeholder="请输入您的密码"
            autocomplete="off"
          />
          <div>
            <van-button
              class="btn"
              round
              block
              type="default"
              native-type="submit"
              :plain="true"
            >立即注册</van-button>
          </div>
        </van-form>

        <div class="t">
          <span>
            已有账号
            <span class="a" @click="goLogin">立即登录</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//导入表单验证模块
import { valid } from "../utils/valid";

//导入公共方法
import { utils } from "../utils/utils";

export default {
  name: "Register",
  computed: {
    userInfo() {
      return this.$store.state.registerModule.userInfo;
    }
  },

  methods: {
    // 注册
    register() {
      if (valid.validForm(this.userInfo, this)) {
        // 

        //发起ajax请求

        //加载提示
        this.$toast.loading({
          //是否禁止背景点击
          forbidClick: true,

          //展示时长为0，不会消失
          duration: 0,

          message: "正在注册..."
        });

        this.axios({
          method: "POST",
          url: "/register",
          //请求的参数
          data: {
            appkey: this.appkey,
            nickName: this.userInfo.nickName,
            phone: this.userInfo.phone,
            password: this.userInfo.password
          },
          //序列化请求体参数
          transformRequest: utils.transformRequest
        })
          .then(result => {
            

            //注册成功，关闭提示,跳转登录界面
            this.$toast.clear();

            if (result.data.code == 100) {
              //跳转登录组件
              this.$router.push({ name: "Login" });
            } else {
              this.$toast({
                message: result.data.msg
              });
            }
          })
          .catch(err => {
            //关闭提示
            this.$toast.clear();
            
          });
      }
    },

    //跳转登录页面
    goLogin() {
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style lang="less" scoped>
.register {
  height: 100%;
  background-image: url(../assets/images/timg1.jpg);
  background-position: center;
  /deep/.van-field__control {
    color: #ffffff !important;
  }
  .t {
    color: #fff;
    margin-top: 10px;
    text-align: center;
    .a {
      color: #3d3df2;
    }
  }
  .box {
    background-color: rgba(26, 19, 19, 0.4);
    height: 100%;
    z-index: 2;
    .register-box {
      margin: 55px 20px;
      .input {
        background-color: rgba(26, 19, 19, 0) !important;
        color: #ffffff !important;
      }
    }
    .logo {
      width: 150px;
      height: 150px;
      padding: 44px 0;
      margin: 0 auto;
    }
    .btn {
      margin: 100px auto 0;
      width: 300px;
      color: #fff;
      background-color: rgba(26, 19, 19, 0);
    }
    .text {
      text-align: center;
      color: #fff;
    }
  }
}
</style>
