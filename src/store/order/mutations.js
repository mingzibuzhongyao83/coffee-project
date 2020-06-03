export const mutations = {
  changeData(state, data) {
    state[data.key] = data.value;
  },

  //删除orderData数组元素
  removeOrderData(state, index) {
    state.orderData.splice(index, 1);
  },

  loadShopcartData(state) {
    //每次获取10条数据
    state.orderproData.push(...state.orderData.slice(state.start, state.count + state.start));

    

    state.start = state.count;
  },

}
