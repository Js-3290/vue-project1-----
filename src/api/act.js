import request from '@/utils/request.js'

// 分页查询活动
export const queryPageApi = (name,typeId,begin,end,page,pageSize) => {
  return request.get(`/acts?name=${name}&typeId=${typeId}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)
}

//查询全部活动类型
export const queryAllTypeApi = () => {
  return request.get('/actTypes')
}

//添加活动
export const addApi = (act) => {
  return request.post('/acts',act)
}

//根据id查询活动
export const queryInfoApi = (id) => {
  return request.get(`/acts/${id}`)
}

 //修改活动
 export const updateApi = (act) => {
  return request.put(`/acts`,act)
}

//删除活动
export const deleteApi = (ids) => {
  return request.delete(`/acts?ids=${ids}`)
}
//根据创建人查询活动
export const queryByCreatorIdApi = (id) => {
  return request.get(`/acts/creator?creatorId=${id}`)
}

//报名活动
export const registerApi = (act) => {
  return request.post(`/registrations`,act)
}

//根据用户id查询报名活动
export const queryRegisteredApi = (id) => {
  return request.get(`/registrations/${id}`)
}

// 根据活动id删除报名记录
export const deleteRegistrationApi = (id) => {
  return request.delete(`/registrations?activityId=${id}`)
}
