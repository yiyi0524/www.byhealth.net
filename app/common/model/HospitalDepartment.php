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
 * 医院的部门
 * Class HospitalDepartment
 * @package app\common\model
 */
class HospitalDepartment extends BdkModel
{
    protected $field = [
        'id', 'ctime', 'utime', 'dtime',
        'name',
    ];

    public function symptoms()
    {
        return $this->hasMany(HospitalDepartmentSymptom::class, 'department_id');
    }
}
