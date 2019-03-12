import React, { Component } from 'react';

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
    return <div>
      this is index
    </div>
  }
}
