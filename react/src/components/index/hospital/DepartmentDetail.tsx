import React, { Component } from 'react';
import SymptomName from './SymptomName';
interface Symptom {
  id: number,
  name: string,
}
export interface Props {
  name: string,
  symptomList: Symptom[],
}
/**
 * 医院科室详情
 */
export default class DepartmentDetail extends Component<Props> {
  render() {
    return <div>
      <div>{this.props.name}</div>
      <div>
        {this.props.symptomList.map((symptom, k) => {
          return (<SymptomName key={k} name={symptom.name} />)
        })}
      </div>
    </div>
  }
}
