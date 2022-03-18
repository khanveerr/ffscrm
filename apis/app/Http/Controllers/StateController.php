<?php

namespace App\Http\Controllers;

use App\State;
use App\Zone;
use Illuminate\Http\Request;
use JWTAuth;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($keyword = null)
    {
        //
        $states = State::where('status','=',1);

        if ($keyword != null && !empty($keyword)) {
            $states = $states->where('name','like','%'.$keyword.'%');
        }

        $states = $states->orderBy('name','asc')->paginate(30);

        foreach ($states as $key => $value) {
            $zone = Zone::find($value->zone_id);
            if (!empty($zone)) {
                $value->zone_name = $zone->zone_name;
            } else {
                $value->zone_name = '';
            }
        }
        return response()->json($states,200);
    }

    public function get_all_states()
    {
        //
        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
        
        if ($user->user_type == 'A') {
            $states = State::where('status','=',1)->orderBy('name','asc')->get();
        } else {
            $zone_id = $user->zone_id;
            $states = State::where('zone_id','=',$zone_id)->where('status','=',1)->orderBy('name','asc')->get();            
        }
        return response()->json($states,200);
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

            $state = State::find($data['id']);
            $state->name = $data['name'];
            $state->zone_id = $data['zone_id'];
            $state->code = $data['code'];
            $state->status = 1;

            if($state->update()) {
                return response()->json('State Updated Successfully', 200);
            } else {
                return response()->json('State Update Failed', 400);
            }

        } else {

            $state = new State;
            $state->name = $data['name'];
            $state->zone_id = $data['zone_id'];
            $state->code = $data['code'];
            $state->status = 1;

            if($state->save()) {
                return response()->json('State Added Successfully', 200);
            } else {
                return response()->json('State Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\State  $state
     * @return \Illuminate\Http\Response
     */
    public function show(Site $site)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\State  $state
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $state = State::find($id);
        $state->zone_id = (int) $state->zone_id;
        return response()->json($state, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\State  $state
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, State $state)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Site  $site
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $state = State::find($id);
        if($state->delete()) {
            return response()->json('State Deleted Successfully', 200);
        } else {
            return response()->json('State Delete Failed', 400);
        }

    }
}
