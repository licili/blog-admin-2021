import React, { Component } from 'react'
import { Table, Input, Popconfirm,Modal, Button, message, Form, Row, Col, Tag,Comment,List,Badge,Space} from 'antd'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import ArticleService from '../../service/article'
import CommentService from '../../service/comment'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './index.less'
//  汉化时间 貌似咩用  ~代表node_modele目录0
moment.locale('zh-cn'); //locale 时区

const { TextArea } = Input;
export default class Article extends Component {
  state = {
    items: [],
    pagination: {}, // 控制分页
    selectedRowKeys: [],
    keyword: '',
    visible: false, // 模态框是否可见
    articleContent: '',// 文章内容
    commentListVisible: false, // 评论列表模态框
    commentItem: {}, // 一条评论
    commentItems: [], //评论列表
    commentVisible:false, //评论回复模态框
  }

  componentDidMount () {
    this.getList();
    this.getCommentList()
  }

  getList = () => {
    ArticleService.list({ current:this.state.pagination.current, keyword: this.state.keyword }).then(res => {
      if (parseInt(res.code) === 0) {
        const { items,pageNum:current,pageSize,total} = res.data;
        this.setState({
          items: items.map(item => {
            item.key = item._id;
            return item;
          }),
          pagination: {
            current,
            pageSize,
            total,
            showTotal: value => `总计${value}条`,
            showQuickJumper: true,
            onChange:this.pageChange,
          }
        })
      }
    })
  }

  // 获取评论列表
  getCommentList = () => {
    CommentService.list({}).then(res => {
      console.log(res, 'comment')
      if (parseInt(res.code) === 0) {
        this.setState({
          commentItems: res.data.items.map(item => {
            item.avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
            item.actions = [
              <span key="comment-list-reply-to-0" onClick={()=>{this.handleReply(item)}}>回复</span>,
              <span key="comment-list-reply-to-0">删除</span>,
              <span key="comment-list-reply-to-0">置顶</span>,
            ];
            return item;
          })
        })
      } else {
        message.error('获取评论失败')
      }
    })
  }



  // 搜索
  handleSearch = (value) => {
    this.setState({
      keyword: value,
      pagination: {
        current:1
      }
    }, () => {
      this.getList()
    })
  }


  // 页面跳转
  pageChange = (current) => {
    this.setState({
       pagination:{...this.state.pagination,current}
    },this.getList)
  }

