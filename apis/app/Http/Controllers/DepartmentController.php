<?php

namespace App\Http\Controllers;

use App\Department;
use App\Site;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $departments = Department::where('status','=',1)->paginate(10);
        foreach ($departments as $key => $value) {
            
            $site = Site::find($value->site_id);
            if(isset($site) && !empty($site)) {
                $value->site_name = $site->name;
            } else {
                $value->site_name = '';
            }

        }
        return response()->json($departments,200);
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

            $department = Department::find($data['id']);
            $department->name = $data['name'];
            $department->site_id = $data['site_id'];
            $department->status = 1;

            if($department->save()) {
                return response()->json('Department Updated Successfully', 200);
            } else {
                return response()->json('Department Update Failed', 400);
            }

        } else {

            $department = new Department;
            $department->name = $data['name'];
            $department->site_id = $data['site_id'];
            $department->status = 1;

            if($department->save()) {
                return response()->json('Department Added Successfully', 200);
            } else {
                return response()->json('Department Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function show(Department $department)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $department = Department::find($id);
        return response()->json($department, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Department $department)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $department = Department::find($id);
        if($department->delete()) {
            return response()->json('Department Deleted Successfully', 200);
        } else {
            return response()->json('Department Delete Failed', 400);
        }

    }
}
