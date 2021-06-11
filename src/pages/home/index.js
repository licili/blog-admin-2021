import React, { Component } from 'react'
import { Form, Input, Button,message} from 'antd'
import { UserOutlined, LockOutlined, MailOutlined} from '@ant-design/icons';
import service from '../../service/user'
import './index.less'
export default class Home extends Component {
  handleSubmit = (isSignUp,user) => {
    // isSignUp 是否为注册
    service[isSignUp?'signup':'signin'](user).then(res => {
      if (res.code == 0) {
        if (!isSignUp) {
          // 登录功能
          message.success('登录成功')
            sessionStorage.setItem('username', res.data.user.username)
            this.props.history.push('/admin')
        } else {
          console.log(res)
          message.success('注册成功~跳转到登录页')
          // 调到登录页出现问题。组件会复用，信息还在上面，而且没有跳转
          console.log(this.userFormRef)
          this.userFormRef.current.setState({
            isSignUp:false
          })
        }
      } else {
        message.error(res.error)
      }
    }).catch(err => {
      console.log(err);
    })
  }
  userFormRef = React.createRef()
  render() {
    return (
      <div className="home-page">
        <div className="form-wrapper">
          <h1>欢迎光临博客</h1>
          {/* 因为表单内容比较多，我们会把它变为一个独立组件 */}
          <UserForm ref={ this.userFormRef } onSubmit={ this.handleSubmit}/>
        </div>
      </div>
    )
  }
}

class UserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignUp:false //默认为登录表单  true为注册表单 
    }
  }

  handleClick = (e) => {
    e.preventDefault()
    this.setState({ isSignUp: !this.state.isSignUp })
    // 重置表单样式
    this.formRef.current.resetFields()
  }
  formRef = React.createRef()
  render () {


    // 验证账号
    const checkUser = (_, value) => {
      if (!value) {
        return Promise.reject(new Error('账号不能为空'))
      } else if (!/^1\d{10}$/.test(value)) {
        return Promise.reject(new Error('账号格式不正确'))
      }
      return Promise.resolve()
    }
    // 验证密码
    const checkPass = (_, value) => {
      let reg = /^\w{6,16}$/
      if (!value) {
        return Promise.reject(new Error('密码不能为空'))
      } else if (!reg.test(value)) {
        return Promise.reject(new Error('密码为长度6-16位'))
      } 
      return Promise.resolve()
    }
    // 验证邮箱
    const checkEail = (_, value) => {
      let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if (!value) {
        return Promise.reject(new Error('邮箱不能为空'))
      }else if(!reg.test(value)) {
        return Promise.reject(new Error('邮箱格式不正确'))
      } 
      return Promise.resolve()
    }

    return (
      <Form
        name="login"
        ref={this.formRef}
        className="login-form" 
        onFinish={(value) => {
          if (this.state.isSignUp) {
            this.formRef.current.resetFields();
          }
          this.props.onSubmit(this.state.isSignUp,value)
        }}
      >
        <Form.Item
          name="username"
          hasFeedback
          rules={[{required:true,validator:checkUser}]}
        >
          <Input prefix={ <UserOutlined className="site-form-item-icon" />}  placeholder="账号"  />
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback
          rules={[{required:true,validator:checkPass}]}
        >
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
        </Form.Item>
        {
          this.state.isSignUp && <Form.Item
            name="email"
            hasFeedback
            rules={[{ required: true, validator: checkEail }]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="邮箱" />
            </Form.Item>
        }
        <Form.Item>
          <Button className="login-form-button" type="primary" htmlType="submit">
            {this.state.isSignUp ? '注册':'登录'}
          </Button>
          <a href="" onClick={this.handleClick}>{this.state.isSignUp ? ' 已有账号？直接登录' : ' 没有账号？请注册'}</a>
        </Form.Item>
      </Form>
    )
    
  }
}
