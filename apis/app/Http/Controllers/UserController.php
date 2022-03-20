<?php

namespace App\Http\Controllers;

use App\User;
use Validator;
use Illuminate\Http\Request;
use JWTAuth;

class UserController extends Controller
{
    
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function get_all(Request $request)
    {
        //
        $data = $request->all();
        $users = User::orderBy('name','asc');
        if (isset($data['keyword']) && $data['keyword'] != null && !empty($data['keyword'])) {
            $users = $users->where('name','like','%'.$data['keyword'].'%');
        }

        $users = $users->orderBy('name','asc')->where('status','=',1)->paginate(30);

        $response['message'] = 'Users fetched successfully.';
		$response['error'] = false;
		$response['result'] = $users;

        return response()->json($response,200);
    }

    public function get_all_active_users()
    {
        //
        $users = User::orderBy('name','asc')->where('status','=',1)->get();

        foreach ($users as $key => $value) {
            
            $value->abbr = strtoupper($this->get_abbr($value));

        }

        $response['message'] = 'Users fetched successfully.';
		$response['error'] = false;
		$response['result'] = $users;

        return response()->json($response,200);
    }

    public function get_all_users()
    {
        //
        $users = User::orderBy('name','asc')->where('status','<>',0)->get();

        foreach ($users as $key => $value) {
            
            $value->abbr = strtoupper($this->get_abbr($value));

        }

        $response['message'] = 'Users fetched successfully.';
		$response['error'] = false;
		$response['result'] = $users;

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
        $user = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6'
        ]);



        if(isset($data['id']) && $data['id'] != null && !empty($data['id']) && $data['id'] != "") {

            $user = User::find($data['id']);
            $user->name = $data['name'];
            $user->email = $data['email'];
            $user->user_type = $data['user_type'];
            if ($user->user_type == 'A') {
                if(isset($data['password']) && !empty($data['password'])) {
                    $user->password = bcrypt($data['password']);
                }
            }

            if($user->save()) {

                $response['message'] = 'User updated successfully.';
				$response['error'] = false;
                return response()->json($response, 200);
                
            } else {

                $response['message'] = 'User Update Failed';
				$response['error'] = true;
                return response()->json($response, 400);
            }

        } else {

            $errors = $validator->errors();

            if(!empty($errors) && $errors != null && count($errors) > 0) {
                
                $response['errors'] = $errors;
                $response['status'] = false;

                return response()->json($response, 400);

                //
            } else {

                $user = new User;
                $user->name = $data['name'];
                $user->email = $data['email'];
                $user->password = bcrypt($data['password']);
                $user->user_type = $data['user_type'];
                $user->status = 1;

                if($user->save()) {

                    $response['message'] = 'User added successfully.';
				    $response['error'] = false;
                    return response()->json($response, 200);

                } else {

                    $response['message'] = 'User Add Failed';
				    $response['error'] = true;	
                    return response()->json($response, 400);
                }

            }

        }

        

        
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $user = User::find($id);

        $response['message'] = 'User detail fetched successfully.';
		$response['error'] = false;
		$response['result'] = $user;

        return response()->json($response, 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $user = User::find($id);
        $user->status = 0;
        if($user->save()) {

            $response['message'] = 'User Deleted Successfully';
            $response['error'] = false;

            return response()->json($response, 200);
        } else {

            $response['message'] = 'User Deleted Successfully';
            $response['error'] = true;
            return response()->json($response, 400);
        }

    }


    public function register(Request $request) {

        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6'
        ]);

        $errors = $validator->errors();

        if(!empty($errors) && $errors != null && count($errors) > 0) {
            $response['errors'] = $errors;
            $response['status'] = false;
            //
        } else {

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]);

            $response['user'] = $user;
            $response['errors'] = $errors;
            $response['status'] = true;

        }


        return response()->json($response);

    }

    public function get_abbr($user) {

        $name = $user->name;

        if($user->email != 'arti@silagroup.co.in') {
        
            $words = preg_split("/[\s,_-]+/", $name);
            $acronym = "";

            foreach ($words as $w) {
            $acronym .= $w[0];
            }
            
            return $acronym;

        } else {

            return "arti";

        }
    }

    public function change_password(Request $request) {

        $data = $request->all();

        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
        
        $credentials = array('email' => $user->email, 'password' => $data['old_password']);
        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'invalid_credentials'], 401);
        }

        $user_db = User::find($user->id);
        $user_db->password = bcrypt($data['new_password']);
        if($user_db->update()) {
            return response()->json(['message' => 'Password changes successfully!'], 200);
        }

    }

}