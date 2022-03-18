<?php

namespace App\Http\Controllers;

use App\Lead;
use App\User;
use App\SiteActivated;

use Validator;
use Illuminate\Http\Request;
use JWTAuth;
use Illuminate\Support\Facades\Auth;

use Carbon\Carbon;

class DashboardController extends Controller
{
    
    
    public function get_sales_funnel_data(Request $req)
    {

		$user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
		}
		
        
        $data = $req->all();

        $report_data = $this->calculate_sales_funnel_data(['status' => 'open']);
        

		$response['message'] = 'Lead fetched successfully.';
		$response['error'] = false;
		$response['report_data'] = array(
            ['name' => 'PRELIMINARY CONTACT', 'label' => 'C0','y' => round($report_data['total_c0_sum'],1)],
            ['name' => 'POTENTIAL CLIENT', 'label' => 'C1', 'y' => round($report_data['total_c1_sum'],1)],
            ['name' => 'WARM CLIENT (NEGOTIATION STAGE)', 'label' => 'C2', 'y' => round($report_data['total_c2_sum'],1)],
            ['name' => 'CONTRACT CLOSURE', 'label' => 'C3', 'y' =>  round($report_data['total_c3_sum'],1)]
        );

        return response()->json($response,200);
    }

    public function calculate_sales_funnel_data($data) {

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
        
        $leads = Lead::select('id','user_id','company_name','company_poc','division','spoc','relevant','leadsource','industry','sales_stage','deal_size','deal_size_annual','probability','weighted','remarks','created_at','reminder','status','city','reason','other_reason','company_poc_email','company_poc_mobile','target_date','email','cost_schedule','contract_start_date','gross_profit','c0_value','c1_value','c2_value','c3_value','client_type','important','percentage_bdm','c3_percentage_won_value','c3_won_value','bdm_value','contract_renewal_date','contract_renew_date','won_month','agp_bdm_percentage_value','agp_percentage_value','service_start_date','work_order_date','c2_probability_perc');

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

		if(!empty($data['client_type']) && $data['client_type'] != "" && $data['client_type'] != null) {
			$leads = $leads->where('client_type','=',$data['client_type']);
		}

		if(!empty($data['email']) && $data['email'] != "" && $data['email'] != null) {
			$leads = $leads->where('email','=',$data['email']);
		}

		if(!empty($data['won_month']) && $data['won_month'] != "" && $data['won_month'] != null) {
			$leads = $leads->where('won_month','=', (int) $data['won_month']);
		}

		if(!empty($data['city']) && $data['city'] != "" && $data['city'] != null) {
			$leads = $leads->where('city','like','%'.$data['city'].'%');
		}

		if(!empty($data['industry']) && $data['industry'] != "" && $data['industry'] != null) {
			$leads = $leads->where('industry','like','%'.$data['industry'].'%');
        }
        
        if(!empty($data['keyword']) && $data['keyword'] != "" && $data['keyword'] != null) {
			$leads = $leads->where('company_name','like','%'.$data['keyword'].'%');
        }


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

        // $bdm_percentage_value = 0;
		// $bdm_percentage_value_total = 0;
		// $agp_value_total = 0;
		// $agp_bdm_value_total = 0;
		$total_contract_value = 0;
		// $total_c2_probability_value = 0;


		foreach ($leads as $key => $value) {

		// 	$value->sr_no = ($leads->currentpage()-1) * $leads->perpage() + $key + 1;


		// 	$value->created_date = $this->get_date($value->created_at, 'd/m/Y');
			
		// 	if($value->user_id != null) {
		// 		$value->abbr = $this->get_abbr(User::find($value->user_id));
		// 	} else {
		// 		$value->abbr = '';
		// 	}

		// 	if($value->reason != null && $value->reason == 4) {
		// 		$value->reason_name = $value->other_reason;
		// 	} else {
		// 		$value->reason_name = '';
		// 	}


		// 	if($value->reminder != null) {
        //         $value->reminder_date = $this->get_date($value->reminder, 'd/m/Y');
		// 	}

		// 	if($value->contract_renewal_date != null) {
        //         $value->contract_renewal_str = $this->get_date($value->contract_renewal_date, 'd/m/Y');
		// 	}

		// 	if($value->service_start_date != null) {
        //         $value->service_start_date_str = $this->get_date($value->service_start_date, 'd/m/Y');
		// 	}

		// 	if($value->work_order_date != null) {
        //         $value->work_order_date_str = $this->get_date($value->work_order_date, 'd/m/Y');
		// 	} else {
		// 		$value->work_order_date_str = '';
		// 	}

		// 	if($value->target_date != null) {
        //         $value->target_date = $this->get_date($value->target_date, 'Y-m-d');
		// 	}

		// 	if($value->contract_start_date != null) {
        //         $value->contract_start_date_str = $this->get_date($value->contract_start_date, 'Y-m-d');
		// 	}

		// 	if($value->bdm_value != null && ($value->status == 1 || $value->status == '1')) {

		// 		$bdm_percentage_value = round((((float) ($value->bdm_value/100)) * ((float) $value->c3_won_value)),2);
		// 		$bdm_percentage_value_total = $bdm_percentage_value_total + $bdm_percentage_value;
		// 		$value->bdm_percentage_value = $bdm_percentage_value;

		// 	}

		// 	if($value->agp_percentage_value != null && ($value->status == 1 || $value->status == '1')) {

		// 		$agp_value = round((((float) ($value->agp_percentage_value/100)) * ((float) $value->c3_won_value)),2);
		// 		$value->agp_value = round($agp_value,1);
		// 		$agp_value_total = $agp_value_total + $agp_value;

		// 		$agp_bdm_value = round((((float) ($value->agp_percentage_value/100)) * ((float) $bdm_percentage_value)),2);
		// 		$value->agp_bdm_value = $agp_bdm_value;

		// 		$agp_bdm_value_total = $agp_bdm_value_total + $agp_bdm_value;

		// 	}

		// 	if($value->won_month != null && ($value->status == 1 || $value->status == '1')) {
		// 		$value->won_month_str = $months[$value->won_month];
		// 	}

			if (($value->status == 1 || $value->status == '1') || ($value->status == 2 || $value->status == '2')) {
				$total_contract_value = (float) $total_contract_value + (float) $value->c3_won_value;
			}

		// 	if(isset($value->c3_won_value)) {
		// 		$value->c3_won_value = round($value->c3_won_value,1);
		// 	}

		// 	if(( ($value->company_poc_email != null && $value->company_poc_email != "" && $value->company_poc_email != "null") || ($value->company_poc_mobile != null && $value->company_poc_mobile != "" && $value->company_poc_mobile != "null") ) && ($value->industry != null && $value->industry != "" && $value->industry != "null") && ($value->city != null && $value->city != "" && $value->city != "null") && ($value->leadsource != null && $value->leadsource != "" && $value->leadsource != "null")) {
		// 		$is_complete = 1;
		// 	} else {
		// 		$is_complete = 0;
		// 	}

		// 	if((isset($value->service_start_date) && !empty($value->service_start_date) && $value->service_start_date != null) && (isset($value->work_order_date) && !empty($value->work_order_date) && $value->work_order_date != null)) {
		// 		$is_won_complete = 1;
		// 	} else {
		// 		$is_won_complete = 0;
		// 	}

		// 	if (isset($value->c2_value) && isset($value->c2_probability_perc)) {
		// 		$value->c2_probability_value = round ((float) $value->c2_value * (((float) $value->c2_probability_perc)/100),1);
		// 		$total_c2_probability_value = $total_c2_probability_value + $value->c2_probability_value;
		// 	} else {
		// 		$value->c2_probability_value = 0;
		// 	}

		// 	if(isset($value->c0_value)) {
		// 		$value->c0_value = round($value->c0_value,1);
		// 	}

		// 	if(isset($value->c1_value)) {
		// 		$value->c1_value =  round($value->c1_value,1);
		// 	}

		// 	if(isset($value->c2_value)) {
		// 		$value->c2_value = round($value->c2_value,1);
		// 	}

		// 	if(isset($value->c3_value)) {
		// 		$value->c3_value =  round($value->c3_value,1);
		// 	}

			
		// 	$value->is_complete = $is_complete;
		// 	$value->is_won_complete = $is_won_complete;
		// 	$value->company_name_new = substr($value->company_name, 0,15);

		// 	$value->is_site_activated = SiteActivated::where('lead_id','=',$value->id)->count() > 0 ? 1 : 0;	

		}

        if($data['status'] == 'open') {
            return ['total_c0_sum' => $total_c0_sum, 'total_c1_sum' => $total_c1_sum, 'total_c2_sum' => $total_c2_sum, 'total_c3_sum' => $total_c3_sum ];
        } else {
            return $total_contract_value;
        }

    }

    public function get_industry_report_data() {

        $leads = Lead::selectRaw('industry, sum(c3_won_value) as won_value')
                    ->where(function($query) {
                        $query->where(function($query1) {
                            $query1->where('status', '=', 1);
                        })->orWhere(function($query2){
                            $query2->where('status', '=', 2);
                        });
                    })->groupBy('industry')
                    ->orderBy('won_value','desc')
                    ->get();

        // $leads = Lead::select('industry')->where(function($query) {
        //     $query->where(function($query1) {
        //         $query1->where('status', '=', 1);
        //     })->orWhere(function($query2){
        //         $query2->where('status', '=', 2);
        //     });
        // })->orderBy('industry','asc')->distinct()->get();

        $industries = [];

        $industry_data = [];

        foreach ($leads as $key => $value) {

            if($value->won_value != 0) {
                $industries[] = $value->industry;
                $industry_data[] = floatval($value->won_value);
            }

        }

        $report_data['industries'] = $industries;
        $report_data['industry_data'] = $industry_data;

        return response()->json($report_data);

    }

    public function get_total_leads_by_source() {

        $leads = Lead::selectRaw('leadsource, sum(c3_won_value) as won_value')
                    ->where(function($query) {
                        $query->where(function($query1) {
                            $query1->where('status', '=', 1);
                        })->orWhere(function($query2){
                            $query2->where('status', '=', 2);
                        });
                    })->groupBy('leadsource')
                    ->get();
                    
        $report_data = [];
        foreach ($leads as $key => $value) {
            $report_data[] = [ 'name' => $value->leadsource == NULL ? 'NA' : $value->leadsource, 'y' => floatval($value->won_value) ];
        }

        return response()->json($report_data);

    }

    public function get_cvalue_data($cvalue) {

        if($cvalue == 'C0') {
            $field = 'c0';
            $select = "user_id, SUM(c0_value) as c_value_sum";
        }

        if($cvalue == 'C1') {
            $field = 'c1';
            $select = "user_id, SUM(c1_value) as c_value_sum";
        }

        if($cvalue == 'C2') {
            $field = 'c2';
            $select = "user_id, SUM(c2_value) as c_value_sum";
        }

        if($cvalue == 'C3') {
            $field = 'c3';
            $select = "user_id, SUM(c3_value) as c_value_sum";
        }

        $leads = Lead::selectRaw($select)->where(function($query) {
            $query->where(function($query1) {
                $query1->where('status', '=', 0);
            })->orWhere(function($query2){
                $query2->where('status', '=', 2);
            });
        })->where('user_id','<>',0)->whereIn('user_id',[3,4,6,11,12,13,28,33,37,39,40])->groupBy('user_id')
        ->orderBy('user_id','asc')
        ->get();

        $data = [];

        foreach ($leads as $key => $value) {
            $data[] = floatval($value->c_value_sum);
        }

        $response = ['name' => $cvalue, 'data' =>  $data];

        return $response;

    }


	public function get_contracts_won_data($post_data) {

		$user_ids = [3,4,6,11,12,13,28,33,37,39,40];
		$data = [];

		if(isset($post_data['from_date']) && isset($post_data['to_date'])) {
			$post_data['from_date'] = $this->format_date($post_data['from_date']);
			$post_data['to_date'] = $this->format_date($post_data['to_date']);
		} else {
			$post_data['from_date'] = date('Y-m-d', strtotime('first day of -2 month'));
			$post_data['to_date'] = date('Y-m-d'); 
		}

		for ($i=0; $i < count($user_ids); $i++) { 

        	$leads = Lead::selectRaw("user_id, sum(c3_won_value) as won_value")
				->where(function($query) {
					$query->where(function($query1) {
						$query1->where('status', '=', 1);
					})->orWhere(function($query2){
						$query2->where('status', '=', 2);
					});
				})
				->where('user_id','<>',0)
				->where("leads.user_id","=",$user_ids[$i])
				->groupBy('user_id')
				->orderBy('user_id','asc');

			if(isset($post_data['financial_year'])) {
				$financial_year = explode("-", $post_data['financial_year']);
				$leads = $leads->where(function($query) use($financial_year) {
					$query->whereYear('created_at', '>=',$financial_year[0])->whereYear('created_at','<=',$financial_year[1]);
				});
			}
		
			if(isset($post_data['from_date']) && isset($post_data['to_date'])) {
				$leads = $leads->where(function($query) use($post_data) {
					$query->whereDate('created_at', '>=',$post_data['from_date'])->whereDate('created_at','<=',$post_data['to_date']);
				});
			}

			if(isset($post_data['month'])) {
				$leads = $leads->whereMonth('created_at', '=',$post_data['month']);
			}

			$leads = $leads->get();

			if(count($leads) > 0) {
				$value = $leads[0];
				$data[] = floatval($value->won_value);
			} else {
				$data[] = 0.0;
			}
		}

        $response = ['name' => 'Contracts Won', 'data' =>  $data];

        return $response;

    }


	public function get_sites_activated_data($post_data) {

		$user_ids = [3,4,6,11,12,13,28,33,37,39,40];
		$data = [];

		if(isset($post_data['from_date']) && isset($post_data['to_date'])) {
			$post_data['from_date'] = $this->format_date($post_data['from_date']);
			$post_data['to_date'] = $this->format_date($post_data['to_date']);
		}  else {
			$post_data['from_date'] = date('Y-m-d', strtotime('first day of -2 month'));
			$post_data['to_date'] = date('Y-m-d'); 
		}

		for ($i=0; $i < count($user_ids); $i++) { 
			
			$leads = Lead::selectRaw("sum(leads.c3_won_value) as won_value ")
						->join('sites_activated', 'sites_activated.lead_id', '=', 'leads.id')
						->where(function($query) {
							$query->where(function($query1) {
								$query1->where('leads.status', '=', 1);
							})->orWhere(function($query2){
								$query2->where('leads.status', '=', 2);
							});
						})
						->where("leads.user_id","=",$user_ids[$i]);
			

			if(isset($post_data['financial_year'])) {
				$financial_year = explode("-", $post_data['financial_year']);
				$leads = $leads->whereYear('sites_activated.created_at', '>=',$financial_year[0])->whereYear('sites_activated.created_at','<=',$financial_year[1]);
			}

			if(isset($post_data['from_date']) && isset($post_data['to_date'])) {
				$leads = $leads->whereDate('sites_activated.created_at', '>=',$post_data['from_date'])->whereDate('sites_activated.created_at','<=',$post_data['to_date']);
			}

			if(isset($post_data['month'])) {
				$leads = $leads->whereMonth('sites_activated.created_at', '=',$post_data['month']);
			}

			$leads = $leads->get();

			
			if(count($leads) > 0) {
				$value = $leads[0];
				$data[] = floatval($value->won_value);
			} else {
				$data[] = 0.0;
			}
		}

        $response = ['name' => 'Sites Activated', 'data' =>  $data];

        return $response;

    }

    public function get_leadowner_report_data() {

        $leads = Lead::select('user_id')->where(function($query) {
            $query->where(function($query1) {
                $query1->where('status', '=', 0);
            })->orWhere(function($query2){
                $query2->where('status', '=', 2);
            });
        })->where('user_id','<>',0)->whereIn('user_id',[3,4,6,11,12,13,28,33,37,39,40])
        ->orderBy('user_id','asc')
        ->distinct()->get();

        $leadowners = [];

        foreach ($leads as $key => $value) {
                $leadowners[] = User::find($value->user_id)->name;
        }

        $c0_report_data = $this->get_cvalue_data('C0');
        $c1_report_data = $this->get_cvalue_data('C1');
        $c2_report_data = $this->get_cvalue_data('C2');
        $c3_report_data = $this->get_cvalue_data('C3');



        $report_data['leadowners'] = $leadowners;
        $report_data['leadowner_data'] = [$c0_report_data, $c1_report_data, $c2_report_data, $c3_report_data];

        return response()->json($report_data);

    }

	public function site_started_report_data($post_data) {

		if(isset($post_data['from_date']) && isset($post_data['to_date'])) {
			$post_data['from_date'] = $this->format_date($post_data['from_date']);
			$post_data['to_date'] = $this->format_date($post_data['to_date']);
		}  else {
			$post_data['from_date'] = date('Y-m-d', strtotime('first day of -2 month'));
			$post_data['to_date'] = date('Y-m-d'); 
		}


        $leads = Lead::selectRaw("sum(c3_won_value) as won_value")->where(function($query) {
            $query->where(function($query1) {
                $query1->where('status', '=', 1);
            })->orWhere(function($query2){
                $query2->where('status', '=', 2);
            });
        })->where('user_id','<>',0)->whereIn('user_id',[3,4,6,11,12,13,28,33,37,39,40])->groupBy('user_id')
        ->orderBy('user_id','asc');

		if(isset($post_data['financial_year'])) {
			$financial_year = explode("-", $post_data['financial_year']);
			$leads = $leads->whereYear('service_start_date', '>=',$financial_year[0])->whereYear('service_start_date','<=',$financial_year[1]);
		}

		if(isset($post_data['from_date']) && isset($post_data['to_date'])) {
			$leads = $leads->whereDate('service_start_date', '>=',$post_data['from_date'])->whereDate('service_start_date','<=',$post_data['to_date']);
		}

		if(isset($post_data['month'])) {
			$leads = $leads->whereMonth('service_start_date', '=',$post_data['month']);
		}

        $leads = $leads->get();

        $data = [];

        foreach ($leads as $key => $value) {
            $data[] = floatval($value->won_value);
        }

        $response = ['name' => 'Site Started', 'data' =>  $data];

        return $response;

    }


	public function get_leadowner_sitestarted_report_data(Request $req) {

		$data = $req->all();

        $leads = Lead::select('user_id')->where(function($query) {
            $query->where(function($query1) {
                $query1->where('status', '=', 0);
            })->orWhere(function($query2){
                $query2->where('status', '=', 2);
            });
        })->where('user_id','<>',0)->whereIn('user_id',[3,4,6,11,12,13,28,33,37,39,40])
        ->orderBy('user_id','asc')
        ->distinct()->get();

        $leadowners = [];

        foreach ($leads as $key => $value) {
                $leadowners[] = User::find($value->user_id)->name;
        }

        $site_started_report_data = $this->site_started_report_data($data);



        $report_data['leadowners'] = $leadowners;
        $report_data['leadowner_data'] = [$site_started_report_data];

        return response()->json($report_data);

    }



	public function get_contracts_won_and_site_started_report_data(Request $req) {

		$data = $req->all();

		$user_ids = [3,4,6,11,12,13,28,33,37,39,40];
		$leadowners = [];

		for ($i=0; $i < count($user_ids); $i++) { 
			$leadowners[] = User::find($user_ids[$i])->name;
		}

        $contracts_won_data = $this->get_contracts_won_data($data);
        $sites_started_data = $this->get_sites_activated_data($data);



        $report_data['leadowners'] = $leadowners;
        $report_data['leadowner_data'] = [$contracts_won_data, $sites_started_data];

        return response()->json($report_data);

    }

	public function format_date($value) {
        $date = explode("-", $value);
        return $date[2]."-".$date[1]."-".$date[0];
    }

    public function get_date($value, $format) {

        $date = new \DateTime($value, new \DateTimeZone("UTC"));
        $date->setTimezone(new \DateTimeZone('Asia/Calcutta'));

        return $date->format($format);

	}

}
