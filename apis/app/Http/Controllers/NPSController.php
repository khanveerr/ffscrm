<?php

namespace App\Http\Controllers;

use App\NPS;
use App\User;

use Validator;
use Illuminate\Http\Request;
use JWTAuth;
use Illuminate\Support\Facades\Auth;

use Carbon\Carbon;

class NPSController extends Controller
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

  //       $user = Auth::user();
  //       if (! $user) {
  //           return response()->json(['user_not_found'], 404);
		// }
        //
        // $all_nps = NPS::where('status','<>',-1);
        $all_nps = NPS::orderBy('interaction_date','desc')->orderBy('score','desc');
        $nps_data = NPS::orderBy('interaction_date','desc')->orderBy('score','desc');
        $avg_data = NPS::orderBy('interaction_date','desc')->orderBy('score','desc');

        if(!empty($data['keyword']) && $data['keyword'] != "" && $data['keyword'] != null) {
            $all_nps = $all_nps->where('company_name','like','%'.$data['keyword'].'%');
            $nps_data = $nps_data->where('company_name','like','%'.$data['keyword'].'%');
            $avg_data = $avg_data->where('company_name','like','%'.$data['keyword'].'%');
        }

        if(isset($data['user_id']) && !empty($data['user_id']) && $data['user_id'] != "" && $data['user_id'] != null) {
            $all_nps = $all_nps->where('user_id','=',$data['user_id']);
            $nps_data = $nps_data->where('user_id','=',$data['user_id']);
            $avg_data = $avg_data->where('user_id','=',$data['user_id']);
        }
        
        if(isset($data['city']) && !empty($data['city']) && $data['city'] != "" && $data['city'] != null) {
            $all_nps = $all_nps->where('city_id','=',$data['city']);
            $nps_data = $nps_data->where('city_id','=',$data['city']);
            $avg_data = $avg_data->where('city_id','=',$data['city']);
		}

		if(isset($data['industry']) && !empty($data['industry']) && $data['industry'] != "" && $data['industry'] != null) {
            $all_nps = $all_nps->where('industry','like','%'.$data['industry'].'%');
            $nps_data = $nps_data->where('industry','like','%'.$data['industry'].'%');
            $avg_data = $avg_data->where('industry','like','%'.$data['industry'].'%');
        }

        if(isset($data['score_cat']) && !empty($data['score_cat']) && $data['score_cat'] != "" && $data['score_cat'] != null) {

            if($data['score_cat'] == 'NA') {
                $all_nps = $all_nps->where('score','=',-1);
                $nps_data = $nps_data->where('score','=',-1);
                $avg_data = $avg_data->where('score','=',-1);
            } else {
                $score_cats = explode("_",$data['score_cat']);
                $all_nps = $all_nps->where('score','>=',$score_cats[0])->where('score','<=',$score_cats[1]);
                $nps_data = $nps_data->where('score','>=',$score_cats[0])->where('score','<=',$score_cats[1]);
                $avg_data = $avg_data->where('score','>=',$score_cats[0])->where('score','<=',$score_cats[1]);
            }
        }


        if( isset($data['from_date']) && (!empty($data['from_date']) && $data['from_date'] != "" && $data['from_date'] != null)) {

        	$data['from_date'] = $this->format_date($data['from_date']);

			if(empty($data['to_date']) || $data['to_date'] == "" || $data['to_date'] == null) {
				$start = Carbon::parse($data['from_date']." 00:00:00");
				$s_date = new \DateTime($start->format('Y-m-d'));
				$new_date = Carbon::parse($data['from_date']." 00:00:00");;
				$e_date = new \DateTime($new_date->format('Y-m-d'));

                $all_nps = $all_nps->where(function($query) use($s_date, $e_date) {
                    $query->where(function($query1) use($s_date) {
                        $query1->where('interaction_date', '>=', $s_date);
                    })->where(function($query2) use($e_date){
                        $query2->where('interaction_date','<=',$e_date);
                    });
                });

                $nps_data = $nps_data->where(function($query) use($s_date, $e_date) {
                    $query->where(function($query1) use($s_date) {
                        $query1->where('interaction_date', '>=', $s_date);
                    })->where(function($query2) use($e_date){
                        $query2->where('interaction_date','<=',$e_date);
                    });
                });

                $avg_data = $avg_data->where(function($query) use($s_date, $e_date) {
                    $query->where(function($query1) use($s_date) {
                        $query1->where('interaction_date', '>=', $s_date);
                    })->where(function($query2) use($e_date){
                        $query2->where('interaction_date','<=',$e_date);
                    });
                });

			}

        }
        
        if(( isset($data['to_date']) && !empty($data['to_date']) && $data['to_date'] != "" && $data['to_date'] != null)) {

        	$data['to_date'] = $this->format_date($data['to_date']);

			if((isset($data['from_date']) && !empty($data['from_date']) && $data['from_date'] != "" && $data['from_date'] != null)) {
				$start = Carbon::parse($data['from_date']." 00:00:00");
				$s_date = new \DateTime($start->format('Y-m-d'));
				$new_date = Carbon::parse($data['to_date']." 00:00:00");;
				$e_date = new \DateTime($new_date->format('Y-m-d'));

                $all_nps = $all_nps->where(function($query) use($s_date, $e_date) {
                    $query->where(function($query1) use($s_date) {
                        $query1->where('interaction_date', '>=', $s_date);
                    })->where(function($query2) use($e_date){
                        $query2->where('interaction_date','<=',$e_date);
                    });
                });

                $nps_data = $nps_data->where(function($query) use($s_date, $e_date) {
                    $query->where(function($query1) use($s_date) {
                        $query1->where('interaction_date', '>=', $s_date);
                    })->where(function($query2) use($e_date){
                        $query2->where('interaction_date','<=',$e_date);
                    });
                });

                $avg_data = $avg_data->where(function($query) use($s_date, $e_date) {
                    $query->where(function($query1) use($s_date) {
                        $query1->where('interaction_date', '>=', $s_date);
                    })->where(function($query2) use($e_date){
                        $query2->where('interaction_date','<=',$e_date);
                    });
                });

			}

        }

        $nps_data = $nps_data->get();
        $all_nps = $all_nps->paginate(50);

        $score_NA = 0;
        $score_0_3 = 0;
        $score_4_6 = 0;
        $score_7_8 = 0;
        $score_9_10 = 0;
        $average_nps_score = 0;

        foreach ($nps_data as $key => $value) {
            
            if($value->score == -1) {
                $score_NA++;
            }
            
            if($value->score >=0 && $value->score <= 3) {
                $score_0_3++;
            }

            if($value->score >=4 && $value->score <= 6) {
                $score_4_6++;
            }

            if($value->score >=7 && $value->score <= 8) {
                $score_7_8++;
            }

            if($value->score >=9 && $value->score <= 10) {
                $score_9_10++;
            }
            
        }

        $average_nps_score = $avg_data->avg('score');
        $average_nps_score = round($average_nps_score,1);

        // $average_nps_score = ($score_0_3 + $score_4_6 + $score_7_8 + $score_9_10) / 4;

        foreach ($all_nps as $key => $value) {

            $value->interaction_date_str = $this->get_date($value->interaction_date, 'd/m/Y');

            $user = User::find($value->user_id);
            if(isset($user)) {
                $value->user_name = $user->name;
            } else {
                $value->user_name = "";
            }

        }

        $response['message'] = 'All NPS fetched successfully.';
		$response['error'] = false;
        $response['result'] = $all_nps;
        $response['score_NA'] = $score_NA;
        $response['score_0_3'] = $score_0_3;
        $response['score_4_6'] = $score_4_6;
        $response['score_7_8'] = $score_7_8;
        $response['score_9_10'] = $score_9_10;
        $response['average_nps_score'] = $average_nps_score;

        return response()->json($response,200);

    }

    public function format_date($value) {
        $date = explode("-", $value);
        return $date[2]."-".$date[1]."-".$date[0];
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
  //       $user = Auth::user();
  //       if (! $user) {
  //           return response()->json(['user_not_found'], 404);
		// }

        $validator = Validator::make($data, [
            'company_name' => 'required|string|max:255',
            'client_spoc' => 'required',
            'interaction_date' => 'required',
            'interaction_type' => 'required',
            'city' => 'required',
            'industry' => 'required',
            'score' => 'required'
        ]);


        if(isset($data['id']) && $data['id'] != null && !empty($data['id']) && $data['id'] != "") {

            $nps = NPS::find($data['id']);
            $nps->company_name = $data['company_name'];
            $nps->client_spoc = $data['client_spoc'];
            $nps->interaction_date = $data['interaction_date'];
            $nps->interaction_type = $data['interaction_type'];
            $nps->city_id = $data['city'];
            $nps->industry = $data['industry'];
            $nps->score = $data['score'];
            if($nps->user_id == 0) {
                $nps->user_id = $user->id;
            }
            if(isset($data['group_code'])) {
                $nps->group_code = $data['group_code'];
            } else {
            	$nps->group_code = "";
            }
            if(isset($data['site_code'])) {
                $nps->site_code = $data['site_code'];
            } else {
            	$nps->site_code = "";
            }
            if(isset($data['comments'])) {
                $nps->comments = $data['comments'];
            }
            if(isset($data['potential'])) {
                $nps->potential = $data['potential'];
            }

            if($nps->update()) {
                return response()->json('NPS Updated Successfully', 200);
            } else {
                return response()->json('NPS Update Failed', 400);
            }

        } else {

            $errors = $validator->errors();

            if(!empty($errors) && $errors != null && count($errors) > 0) {
                
                $response['errors'] = $errors;
                $response['status'] = false;

                return response()->json($response, 400);

            } else {

                $nps = new NPS;
                $nps->company_name = $data['company_name'];
                $nps->client_spoc = $data['client_spoc'];
                $nps->interaction_date = $data['interaction_date'];
                $nps->interaction_type = $data['interaction_type'];
                $nps->city_id = $data['city'];
                $nps->industry = $data['industry'];
                $nps->user_id = $user->id;
                $nps->score = $data['score'];
                if(isset($data['group_code'])) {
	                $nps->group_code = $data['group_code'];
	            }
	            if(isset($data['site_code'])) {
	                $nps->site_code = $data['site_code'];
	            }
                if(isset($data['comments'])) {
                    $nps->comments = $data['comments'];
                }
                if(isset($data['potential'])) {
                    $nps->potential = $data['potential'];
                }

                if($nps->save()) {
                    $response['message'] = 'NPS Added Successfully';
                    $response['error'] = false;
                    return response()->json($response, 200);
                } else {
                    $response['message'] = 'NPS Add Failed';
                    $response['error'] = true;	
                    return response()->json($response, 400);
                }

            }

        }

        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\NPS  $nps
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $nps = NPS::find($id);
        $nps->city = $nps->city_id.'';
        $nps->score = $nps->score.'';
        $nps->potential = $nps->potential.'';

        $response['message'] = 'NPS detail fetched successfully.';
		$response['error'] = false;
		$response['result'] = $nps;

        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\NPS  $nps
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $nps = NPS::find($id);
        // $nps->status = -1;
        if($nps->delete()) {
            $response['message'] = 'NPS Deleted Successfully';
            $response['error'] = false;
            return response()->json($response, 200);
        } else {
            $response['message'] = 'NPS Deleted Successfully';
            $response['error'] = true;
            return response()->json($response, 400);
        }

    }

    public function get_date($value, $format) {

        $date = new \DateTime($value, new \DateTimeZone("UTC"));
        $date->setTimezone(new \DateTimeZone('Asia/Calcutta'));

        return $date->format($format);

	}

}
