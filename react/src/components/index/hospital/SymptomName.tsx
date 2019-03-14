import React, { Component } from 'react';
import csn from 'classnames'
import gSass from '@utils/sass';
const style = gSass.index.hospital.symptomName;
interface Props {
  key: number,
  name: string,
}
/**
 * 症状名
 */
export default class SymptomName extends Component<Props> {
  render() {
    return <div className={csn(style.symptomName)}>
      {this.props.name}
    </div>
  }
}
