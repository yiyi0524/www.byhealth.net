<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2018/12/29
 * Time: 17:52.
 */

namespace app\common\model;

use bdk\app\common\model\Base as BdkModel;

/**
 * 医院部门主治的症状
 * Class HospitalDepartmentSymptom
 * @package app\common\model
 */
class HospitalDepartmentSymptom extends BdkModel
{
    protected $field = [
        'id', 'ctime', 'utime', 'dtime',
        'department_id', 'name',
    ];
}
