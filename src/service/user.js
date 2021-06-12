import {post,get} from './index'
const ENTITY = '/api/users';

// 注册
function signup (data) { //data={username,password,email}
  return post(`${ENTITY}/signup`,data);
}

// 登录
function signin (data) { //data={username,password}
  return post(`${ENTITY}/signin`,data);
}

function signout (data) { 
  return get(`${ENTITY}/signout`,data);
}


//eslint-disable-next-line 
export default {
  signup,
  signin,
  signout
}