<template>
  <div class="login">
    <div class="box">
      <div class="logo">
        <img class="auto-img" src="../assets/images/logo.png" alt />
      </div>

      <div class="text">
        <span>喝一杯苦咖啡，为了和生活相遇</span>
      </div>
      <div class="menu">
        <span @click="goMenu">进去逛逛 ></span>
      </div>
      <div class="login-box">
        <van-form @submit="login" color="#fff">
          <van-field
            v-model="userInfo.phone"
            class="input"
            name="手机号"
            label="手机号"
            placeholder="请输入您的手机号码"
            autocomplete="off"
          />
          <van-field
            v-model="userInfo.password"
            class="input"
            type="password"
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
            >立即登录</van-button>
          </div>
        </van-form>
        <div class="clearfix find-box">
          <div class="t fl">
            <span>
              没有账号?
              <span class="a" @click="goRegister">立即注册</span>
            </span>
          </div>
          <div class="find fr">
            <span @click="goEmail">找回密码</span>
          </div>
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
  name: "Login",
  computed: {
    userInfo() {
      return this.$store.state.loginModule.userInfo;
    },
     isLogin() {
        return this.$store.state.isLogin;
      },
  },

  methods: {
    //跳转首页
    goMenu() {
      this.$router.push({ name: "Menu" });
    },
    // 登录
    login() {
      if (valid.validForm(this.userInfo, this)) {
        // 
        //发起ajax请求

        //加载提示
        this.$toast.loading({
          //是否禁止背景点击
          forbidClick: true,

          //展示时长为0，不会消失
          duration: 0,

          message: "正在登录中..."
        });

        this.axios({
          method: "POST",
          url: "/login",
          //请求的参数
          data: {
            appkey: this.appkey,
            phone: this.userInfo.phone,
            password: this.userInfo.password
          },
          //序列化请求体参数
          transformRequest: utils.transformRequest
        })
          .then(result => {
            

            this.$store.commit('changeData',{key:'isLogin',value:true});

            

            //关闭提示
            this.$toast.clear();

            //登陆成功，将token保存在cookie中
            if (result.data.code == 200) {
              //将token分段存储
              // let tokenData = result.data.token.split(".");
              // 

              // //cookie过期时间
              // let expires = 30 * 24 * 60 * 60;

              // tokenData.forEach((v, i) => {
              //   //v:一个token分段
              //   this.$cookies.set("t" + i, v, expires);
              // });

              //存储token字符串
              localStorage.setItem("_t", result.data.token);

              //跳转首页
              this.$router.push({ name: "Menu" });
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            
            this.$toast.clear();
          });
      }
    },

    //跳转注册页面
    goRegister() {
      this.$router.push({ name: "Register" });
    },

    //跳转找回密码
    goEmail(){
      this.$router.push({name:'Email'});
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-image: url(../assets/images/timg1.jpg);
  background-position: center;

  /deep/.van-field__control {
    color: #ffffff !important;
  }
  .find-box {
    padding: 0 20px;
  }
  .menu {
    margin-top: 20px;
    text-align: center;
    color: #fff;
  }
  .t {
    color: #fff;
    margin-top: 20px;
    text-align: center;
    .a {
      color: #3d3df2;
    }
  }
  .find {
    color: #fff;
    margin-top: 20px;
  }
  .box {
    background-color: rgba(26, 19, 19, 0.4);
    height: 100%;
    z-index: 2;
    .login-box {
      padding: 50px 20px 40px;
      .input {
        background-color: rgba(26, 19, 19, 0) !important;
        color: #ffffff !important;
      }
    }
    .logo {
      width: 150px;
      height: 150px;
      padding: 50px 0;
      margin: 0 auto;
    }
    .btn {
      margin: 90px auto 0;
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
