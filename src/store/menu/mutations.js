export const mutations = {
  //修改数据
  changeData(state, data) {
    // 
    state[data.key] = data.value;
  },

  // //修改商品类型
  // changeTypeData(state, data) {
  //   state.typeData = data;
  // },

  // //修改商品类型的商品数据
  // changeProductData(state, data) {
  //   state.products = data
  // },

  // //最新商品的数据
  // changeHot(state, data) {
  //   state.products = data
  // }

  loadShopcartData(state) {
    //每次获取10条数据
    state.proData.push(...state.products.slice(state.start, state.count + state.start));

    

    state.start = state.count;
  },
}
