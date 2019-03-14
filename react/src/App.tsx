import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import IndexHome from "@pages/index/Home";
import AdminIndex from "@pages/admin/Index";
import AdminLogin from "@pages/admin/user/Login";
import AdminAuthRoute from "@utils/AdminAuth";
import "@sass/common.scss";
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/admin/login" exact component={AdminLogin} />
          <AdminAuthRoute path="/admin" component={AdminIndex} />
          <Route path="/" component={IndexHome} />
        </Switch>
      </Router>
    );
  }
}
export default App;
