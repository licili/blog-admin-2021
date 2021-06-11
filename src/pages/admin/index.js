import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb,message} from 'antd';
import {ExportOutlined,SmileOutlined,BgColorsOutlined,FormOutlined,HomeOutlined} from '@ant-design/icons'
import './index.less'
import service from '../../service/user'
import { withRouter, Route,Link} from 'react-router-dom'
import Welcome from '../welcome'
import Article from '../Article'
import Category from '../category'
const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu;
export default class Admin extends Component {
  constructor() {
    super()
    this.state = {
      username: sessionStorage.getItem('username'),
      breadcrumb:[]
    }
  }
  logout = () => {

    // 1. 从服务器上调用退出接口
    // 2. 把sessionStorage清掉
    // 3. 返回登录页
    service.signout().then(res => {
      if (parseInt(res.code) === 0) {
        sessionStorage.removeItem('username');
        message.success(res.data).then(() => {
          console.log(this)
          // 只有Route渲染出来的组件才有history属性。
          // 如果不是在Route渲染出来的组件，就要使用WithRouter包裹，才会有这个属性
          this.props.history.push('/')
        })
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
  handleSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    console.log(domEvent.target.textContent)
    this.setState({
      breadcrumb:[domEvent.target.textContent]
    })
  }
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }} className="admin-page">
        <Sider>
          <div className="logo">
            博客管理系统
          </div>
          <Menu
            theme="dark"
            mode="inline"
            onClick={this.handleClick}
            onSelect={this.handleSelect}
            defaultSelectedKeys={[window.location.hash.slice(1)]}
          >
            <Menu.Item key="/admin" icon={<HomeOutlined />} title="首页">
              首页
            </Menu.Item>
            {/* 也可以这样子设置：加Link，然后就不用添加方法了 */}
            {/*<Menu.Item key="/admin" icon={<BgColorsOutlined />}>
              <Link to="/">首页</Link>
            </Menu.Item> */}
            <Menu.Item key="/admin/category" icon={<BgColorsOutlined />} title="分类管理">
              分类管理
            </Menu.Item>
            <Menu.Item key="/admin/article" icon={ <FormOutlined />} title="文章管理">
              文章管理
            </Menu.Item>
            {/* 子菜单 */}
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
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background site-layout-header">
            <span style={{ marginRight: '10px' }}><SmileOutlined /> 欢迎{ this.state.username}</span>
            <a onClick={this.logout}><ExportOutlined /> 退出</a>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {
                this.state.breadcrumb.map(item => <Breadcrumb.Item>{ item }</Breadcrumb.Item>)
              }
              {/* <Breadcrumb.Item>User</Breadcrumb.Item> */}
              {/* <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Route exact path="/admin" component={Welcome } />
              <Route path="/admin/category" component={Category } />
              <Route path="/admin/article" component={ Article} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>CopyRight ©2022 Created by lici. All Rights Reserved. </Footer>
        </Layout>
      </Layout>
    )
  }
}
