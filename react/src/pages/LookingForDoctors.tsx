import React, { Component } from 'react';
import hospitalApi from '../services/hospital';
import DepartmentDetail, { Props as DepartmentDetailProps } from '../components/index/hospital/DepartmentDetail';
interface State {
  departmentList: DepartmentDetailProps[],
}

export default class Home extends Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = () => {
    return {
      departmentList: [],
    };
  }
  async componentDidMount() {
    //todo 
    const { data: { list } } = await hospitalApi.getAllSymptomList()
    let { departmentList } = this.state;
    for (let department of list) {
      departmentList.push({
        name: department.name,
        symptomList: department.symptomList,
      })
    }
    this.setState({
      departmentList,
    })
  }
  render() {
    return (
      <div>
        {this.state.departmentList.map((department, k) =>
          <DepartmentDetail key={k} name={department.name} symptomList={department.symptomList} />)}
      </div>
    )
  }
}