  // 创建文章
  create = () => {
    this.props.history.push('/admin/article/create')
    this.setState({
      editVisible: true,
      isCreate:true
    })
  }


  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }

  // 确定删除
  handleConfirm = (id) => {
    ArticleService.remove(id).then(res => {
      if (parseInt(res.code) === 0) {
        console.log(res)
        message.success(res.data);
        this.setState({
          pagination:{current:1}
        }, () => {
          this.getList();    
        })
        
      } else {
        message.success(res.error)
      }
    }).catch(res => {
      message.error(res)
    })
  }

  // preview 预览
  handlePreview = (record) => {
    ArticleService.addPv(record._id).then(res => {
      if (parseInt(res.code) === 0) {
        this.setState({
          articleContent: record.content,
          visible:true
        },this.getList)
      } else {
        message.error(res.data)
      }
    })

  }
  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleCommentCancel = () => {
    this.setState({commentListVisible:false})
  }

  // edit 编辑
  handleEdit = (record) => {
    // 提交给父组件处理
    this.props.saveArticle(record)
    this.props.history.push('/admin/article/create')
  }
  handleDelComment = (item,fid='') => {
    if (item.sub) {
      // 一级评论 
      CommentService.remove({ fid: item._id, sid: '' }).then(res => {
        if (parseInt(res.code) === 0) {
          message.success(res.data)
          this.getCommentList();
        } else {
          message.success(res.error)
        }
      })
    } else {
      // 二级评论
      // FComment一级评论ID, SComment二级评论ID,
      CommentService.remove({fid:fid,sid:item._id}).then(res => {
        if (parseInt(res.code) === 0) {
          message.success(res.data)
          this.getCommentList();
        } else {
          message.success(res.error)
        }
      })
    }
  }

  // 创建评论内容
  createComment = (data,fid='') => (
    <Comment
      key={data._id}
      actions={[
        <span key="comment-list-reply-to-0" onClick={()=>{this.handleReply(data,fid)}}>回复</span>,
        <Popconfirm title="确定删除吗？" okText="确定" cancelText="取消" onConfirm={()=>this.handleDelComment(data,fid)}>
          <span key="comment-list-reply-to-0">删除</span>
        </Popconfirm>,
        <span key="comment-list-reply-to-0">置顶</span>,
      ]}
      author={data.user.nickname}
      avatar={data.user.avatar }
      content={data.content}
      datetime={moment(data.createAt).fromNow()}
    >
      {data.sub && data.sub.map((item) => {
        return this.createComment(item,data._id)
      })}
    </Comment>
  )

  // 提交 （一级/二级）评论
  handleSubmitComment = (values) => {

    let obj = {};

    obj['id'] = this.state.commentItem.sub ? this.state.commentItem._id : this.state.fid;
    values.content = '@' + this.state.commentItem.user.nickname + ' ' + values.content;
    obj['sub'] = values;
    console.log(obj,'handleSubmitComment')
    CommentService.update(obj).then(res => {
      if (parseInt(res.code) === 0) {
        message.success(res.data);
        this.setState({
          commentVisible:false
        },this.getCommentList)
      } else {
        message.error(res.error)
      }
    })
  }

    // handleReply
  handleReply = (item,fid='') => {
    this.setState({
      commentVisible: true,
      commentItem: item,
      fid
    })
  }

  render () {
    let that = this;
    const columns = [
      {
        title: '标题',
        width:'15%',
        dataIndex: 'title',
        key: 'title',
        ellipsis:true,
      },
      {
        title: '内容',
        width:'15%',
        ellipsis:true,
        dataIndex: 'content',
        key:'title'
      },
      {
        // 重点
        title: '分类',
        width:'15%',
        dataIndex: 'category',
        key: 'category',
        render: (text, record) => (
          // text  record 当前项的对象
          // text本来是一个字符串，但是我们会在后台处理（populate），它会变为分类对象
          text.map(item => {

            let color = ['success', 'processing', 'error', 'warning', 'default']
            let num = Math.ceil(Math.random()*color.length)
            return <Tag key={item._id} color={color[num]}>{ item.name}</Tag>
          })
        )
      },
      {
        title: '阅读量',
        width:'5%',
        dataIndex: 'pv',
        key:'pv'
      },
      {
        title: '创建时间',
        width:'10%',
        dataIndex: 'createAt',
        key: 'createAt',
        render: (text, record) => {
          // format('YYYY-MM-DD HH:MM')
          return moment(text).fromNow()
        }
      },
      {
        title: '评论数',
        width: '5%',

        dataIndex: 'comments',
        key: 'comments',
        render: (text) => {
          return text.length
        }
      },
      {
        title: '作者',
        width: '10%',
        dataIndex: 'user',
        render: (text) => {
          return text && text.nickname
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        // width:300,
        // fixed:'right',
        key: 'action',
        render: (text,record) => {
          return (
            <>
              <Button type="dashed" style={{ marginLeft: 5, marginTop: 2 }} onClick={() => this.handlePreview(record)}>查看</Button>
              <Button type="primary" style={{marginLeft:5,marginTop:2}} onClick={()=>this.handleEdit(record)}>编辑</Button>
              <Button type="primary" style={{marginLeft:5,marginTop:2}} onClick={()=>this.setState({commentListVisible  :true})}>评论</Button>
              <Popconfirm
                okText="确定"
                cancelText="取消"
                title="确定删除吗？"
                onConfirm={()=>{this.handleConfirm(record._id)}}
                onCancel={() => { }}
              >
                <Button type="danger"  style={{marginLeft:5,marginTop:2}}>删除</Button>
              </Popconfirm>
            </>
          )
        }
      }
    ]
    const rowSelection = {
      onChange: this.onSelectChange,
    }


    const loadMore = <div style={{
      textAlign: 'center',
      marginTop: 12,
      height: 32,
      lineHeight:'32px'
    }}>
      <Button>loading more</Button>
    </div>
    return (
      <Row className="article-page">
        <Col span={8}>
          <Button.Group>
            <Button type="dashed" icon={<PlusCircleOutlined />} onClick={this.create}>添加文章</Button>
            <Popconfirm
              okText="确定"
              cancelText="取消"
              title="确定删除吗？"
              width="800px"
              onConfirm={()=>{this.handleConfirm(this.state.selectedRowKeys)}}
              onCancel={() => { }}
            >
              <Button type="danger" icon={<DeleteOutlined />} >删除文章</Button>
            </Popconfirm>
          </Button.Group>
        </Col>
        <Col span={8}>
          <Input.Search
            enterButton
            allowClear
            onSearch={this.handleSearch}
            placeholder="请输入搜索内容" />
        </Col>
        <Col span={24} style={{marginTop:20}}>
          <Table
            columns={columns}
            bordered
            rowSelection={rowSelection}
            pagination={this.state.pagination}
            dataSource={this.state.items}>
          </Table>
          <Modal
            visible={this.state.visible}
            title="文章预览"
            closable
            footer={null}
            onCancel={this.handleCancel}
          >
            <div dangerouslySetInnerHTML={{__html:this.state.articleContent}}>
            </div>
          </Modal>
          <Modal
            visible={this.state.commentListVisible}
            title="评论列表"
            closable
            footer={null}
            onCancel={this.handleCommentCancel}
          >
            <List
              className="comment-list"
              itemLayout="horizontal"
              dataSource={this.state.commentItems}
              loadMore={loadMore}
              renderItem={item => (
                <li>
                  {
                    this.createComment(item)
                  }
                </li>
              )}
            >
            </List>
          </Modal>
          <Modal
            className="comment-modal"
            okText="评论"
            onCancel={()=>this.setState({commentVisible:false})}
            closable={false}
            footer={null}
            destroyOnClose
            visible={this.state.commentVisible}>
            <Form onFinish={this.handleSubmitComment}>  
              <Form.Item name="content">
                <TextArea rows={ 4} autoSize={ {minRows:4,maxRows: 4} }/>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button htmlType="submit" loading={false}  type="text">
                  评论
                  </Button>
                  <Button  loading={false} onClick={()=>{this.setState({commentVisible:false})}} type="text">
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
    )
  }
}
