import { post, get, del, put } from './index'
// 把对象转为查询字符串
import qs from 'qs';

const ENTITY = '/api/categories';


// 查看分类列表 {pageNum:'',pageSize:'', keyword:''}
function list ({current=1,pageSize=5,keyword=''}) { 
  return get(`${ENTITY}?pageNum=${current}&pageSize=${pageSize}&keyword=${keyword}`);
}

// 创建分类
function create (data) {  //{name:""}
  return post(`${ENTITY}`,data)
}

// 更新分类
function update (category) {
  return put(`${ENTITY}/${category.id}`,category)
}

// 删除 
// 可能传来ID字符串，也有可能传来一个ID字符串数组
function remove (ids) {
  if (typeof ids === 'string') {
    ids = [ids]
  }
  return del(`${ENTITY}/${ids[0]}`,{ids})
}

// 解决了 Assign object to a variable before exporting as module default 警告
//eslint-disable-next-line 
export default {
  list,
  create,
  update,
  remove
}