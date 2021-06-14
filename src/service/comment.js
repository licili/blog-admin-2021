import { post, get, del, put } from './index'
// 把对象转为查询字符串
import qs from 'qs';

const ENTITY = '/api/comments';


// 查看分类列表 {pageNum:'',pageSize:'', keyword:''}
function list ({current=1,pageSize=5,keyword=''}) { 
  return get(`${ENTITY}?pageNum=${current}&pageSize=${pageSize}&keyword=${keyword}`);
}


function create (data) { 
  return post(`${ENTITY}`,data)
}

// 提交评论
function update (item) { // {id:'评论ID',sub:{_id:xxx,content:'xxx'}}
  return put(`${ENTITY}/${item.id}`,item)
}

// 删除 
// 一级评论ID 二级评论ID
function remove ({ fid = '', sid = '' }) {
  console.log(fid,sid,'hhhh')
  return del(`${ENTITY}/${fid}`,{sid})
}

// 解决了 Assign object to a variable before exporting as module default 警告
//eslint-disable-next-line 
export default {
  list,
  create,
  remove,
  update
}