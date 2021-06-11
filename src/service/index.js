import axios from 'axios';
const baseURL = "http://127.0.0.1:7001";
const config = {
  baseURL,
  timeout: 8000,
  withCredentials: true, // 跨域请求时候携带cookie
}


export  function get(url) {
  return axios({
    ...config,
    method: 'get',
    url,
  }).then(res => res.data) // res={header,data,config} 我们只拿data
}

export  function post(url, data) {
  return axios({
    ...config,
    method: 'post',
    url,
    data
  }).then(res => res.data)
}

export  function put(url, data) {
  return axios({
    ...config,
    method: 'put',
    url,
    data
  }).then(res => res.data)
}

export  function del(url,data) {
  return axios({
    ...config,
    method: 'delete',
    url,
    data
  }).then(res => res.data)
}

