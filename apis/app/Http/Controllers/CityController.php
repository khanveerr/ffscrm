<?php

namespace App\Http\Controllers;

use App\City;
use Validator;
use Illuminate\Http\Request;
use JWTAuth;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = $request->all();

        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
        //
        $cities = City::where('status','<>',-1);

        if (isset($data['keyword']) && $data['keyword'] != null && !empty($data['keyword'])) {
            $cities = $cities->where('name','like','%'.$data['keyword'].'%');
        }

        $cities = $cities->orderBy('name','asc')->paginate(30);

        $response['message'] = 'Cities fetched successfully.';
		$response['error'] = false;
		$response['result'] = $cities;

        return response()->json($response,200);

    }

    public function get_all_cities()
    {
        //
        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
        
        $cities = City::where('status','=',1)->orderBy('name','asc')->get();

        $response['message'] = 'Cities fetched successfully.';
		$response['error'] = false;
		$response['result'] = $cities;

        return response()->json($response,200);
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

        $validator = Validator::make($data, [
            'name' => 'required|string|max:255'
        ]);


        if(isset($data['id']) && $data['id'] != null && !empty($data['id']) && $data['id'] != "") {

            $city = City::find($data['id']);
            $city->name = $data['name'];
            $city->status = $data['status'];

            if($city->update()) {
                return response()->json('City Updated Successfully', 200);
            } else {
                return response()->json('City Update Failed', 400);
            }

        } else {

            $errors = $validator->errors();

            if(!empty($errors) && $errors != null && count($errors) > 0) {
                
                $response['errors'] = $errors;
                $response['status'] = false;

                return response()->json($response, 400);

            } else {

                $city = new City;
                $city->name = $data['name'];
                $city->status = $data['status'];

                if($city->save()) {
                    $response['message'] = 'City Added Successfully';
                    $response['error'] = false;
                    return response()->json($response, 200);
                } else {
                    $response['message'] = 'City Add Failed';
                    $response['error'] = true;	
                    return response()->json($response, 400);
                }

            }

        }

        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\City  $city
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $city = City::find($id);
        $city->status = $city->status.'';

        $response['message'] = 'City detail fetched successfully.';
		$response['error'] = false;
		$response['result'] = $city;

        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\City  $city
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $city = City::find($id);
        $city->status = -1;
        if($city->save()) {
            $response['message'] = 'City Deleted Successfully';
            $response['error'] = false;
            return response()->json($response, 200);
        } else {
            $response['message'] = 'City Deleted Successfully';
            $response['error'] = true;
            return response()->json($response, 400);
        }

    }
}
