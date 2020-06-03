import Vue from 'vue'
import Vuex from 'vuex'

//导入
import {
  registerModule
} from './register/store'

import {
  mainModule
} from './main/store'

import {
  loginModule
} from './login/store'

import {
  menuModule
} from './menu/store'

import {
  detailModule
} from './detail/store'

import {
  shopcartModule
} from './shopcart/store'

import {
  myfavoriteModule
} from './myfavorite/store'

import {
  myModule
}from './my/stroe'

import {
  addressModule
}from './address/store'

import {
  newaddressModule
}from './newaddress/store'

import {
  submitorderModule
}from './submitorder/store'

import {
  orderModule
}from './order/store'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    //菜单页面是否已经加载过
    menuIsloaded: false,

    //记录是否登录
    isLogin: false
  },

  mutations: {
    changeData(state, data) {
      state[data.key] = data.value;
    }
  },

  modules: {
    registerModule,
    mainModule,
    loginModule,
    menuModule,
    detailModule,
    shopcartModule,
    myfavoriteModule,
    myModule,
    addressModule,
    newaddressModule,
    submitorderModule,
    orderModule
  }
})
