import gSass from '@utils/sass';
import { Button, Dropdown, Input, Menu, Modal, Table, Icon } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import Form, { FormComponentProps } from 'antd/lib/form';
import { SearchProps } from 'antd/lib/input';
import { ModalProps } from 'antd/lib/modal';
import { TableProps } from 'antd/lib/table';
import React, { Component } from 'react';
import { NavLink, RouteProps } from 'react-router-dom';
const style = gSass.common.table;
const Search = Input.Search;
/**
 * 操作 比如 新增 删除
 */
const OperationComponent = (props: TableOperation) => {
  if (props.to) {
    return <NavLink className={style.item} to={props.to}>
      <Button>{props.title}</Button>
    </NavLink>
  }
  if (props.dropdown) {
    return (<Dropdown className={style.item} overlay={<Menu>
      {props.dropdown.menuList.map((menuItem, k) => {
        return <Menu.Item key={k}>
          <div onClick={menuItem.onClick}>{menuItem.title}</div>
        </Menu.Item>
      })}
    </Menu>} placement="bottomLeft" >
      <Button>{props.title}{props.btnProps && props.btnProps.rightIconType ?
        <Icon type={props.btnProps.rightIconType} /> : null}</Button>
    </Dropdown>)
  }
  return <Button className={style.item} {...props.btnProps}>
    {props.title}
  </Button>
}
export interface TableOperation {
  title: string,
  btnProps?: {
    shape?: "round" | "circle" | "circle-outline";
    size?: "small" | "default" | "large";
    icon?: string;
    onClick?: () => any;
    rightIconType?: string,
  } & ButtonProps,
  to?: string,
  dropdown?: {
    menuList: {
      title: string,
      onClick?: () => void,
    }[],
  },
}
interface Props {
  componentsProps: {
    search: SearchProps,
    table: TableProps<any>,
    modal: ModalProps,
  },
  operationList: TableOperation[],
}
interface State { }
class MyTable extends Component<Props & FormComponentProps & RouteProps, State> {
  render() {
    return (
      <div className={style.main}>
        <div className={style.tableHeader}>
          <div className={style.operationList} >
            {this.props.operationList.map((operation, k) => {
              return <OperationComponent key={k} {...operation} />
            })}
          </div>
          <Search {...this.props.componentsProps.search} className={style.search} />
        </div>
        <Table className={style.table} {...this.props.componentsProps.table} />
        <Modal {...this.props.componentsProps.modal}>

        </Modal>
      </div>
    );
  }
}
export default Form.create()(MyTable)
