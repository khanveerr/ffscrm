<?php

namespace App\Http\Controllers;

use App\Brand;
use App\ModelNo;
use Illuminate\Http\Request;

class ModelNoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $model_nos = ModelNo::where('status','=',1)->paginate(10);
        foreach ($model_nos as $key => $value) {
            
            $brand = Brand::find($value->brand_id);
            if(isset($brand) && !empty($brand)) {
                $value->brand_name = $brand->name;
            } else {
                $value->brand_name = '';
            }

        }
        return response()->json($model_nos,200);
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

            $model_no = ModelNo::find($data['id']);
            $model_no->name = $data['name'];
            $model_no->brand_id = $data['brand_id'];
            $model_no->status = 1;

            if($model_no->save()) {
                return response()->json('Model No. Updated Successfully', 200);
            } else {
                return response()->json('Model No. Update Failed', 400);
            }

        } else {

            $model_no = new ModelNo;
            $model_no->name = $data['name'];
            $model_no->brand_id = $data['brand_id'];
            $model_no->status = 1;

            if($model_no->save()) {
                return response()->json('Model No. Added Successfully', 200);
            } else {
                return response()->json('Model No. Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ModelNo  $model_no
     * @return \Illuminate\Http\Response
     */
    public function show(ModelNo $model_no)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ModelNo  $model_no
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $model_no = ModelNo::find($id);
        return response()->json($model_no, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ModelNo  $model_no
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ModelNo $model_no)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ModelNo  $model_no
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $model_no = ModelNo::find($id);
        if($model_no->delete()) {
            return response()->json('Model No Deleted Successfully', 200);
        } else {
            return response()->json('Model No Delete Failed', 400);
        }

    }
}
