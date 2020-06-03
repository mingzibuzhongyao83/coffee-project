export const mutations = {

  //清空数据
  emptyData(state){
    state.finished = false;
    state.count = 10;
    state.start = 0;
    state.shopcartData = [];
    state.allShocartData = [];
    state.isManage = false;
    state.total = 0;
  },

  changeData(state, data) {
    state[data.key] = data.value;
  },

  loadShopcartData(state) {
    //每次获取10条数据
    state.shopcartData.push(...state.allShocartData.slice(state.start, state.count + state.start));

    state.start = state.count;
  },

  //删除shopcart数组元素
  removeShopcartData(state, data) {
  
    for (let i = state.shopcartData.length - 1; i >= 0; i--) {
      if (data.indexOf(state.shopcartData[i].sid) > -1) {
        state.shopcartData.splice(i, 1);
      }
    }

    
  }

}
