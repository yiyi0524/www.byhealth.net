import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Page404 from "@pages/common/Page404";
import LookingForDoctors from '../LookingForDoctors';
export default class Home extends Component<any, {}> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = () => {
    return {

    };
  }
  render() {
    return (
      <Switch>
        <Route path="/" exact component={LookingForDoctors} />
        <Route path="/hospital/department" exact component={LookingForDoctors} />
        <Route component={Page404} />
      </Switch>)
  }
}
