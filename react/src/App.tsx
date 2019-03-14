import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import IndexHome from "@pages/index/Home";
import Page404 from "@pages/common/Page404";
import AdminIndex from "@pages/admin/Index";
import AdminLogin from "@pages/admin/user/Login";
import AdminAuthRoute from "@utils/AdminAuth";
import "@sass/common.scss";
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={IndexHome} />
          <Route path="/admin/login" exact component={AdminLogin} />
          <AdminAuthRoute path="/admin" component={AdminIndex} />
          <Route component={Page404} />
        </Switch>
      </Router>
    );
  }
}
export default App;
