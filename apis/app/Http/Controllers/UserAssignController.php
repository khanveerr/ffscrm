<?php

namespace App\Http\Controllers;

use App\UserAssign;
use App\Site;
use App\Department;
use App\Employee;
use Illuminate\Http\Request;

class UserAssignController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        //
        $user_assigns = UserAssign::where('inventory_id','=',$id)->where('status','=',1)->paginate(10);

        foreach ($user_assigns as $key => $value) {
            
            $site = Site::find($value->site_id);
            if(!empty($site)) {
                $value->site_name = $site->name;
            } else {
                $value->site_name = '';
            }

            $department = Department::find($value->department_id);
            if(!empty($department)) {
                $value->department_name = $department->name;
            } else {
                $value->department_name = '';
            }

            $employee = Employee::find($value->employee_id);
            if(!empty($employee)) {
                $value->employee_name = $employee->name;
            } else {
                $value->employee_name = '';
            }

            $value->assigned_date_str = date('d M Y', strtotime($value->assigned_date));

        }

        return response()->json($user_assigns,200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $data = $request->all();


        if(array_key_exists('id', $data) && $data['id'] != null && !empty($data['id']) && $data['id'] != "") {

            $user_assign = UserAssign::find($data['id']);
            $user_assign->inventory_id = $data['inventory_id'];
            $user_assign->site_id = $data['site_id'];
            $user_assign->department_id = $data['department_id'];
            $user_assign->repair_cost = (int) $data['repair_cost'];
            $user_assign->employee_id = $data['employee_id'];
            $user_assign->assigned_date = $data['assigned_date'];
            $user_assign->status = 1;

            if($user_assign->save()) {
                return response()->json('User Assign Updated Successfully', 200);
            } else {
                return response()->json('User Assign Update Failed', 400);
            }

        } else {

            $user_assign = new UserAssign;
            $user_assign->inventory_id = $data['inventory_id'];
            $user_assign->site_id = $data['site_id'];
            $user_assign->department_id = $data['department_id'];
            $user_assign->repair_cost = (int) $data['repair_cost'];
            $user_assign->employee_id = $data['employee_id'];
            $user_assign->assigned_date = $data['assigned_date'];
            $user_assign->status = 1;

            if($user_assign->save()) {
                return response()->json('User Assign Added Successfully', 200);
            } else {
                return response()->json('User Assign Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\UserAssign  $user_assign
     * @return \Illuminate\Http\Response
     */
    public function show(UserAssign $brand)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\UserAssign  $user_assign
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $user_assign = UserAssign::find($id);
        return response()->json($user_assign, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\UserAssign  $user_assign
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Brand $brand)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\UserAssign  $user_assign
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $user_assign = UserAssign::find($id);
        if($user_assign->delete()) {
            return response()->json('User Assign Deleted Successfully', 200);
        } else {
            return response()->json('User Assign Delete Failed', 400);
        }

    }
}
