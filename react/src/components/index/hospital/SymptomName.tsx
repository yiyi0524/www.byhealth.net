import React, { Component } from 'react';

interface Props {
  key: number,
  name: string,
}
/**
 * 症状名
 */
export default class SymptomName extends Component<Props> {
  render() {
    return <div>
      {this.props.name}
    </div>
  }
}
