<?php

namespace App\Http\Controllers;

use App\Lead;
use App\KAP;
use App\User;
use App\SiteActivated;
use App\State;
use Illuminate\Http\Request;
use JWTAuth;

use Carbon\Carbon;
use Carbon\CarbonPeriod;

class LeadController extends Controller
{
    
    public function index(Request $req)
    {

		$user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
		}
		
        
        $data = $req->all();
        $is_complete = 0;
        $is_won_complete = 0;
        
        $months = array(
			'1' => 'January',
			'2' => 'February',
			'3' => 'March',
			'4' => 'April',
			'5' => 'May',
			'6' => 'June',
			'7' => 'July',
			'8' => 'August',
			'9' => 'September',
			'10' => 'October',
			'11' => 'November',
			'12' => 'December'
        );
        
        $leads = Lead::select('id','user_id','company_name','company_poc','division','spoc','relevant','leadsource','industry','sales_stage','deal_size','deal_size_annual','probability','weighted','remarks','created_at','reminder','status','city','reason','other_reason','company_poc_email','company_poc_mobile','target_date','email','cost_schedule','contract_start_date','gross_profit','c0_value','c1_value','c2_value','c3_value','client_type','important','percentage_bdm','c3_percentage_won_value','c3_won_value','bdm_value','contract_renewal_date','contract_renew_date','won_month','agp_bdm_percentage_value','agp_percentage_value','service_start_date','work_order_date','c2_probability_perc','state');

		// if($user->user_type != 'A') {
			// $leads = $leads->where('user_id','=',$user->id);
		// } else {

			// if(isset($data['user_id']) && !empty($data['user_id']) && $data['user_id'] != "" && $data['user_id'] != null) {
			// 	$leads = $leads->where('user_id','=',$data['user_id']);
			// }

		// }

		if(isset($data['user_id']) && !empty($data['user_id']) && $data['user_id'] != "" && $data['user_id'] != null) {
			$leads = $leads->where('user_id','=',$data['user_id']);
		}

        if(!empty($data['spoc']) && $data['spoc'] != "" && $data['spoc'] != null) {
			$leads = $leads->where('spoc','like','%'.$data['spoc'].'%');
		}

		// if(!empty($data['client_type']) && $data['client_type'] != "" && $data['client_type'] != null) {
		// 	$leads = $leads->where('client_type','=',$data['client_type']);
		// }

		if(!empty($data['leadsource']) && $data['leadsource'] != "" && $data['leadsource'] != null) {
			if($data['leadsource'] === 'NA') {
				$leads = $leads->whereRaw('leadsource is NULL');
			} else {
				$leads = $leads->where('leadsource','=',$data['leadsource']);
			}
		}

		if(!empty($data['email']) && $data['email'] != "" && $data['email'] != null) {
			$leads = $leads->where('email','=',$data['email']);
		}

		if(!empty($data['won_month']) && $data['won_month'] != "" && $data['won_month'] != null) {
			$leads = $leads->where('won_month','=', (int) $data['won_month']);
		}

		// if(!empty($data['city']) && $data['city'] != "" && $data['city'] != null) {
		// 	$leads = $leads->where('city','like','%'.$data['city'].'%');
		// }

		if(!empty($data['state']) && $data['state'] != "" && $data['state'] != null) {
			$leads = $leads->where('state','like','%'.$data['state'].'%');
		}

		if(!empty($data['industry']) && $data['industry'] != "" && $data['industry'] != null) {
			$leads = $leads->where('industry','like','%'.$data['industry'].'%');
        }
        
        if(!empty($data['keyword']) && $data['keyword'] != "" && $data['keyword'] != null) {
			$leads = $leads->where('company_name','like','%'.$data['keyword'].'%');
        }

        
   //      if((!empty($data['from_date']) && $data['from_date'] != "" && $data['from_date'] != null)) {

   //      	$data['from_date'] = $this->format_date($data['from_date']);

			// if(empty($data['to_date']) || $data['to_date'] == "" || $data['to_date'] == null) {
			// 	$start = Carbon::parse($data['from_date']." 00:00:00");
			// 	$s_date = new \DateTime($start->format('Y-m-d'));
			// 	$new_date = Carbon::parse($data['from_date']." 00:00:00");;
			// 	$e_date = new \DateTime($new_date->format('Y-m-d'));

   //              $leads = $leads->where(function($query) use($s_date, $e_date) {
			// 		$query->where(function($query1) use($s_date) {
			// 			$query1->where('service_start_date', '>=', $s_date);
			// 		})->where(function($query2) use($e_date){
			// 			$query2->where('service_start_date','<=',$e_date);
			// 		});
			// 	});
			// }

   //      }
        
   //      if((!empty($data['to_date']) && $data['to_date'] != "" && $data['to_date'] != null)) {

   //      	$data['to_date'] = $this->format_date($data['to_date']);

			// if((!empty($data['from_date']) && $data['from_date'] != "" && $data['from_date'] != null)) {
			// 	$start = Carbon::parse($data['from_date']." 00:00:00");
			// 	$s_date = new \DateTime($start->format('Y-m-d'));
			// 	$new_date = Carbon::parse($data['to_date']." 00:00:00");;
			// 	$e_date = new \DateTime($new_date->format('Y-m-d'));
			// 	$leads = $leads->where(function($query) use($s_date, $e_date) {
			// 		$query->where(function($query1) use($s_date) {
			// 			$query1->where('service_start_date', '>=', $s_date);
			// 		})->where(function($query2) use($e_date){
			// 			$query2->where('service_start_date','<=',$e_date);
			// 		});
			// 	});

			// }

   //      }


