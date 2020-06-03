import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import 'lib-flexible'
import axios from 'axios'
import VueAxios from 'vue-axios'

import VueCookies from 'vue-cookies'


//导入vant的组件
import {
  Form,
  Field,
  Button,
  Toast,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Lazyload,
  Tab,
  Tabs,
  Loading,
  Cell,
  Icon,
  NavBar,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  CellGroup,
  SwipeCell,
  Image,
  Checkbox,
  SubmitBar,
  List,
  AddressList,
  AddressEdit,
  Popup,
  ActionSheet,
  Uploader,
  Dialog
} from 'vant'

Vue
  .use(Form)
  .use(Field)
  .use(Button)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Tabs)
  .use(Tab)
  .use(Loading)
  .use(Cell)
  .use(Icon)
  .use(NavBar)
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(CellGroup)
  .use(SwipeCell)
  .use(Image)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressList)
  .use(AddressEdit)
  .use(Popup)
  .use(ActionSheet)
  .use(Uploader)
  .use(Dialog)

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueCookies)

//设置基础请求路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

//为vue原型添加一个属性
Vue.prototype.appkey = 'U2FsdGVkX19PTJMdpxSGeUMhcMP8beO+u5EKOh+5Gro='
// 老师U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=
// 自己U2FsdGVkX19PTJMdpxSGeUMhcMP8beO+u5EKOh+5Gro=
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
