<?php

namespace App\Http\Controllers;

use App\Zone;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($keyword = null)
    {
        //
        $zones = Zone::where('status','=',1);
        if ($keyword != null && !empty($keyword) && $keyword != "undefined") {
            $zones = $zones->where('zone_name','like','%'.$keyword.'%');
        }

        $zones = $zones->orderBy('zone_name','asc')->paginate(30);
        return response()->json($zones,200);
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

            $zone = Zone::find($data['id']);
            $zone->zone_name = $data['zone_name'];
            $zone->code = $data['code'];
            $zone->status = 1;

            if($zone->save()) {
                return response()->json('Zone Updated Successfully', 200);
            } else {
                return response()->json('Zone Update Failed', 400);
            }

        } else {

            $zone = new Zone;
            $zone->zone_name = $data['zone_name'];
            $zone->code = $data['code'];
            $zone->status = 1;

            if($zone->save()) {
                return response()->json('Zone Added Successfully', 200);
            } else {
                return response()->json('Zone Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Zone  $zone
     * @return \Illuminate\Http\Response
     */
    public function show(Zone $zone)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Zone  $zone
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $zone = Zone::find($id);
        return response()->json($zone, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Zone  $zone
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Zone $zone)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Zone  $zone
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $zone = Zone::find($id);
        if($zone->delete()) {
            return response()->json('Zone Deleted Successfully', 200);
        } else {
            return response()->json('Zone Delete Failed', 400);
        }

    }
}
