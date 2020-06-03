export const mutations = {
  changeData(state, data) {
    state[data.key] = data.value
  },

  changeLikeData(state,index){
      state.proData.splice(index,1);
  },
  loadShopcartData(state) {
    //每次获取10条数据
    state.proData.push(...state.likeData.slice(state.start, state.count + state.start));

    state.start = state.count;
  },
}
