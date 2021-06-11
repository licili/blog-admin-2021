import {BgColorsOutlined,HomeOutlined,BookOutlined} from '@ant-design/icons'
// 菜单路由
const routerArr = [
  {
    key: "/admin",
    name: "首页",
    path: "/admin",
    icon:HomeOutlined
  },
  {
    key: "/admin/category",
    name: "分类管理",
    path: "/admin/category",
    icon:BgColorsOutlined
  },
  {
    key: "/admin/article",
    name: "文章管理",
    path: "/admin/article",
    icon:BookOutlined
  },
  {
    key: "sub1",
    name: "测试3",
    children: [
      {
        key:"sub-1",
        path: "/admin/3-1/3",
        name:"3-1"
      },
      {
        key:"sub-2",
        path: "/sub2",
        name:"3-2"
      }
    ]
  },
]

export default routerArr 