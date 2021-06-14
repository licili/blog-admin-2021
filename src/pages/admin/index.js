import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb,message} from 'antd';
import {ExportOutlined,SmileOutlined} from '@ant-design/icons'
import './index.less'
import service from '../../service/user'
import { withRouter, Route,Link} from 'react-router-dom'
import Welcome from '../welcome'
import Article from '../Article'
import Category from '../category'
import routerArr from '../../route'
import CreateArticle from '../Article/create'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu;
export default class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nickename: sessionStorage.getItem('nickname'),
      breadcrumb: [], // 面包屑
      routerArr: [], // 右侧菜单
      article:null, // 文章项
    }
  }
  componentDidMount () {
    this.setState({
      routerArr:routerArr
    }, () => {
      this.createBreadCrumb(this.props.location.pathname)
      this.watchBreadCrumb()
    })
    
  }

  // 退出登录
  logout = () => {
    // 1. 从服务器上调用退出接口
    // 2. 把sessionStorage清掉
    // 3. 返回登录页
    service.signout().then(res => {
      if (parseInt(res.code) === 0) {
        sessionStorage.removeItem('username');
        message.success(res.data);
        // console.log(this)
        // 只有Route渲染出来的组件才有history属性。
        // 如果不是在Route渲染出来的组件，就要使用WithRouter包裹，才会有这个属性
        this.props.history.push('/')
      } else {
        message.error('退出失败')
      }
    })
  }
  // 菜单点击事件
  handleClick = ({ item, key, keyPath, domEvent }) => {
    // console.log('key',key)
    this.props.history.push(key)
  }

  // 创建菜单
  createMenu = (routerArr) => {
    return <>
      {
        routerArr.map(item => (
          item.children ? <SubMenu key={item.key} title={item.name}>
            {
              item.children.map(subItem => {
                if (subItem.children) {
                  return this.createMenu(subItem.children)
                }
                return (
                  <Menu.Item key={subItem.key}>
                    <Link to={subItem.path}>{ subItem.name}</Link>
                  </Menu.Item>
                )
              })
            }
          </SubMenu> : <Menu.Item key={item.key} icon={<item.icon />}>
              <Link to={item.path}>{ item.name}</Link>
            </Menu.Item>
        ))
      }
    </>
  }
  
  // 创建面包屑
  createBreadCrumb (pathname) {
    let arr = [];
    this.state.routerArr.forEach(item => {
      if (item.path === pathname) {
        arr.push({
          path: item.path,
          name: item.name,
          key:item.key
        })
      }
      item.children && item.children.forEach(subItem => {
        if (subItem.path === pathname) {
          arr.push({
            path: subItem.path,
            name: subItem.name,
            key:subItem.key
          })
        }
      })
    })
    this.setState({ breadcrumb: arr })
  }

  // 监听面包屑导航
  watchBreadCrumb () {
    this.props.history.listen((location, state) => {
      this.createBreadCrumb(location.pathname)
    })
  }

  // 保存子组件传来的article
  handleSaveArticle = (article) => {
    this.setState({
      article
    })
  }
  // 清除article属性数据
  handleRemoveArticle = () => {
    console.log('运行了吗')
    this.setState({
      article:null
    })
  }

  render () {
    return (
      <Layout style={{ minHeight: '100vh' }} className="admin-page">
        <Sider>
          <div className="logo">
            博客管理系统
          </div>
          <Menu
            theme="dark"
            mode="inline"
            // onClick={this.handleClick}
            // 我们页面刷新了，怎么保持我们打开的页面还是刷新前那个
            defaultSelectedKeys={[window.location.hash.slice(1)]}
          >

            {
              this.createMenu(this.state.routerArr)
            }

            {/* <Menu.Item key="/admin" icon={<HomeOutlined />} title="首页">
              首页
            </Menu.Item>
            <Menu.Item key="/admin/category" icon={<BgColorsOutlined />} title="分类管理">
              分类管理
            </Menu.Item>
            <Menu.Item key="/admin/article" icon={ <FormOutlined />} title="文章管理">
              文章管理
            </Menu.Item> */}
            {/* 也可以这样子设置：加Link，然后就不用添加方法了 */}
            {/* <Menu.Item key="/admin"  icon={<BgColorsOutlined />}>
              <Link to="/admin" >首页</Link>
            </Menu.Item>
             <Menu.Item key="/admin/category" icon={<BgColorsOutlined />} title="分类管理">
              <Link to="/admin/category"> 分类管理</Link>
            </Menu.Item>
            <Menu.Item key="/admin/article" icon={ <FormOutlined />} title="文章管理">
              <Link to="/admin/article">文章管理</Link>
            </Menu.Item>
            <SubMenu key="sub1" title="user">
              <Menu.Item key="3">
                TOM
              </Menu.Item>
              <Menu.Item key="4">
                CAT
              </Menu.Item>
              <Menu.Item key="5">
                DOG
              </Menu.Item>
            </SubMenu> */}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background site-layout-header">
            <span style={{ marginRight: '10px' }}><SmileOutlined /> 欢迎{ this.state.nickename}</span>
            <a href="javascrip:;" onClick={this.logout}><ExportOutlined /> 退出</a>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {/* <Breadcrumb.Item><Link to="/admin">首页</Link></Breadcrumb.Item> */}
              {
                this.state.breadcrumb.map(item => (
                  <Breadcrumb.Item key={item.path}>
                    <Link to={item.path}>{ item.name}</Link>
                  </Breadcrumb.Item>
                ))
              }

              {/* <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
            </Breadcrumb>
            <div className="site-layout-background site-layout-main" >
              <Route exact path="/admin" render={(props) => <Welcome  {...props}/>}/>
              <Route path="/admin/category" component={Category } />
              <Route exact path="/admin/article" render={props => <Article {...props} saveArticle={ this.handleSaveArticle}/>} />
              {/* <Route exact path="/admin/article" component={ Article} /> */}
              {/* <Route path="/admin/article/create" component={ CreateArticle} /> */}
              <Route path="/admin/article/create" render={props => <CreateArticle {...props} article={this.state.article} removeArticle={ this.handleRemoveArticle}/>}  />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>CopyRight ©2022 Created by lici. All Rights Reserved. </Footer>
        </Layout>
      </Layout>
    )
  }
}
