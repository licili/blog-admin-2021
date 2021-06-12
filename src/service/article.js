import { post, get, del, put } from './index'


const ENTITY = '/api/articles';


function list ({current=1,pageSize=5,keyword=''}) { 
  return get(`${ENTITY}?pageNum=${current}&pageSize=${pageSize}&keyword=${keyword}`);
}

// 创建
function create (item) {  
  return post(`${ENTITY}`,item)
}

// 更新分类
function update (item) {
  return put(`${ENTITY}/${item.id}`,item)
}

// 删除 
// 可能传来ID字符串，也有可能传来一个ID字符串数组
function remove (ids) {
  if (typeof ids === 'string') {
    ids = [ids]
  }
  console.log(ids,'ids')
  return del(`${ENTITY}/${ids[0]}`,{ids})
}

function addPv (id) {
  return get(`${ENTITY}/pv/${id}`)
}

//eslint-disable-next-line 
export default {
  list,
  create,
  update,
  remove,
  addPv
}