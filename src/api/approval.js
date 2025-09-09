// api/approval.js
import request from '@/utils/request'

export function getPendingApprovals(page = 1, pageSize = 10) {
  return request({
    url: '/approvals/pending',
    method: 'get',
    params: { page, pageSize }
  })
}

export function getApprovalsByStatus(page = 1, pageSize = 10, approvalStatus = null) {
  return request({
    url: '/approvals',
    method: 'get',
    params: { page, pageSize, approvalStatus }
  })
}

export function approveActivity(id, approvalStatus, approvalComment = null) {
  return request({
    url: `/approvals/${id}/approve`,
    method: 'post',
    params: { approvalStatus, approvalComment }
  })
}

export function getApprovalByActivityId(activityId) {
  return request({
    url: `/approvals/activity/${activityId}`,
    method: 'get'
  })
}