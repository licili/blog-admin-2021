import React, { Component } from 'react'
import { Table, Input, Popconfirm,Modal, Button, message, Form, Row, Col } from 'antd'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import ArticleService from '../../service/article'
export default class Article extends Component {
  state = {
    items: [],
    editVisible: false,
    isCreate: true,
    item: {}
  }
  componentDidMount () {
    // this.getList();
  }
  getList = () => {
    ArticleService.list().then(res => {
      if (parseInt(res.code) === 0) {
        const { items } = res.data;
        this.setState({items})
      }
    })
  }
  create = () => {
    this.props.history.push('/admin/article/create')
    this.setState({
      editVisible: true,
      isCreate:true
    })
  }
  render () {
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key:'title'
      },
      {
        title: '内容',
        dataIndex: 'content',
        key:'title'
      },
      {
        // 重点
        title: '分类',
        dataIndex: 'category',
        key: 'category',
        render: (text, record) => {
          // text  record 当前项的对象
          // text本来是一个字符串，但是我们会在后台处理（populate），它会变为分类对象
          return text.name
        }
      },
      {
        title: '阅读量',
        dataIndex: 'pv',
        key:'pv'
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        key:'createAt'
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
        render: (text, record) => {
          return text.toLocaleString()
        }
      },
      {
        title: '评论数',
        dataIndex: 'comments',
        key: 'comments',
        render: (text) => {
          return text.length
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: () => {
          return (
            <Button.Group>
              <Button type="dashed">查看</Button>
              <Button type="primary">编辑</Button>
              <Button type="primary">评论</Button>
              <Button type="danger">删除</Button>
            </Button.Group>
          )
        }
      }
    ]
    return (
      <Row>
        <Col span={12}>
          <Button.Group>
            <Button type="dashed" icon={<PlusCircleOutlined />} onClick={this.create}>添加文章</Button>
            <Button type="danger" icon={<DeleteOutlined />} >删除文章</Button>
          </Button.Group>
        </Col>
        <Col span={12}>
          <Input.Search
            enterButton
            allowClear
            placeholder="请输入搜索内容" />
        </Col>
        <Col span={24} style={{marginTop:20}}>
          <Table columns={columns} dataSource={this.state.items}></Table>
          <Modal
            title={this.state.title}
            onCancel={this.editCancel}
            onOk={this.editOK}
            destroyOnClose
          ></Modal>
        </Col>
      </Row>
    )
  }
}
