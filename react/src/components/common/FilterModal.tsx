import gSass from "@utils/sass";
import { Form, Modal, Radio } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { ModalProps } from "antd/lib/modal";
import React, { Component } from "react";
import { RouteProps } from "react-router";
const style = gSass.common.table;
const RadioGroup = Radio.Group;

interface Props { }
interface State { }

class FilterModal extends Component<Props & RouteProps & FormComponentProps & ModalProps, State> {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal {...this.props}>
        <Form className={style.filterList}>
          <div className={style.item}>
            <div className={style.title}> 管理员 </div>
            {getFieldDecorator("administrators", { initialValue: -1 })(
              <RadioGroup>
                <Radio value={-1}> 全部 </Radio>
                <Radio value={0}> 是 </Radio>
                <Radio value={1}> 否 </Radio>
              </RadioGroup>
            )}
          </div>
        </Form>
      </Modal>
    );
  }
}
export default Form.create()(FilterModal);
