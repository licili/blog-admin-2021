import React, { Component } from 'react';
import { Router, Route,Switch,Redirect} from 'react-router-dom';
import Home from './pages/home'
import Admin from './pages/admin'
// import createHistory from 'history/createHashHistory'; //这个是默认装了的  奇葩错误
// Please use `require("history").createHashHistory` instead of `require("history/createHashHistory")
let createHistory = require('history').createHashHistory;
// 创建一个hashHistory
let history = createHistory();

// 每当路由变化时候，都会执行这个监听函数。（真正的处理是在后台）
history.listen(location => {
  if (location.pathname == '/admin' && !sessionStorage.getItem('username')) {
    history.push('/')
  }
})
// HashRouter 内置history属性
// Router 要自己传递history属性
export default class Routers extends Component {
  render () {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/"  component={ Home} />
          <Route path="/admin"  component={Admin} />
          <Redirect to="/" component={ Home} />
        </Switch>
      </Router>
   )
  }
}