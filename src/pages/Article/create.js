import React, { Component } from 'react'
// import Editor from 'for-editor'
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { Row, Col, Button, Space, message, Select, Input, Form } from 'antd';
import PropTypes from 'prop-types'
import articleService from '../../service/article'
import categoryService from '../../service/category';
import './create.less'

const { Option} = Select;
export default class CreateArticle extends Component {

  constructor(props) {
    super(props);
    this.state = {
       // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null),
      item: this.props.article, // 记录字段值
      title: '', // 文章的标题
      categoryItems: [], // 分类列表
      category: [], // 文章的类型
      htmlContent: '', // 文章的html内容
      isCreate:true, // true为添加文章，false为更新操作
    }
    this.$form = React.createRef();
  }

  // 在组件卸载及销毁之前直接调用
  componentWillUnmount () {
    // 全部清空
     this.props.removeArticle()
  }

  componentDidMount () {

    categoryService.list({current:1,pageSize:10}).then(res => {
      if (parseInt(res.code) === 0) {
        this.setState({
          categoryItems:res.data.items
        })
      }
    })



    if (this.state.item) {
      let { content, category, title, _id } = this.state.item;
      category = category.map(item => item._id)
      this.setState({
        editorState: BraftEditor.createEditorState(content),
        title,
        isCreate:false
      }, () => {
        this.$form.current.setFieldsValue({
          title: this.state.title,
          category,
          id:_id
        })
      })
    }
  }

  // 富文本编辑器改变的时候
  handleChange = (editorState) => {
    this.setState({ editorState })
  }


  // 提交文章 （创建/更新）
  handleClick = () => {
    // 获取title
    const htmlContent = this.state.editorState.toHTML()
    let fields = this.$form.current.getFieldsValue()
    this.setState({
      htmlContent
    }, () => {
      articleService[this.state.isCreate ? 'create':'update']({...fields,content:htmlContent}).then(res => {
        if (parseInt(res.code) === 0) {
          message.success(res.data)
          this.setState({
            value: ''
          }, () => {
            this.props.history.push('/admin/article')
          })
        } else {
          message.error(res.error)
        }
      }).catch(err => {
        message.error(err)
      })
    })
  }

  // 取消
  hancleCancle = () => {
    this.props.history.goBack();
  }
  
  // 编辑器ctrl + s 自动保存内容
  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML()
    // const result = await saveEditorContent(htmlContent)
    this.setState({
      htmlContent
    })
  }

  // category下拉框 选择
  handleSelect = (val) => {
    let category = this.state.category;
    category.push(val)
    this.setState({
      category
    })
  }

  // 下拉框 取消选择
  handleDeselect = (val) => {
    let category = this.state.category;
    category = category.filter(item => item != val);
    this.setState({
      category
    })
  }
  // 标题 & 分类
  handleFieldsChange = (changedFields, allFields) => {
    // 直接在表单操作全部表单
    let obj = {};
    allFields.forEach(item => {
      obj[item.name] = item.value
    });
    this.setState({...obj})
  }
  render () {
    const markdownOption = {
      bold: true, // 粗体
    }
    return (
      <Row className="article-edit-page">
        <Space className="edit-button-wrapper">
          <Button type="text" danger onClick={this.hancleCancle}>取消</Button>
          <Button type="text" onClick={this.handleClick}>{ this.state.isCreate ? '发布':'更新'}</Button>
          {/* <Select
            onSelect={this.handleSelect}
            onDeselect={this.handleDeselect}
            bordered={false}
            maxTagCount="3"
            size="small"
            mode="multiple"
            placeholder="请选择文章类型"
            style={{ width: 250 }}>
            {
              this.state.categoryItems.map(item => (
                 <Option key={item._id} value={item._id}>{item.name}</Option>
              ))
            }
          </Select> */}
          
          <Form layout="inline"  onFieldsChange={this.handleFieldsChange} ref={this.$form}>
            <Form.Item label="文章标题" name="title" >
              <Input placeholder="请输入文章标题"  bordered={false} type="text"></Input>
            </Form.Item>
            <Form.Item label="文章类型" name="category">
              <Select
                // onSelect={this.handleSelect}
                // onDeselect={this.handleDeselect}
                bordered={false}
                maxTagCount="3"
                size="small"
                mode="multiple"
                placeholder="请选择文章类型"
                style={{ width: 250 }}>
                {
                  this.state.categoryItems.map(item => (
                    <Option key={item._id} value={item._id}>{item.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            {
              !this.state.isCreate ? <Form.Item label="" name="id" >
                <Input type="hidden" /></Form.Item> : null
            }
          </Form>
        </Space>

        <Col span={24}>
          <BraftEditor value={this.state.editorState } onChange={this.handleChange} onSave={() => { this.submitContent()}}></BraftEditor>
        </Col>
       </Row>
    )
  }
}
