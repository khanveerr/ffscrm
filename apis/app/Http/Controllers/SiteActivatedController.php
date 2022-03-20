<?php

namespace App\Http\Controllers;

use App\City;
use App\Lead;
use App\SiteActivated;
use Validator;
use Illuminate\Http\Request;
use JWTAuth;

class SiteActivatedController extends Controller
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

        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

        $validator = Validator::make($data, [
            'site_name' => 'required|string|max:255',
            'site_start_date' => 'required|string|max:255'    
        ]);


        // if(isset($data['id']) && $data['id'] != null && !empty($data['id']) && $data['id'] != "") {

        //     $city = City::find($data['id']);
        //     $city->name = $data['name'];
        //     $city->status = $data['status'];

        //     if($city->update()) {
        //         return response()->json('City Updated Successfully', 200);
        //     } else {
        //         return response()->json('City Update Failed', 400);
        //     }

        // } else {

            $errors = $validator->errors();

            if(!empty($errors) && $errors != null && count($errors) > 0) {
                
                $response['errors'] = $errors;
                $response['status'] = false;

                return response()->json($response, 400);

            } else {

                $site_activated = new SiteActivated;
                $site_activated->user_id = $user->id;
                $site_activated->lead_id = $data['lead_id'];
                $site_activated->site_name = $data['site_name'];
                $site_activated->site_start_date = $data['site_start_date'];
                $site_activated->state = $data['state'];
                $site_activated->city = $data['city'];
                $site_activated->pincode = $data['pincode'];
                $site_activated->gst_status = $data['gst_status'];
                $site_activated->gst_number = $data['gst_number'];
                $site_activated->address = $data['address'];
                $site_activated->bd_spoc = $data['bd_spoc'];
                $site_activated->site_incharge = $data['site_incharge'];
                $site_activated->sector = $data['sector'];
                $site_activated->billing_name = $data['billing_name'];
                $site_activated->billing_period = $data['billing_period'];
                $site_activated->billing_date = $data['billing_date'];
                $site_activated->billing_to_address = $data['billing_to_address'];
                $site_activated->consignee_address = $data['consignee_address'];
                $site_activated->invoice_address = $data['invoice_address'];
                $site_activated->client_spoc_name = $data['client_spoc_name'];
                $site_activated->client_spoc_contact = $data['client_spoc_contact'];
                $site_activated->client_spoc_email = $data['client_spoc_email'];
                $site_activated->is_work_order_signed = $data['is_work_order_signed'];


                $cost_schedule_name = '';
                $subject = $data['site_name']." - ". $this->get_date($data['site_start_date'], 'jS M Y');

                if($request->file('cost_schedule') != null || !empty($request->file('cost_schedule'))) {

                 $valid_extensions = array('pdf','docx','doc','xlsx','xls');

                 $cost_schedule = $request->file('cost_schedule');
                 if($cost_schedule != null && $cost_schedule != "" && !empty($cost_schedule)) {
                     $extension = $cost_schedule->getClientOriginalExtension();
                 } else {
                     $extension = '';
                 }

                 if(in_array($extension, $valid_extensions)) {

                     if($cost_schedule != null && $cost_schedule != "" && !empty($cost_schedule)) {
                         $doc_name = str_replace(' ', '_', $cost_schedule->getClientOriginalName());
                         $doc_name = strtolower($doc_name);
                         $cost_schedule_name = date('Ymdhis').'_'.$doc_name;
                         $destinationPath = base_path().'/public/uploads/cost_schedule/';
                         $cost_schedule->move($destinationPath,$cost_schedule_name);
                     } else {
                         $cost_schedule_name = '';
                     }
                 } else {

                     $response['message'] = 'Invalid file extension.';
                     $response['error'] = true;          
                     return response()->json($response,400);

                 }

                }

                $site_activated->cost_schedule = $cost_schedule_name;


                $work_order_name = '';

                if($request->file('work_order') != null || !empty($request->file('work_order'))) {

                 $valid_extensions = array('pdf','docx','doc','xlsx','xls');

                 $work_order = $request->file('work_order');
                 if($work_order != null && $work_order != "" && !empty($work_order)) {
                     $extension = $work_order->getClientOriginalExtension();
                 } else {
                     $extension = '';
                 }

                 if(in_array($extension, $valid_extensions)) {

                     if($work_order != null && $work_order != "" && !empty($work_order)) {
                         $doc_name = str_replace(' ', '_', $work_order->getClientOriginalName());
                         $doc_name = strtolower($doc_name);
                         $work_order_name = date('Ymdhis').'_'.$doc_name;
                         $destinationPath = base_path().'/public/uploads/work_order/';
                         $work_order->move($destinationPath,$work_order_name);
                     } else {
                         $work_order_name = '';
                     }
                 } else {

                     $response['message'] = 'Invalid file extension.';
                     $response['error'] = true;          
                     return response()->json($response,400);

                 }

                }

                $site_activated->work_order = $work_order_name;


                if($site_activated->save()) {
                    $response['message'] = 'Site Activated Added Successfully';

                    if(isset($cost_schedule_name) && !empty($cost_schedule_name)) {
                        $cost_schedule_attachment = url('/'). "/uploads/cost_schedule/".$cost_schedule_name;
                    } else {
                        $cost_schedule_attachment = '';
                    }

                    if(isset($work_order_name) && !empty($work_order_name)) {
                        $work_order_attachment = url('/'). "/uploads/work_order/".$work_order_name;
                    } else {
                        $work_order_attachment = '';
                    }

                    $email = ['tanveer.khan@silagroup.co.in','satyajit.nalawade@silagroup.co.in','natasha.jain@silagroup.co.in','newsite@silagroup.co.in'];
                    $email[] = $user->email;

                    $lead = Lead::find($data['lead_id']);
                    $lead->is_site_activated = 1;
                    $lead->update();


                    \Mail::send('site_activated', ['data' => $data], function ($message) use ($subject, $email, $cost_schedule_attachment, $work_order_attachment)
                    {
                        $message->subject($subject);
                        $message->from('crm@silagroup.co.in', 'SILA CRM');
                        $message->to($email);
                        if(isset($cost_schedule_attachment) && !empty($cost_schedule_attachment)) {
                            $message->attach($cost_schedule_attachment);
                        }
                        if(isset($work_order_attachment) && !empty($work_order_attachment)) {
                            $message->attach($work_order_attachment);
                        }
                    });

                    $response['error'] = false;
                    return response()->json($response, 200);
                } else {
                    $response['message'] = 'Site Activated Add Failed';
                    $response['error'] = true;	
                    return response()->json($response, 400);
                }

            }

        // }

        
    }

    public function get_date($value, $format) {

        $date = new \DateTime($value, new \DateTimeZone("UTC"));
        $date->setTimezone(new \DateTimeZone('Asia/Calcutta'));

        return $date->format($format);

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