        if((!empty($data['from_date']) && $data['from_date'] != "" && $data['from_date'] != null)) {

        	$data['from_date'] = $this->format_date($data['from_date']);

			if(empty($data['to_date']) || $data['to_date'] == "" || $data['to_date'] == null) {
				$start = Carbon::parse($data['from_date']." 00:00:00");
				$s_date = new \DateTime($start->format('Y-m-d'));
				$new_date = Carbon::parse($data['from_date']." 00:00:00");;
				$e_date = new \DateTime($new_date->format('Y-m-d'));

				if(isset($data['date_type_filter'])) {

					if($data['date_type_filter'] == 'W/O Date') {

						$leads = $leads->where(function($query) use($s_date, $e_date) {
							$query->where(function($query1) use($s_date) {
								$query1->where('work_order_date', '>=', $s_date);
							})->where(function($query2) use($e_date){
								$query2->where('work_order_date','<=',$e_date);
							});
						});

					}

					if($data['date_type_filter'] == 'Date - (Service Start)') {

						$leads = $leads->where(function($query) use($s_date, $e_date) {
							$query->where(function($query1) use($s_date) {
								$query1->where('service_start_date', '>=', $s_date);
							})->where(function($query2) use($e_date){
								$query2->where('service_start_date','<=',$e_date);
							});
						});

					}


					if($data['date_type_filter'] == 'Contract Renewal Date') {

						$leads = $leads->where(function($query) use($s_date, $e_date) {
							$query->where(function($query1) use($s_date) {
								$query1->where('contract_renewal_date', '>=', $s_date);
							})->where(function($query2) use($e_date){
								$query2->where('contract_renewal_date','<=',$e_date);
							});
						});

					}


				}
			}

        }
        
        if((!empty($data['to_date']) && $data['to_date'] != "" && $data['to_date'] != null)) {

        	$data['to_date'] = $this->format_date($data['to_date']);

			if((!empty($data['from_date']) && $data['from_date'] != "" && $data['from_date'] != null)) {
				$start = Carbon::parse($data['from_date']." 00:00:00");
				$s_date = new \DateTime($start->format('Y-m-d'));
				$new_date = Carbon::parse($data['to_date']." 00:00:00");;
				$e_date = new \DateTime($new_date->format('Y-m-d'));

				if($data['date_type_filter'] == 'W/O Date') {
					$leads = $leads->where(function($query) use($s_date, $e_date) {
						$query->where(function($query1) use($s_date) {
							$query1->where('work_order_date', '>=', $s_date);
						})->where(function($query2) use($e_date){
							$query2->where('work_order_date','<=',$e_date);
						});
					});
				}

				if($data['date_type_filter'] == 'Date - (Service Start)') {
					$leads = $leads->where(function($query) use($s_date, $e_date) {
						$query->where(function($query1) use($s_date) {
							$query1->where('service_start_date', '>=', $s_date);
						})->where(function($query2) use($e_date){
							$query2->where('service_start_date','<=',$e_date);
						});
					});
				}

				if($data['date_type_filter'] == 'Contract Renewal Date') {
					$leads = $leads->where(function($query) use($s_date, $e_date) {
						$query->where(function($query1) use($s_date) {
							$query1->where('contract_renewal_date', '>=', $s_date);
						})->where(function($query2) use($e_date){
							$query2->where('contract_renewal_date','<=',$e_date);
						});
					});
				}

			}

        }
        
        if($data['status'] == 'won' && (empty($data['from_date']) || $data['from_date'] == "" || $data['from_date'] == null) && (empty($data['to_date']) || $data['to_date'] == "" || $data['to_date'] == null)) {

			$m = (int) date('m');
			if ($m >= 4 && $m <= 12) {
				$s_y = date('Y');
				$e_y = $s_y + 1;
			}

			if ($m >= 1 && $m <=3) {
				$e_y = date('Y');
				$s_y = $e_y - 1;
			}

			$s_date = new \DateTime($s_y.'-04-01');
			$e_date = new \DateTime($e_y.'-03-31');

            $leads = $leads->where(function($query) use($s_date, $e_date) {
				$query->where(function($query1) use($s_date) {
					$query1->where('service_start_date', '>=', $s_date);
				})->where(function($query2) use($e_date){
					$query2->where('service_start_date','<=',$e_date);
				});
			});

        }
        
        if(!empty($data['status']) && $data['status'] != "" && $data['status'] != null) {

			if($data['status'] == 'open') {
				$leads = $leads->where(function($query) {
					$query->where(function($query1) {
						$query1->where('status', '=', 0);
					})->orWhere(function($query2){
						$query2->where('status', '=', 2);
					});
				});
			}

			if($data['status'] == 'won') {
				$leads = $leads->where(function($query) {
					$query->where(function($query1) {
						$query1->where('status', '=', 1);
					})->orWhere(function($query2){
						$query2->where('status', '=', 2);
					})->orWhere(function($query2){
						$query2->where('status', '=', -3);
					});
				});
			}

			if($data['status'] == 'lost') {
				$leads = $leads->where('status','=',3);
			}

			if($data['status'] == 'database') {
				$leads = $leads->where('status','=',5);
			}
        }
        

        $response['query'] = $leads->toSql();

		if($data['status'] == 'won') {
			$my_lead_data = $leads->orderBy('work_order_date','desc')->get();
			$leads = $leads->paginate(75);
		} else {
			if(!empty($data['sort_order']) && $data['sort_order'] != "" && $data['sort_order'] != null) {

				$my_lead_data = $leads->get();
				if(isset($data['show_important_first']) && ($data['show_important_first'] == 1 || $data['show_important_first'] == '1')) {
					$leads = $leads->orderBy('important','desc');	
				}
				$leads = $leads->orderBy('created_at',$data['sort_order'])->paginate(75);
			} else {
				// $my_lead_data = $leads->orderBy('c3_value','desc')->orderBy('c2_probability_value','desc')->orderBy('c2_value','desc')->orderBy('c1_value','desc')->orderBy('c0_value','desc')->get();
				if(isset($data['show_important_first']) && ($data['show_important_first'] == 1 || $data['show_important_first'] == '1')) {
					$leads = $leads->orderBy('important','desc');	
				}
				$my_lead_data = $leads->orderBy('c3_value','desc')->orderBy('c2_value','desc')->orderBy('c1_value','desc')->orderBy('c0_value','desc')->get();
				$leads = $leads->orderBy('created_at','desc')->paginate(75);
			}

        }
        
        
        $total_c0_sum = 0;
		$total_c1_sum = 0;
		$total_c2_sum = 0;
		$total_c3_sum = 0;



