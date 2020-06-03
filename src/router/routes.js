export const routes = [
  //main路由组件
  {
    path: '/main',
    name: 'Main',
    component: r => require(['../views/Main.vue'], r),
    // 二级路由
    children: [{
        path: 'menu',
        name: 'Menu',
        component: r => require(['../views/main_view/Menu.vue'], r)
      },
      {
        path: 'order',
        name: 'Order',
        component: r => require(['../views/main_view/Order.vue'], r)
      },
      {
        path: 'my',
        name: 'My',
        component: r => require(['../views/main_view/My.vue'], r)
      },
      {
        path: 'shopcart',
        name: 'Shopcart',
        component: r => require(['../views/main_view/Shopcart.vue'], r)
      }
    ]
  },
  //注册路由组件
  {
    path: '/register',
    name: 'Register',
    component: r => require(['../views/Register.vue'], r)
  },
  //登录路由组件
  {
    path: '/login',
    name: 'Login',
    component: r => require(['../views/Login.vue'], r)
  },
  //商品详情路由
  {
    path: '/detail/:pid',
    name: 'Detail',
    component: r => require(['../views/Detail.vue'], r)
  },
  //我的收藏页面
  {
    path: '/myfavorite',
    name: 'MyFavorite',
    component: r => require(['../views/MyFavorite.vue'], r)
  },
  //地址管理页面
  {
    path: '/address',
    name: 'Address',
    component: r => require(['../views/Address.vue'], r)
  },
  //新增地址页面
  {
    path: '/newaddress',
    name: 'NewAddress',
    component: r => require(['../views/NewAddress.vue'], r)
  },
  //个人资料页面
  {
    path: '/porsonaldata',
    name: 'PersonalData',
    component: r => require(['../views/PersonalData.vue'], r)
  },
  //提交订单页面
  {
    path: '/submitorder',
    name: 'SubmitOrder',
    component: r => require(['../views/SubmitOrder.vue'], r)
  },
  //安全中心
  {
    path: '/security',
    name: 'Security',
    component: r => require(['../views/Security.vue'], r)
  },
  //邮箱页面
  {
    path:'/email',
    name:'Email',
    component: r => require(['../views/Email.vue'], r)
  },
  //找回密码
  {
    path:'/findpassword',
    name:'FindPassword',
    component: r => require(['../views/FindPassword.vue'], r)
  },
  {
    path: '*',
    redirect: {
      name: 'Menu'
    }
  }
]
