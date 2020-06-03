export const mutations = {
  //修改数据
  changeData(state, data) {
    state[data.key] = data.value;
  },

  //置空
  emptyData(state) {
    state.detailData = {};
    state.rules = [];
    state.count=1;
    state.desc=[];
    state.isLike=false;
    state.shopcartCount=0;
  },

  //修改商品数据
  changeDetaildata(state, data) {

    // 
    //整理商品规格
    let titles = {
      tem: data.tem_desc,
      milk: data.milk_desc,
      sugar: data.sugar_desc,
      cream: data.cream_desc
    };

    for (let key in titles) {

      if (data[key] == '') {
        //当前商品的规格不存在，则跳过本轮循环
        continue;
      }

      let o = {
        title: titles[key],
        rule: []
      };

      let ruleData = data[key].split('/');
    //   
      for (let i = 0; i < ruleData.length; i++) {
        let o1 = {
          text: ruleData[i],
          isActive: i == 0
        };

        o.rule.push(o1);
      }

      state.rules.push(o);
    //   
    }

    //商品描述
    state.desc = data.desc.split(/\n/);

    state.detailData = data;
  }
}
