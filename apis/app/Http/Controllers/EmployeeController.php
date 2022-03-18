<?php

namespace App\Http\Controllers;

use App\Company;
use App\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $employees = Employee::where('status','=',1)->paginate(10);
        foreach ($employees as $key => $value) {
            
            $company = Company::find($value->company_id);
            if(isset($company) && !empty($company)) {
                $value->company_name = $company->name;
            } else {
                $value->company_name = '';
            }

        }
        return response()->json($employees,200);
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


        if($data['id'] != null && !empty($data['id']) && $data['id'] != "") {

            $employee = Employee::find($data['id']);
            $employee->name = $data['name'];
            $employee->company_id = $data['company_id'];
            $employee->status = 1;

            if($employee->save()) {
                return response()->json('Employee Updated Successfully', 200);
            } else {
                return response()->json('Employee Update Failed', 400);
            }

        } else {

            $employee = new Employee;
            $employee->name = $data['name'];
            $employee->company_id = $data['company_id'];
            $employee->status = 1;

            if($employee->save()) {
                return response()->json('Employee Added Successfully', 200);
            } else {
                return response()->json('Employee Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function show(Employee $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $employee = Employee::find($id);
        return response()->json($employee, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Employee $company)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $employee = Employee::find($id);
        if($employee->delete()) {
            return response()->json('Employee Deleted Successfully', 200);
        } else {
            return response()->json('Employee Delete Failed', 400);
        }

    }
}
