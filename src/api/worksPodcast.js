import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/worksPodcast',
    method: 'post',
    data
  })
}

export function uploadBanner(data) {
  return request({
    url: 'api/uploadBanner',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/worksPodcast/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/worksPodcast',
    method: 'put',
    data
  })
}

export default { add, edit, del, uploadBanner }