		foreach ($my_lead_data as $lkey => $lvalue) {
			
			if(isset($lvalue->c0_value) && !empty($lvalue->c0_value)) {
				$total_c0_sum += (float) $lvalue->c0_value;
			}	

			if(isset($lvalue->c1_value) && !empty($lvalue->c1_value)) {
				$total_c1_sum += (float) $lvalue->c1_value;
			}	

			if(isset($lvalue->c2_value) && !empty($lvalue->c2_value)) {
				$total_c2_sum += (float) $lvalue->c2_value;
			}	

			if(isset($lvalue->c3_value) && !empty($lvalue->c3_value)) {
				$total_c3_sum += (float) $lvalue->c3_value;
			}	

		}

        $bdm_percentage_value = 0;
		$bdm_percentage_value_total = 0;
		$agp_value_total = 0;
		$agp_bdm_value_total = 0;
		$total_contract_value = 0;
		$total_c2_probability_value = 0;


		foreach ($leads as $key => $value) {

			$value->sr_no = ($leads->currentpage()-1) * $leads->perpage() + $key + 1;


			$value->created_date = $this->get_date($value->created_at, 'd/m/Y');
			
			if($value->user_id != null) {
				$value->abbr = $this->get_abbr(User::find($value->user_id));
			} else {
				$value->abbr = '';
			}

			if($value->reason != null && $value->reason == 4) {
				$value->reason_name = $value->other_reason;
			} else {
				$value->reason_name = '';
			}


			if($value->reminder != null) {
                $value->reminder_date = $this->get_date($value->reminder, 'd/m/Y');
			}

			if($value->contract_renewal_date != null) {
                $value->contract_renewal_str = $this->get_date($value->contract_renewal_date, 'd/m/Y');
			}

			if($value->service_start_date != null) {
                $value->service_start_date_str = $this->get_date($value->service_start_date, 'd/m/Y');
			}

			if($value->work_order_date != null) {
                $value->work_order_date_str = $this->get_date($value->work_order_date, 'd/m/Y');
			} else {
				$value->work_order_date_str = '';
			}

			if($value->target_date != null) {
                $value->target_date = $this->get_date($value->target_date, 'Y-m-d');
			}

			if($value->contract_start_date != null) {
                $value->contract_start_date_str = $this->get_date($value->contract_start_date, 'Y-m-d');
			}

			if($value->bdm_value != null && ($value->status == 1 || $value->status == '1')) {

				$bdm_percentage_value = round((((float) ($value->bdm_value/100)) * ((float) $value->c3_won_value)),2);
				$bdm_percentage_value_total = $bdm_percentage_value_total + $bdm_percentage_value;
				$value->bdm_percentage_value = $bdm_percentage_value;

			}

			if($value->agp_percentage_value != null && ($value->status == 1 || $value->status == '1')) {

				$agp_value = round((((float) ($value->agp_percentage_value/100)) * ((float) $value->c3_won_value)),2);
				$value->agp_value = round($agp_value,1);
				$agp_value_total = $agp_value_total + $agp_value;

				$agp_bdm_value = round((((float) ($value->agp_percentage_value/100)) * ((float) $bdm_percentage_value)),2);
				$value->agp_bdm_value = $agp_bdm_value;

				$agp_bdm_value_total = $agp_bdm_value_total + $agp_bdm_value;

			}

			if($value->won_month != null && ($value->status == 1 || $value->status == '1')) {
				$value->won_month_str = $months[$value->won_month];
			}

			if (($value->status == 1 || $value->status == '1') || ($value->status == 2 || $value->status == '2')) {
				$total_contract_value = (float) $total_contract_value + (float) $value->c3_won_value;
			}

			if(isset($value->c3_won_value)) {
				$value->c3_won_value = round($value->c3_won_value,1);
			}

			if(( ($value->company_poc_email != null && $value->company_poc_email != "" && $value->company_poc_email != "null") || ($value->company_poc_mobile != null && $value->company_poc_mobile != "" && $value->company_poc_mobile != "null") ) && ($value->industry != null && $value->industry != "" && $value->industry != "null") && ($value->state != null && $value->state != "" && $value->state != "null") && ($value->leadsource != null && $value->leadsource != "" && $value->leadsource != "null")) {
				$is_complete = 1;
			} else {
				$is_complete = 0;
			}

			if((isset($value->service_start_date) && !empty($value->service_start_date) && $value->service_start_date != null) && (isset($value->work_order_date) && !empty($value->work_order_date) && $value->work_order_date != null)) {
				$is_won_complete = 1;
			} else {
				$is_won_complete = 0;
			}

			if (isset($value->c2_value) && isset($value->c2_probability_perc)) {
				$value->c2_probability_value = round ((float) $value->c2_value * (((float) $value->c2_probability_perc)/100),1);
				$total_c2_probability_value = $total_c2_probability_value + $value->c2_probability_value;
			} else {
				$value->c2_probability_value = 0;
			}

			if(isset($value->c0_value)) {
				$value->c0_value = round($value->c0_value,1);
			}

			if(isset($value->c1_value)) {
				$value->c1_value =  round($value->c1_value,1);
			}

			if(isset($value->c2_value)) {
				$value->c2_value = round($value->c2_value,1);
			}

			if(isset($value->c3_value)) {
				$value->c3_value =  round($value->c3_value,1);
			}

			
			$value->is_complete = $is_complete;
			$value->is_won_complete = $is_won_complete;
			$value->company_name_new = substr($value->company_name, 0,15);

			$value->is_site_activated = SiteActivated::where('lead_id','=',$value->id)->count() > 0 ? 1 : 0;	

		}

		$response['message'] = 'Lead fetched successfully.';
		$response['error'] = false;
		$response['result'] = $leads;
		$response['total_c0_sum'] = round($total_c0_sum,1);
		$response['total_c1_sum'] = round($total_c1_sum,1);
		$response['total_c2_sum'] = round($total_c2_sum,1);
		$response['total_c3_sum'] = round($total_c3_sum,1);
		$response['total_c2_probability_value'] = round($total_c2_probability_value,1);
		$response['contract_count'] = count($leads);
		$response['bdm_contribution_total'] = round($bdm_percentage_value_total,1);
		$response['agp_value_total'] = round($agp_value_total,1);
		$response['agp_bdm_value_total'] = round($agp_bdm_value_total,1);
		$response['total_contract_value'] = round($total_contract_value,1);

