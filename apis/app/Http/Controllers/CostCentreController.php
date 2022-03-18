<?php

namespace App\Http\Controllers;

use App\CostCentre;
use App\Site;
use Illuminate\Http\Request;

class CostCentreController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $cost_centres = CostCentre::where('status','=',1)->paginate(10);
        foreach ($cost_centres as $key => $value) {
            
            $site = Site::find($value->site_id);
            if(isset($site) && !empty($site)) {
                $value->site_name = $site->name;
            } else {
                $value->site_name = '';
            }

        }
        return response()->json($cost_centres,200);
    }

    public function get_all()
    {
        //
        $cost_centres = CostCentre::where('status','=',1)->get();
        foreach ($cost_centres as $key => $value) {
            
            $site = Site::find($value->site_id);
            if(isset($site) && !empty($site)) {
                $value->site_name = $site->name;
            } else {
                $value->site_name = '';
            }

        }
        return response()->json($cost_centres,200);
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

            $cost_centre = CostCentre::find($data['id']);
            $cost_centre->name = $data['name'];
            $cost_centre->site_id = $data['site_id'];
            $cost_centre->status = 1;

            if($cost_centre->save()) {
                return response()->json('Cost Centre Updated Successfully', 200);
            } else {
                return response()->json('Cost Centre Update Failed', 400);
            }

        } else {

            $cost_centre = new CostCentre;
            $cost_centre->name = $data['name'];
            $cost_centre->site_id = $data['site_id'];
            $cost_centre->status = 1;

            if($cost_centre->save()) {
                return response()->json('Cost Centre Added Successfully', 200);
            } else {
                return response()->json('Cost Centre Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\CostCentre  $cost_centre
     * @return \Illuminate\Http\Response
     */
    public function show(CostCentre $cost_centre)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\CostCentre  $cost_centre
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $cost_centre = CostCentre::find($id);
        return response()->json($cost_centre, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\CostCentre  $cost_centre
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CostCentre $cost_centre)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\CostCentre  $cost_centre
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $cost_centre = CostCentre::find($id);
        if($cost_centre->delete()) {
            return response()->json('Cost Centre Deleted Successfully', 200);
        } else {
            return response()->json('Cost Centre Delete Failed', 400);
        }

    }
}
