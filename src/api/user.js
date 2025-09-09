import request from '@/utils/request.js'

// 查询全部用户
export const queryPageApi = (name,gender,page,pageSize) => {
  return request.get(`/users?name=${name}&gender=${gender}&page=${page}&pageSize=${pageSize}`)
}

//新增
export const addApi = (user) => {
  return request.post('/users',user)
}

//根据id查询
export const queryInfoApi = (id) => {
  return request.get(`/users/${id}`)
}

//修改
export const updateApi = (user) => {
  return request.put(`/users`,user)
}

//删除
export const deleteApi = (ids) => {
  return request.delete(`/users?ids=${ids}`)
}