        return response()->json($response,200);
    }
    

    public function get_date($value, $format) {

        $date = new \DateTime($value, new \DateTimeZone("UTC"));
        $date->setTimezone(new \DateTimeZone('Asia/Calcutta'));

        return $date->format($format);

	}

	public function format_date($value) {
		$date = explode("-", $value);
		return $date[2]."-".$date[1]."-".$date[0];
	}
	
   
    public function store(Request $request)
    {
        //
        $data = $request->all();
        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }


        if(isset($data['id']) && $data['id'] != null && !empty($data['id']) && $data['id'] != "") {

			$lead = Lead::find($data['id']);
			
            if(isset($data['company_name'])) {
				$lead->company_name = $data['company_name'];
			}

			if(isset($data['company_poc'])) {
				$lead->company_poc = $data['company_poc'];
			}

            if(isset($data['company_poc_email'])) {
                $lead->company_poc_email = $data['company_poc_email'];
            }
            if(isset($data['company_poc_mobile'])) {
                $lead->company_poc_mobile = $data['company_poc_mobile'];
            }
            
            if(isset($data['city'])) {
				$lead->city = $data['city'];
			}

			if(isset($data['state'])) {
				$lead->state = $data['state'];
			}

			if(isset($data['industry'])) {
				$lead->industry = $data['industry'];
			}

			if(isset($data['leadsource'])) {
				$lead->leadsource = $data['leadsource'];
			}

			if(isset($data['client_type'])) {
				$lead->client_type = $data['client_type'];
			}

            if(isset($data['c0_value'])) {
				$c0_db_value = (float) $lead->c0_value;
				$c0_value = (float) $data['c0_value'];

				if(isset($c0_value) && $c0_value != 0 && $c0_value != $c0_db_value) {
					$lead->c0_value_date = date('Y-m-d h:i:s');
				}

                $lead->c0_value = $c0_value;
            } 

            if(isset($data['c1_value'])) {
				$c1_db_value = (float) $lead->c1_value;
				$c1_value = (float) $data['c1_value'];

				if(isset($c1_value) && $c1_value != 0 && $c1_value != $c1_db_value) {
					$lead->c1_value_date = date('Y-m-d h:i:s');
				}

				$lead->c1_value = $c1_value;
            } 

            if(isset($data['c2_value'])) {
				$c2_db_value = (float) $lead->c2_value;
				$c2_value = (float) $data['c2_value'];

				if(isset($c2_value) && $c2_value != 0 && $c2_value != $c2_db_value) {
					$lead->c2_value_date = date('Y-m-d h:i:s');
				}
                $lead->c2_value = $c2_value;
            } 

            if(isset($data['c3_value'])) {
				$c3_db_value = (float) $lead->c3_value;
				$c3_value = (float) $data['c3_value'];

				if(isset($c3_value) && $c3_value != 0 && $c3_value != $c3_db_value) {
					$lead->c3_value_date = date('Y-m-d h:i:s');
				}
                $lead->c3_value = $c3_value;
            } 

            if(isset($data['c2_probability_perc'])) {
                $lead->c2_probability_perc = $data['c2_probability_perc'];
            } 
			
			if(isset($data['c3_won_value'])) {
                $lead->c3_won_value = $data['c3_won_value'];
			}
			
			if(isset($data['contract_renewal_date'])) {
                $lead->contract_renewal_date = $data['contract_renewal_date'];
			}
			
			if(isset($data['service_start_date'])) {
                $lead->service_start_date = $data['service_start_date'];
			}
			
			if(isset($data['work_order_date'])) {
                $lead->work_order_date = $data['work_order_date'];
			}
			
			if(isset($data['bdm_value'])) {
                $lead->bdm_value = $data['bdm_value'];
			}
			
			if(isset($data['agp_percentage_value'])) {
                $lead->agp_percentage_value = $data['agp_percentage_value'];
			}
			
			if(isset($data['status'])) {
                $lead->status = $data['status'];
			}

			if(isset($data['user_id'])) {
				$lead->user_id = $data['user_id'];
			}
			
			if(isset($data['reason'])) {
                $lead->reason = $data['reason'];
			}
			
			if(isset($data['other_reason'])) {
                $lead->other_reason = $data['other_reason'];
			}
			
			if(isset($data['next_follow_up_date'])) {
                $lead->next_follow_up_date = $data['next_follow_up_date'];
			}
			
			if(isset($data['lost_contract_value'])) {
                $lead->lost_contract_value = $data['lost_contract_value'];
			}
			
			if(isset($data['lost_lead'])) {
                $lead->lost_lead = $data['lost_lead'];
			}
			
			if(isset($data['last_sales_stage'])) {
                $lead->last_sales_stage = $data['last_sales_stage'];
            }

            if($lead->update()) {

                $response['message'] = 'Lead updated successfully.';
				$response['error'] = false;
                return response()->json($response,200);
                
            } else {

                $response['message'] = 'Lead not updated successfully.';
				$response['error'] = true;			
                return response()->json($response,500);
                
            }

        } else {

			$lead = new Lead;
			
			if(isset($data['company_name'])) {
				$lead->company_name = $data['company_name'];
			}

			if(isset($data['company_poc'])) {
				$lead->company_poc = $data['company_poc'];
			}
			
            if(isset($data['user_id'])) {
				$lead->user_id = $data['user_id'];
			}

            if(isset($data['company_poc_email'])) {
                $lead->company_poc_email = $data['company_poc_email'];
            }
            if(isset($data['company_poc_mobile'])) {
                $lead->company_poc_mobile = $data['company_poc_mobile'];
            }
			
			if(isset($data['city'])) {
				$lead->city = $data['city'];
			}

			if(isset($data['state'])) {
				$lead->state = $data['state'];
			}

			if(isset($data['industry'])) {
				$lead->industry = $data['industry'];
			}

			if(isset($data['leadsource'])) {
				$lead->leadsource = $data['leadsource'];
			}

			if(isset($data['client_type'])) {
				$lead->client_type = $data['client_type'];
			}

            if(isset($data['spoc'])) {
                $lead->spoc = $data['spoc'];
            }

            if(isset($data['c0_value'])) {
				$lead->c0_value = $data['c0_value'];
				$lead->c0_value_date = date('Y-m-d h:i:s');
            }

            if(isset($data['c1_value'])) {
				$lead->c1_value = $data['c1_value'];
				$lead->c1_value_date = date('Y-m-d h:i:s');
            }

            if(isset($data['c2_value'])) {
				$lead->c2_value = $data['c2_value'];
				$lead->c2_value_date = date('Y-m-d h:i:s');
            }

            if(isset($data['c3_value'])) {
				$lead->c3_value = $data['c3_value'];
				$lead->c3_value_date = date('Y-m-d h:i:s');
            }

            if(isset($data['c2_probability_perc'])) {
                $lead->c2_probability_perc = $data['c2_probability_perc'];
            }
			
			if(isset($data['c3_won_value'])) {
                $lead->c3_won_value = $data['c3_won_value'];
			}
			
			if(isset($data['contract_renewal_date'])) {
                $lead->contract_renewal_date = $data['contract_renewal_date'];
			}
			
			if(isset($data['service_start_date'])) {
                $lead->service_start_date = $data['service_start_date'];
			}
			
			if(isset($data['work_order_date'])) {
                $lead->work_order_date = $data['work_order_date'];
			}
			
			if(isset($data['bdm_value'])) {
                $lead->bdm_value = $data['bdm_value'];
			}
			
			if(isset($data['agp_percentage_value'])) {
                $lead->agp_percentage_value = $data['agp_percentage_value'];
			}
			
			if(isset($data['status'])) {
                $lead->status = $data['status'];
			}
			
			if(isset($data['reason'])) {
                $lead->reason = $data['reason'];
			}
			
			if(isset($data['other_reason'])) {
                $lead->other_reason = $data['other_reason'];
			}
			
			if(isset($data['next_follow_up_date'])) {
                $lead->next_follow_up_date = $data['next_follow_up_date'];
			}
			
			if(isset($data['lost_contract_value'])) {
                $lead->lost_contract_value = $data['lost_contract_value'];
			}
			
			if(isset($data['lost_lead'])) {
                $lead->lost_lead = $data['lost_lead'];
			}
			
			if(isset($data['last_sales_stage'])) {
                $lead->last_sales_stage = $data['last_sales_stage'];
            }

            $lead->important = 0.0;

            if($lead->save()) {

                $response['message'] = 'Lead added successfully.';
				$response['error'] = false;
                return response()->json($response,201);
                
            } else {
                
                $response['message'] = 'Lead not added successfully.';
				$response['error'] = true;			
				return response()->json($response,500);
                
            }

        }

        
	}
	

	public function set_important(Request $request) {

		$data = $request->all();
        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

        if(isset($data['id']) && $data['id'] != null && !empty($data['id']) && $data['id'] != "") {
			$lead = Lead::find($data['id']);
			$lead->important = $data['important'];

			if($lead->update()) {

                $response['message'] = 'Lead set as important successfully.';
				$response['error'] = false;
                return response()->json($response,200);
                
            } else {

                $response['message'] = 'Lead not updated.';
				$response['error'] = true;			
                return response()->json($response,500);
                
            }

		} else {

			$response['message'] = 'Lead not updated.';
			$response['error'] = true;			
			return response()->json($response,500);

		}
		

	}


	public function get_lead_details($id) {

		$lead = Lead::find($id);

		if(!empty($lead) && $lead != null && $lead != "") {

			if($lead->target_date != null) {
				$lead->target_date = $this->get_date($lead->target_date, 'Y-m-d');
				
			}

			if($lead->c0_value_date != null) {
				$lead->c0_value_date = $this->get_date($lead->c0_value_date, 'Y-m-d');
			}

			if($lead->c1_value_date != null) {
				$lead->c1_value_date = $this->get_date($lead->c1_value_date, 'Y-m-d');
			}

			if($lead->c2_value_date != null) {
				$lead->c2_value_date = $this->get_date($lead->c2_value_date, 'Y-m-d');
			}

			if($lead->contract_renewal_date != null) {
				$lead->contract_renewal_date_str = $this->get_date($lead->contract_renewal_date, 'jS M Y');
			}

			if($lead->service_start_date != null) {
				$lead->service_start_date_str = $this->get_date($lead->service_start_date, 'jS M Y');
			}

			if($lead->work_order_date != null) {
				$lead->work_order_date_str = $this->get_date($lead->work_order_date, 'jS M Y');
			}

			$lead->user_id = $lead->user_id.'';


			$response['message'] = 'Lead details fetched successfully.';
			$response['error'] = false;
			$response['result'] = $lead;

			return response()->json($response,200);

		} else {

			$response['message'] = 'Not found';
			$response['error'] = true;

			return response()->json($response,404);

		}

	}

   
    public function update_reminder(Request $req) {

		$data = $req->all();

        $lead = Lead::find($data['id']);
        
        $reminder = Carbon::parse($data['reminder']." 00:00:00");
		$lead->reminder = new \DateTime($reminder->format('Y-m-d'));

		if($lead->update()) {

			$response['message'] = 'Reminder updated successfully.';
			$response['error'] = false;

			return response()->json($response,200);

		} else {
			$response['message'] = 'Reminder not updated successfully.';
			$response['error'] = true;			
			return response()->json($response,500);
		}

	}


	public function delete($id) {


		$lead = Lead::find($id);
		$lead->status = -1;

		if($lead->update()) {

			$response['message'] = 'Lead deleted successfully.';
			$response['error'] = false;

			return response()->json($response,200);

		} else {

			$response['message'] = 'Lead not deleted successfully.';
			$response['error'] = true;			
			return response()->json($response,500);

		}



	}


	public function get_companies() {

        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

		$companies = Lead::select('company_name as name','id')->where('company_name','<>',"")->where('status','<>',-1);

		if($user->user_type != 'A') {
			$companies = $companies->where('user_id','=',$user->id);
		}

		$companies = $companies->orderBy('company_name','asc')->distinct('company_name')->get();

		$response['message'] = 'Company fetched successfully.';
		$response['error'] = false;
		$response['result'] = $companies;

		return response()->json($response,200);

	}

	public function get_states() {

        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

		$states = State::select('name')->orderBy('name','asc')->get();

		$response['message'] = 'States fetched successfully.';
		$response['error'] = false;
		$response['result'] = $states;

		return response()->json($response,200);

	}

	public function get_lead_kaps($lead_id) {

		$user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

		$kaps = KAP::select('id','created_at','user_id', 'lead_id','activity','kap_date')->where('lead_id','=',$lead_id);

		// if($user->user_type != 'A') {
		// 	$kaps = $kaps->where('user_id','=',$user->id);
		// }

		$kaps = $kaps->orderBy('created_at','desc')->get();

		foreach ($kaps as $key => $value) {

			$value->company_name = Lead::find($value->lead_id)->company_name;

			$value->created_date = $this->get_date($value->created_at, 'jS M Y');

			if($value->kap_date != null) {
				$value->kap_date_str = $this->get_date($value->kap_date, 'jS M Y');
			}

			$value->added_by = User::find($value->user_id)->name;

		}


		$response['message'] = 'KAP fetched successfully.';
		$response['error'] = false;
		$response['result'] = $kaps;

		return response()->json($response,200);
		
		

	}


	public function get_abbr($user) {

		if(isset($user->name)) {

			$name = $user->name;

			if($user->email != 'arti@silagroup.co.in') {
			
				$words = preg_split("/[\s,_-]+/", $name);
		        $acronym = "";

		        foreach ($words as $w) {
		        $acronym .= $w[0];
				}
				
				return $acronym;

			} else {

				return "ARTI";

			}

		} else {

			return "";

		}
	}


	public function lead_export(Request $req) {

		$data = $req->all();
		$reasons = array(
			'1' => 'Going to competitor',
			'2' => 'Too Expensive',
			'3' => 'Lead just gone cold',
			'4' => 'Waiting for the response'
		);

		$leads = Lead::select('user_id','company_name','spoc','company_poc','company_poc_email','company_poc_mobile','client_type','industry','leadsource','city','c0_value','c1_value','c2_value','c3_value','c0_value_date','c1_value_date','c2_value_date','c3_value_date','created_at','email','bdm_value','agp_percentage_value','c3_won_value','status','reason','other_reason');

		if ($data['lead_type'] == 'open') {
			
			$leads = $leads->where(function($query) {
				$query->where(function($query1) {
					$query1->where('status', '=', 0);
				})->orWhere(function($query2){
					$query2->where('status', '=', 2);
				});
			});

		}

		if ($data['lead_type'] == 'won') {

			$leads = $leads->where(function($query) {
				$query->where(function($query1) {
					$query1->where('status', '=', 1);
				})->orWhere(function($query2){
					$query2->where('status', '=', 2);
				});
			});

		}

		if($data['lead_type'] == 'database') {
			$leads = $leads->where('status','=',5);
		}

		$file_name = 'all';

		if (isset($data['export_type']) && !empty($data['export_type']) && ($data['export_type'] == '2' || $data['export_type'] == 2)) {

			$file_name = '';
			
			if ((isset($data['start_date']) && !empty($data['start_date']) && $data['start_date'] != "") && (isset($data['end_date']) && !empty($data['end_date']) && $data['end_date'] != "")) {

				$start = Carbon::parse($data['start_date']." 00:00:00");
				$s_date = new \DateTime($start->format('Y-m-d'));
				$end_date = Carbon::parse($data['end_date']." 00:00:00");;
				$e_date = new \DateTime($end_date->format('Y-m-d'));


				$leads = $leads->where(function($query) use($s_date, $e_date) {
					$query->where(function($query1) use($s_date) {
						$query1->where('created_at', '>=', $s_date);
					})->where(function($query2) use($e_date){
						$query2->where('created_at','<=',$e_date);
					});
				});

				$file_name .= str_replace('-', '', $data['start_date']).'_'.str_replace('-', '', $data['end_date']);

			}



		}

		$file_name .= "_".$data['lead_type'];



		$leads = $leads->orderBy('created_at','desc')->get();
		$spocs = \Config::get('constants.spocs_short_name');
		$spocs_fullname = \Config::get('constants.spocs_by_short_name');

		foreach ($leads as $key => $value) {

			$value->created_date = $this->get_date($value->created_at, 'd/m/Y');

			if(isset($value->user_id) && $value->user_id !=0) {
				$value->lead_owner = User::find($value->user_id)->name;
			} else {
				$value->lead_owner = '';
			}

			if (isset($value->client_type) && !empty($value->client_type)) {
				$value->client_type_str = $value->client_type == 'new_client' ? 'New Client' : 'Existing Client';
			}

			if(isset($value->bdm_value) && $value->bdm_value != null && ($value->status == 1 || $value->status == '1')) {

				$bdm_percentage_value = round((((float) ($value->bdm_value/100)) * ((float) $value->c3_won_value)),2);
				$value->bdm_percentage_value = $bdm_percentage_value;
			
			} else {
				$value->bdm_value = 0;
				$value->bdm_percentage_value = 0;
			}

			if(isset($value->agp_percentage_value) && $value->agp_percentage_value != null && ($value->status == 1 || $value->status == '1')) {
			}else {
				$value->agp_percentage_value = 0;
			}

			if(isset($value->reason) && $value->reason != null && ($value->status == 5 || $value->status == '5')) {

				if ($value->reason == 5 || $value->reason == '5') {
					$value->reason_str = $value->other_reason;
				} else {
					$value->reason_str = $reasons[$value->reason];
				}
			
			}

			if(isset($value->c0_value_date) && $value->c0_value_date != null) {
				$value->c0_value_date_str = $this->get_date($value->c0_value_date, 'd/m/Y H:i:s');
			}

			if(isset($value->c1_value_date) && $value->c1_value_date != null) {
				$value->c1_value_date_str = $this->get_date($value->c1_value_date, 'd/m/Y H:i:s');
			}

			if(isset($value->c2_value_date) && $value->c2_value_date != null) {
				$value->c2_value_date_str = $this->get_date($value->c2_value_date, 'd/m/Y H:i:s');
			}

			if(isset($value->c3_value_date) && $value->c3_value_date != null) {
				$value->c3_value_date_str = $this->get_date($value->c3_value_date, 'd/m/Y H:i:s');
			}
			
		}


		$header_data = array('Client Name','Company POC','Company POC Email','Company POC Mobile','Lead Owner','New /Existing','Industry', 'Leadsource','City','C0 Value', 'C1 Value','C2 Value','C3 Value','Date of movement to C0','Date of movement to C1','Date of movement to C2','Date of movement to C3','Contract Won value','Gross Margin %','Primary BDM Contribution %','Primary BDM Contribution Value','Primary BDM Margin Value');

		if($data['lead_type'] == 'open' || $data['lead_type'] == 'won') {
			$header_data = array('Client Name','Company POC','Company POC Email','Company POC Mobile','Lead Owner','New /Existing','Industry', 'Leadsource', 'City','C0 Value', 'C1 Value','C2 Value','C3 Value','Date of movement to C0','Date of movement to C1','Date of movement to C2','Date of movement to C3','Contract Won value','Gross Margin %','Primary BDM Contribution %','Primary BDM Contribution Value','Primary BDM Margin Value');
		} else {
			$header_data = array('Client Name','Company POC','Company POC Email','Company POC Mobile','Lead Owner','New /Existing','Industry', 'Leadsource','City','C0 Value', 'C1 Value','C2 Value','Reason');
		}


		$export_data = array();

        $export_data[] = $header_data;

        foreach ($leads as $key => $value) {

        	if($data['lead_type'] == 'open' || $data['lead_type'] == 'won') {

	        	$export_data[] = array(
	        		$value['company_name'],
	        		$value['company_poc'],
	        		$value['company_poc_email'],
	        		$value['company_poc_mobile'],
	        		$value['lead_owner'],
	        		$value['client_type_str'],
	        		$value['industry'],
	        		$value['leadsource'],
	        		$value['city'],
	        		$value['c0_value'],
	        		$value['c1_value'],
	        		$value['c2_value'],
					$value['c3_value'],
					$value['c0_value_date_str'],
	        		$value['c1_value_date_str'],
	        		$value['c2_value_date_str'],
	        		$value['c3_value_date_str'],
	        		$value['c3_won_value'],
					$value['agp_percentage_value'],
					$value['bdm_value'],
	        		$value['bdm_percentage_value'],
	        		0
	        	);

        	} else {

        		$export_data[] = array(
	        		$value['company_name'],
	        		$value['company_poc'],
	        		$value['company_poc_email'],
	        		$value['company_poc_mobile'],
	        		$value['lead_owner'],
	        		$value['client_type_str'],
	        		$value['industry'],
	        		$value['leadsource'],
	        		$value['city'],
	        		$value['c0_value'],
	        		$value['c1_value'],
	        		$value['c2_value'],
	        		$value['reason_str']
	        	);

        	}

        }

        //return $result;

        $full_filename = 'leaddata_'.$file_name;

		\Excel::create($full_filename, function($excel) use ($export_data) {

		    $excel->sheet('Data', function($sheet) use ($export_data) {
		        $sheet->fromArray($export_data, null, 'A1', false, false);
		    });

		})->store('xls',base_path().'/public/exports/');

		$file_name_str = $full_filename.'.xls';

		return response()->json(['msg' => 'success', 'path' => url('/').'/exports/'.$file_name_str, 'filename' => $file_name_str]);

	}

	public function get_industry_lists() {

		$user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

		// $industries = array(
		// 	'Corporate Offices' => 'Corporate Offices',
		// 	'Developers' => 'Developers',
		// 	'Education' => 'Education',
		// 	'F&B, Retail, Hospitality' => 'F&B, Retail, Hospitality',
		// 	'Financial Services' => 'Financial Services',
		// 	'Industrial' => 'Industrial',
		// 	'IT' => 'IT',
		// 	'Infrastructure' => 'Infrastructure',
		// 	'Residential Society' => 'Residential Society',
		// 	'Architects & Interior Design' => 'Architects & Interior Design',
		// 	'Commercial Brokers' => 'Commercial Brokers',
		// 	'Others' => 'Others'
		// );

        $industries = array(
			'Residential – Developer' => 'Residential – Developer',
			'Residential – CHS/RWA' => 'Residential – CHS/RWA',
			'Commercial Buildings/IT Parks' => 'Commercial Buildings/IT Parks',
			'Commercial Offices & Branches' => 'Commercial Offices & Branches',
			'Industrial - Manufacturing' => 'Industrial - Manufacturing',
			'Industrial - Warehousing' => 'Industrial - Warehousing',
			'Retail & Hospitality' => 'Retail & Hospitality',
			'Education & Others' => 'Education & Others'
		);



		$response['message'] = 'Industries fetched successfully.';
		$response['error'] = false;
		$response['result'] = $industries;

		return response()->json($response,200);

	}


	public function get_leadsource_list() {

		$user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

        $leadsources = array(
			'Marketing Lead - Inbound' => 'Marketing Lead - Inbound',
			'Marketing Lead - Cold Call' => 'Marketing Lead - Cold Call',
			'Existing Client Expansion' => 'Existing Client Expansion',
			'Client Reference' => 'Client Reference',
			'Direct - Sales Team' => 'Direct - Sales Team',
			'Mgmt./Investor ref' => 'Mgmt./Investor ref'
		);



		$response['message'] = 'Leadsources fetched successfully.';
		$response['error'] = false;
		$response['result'] = $leadsources;

		return response()->json($response,200);

	}


	public function send_lead_contract_renewal_reminders() {

		$dt = Carbon::now();

		if($dt->dayOfWeek == 1) { 

			$today = $dt->format('Y-m-d');
			$current_month = $dt->format('m');


			$end_month_last_date = $dt->addMonths(2);
			$end_month_last_date = $end_month_last_date->endOfMonth();


			$result = CarbonPeriod::create($today, '1 month', $end_month_last_date->format('Y-m-d'));

			$date_periods = [];
	  
	        foreach ($result as $dt) {
	        	if($dt->format("m") == $current_month) {
		        	$date_periods[] = array(
		        		'full_month_year' => $dt->endOfMonth()->format('M Y'),
		        		'start_date' => $today,
		        		'end_date' => $dt->endOfMonth()->format('Y-m-d')
		        	);
	        	} else {
	        		$date_periods[] = array(
	        			'full_month_year' => $dt->startOfMonth()->format('M Y'),
		        		'start_date' => $dt->startOfMonth()->format('Y-m-d'),
		        		'end_date' => $dt->endOfMonth()->format('Y-m-d')
		        	);
	        	}
	            // echo $dt->format("Y-m")."<br />";
	        }


	        $response = [];

			foreach ($date_periods as $key => $date_period) {
				
				$leads = Lead::select('company_name','contract_renewal_date', 'user_id')->where(function($query) use($date_period) {
					$query->where(function($query1) use($date_period) {
						$query1->where('contract_renewal_date', '>=', $date_period['start_date']);
					})->where(function($query2) use($date_period){
						$query2->where('contract_renewal_date','<=',$date_period['end_date']);
					});
				})->where(function($query) {
					$query->where(function($query1) {
						$query1->where('status', '=', 1);
					})->orWhere(function($query2){
						$query2->where('status', '=', 2);
					});
				})->orderBy('contract_renewal_date')->get();

				$response_obj = [];
				$response_obj['full_month_year'] = $date_period['full_month_year'];

				if(count($leads) > 0) {

					foreach ($leads as $lkey => $lvalue) {
						$lvalue->lead_owner = User::find($lvalue->user_id)->name;
						$lvalue->contract_renewal_date_str = $this->get_date($lvalue->contract_renewal_date, 'jS M Y');
					}


					if(!isset($response_obj['data'])) {
						$response_obj['data'] = [];
					}

		            foreach ($leads as $lkey => $lvalue) {

		                $response_obj['data'][$lvalue->lead_owner][] = $lvalue;

		            }

		        }

		        $response[] = $response_obj;


			}


			// return json_encode($response);

			




			// $start_of_day = $dt->startOfDay();
			// $end_of_day = $dt->copy()->endOfDay();


			// $leads = Lead::where(function($query) use($start_of_day, $end_of_day) {
			// 	$query->where(function($query1) use($start_of_day) {
			// 		$query1->where('contract_renewal_date', '>=', $start_of_day);
			// 	})->where(function($query2) use($end_of_day){
			// 		$query2->where('contract_renewal_date','<=',$end_of_day);
			// 	});
			// })->get();

			// //return $leads;

			// foreach ($leads as $key => $value) {

			// 	if(isset($value->company_poc_email) && $value->company_poc_email != null && $value->company_poc_email != "" && !empty($value->company_poc_email)) {
			// 		$value->company_contact = $value->company_poc_email;
			// 	}

			// 	if(isset($value->company_poc_mobile) && $value->company_poc_mobile != null && $value->company_poc_mobile != "" && !empty($value->company_poc_mobile)) {
			// 		$value->company_contact = $value->company_poc_mobile;
			// 	}

			// 	// $email = array($value->email);
			// 	// $email = array($value->email);
				$email = array('bd@silagroup.co.in');
				$bccEmail = array('tanveer.khan@silagroup.co.in');

			// 	if($value->user_id != null) {
			// 		$user = User::find($value->user_id);
			// 		$leadowner = $user->name;
			// 	} else {
			// 		$value->abbr = '';
			// 		$leadowner = '';
			// 	}
				


			// 	\Mail::send('contract_renewal_reminder', ['leadowner' => $leadowner, 'company_name' => $value->company_name, 'company_poc' => $value->company_poc, 'company_contact' => $value->company_contact], function ($message) use ($email, $bccEmail)
		 //        {
		 //        	$message->subject("Contract Renewal Reminder - SILA CRM");
		 //            $message->from('crm@silagroup.co.in', 'SILA CRM');
		 //            $message->to($email);
		 //            $message->bcc($bccEmail);

		 //        });


			// }

			\Mail::send('contract_renewal_reminder_new', ['leads' => $response], function ($message) use ($email, $bccEmail)
	        {
	        	$message->subject("Contract Renewal Reminder - SILA CRM");
	            $message->from('crm@silagroup.co.in', 'SILA CRM');
	            $message->to($email);
	            $message->bcc($bccEmail);

	        });


			return view('contract_renewal_reminder_new',['leads' => $response]);
		} else {
			return "NOT MONDAY";
		}

		// return $leads;


	}



	public function send_lead_database_followup_reminders() {

		$dt = Carbon::now();

		if($dt->dayOfWeek == 1) { 

			$today = $dt->format('Y-m-d');
			$current_month = $dt->format('m');


        	$date_periods[] = array(
        		'full_month_year' => $dt->endOfMonth()->format('M Y'),
        		'start_date' => $today,
        		'end_date' => $dt->endOfMonth()->format('Y-m-d')
        	);
        


	        $response = [];

			foreach ($date_periods as $key => $date_period) {
				
				$leads = Lead::select('company_name','next_follow_up_date', 'user_id')->where(function($query) use($date_period) {
					$query->where(function($query1) use($date_period) {
						$query1->where('next_follow_up_date', '>=', $date_period['start_date']);
					})->where(function($query2) use($date_period){
						$query2->where('next_follow_up_date','<=',$date_period['end_date']);
					});
				})->where('status','=',5)->where('reason','=',3)->orderBy('next_follow_up_date')->get();

				$response_obj = [];
				$response_obj['full_month_year'] = $date_period['full_month_year'];

				if(count($leads) > 0) {

					foreach ($leads as $lkey => $lvalue) {
						$lvalue->lead_owner = User::find($lvalue->user_id)->name;
						$lvalue->next_follow_up_date_str = $this->get_date($lvalue->next_follow_up_date, 'jS M Y');
					}


					if(!isset($response_obj['data'])) {
						$response_obj['data'] = [];
					}

		            foreach ($leads as $lkey => $lvalue) {

		                $response_obj['data'][$lvalue->lead_owner][] = $lvalue;

		            }

		        }

		        $response[] = $response_obj;


			}

			$email = array('bd@silagroup.co.in');
			$bccEmail = array('tanveer.khan@silagroup.co.in');




			\Mail::send('lead_database_followup_reminder', ['leads' => $response], function ($message) use ($email, $bccEmail)
	        {
	        	$message->subject("Lead Database Followup Reminder - SILA CRM");
	            $message->from('crm@silagroup.co.in', 'SILA CRM');
	            $message->to($email);
	            $message->bcc($bccEmail);

	        });

			return view('lead_database_followup_reminder',['leads' => $response]);

		} else {
			return "NOT MONDAY";
		}
		



	}

    
}