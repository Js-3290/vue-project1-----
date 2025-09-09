import request from '@/utils/request.js'

//统计活动类型数量
export const getActTypeCount = () => {
  return request.get('/report/actTypeData')
}

//统计用户性别
export const getUserSexCount = () => {
  return request.get('report/userGenderData')
}
