<?php

namespace App\Http\Controllers;

use App\Lead;
use App\KAP;
use App\User;

use Carbon\Carbon;
use Illuminate\Http\Request;

use JWTAuth;

class KAPController extends Controller
{

    public function get_date($value, $format) {

        $date = new \DateTime($value, new \DateTimeZone("UTC"));
        $date->setTimezone(new \DateTimeZone('Asia/Calcutta'));

        return $date->format($format);

	}

    public function get_kaps() {

        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

        $month = date('m');
        $year = date('Y');
        $previous_months = $month - 1;
        $next_months = $month + 1;
        
        $start_date = $year.'-'.$previous_months.'-1';
        $end_date = $year.'-'.$next_months.'-31';


        $kaps = KAP::select('id','created_at','user_id', 'lead_id','activity','kap_date')
            ->where('kap_date','>=',$start_date)
            ->where('kap_date','<=',$end_date);

        // if($user->user_type != 'A') {
        //  $kaps = $kaps->where('user_id','=',$user->id);
        // }

        $kaps = $kaps->orderBy('created_at','desc')->get();

        foreach ($kaps as $key => $value) {
            
            // if(isset($value->lead_id)) {
                $lead = Lead::find($value->lead_id);
                if(isset($lead)) {
                    $value->company_name = $lead->company_name;
                } else {
                    $value->company_name = '';
                }

                $value->start = $value->kap_date;
                $value->title = $value->activity;

            // } else {
            //     $value->company_name = '';
            // }

            $value->created_date = $this->get_date($value->created_at, 'jS M Y');

            if($value->kap_date != null) {
                $value->kap_date_str = $this->get_date($value->kap_date, 'jS M Y');
            }

            $value->added_by = User::find($value->user_id)->name;

        }


        $response['message'] = 'KAP fetched successfully.';
        $response['error'] = false;
        $response['result'] = $kaps;
        $response['start_date'] = $start_date;
        $response['end_date'] = $end_date;

        return response()->json($response,200);
        
        

    }
    
    public function save_kap(Request $req) {

		$data = $req->all();
		$response = array();

        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

        $kap = new KAP;
        
        if(isset($data['company_name'])) {
            $kap->company_name = $data['company_name'];
        }

        if(isset($data['activity'])) {
            $kap->activity = $data['activity'];
        }
        
        if(isset($data['lead_id'])) {
            $kap->lead_id = $data['lead_id'];
        }
        
        if(isset($data['kap_date'])) {
            $kap_date = $this->get_date($data['kap_date'],'Y-m-d');
            $kap->kap_date = $kap_date;
        }

        $kap->user_id = $user->id;


		if($kap->save()) {

			$response['message'] = 'KAP added successfully.';
			$response['error'] = false;

			return response()->json($response,201);

		}

    }
    

    public function update_kap(Request $req) {

		$data = $req->all();
		$response = array();

		$kap_id = $data['id'];

		$kap = KAP::find($kap_id);
        
        if(isset($data['company_name'])) {
            $kap->company_name = $data['company_name'];
        }

        if(isset($data['activity'])) {
            $kap->activity = $data['activity'];
        }
        
        if(isset($data['lead_id'])) {
            $kap->lead_id = $data['lead_id'];
        }
        
        if(isset($data['kap_date'])) {
            $kap_date = $this->get_date($data['kap_date'],'Y-m-d');
            $kap->kap_date = $kap_date;
        }

		if($kap->update()) {

			$response['message'] = 'KAP updated successfully.';
			$response['error'] = false;

			return response()->json($response,201);

		}

	}


    public function send_kap_reminders() {

        $today = date('Y-m-d');
        $today_str = date('jS M Y');

        $today_date = $this->get_date($today, 'Y-m-d');
        $kaps = KAP::where('kap_date','=',$today_date)->get();

        foreach ($kaps as $key => $value) {


            $value->created_date = $this->get_date($value->created_at, 'jS M Y');

            if(isset($value->kap_date)) {
                $value->kap_date_str = $this->get_date($value->kap_date, 'jS M Y');
            }

            $value->lead_name = Lead::find($value->lead_id)->company_name;

            $value->lead_owner = User::find($value->user_id)->name;

        }

        $kap_data = array();

        if(count($kaps) > 0) {

            foreach ($kaps as $key => $value) {

                $kap_data[$value->lead_owner][] = $value;

            }

        }

        // $email = array('tanveer.khan@silagroup.co.in');
        $email = array('bd@silagroup.co.in');
        $bccEmail = array('tanveer.khan@silagroup.co.in');
        // $bccEmail = '';

        \Mail::send('kap_reminder', ['kaps' => $kap_data], function ($message) use ($email, $bccEmail, $today_str)
            {
                $message->subject($today_str." - KAP Followup Reminder - SILA CRM");
                $message->from('crm@silagroup.co.in', 'SILA CRM');
                $message->to($email);
                $message->bcc($bccEmail);

            });


        return view('kap_reminder',['kaps' => $kap_data]);

        // $response['message'] = 'KAPs fetched successfully.';
        // $response['error'] = false;
        // $response['result'] = $kap_data;

        // return response()->json($response,200);
        


    }

}