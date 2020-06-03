export const state = {
    orderData:[],
    navData:[
        {title:'全部',name:'0'},
        {title:'待收货',name:'1'},
        {title:'已收货',name:'2'},
    ],

     //每次加载10条数据
  count: 10,

  // 开始截取下标
  start: 0,
  finished: false,
  orderproData:[]
}