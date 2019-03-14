import React, { Component } from 'react';
import SymptomName from './SymptomName';
import csn from 'classnames'
import gSass from '@utils/sass';
const style = gSass.index.hospital.departmentDetail;
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
      <div className={csn(style.departmentName)}>
        <div className={csn(style.titleArrow)}></div>
        {this.props.name}</div>
      <div>
        {this.props.symptomList.map((symptom, k) => {
          return (<SymptomName key={k} name={symptom.name} />)
        })}
      </div>
    </div>
  }
}
