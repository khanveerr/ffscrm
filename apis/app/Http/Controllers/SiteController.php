<?php

namespace App\Http\Controllers;

use App\Site;
use App\State;
use Illuminate\Http\Request;
use JWTAuth;

class SiteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($keyword = null)
    {
        //
        $sites = Site::where('status','=',1);
        if ($keyword != null && !empty($keyword)) {
            $sites = $sites->where('name','like','%'.$keyword.'%');
        }

        $sites = $sites->where('site_code','<>','')->orderBy('site_code_no','asc')->paginate(30);
        return response()->json($sites,200);
    }

    public function get_all_sites()
    {
        //
        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

        if ($user->user_type != 'A' && $user->user_type != 'S') {
            $zone_id = $user->zone_id;
            $state_id = $user->state_id;
            $sites = Site::where('zone_id','=',$zone_id)->where('state_id','=',$state_id)->where('status','=',1)->orderBy('name','asc')->get();
        } else {
            $sites = Site::where('status','=',1)->orderBy('name','asc')->get();
        }
        return response()->json($sites,200);
    }


    public function get_site_states() {

        $sites = Site::select("state_id")->where('state_id','<>',0)->distinct('state_id')->get();
        $state_ids = array();
        foreach ($sites as $key => $value) {
            $state_ids[] = $value->state_id;
        }

        $states = State::select('id','name')->whereIn('id',$state_ids)->orderBy('name')->get();

        return $states;

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

            $site = Site::find($data['id']);
            $site->name = $data['name'];
            $site->cost_centre = $data['name'];
            $site->billing_name = $data['name'];
            $site->zone_id = $data['zone_id'];
            $site->state_id = $data['state_id'];
            $site->site_address = $data['site_address'];
            $site->billing_type = $data['billing_type'];
            $site->budgeted_amount = $data['budgeted_amount'];
            $site->contact_person = $data['contact_person'];
            $site->contact_no = $data['contact_no'];
            $site->status = 1;

            if($site->save()) {
                return response()->json('Site Updated Successfully', 200);
            } else {
                return response()->json('Site Update Failed', 400);
            }

        } else {

            $site = new Site;
            $site->name = $data['name'];
            $site->cost_centre = $data['name'];
            $site->billing_name = $data['name'];
            $site->zone_id = $data['zone_id'];
            $site->state_id = $data['state_id'];
            $site->site_address = $data['site_address'];
            $site->billing_type = $data['billing_type'];
            $site->budgeted_amount = $data['budgeted_amount'];
            $site->contact_person = $data['contact_person'];
            $site->contact_no = $data['contact_no'];
            $site->status = 1;

            if($site->save()) {
                return response()->json('Site Added Successfully', 200);
            } else {
                return response()->json('Site Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Site  $site
     * @return \Illuminate\Http\Response
     */
    public function show(Site $site)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Site  $site
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $site = Site::find($id);
        $site->billing_type = (isset($site->billing_type)) ? (int) $site->billing_type : '';
        $site->state_id = (isset($site->state_id) && !empty($site->state_id)) ?  (int) $site->state_id : '';
        $site->status = (int) $site->status;
        $site->zone_id = (isset($site->zone_id) && !empty($site->zone_id)) ? (int) $site->zone_id : '';
        return response()->json($site, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Site  $site
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Site $site)
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
        $site = Site::find($id);
        if($site->delete()) {
            return response()->json('Site Deleted Successfully', 200);
        } else {
            return response()->json('Site Delete Failed', 400);
        }

    }
}
