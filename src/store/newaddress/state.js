import addressList from '../../data/addressList'

export const state = {
  //是否显示邮政编码
  isPostal: true,
  //是否显示删除按钮
  isDelete: true,
  //是否默认地址
  isDefault: true,
  //地址选择数据
  addressList,

  //新增或者编译地址标识 1：新增，0：编译
  isAdd: 0,

  //地址唯一标识
  aid: '',

  title: '编辑地址',

  //临时地址数据，用于判断用户是否修改地址数据
  temporaryAddressData: {}
}
