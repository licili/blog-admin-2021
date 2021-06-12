import React, { Component } from 'react'
import {Row,Col,Table,Button,Modal,message,Popconfirm,Input,Space,Form} from 'antd'
import categoryService from '../../service/category'
import {DeleteOutlined,FileAddOutlined} from '@ant-design/icons'
import './index.less'

export default class Category extends Component {
  state = {
    items: [], // 数据源
    item: {}, // 记录当前字段的内容。然后可以通过props传递
    isModalVisible: false, // 模态框状态
    title: '', // 模态框标题
    keyword: '', // 搜索关键词
    isCreate: true, // 模态框是否为创建状态
    pagination: {}, // 控制分页
    selectedRowKeys:[], // 选中行的ID数组
    
  }
  // 搜索
  handleSearch = (keyword) => {

    this.setState({
      keyword,
      pagination: {
        // 显示为 1 从第一页开始显示
        current:1
      }
    }, () => {
      this.getList()
    })
  }
  // 组件挂在后
  componentDidMount () {
    this.getList();
  }
  // 因为删除，更新，创建都要获取数据，刷新页面，所以封装为一个方法
  // 获取数据
  getList = () => {
    categoryService.list({ current: this.state.pagination.current, keyword: this.state.keyword }).then(res => {
      if (parseInt(res.code) === 0) {
        const {items,pageNum:current,pageSize,total } = res.data;
        // item => (item.key=item._id,item) 他的意思为他们当作一个整体，然后返回最后一个,由于有警告，忍受不了，就改了
        this.setState({
          items: items.map(item => {
            item.key = item._id
            return item
          }),
          pagination: {
            current, // 当前页码
            pageSize,// 每页条数
            total, //总条数
            showTotal: total => `总计${total}条`,
            showQuickJumper:true,
            onChange:this.pageChange,
          }
        })
      } else {
        message.error('获取数据失败')
      }
    })
  }
  // 点击分页器页码
  pageChange = (current) => {
    this.setState({
      pagination:{...this.state.pagination,current}
    },this.getList)
  }

  // 创建
  handleCreate = () => {
    this.setState({
      isModalVisible: true,
      isCreate: true,
      title:'创建'
    })
  }

  // 编辑
  handleEdit = (text, record, index) => {
    this.setState({
      isModalVisible: true,
      isCreate: false,
      title: '编辑',
      item:record
    })
  }
  // 删除
  remove = (ids) => {
    categoryService.remove(ids).then(res => {
      if (parseInt(res.code) === 0) {
        message.success(res.data);
        // 删除完，从第一页获取数据
        this.setState({ pagination: { current: 1 } }, () => {
          // 重新获取数据
          this.getList();
        })
      } else {
        message.error(res.error)
      }
    }).catch(err => {
      message.error('remove 删除有点问题')
    })
  }

  // 关闭模态框
  editCancel = () => {
    this.setState({isModalVisible:false})
  }
  editOK = () => {
    // 这也太牛逼了吧？？ 
    let formRef = this.editModal.current.formRef
    let category = formRef.current.getFieldsValue(); // 通过隐藏域，把ID的值传递过去
    categoryService[this.state.isCreate ? 'create':'update'](category).then(res => {
      if (parseInt(res.code) === 0) {
        formRef.current.resetFields();
        message.success(res.data);
        this.setState({isModalVisible:false})
        this.getList();
      } else {
        message.error(res.error)
      }
    }).catch(err => {
      message.error(err)
    })
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  editModal = React.createRef();
  render () {
    const selectedRowKeys = this.state.selectedRowKeys
    // React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name', 
        key: 'name',
        width:"70%"
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (text,record,index) => (<Space>
          <Button type="primary" onClick={()=>this.handleEdit(text,record,index)}>修改</Button>
          <Popconfirm
            title="确定删除吗？"
            okText="确定"
            cancelText="取消"
            onCancel={ ()=>{}}
            onConfirm={ ()=>this.remove(record._id)}
          >
            <Button type="danger">删除</Button>
          </Popconfirm>
        </Space>)
      }
    ]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        {
          key: 'odd',
          text: '基数项',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
        {
          key: 'even',
          text: '偶数项',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
      ]
      
    }
    return (
      <div className="category-page"> 
        <Row>
          <Col span="8">
            <Button.Group>
              <Button type="default" icon={<FileAddOutlined/>} onClick={this.handleCreate}>创建</Button>
              <Popconfirm
                okText="确定"
                cancelText="取消"
                title="确定删除吗？"
                onConfirm={() => this.remove(this.state.selectedRowKeys)}
              >
                <Button type="danger" icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
            </Button.Group>
          </Col>
          <Col span="8">
            <Input.Search
              enterButton
              placeholder="请输入搜索的内容"
              onSearch={this.handleSearch}
              style={{width:'400px'}}
              allowClear ></Input.Search>
          </Col>
        </Row>
        <Table
          style={{marginTop:'20px'}}
          bordered
          dataSource={this.state.items}
          columns={columns}
          rowSelection={rowSelection}
          pagination={this.state.pagination}>
        </Table>
        {/* Modal 会缓存数据做优化，使用destroyOnClose清楚这些缓存 */}
        <Modal
          title={this.state.title}
          visible={this.state.isModalVisible}
          destroyOnClose
          onCancel={this.editCancel}
          onOk={this.editOK}>
          <EditModal ref={this.editModal} item={this.state.item} isCreate={ this.state.isCreate}/>
        </Modal>
      </div>
    )
  }
}

// 模态框里面有表单，我们自己写。用来复用（添加修改公用一个组件）
class EditModal extends Component {
  formRef = React.createRef();
  render () {
    // this.formRef.current.getFieldsValue
    let { isCreate,item } = this.props;
    return (
      <Form ref={ this.formRef}>
        <Form.Item
          label="文章分类名称"
          name="name"
          initialValue={isCreate ? '' : item.name}
          rules={[{ required: true, message: "分类不能为空" }]}>
          <Input placeholder="文章分类名称" />
        </Form.Item>
        {/* 这个巧妙使用隐藏域来传递ID */}
        {!isCreate &&
          <Form.Item name="id"
            initialValue={item._id}>
            <Input type="hidden"/>
          </Form.Item>}
      </Form>
    )
  }
}
