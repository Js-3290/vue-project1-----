import request from '@/utils/request.js'

// 获取活动类型列表
export const getAllApi = () => {
  return request.get('/actTypes')
}

// 添加活动类型
export const addApi = (type) => {
  return request.post(`/actTypes`, type)
}

//根据id查询活动类型
export const getByIdApi = (id) => {
  return request.get(`/actTypes/${id}`)
}

//修改活动类型
export const updateApi = (type) => {
  return request.put(`/actTypes`, type)
}

//删除活动类型
export const deleteApi = (id) => {
  return request.delete(`/actTypes?id=${id}`)
}
