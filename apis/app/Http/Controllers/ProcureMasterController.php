<?php

namespace App\Http\Controllers;

use App\ProcureMaster;
use App\ProcureItems;
use App\ProcureItemsFM;
use App\ProcureBilling;
use App\ItemMaster;
use App\Company;
use App\User;
use App\Site;
use App\Item;
use App\ItemType;
use Illuminate\Http\Request;
use JWTAuth;
use Excel;
use Input;
use TCPDF;
use PHPExcel; 
use PHPExcel_IOFactory;
use PHPExcel_Style_Border;
use PHPExcel_Helper_HTML;
use PHPExcel_Shared_Font;
use PHPExcel_Worksheet_Drawing;
use PHPExcel_Cell;
use PHPExcel_Style_Fill;
use Image;

class ProcureMasterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $user = JWTAuth::parseToken()->authenticate();
        $data = $request->all();
        

        $requisitions = ProcureMaster::leftJoin('sites', function($join) {
            $join->on('procure_master.site_id', '=', 'sites.id');
        })->select(
            'procure_master.id',
            'procure_master.parent_id',
            'procure_master.order_id',
            'procure_master.order_no',
            'procure_master.req_no',
            'procure_master.user_id',
            'procure_master.approved_by',
            'procure_master.zone_id',
            'procure_master.month',
            'procure_master.year',
            'procure_master.site_id',
            'procure_master.is_chargeable',
            'procure_master.selected_vendor',
            'procure_master.status',
            'procure_master.order_processed_date',
            'procure_master.delivered_date',
            'procure_master.confirmed_date',
            'sites.name',
            'sites.billing_type',
            'sites.budgeted_amount'
        );

        if (isset($data['financial_year']) && !empty($data['financial_year'])) {
            $split_financial_year = explode("-", $data['financial_year']);
            $start_financial_year = $split_financial_year[0];
            $end_financial_year = $split_financial_year[1];
            $requisitions = $requisitions->where('year','>=',$start_financial_year)->where('year','<=',$end_financial_year);
        }

        if (isset($data['month']) && !empty($data['month'])) {
            $requisitions = $requisitions->where('month','=',$data['month']);
        }

        if (isset($data['site']) && !empty($data['site'])) {
            $requisitions = $requisitions->where('name','like','%'.$data['site'].'%');
        }

        if (isset($data['status']) && !empty($data['status'])) {
            $requisitions = $requisitions->where('procure_master.status','=',(int) $data['status']);
        }

        if(isset($data['status']) && $data['status'] == '0') {
            $requisitions = $requisitions->where('procure_master.status','=',0);
        }

        if (isset($data['chargeable']) && !empty($data['chargeable'])) {
            $requisitions = $requisitions->where('is_chargeable','=',(int) $data['chargeable']);
        }

        if(isset($data['chargeable']) && $data['chargeable'] == '0') {
            $requisitions = $requisitions->where('is_chargeable','=',0);
        }

        

        if ($user->user_type == 'A' || $user->user_type == 'S') {
            $requisitions = $requisitions->paginate(50);
        } else {
            $requisitions = $requisitions->where('user_id','=',$user->id)->paginate(50);
        }


        
        $months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Nov','Dec'];

        foreach ($requisitions as $key => $value) {
            
            $user = User::find($value->user_id);
            if(isset($user) && !empty($user)) {
                $value->submitted_user = $user->name;
            } else {
                $value->submitted_user = '';
            }
            

            $site = Site::find($value->site_id);
            if(isset($site) && !empty($site)) {
                $value->site_name = $site->name;
            } else {
                $value->site_name = '';
            }

            $value->month_str = $months[$value->month];

            $proc_items = ProcureItems::where('procure_master_id','=',$value->id)->where('status','=',0)->get();
            $value->proc_items = count($proc_items);
            $has_any_proccesed_order = ProcureMaster::where('parent_id','=',$value->id)->get();

            if ($user->user_type == 'A' || $user->user_type == 'S') {
                $value->has_any_proccesed_order = 0;
            } else {
                $value->has_any_proccesed_order = count($has_any_proccesed_order);
            }

            $value->is_chargeable = (int) $value->is_chargeable;
            $value->month = (int) $value->month;
            $value->order_no = (int) $value->order_no;
            $value->parent_id = (int) $value->parent_id;
            $value->selected_vendor = (int) $value->selected_vendor;
            $value->site_id = (int) $value->site_id;
            $value->status = (int) $value->status;
            $value->zone_id = (int) $value->zone_id;
            $value->user_id = (int) $value->user_id;

        }

        return response()->json($requisitions,200);
    }



    public function get_requisition_export_report(Request $request)
    {
        //
        $user = JWTAuth::parseToken()->authenticate();
        $data = $request->all();
        

        $requisitions = ProcureMaster::leftJoin('sites', function($join) {
            $join->on('procure_master.site_id', '=', 'sites.id');
        })->select(
            'procure_master.id',
            'procure_master.parent_id',
            'procure_master.order_id',
            'procure_master.order_no',
            'procure_master.req_no',
            'procure_master.user_id',
            'procure_master.approved_by',
            'procure_master.zone_id',
            'procure_master.month',
            'procure_master.year',
            'procure_master.site_id',
            'procure_master.is_chargeable',
            'procure_master.selected_vendor',
            'procure_master.status',
            'procure_master.order_processed_date',
            'procure_master.delivered_date',
            'procure_master.confirmed_date',
            'sites.name',
            'sites.billing_type',
            'sites.budgeted_amount'
        );

        if (isset($data['financial_year']) && !empty($data['financial_year'])) {
            $split_financial_year = explode("-", $data['financial_year']);
            $start_financial_year = $split_financial_year[0];
            $end_financial_year = $split_financial_year[1];
            $requisitions = $requisitions->where('year','>=',$start_financial_year)->where('year','<=',$end_financial_year);
        }

        if (isset($data['month']) && !empty($data['month'])) {
            $requisitions = $requisitions->where('month','=',$data['month']);
        }

        if (isset($data['site']) && !empty($data['site'])) {
            $requisitions = $requisitions->where('name','like','%'.$data['site'].'%');
        }

        if (isset($data['status']) && !empty($data['status'])) {
            $requisitions = $requisitions->where('procure_master.status','=',(int) $data['status']);
        }

        if(isset($data['status']) && $data['status'] == '0') {
            $requisitions = $requisitions->where('procure_master.status','=',0);
        }

        if (isset($data['chargeable']) && !empty($data['chargeable'])) {
            $requisitions = $requisitions->where('is_chargeable','=',(int) $data['chargeable']);
        }

        if(isset($data['chargeable']) && $data['chargeable'] == '0') {
            $requisitions = $requisitions->where('is_chargeable','=',0);
        }

        

        // if ($user->user_type == 'A' || $user->user_type == 'S') {
        $requisitions = $requisitions->get();
        // } else {
        //     $requisitions = $requisitions->where('user_id','=',$user->id)->paginate(50);
        // }


        
        $months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Nov','Dec'];
        $statuses = array(
            '0' => 'Pending',
            '1' => 'Processed',
            '2' => 'Delivered',
            '3' => 'Confirmed'
        );

        foreach ($requisitions as $key => $value) {
            
            // $user = User::find($value->user_id);
            // if(isset($user) && !empty($user)) {
            //     $value->submitted_user = $user->name;
            // } else {
            //     $value->submitted_user = '';
            // }
            

            $site = Site::find($value->site_id);
            if(isset($site) && !empty($site)) {
                $value->site_name = $site->name;
            } else {
                $value->site_name = '';
            }

            $value->month_str = $months[$value->month];

            if ($value->status == 3 || $value->status == '3') {
                $total_price = ProcureBilling::where('procure_master_id','=',$value->id)->get()->sum("total");
            } else {
                $total_price = ProcureItems::where('procure_master_id','=',$value->id)->get()->sum("vendor_total");
            }

            $value->total_price = $total_price;
            $value->status_label = $statuses[$value->status];

            // $proc_items = ProcureItems::where('procure_master_id','=',$value->id)->where('status','=',0)->get();
            // $value->proc_items = count($proc_items);
            // $has_any_proccesed_order = ProcureMaster::where('parent_id','=',$value->id)->get();

            // if ($user->user_type == 'A' || $user->user_type == 'S') {
            //     $value->has_any_proccesed_order = 0;
            // } else {
            //     $value->has_any_proccesed_order = count($has_any_proccesed_order);
            // }

            $value->is_chargeable = (int) $value->is_chargeable;
            // $value->month = (int) $value->month;
            // $value->order_no = (int) $value->order_no;
            // $value->parent_id = (int) $value->parent_id;
            // $value->selected_vendor = (int) $value->selected_vendor;
            // $value->site_id = (int) $value->site_id;
            // $value->status = (int) $value->status;
            // $value->zone_id = (int) $value->zone_id;
            // $value->user_id = (int) $value->user_id;

        }

        $ext = 'xls';
        $filename = "requisition_report_".time();
        $filepath = public_path()."/uploads/excel";
        $path = $this->export_to_excel($requisitions, $filepath, $filename);

        return response()->json(['path' => $path, 'filename' => $filename.'.'.$ext]);
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


    public function draft_requisition(Request $request) {

        $data = $request->all();
        $user = JWTAuth::parseToken()->authenticate();

        if(array_key_exists('procure_master_id', $data) && isset($data['procure_master_id']) && !empty($data['procure_master_id']) && $data['procure_master_id'] != "") {

            $proc_master = ProcureMaster::find($data['procure_master_id']);
            //$proc_calc->user_id = $user->id;
            $proc_master->site_id = $data['site_id'];
            // $proc_master->month = $data['month'];
            $proc_master->year = date('Y');
            $proc_master->is_chargeable = $data['is_chargeable'];
            $proc_master->selected_vendor = (isset($data['selected_vendor']) && array_key_exists('selected_vendor', $data)) ? $data['selected_vendor'] : 0;

        } else {

            $proc_master = new ProcureMaster;
            $proc_master->user_id = $user->id;
            $proc_master->zone_id = $user->zone_id;
            $proc_master->site_id = $data['site_id'];
            $proc_master->month = $data['month'];
            $proc_master->year = date('Y');
            $proc_master->req_no = '';
            $proc_master->order_no = 0;
            $proc_master->order_id = '';
            $proc_master->is_chargeable = $data['is_chargeable'];
            $proc_master->selected_vendor = (isset($data['selected_vendor']) && array_key_exists('selected_vendor', $data)) ? $data['selected_vendor'] : 0;
            $proc_master->status = $data['status'];


        }

        $items = json_decode($data['items']);
        $deleted_items = array();
        if (array_key_exists('deleted_items', $data) && isset($data['deleted_items'])) {
            $deleted_items = json_decode($data['deleted_items']);
        }

        if($proc_master->save()) {

            if (count($items) > 0) {
            
                foreach ($items as $key => $value) {
                        
                    if(property_exists($value, 'proc_item_id') && isset($value->proc_item_id) && !empty($value->proc_item_id) && $value->proc_item_id != "") {

                        $procure_item = ProcureItems::find($value->proc_item_id);

                        $procure_item->procure_master_id = $proc_master->id;
                        $procure_item->item_id = $value->item_id;
                        $procure_item->description = $value->description;
                        $procure_item->quantity = $value->quantity;
                        $procure_item->vendor_total = $value->vendor_total;
                        $procure_item->vendor_rate = $value->vendor_rate;
                        $vendor_id_arr = explode('|', $value->vendor_id);
                        $procure_item->vendor_id = $vendor_id_arr[0];

                        $procure_item->update();


                    } else {

                        $procure_item = new ProcureItems;
                        $procure_item->procure_master_id = $proc_master->id;
                        $procure_item->item_id = $value->item_id;
                        $procure_item->description = $value->description;
                        $procure_item->quantity = $value->quantity;
                        $procure_item->vendor_total = $value->vendor_total;
                        $procure_item->vendor_rate = $value->vendor_rate;
                        $vendor_id_arr = explode('|', $value->vendor_id);
                        $procure_item->vendor_id = $vendor_id_arr[0];

                        $procure_item->save();

                    }


                }  


            }

            

            if (count($deleted_items) > 0) {
                
                foreach ($deleted_items as $key => $value) {

                    if(property_exists($value, 'proc_item_id') && isset($value->proc_item_id) && !empty($value->proc_item_id) && $value->proc_item_id != "") {

                        $procure_item = ProcureItems::find($value->proc_item_id);
                        $procure_item->delete();

                    }

                }


            }

        }



    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function submit_request(Request $request)
    {
        //
        $data = $request->all();
        $proc_master = ProcureMaster::find($data['procure_master_id']);

        $user = JWTAuth::parseToken()->authenticate();
        $is_new_requisition = 0;

        $items = json_decode($data['items']);
        $vendor_items = array();

        foreach ($items as $key => $value) {

            $vendor_id_arr = explode('|', $value->vendor_id);
            $vendor_id = (int) $vendor_id_arr[0];
            $vendor_items[$vendor_id][] = $value;

        }



        if (is_object($proc_master) && $proc_master->status == 3) {

            foreach ($items as $key => $value) {

                $procure_billing_db = ProcureBilling::where('procure_master_id','=',$proc_master->id)->where('item_id','=',$value->item_id)->first();

                if (isset($procure_billing_db) && !empty($procure_billing_db)) {
                        
                    $procure_billing = ProcureBilling::find($procure_billing_db->id);
                    $procure_billing->procure_master_id = $proc_master->id;
                    $procure_billing->item_id = $value->item_id;
                    $procure_billing->description = $value->description;
                    $procure_billing->quantity = $value->quantity;
                    $procure_billing->total = $value->vendor_total;
                    $procure_billing->rate = $value->vendor_rate;

                    $procure_billing->save();

                }

            }


        } else {

            if(array_key_exists('procure_master_id', $data) && isset($data['procure_master_id']) && !empty($data['procure_master_id']) && $data['procure_master_id'] != "") {

                $proc_master = ProcureMaster::find($data['procure_master_id']);
                //$proc_calc->user_id = $user->id;
                $proc_master->site_id = $data['site_id'];
                // $proc_master->month = $data['month'];
                $proc_master->year = date('Y');
                $proc_master->is_chargeable = $data['is_chargeable'];
                $proc_master->selected_vendor = (isset($data['selected_vendor']) && array_key_exists('selected_vendor', $data)) ? $data['selected_vendor'] : 0;

                $is_new_requisition = 0;


            } else {

                $proc_master = new ProcureMaster;
                $proc_master->user_id = $user->id;
                $proc_master->zone_id = $user->zone_id;
                $proc_master->site_id = $data['site_id'];
                $proc_master->month = $data['month'];
                $proc_master->year = date('Y');
                $proc_master->req_no = '';
                $proc_master->order_no = 0;
                $proc_master->order_id = '';
                $proc_master->is_chargeable = $data['is_chargeable'];
                $proc_master->selected_vendor = (isset($data['selected_vendor']) && array_key_exists('selected_vendor', $data)) ? $data['selected_vendor'] : 0;


                $is_new_requisition = 1;


            }

            

            if($proc_master->save()) {

                if ($user->user_type == 'A' && (isset($proc_master->req_no) && !empty($proc_master->req_no))) {

                    // $proc_master_order = ProcureMaster::orderBy('order_no','desc')->first();
                    // if (!empty($proc_master_order)) {
                    //     $order_no = $proc_master_order->order_no + 1;
                    // } else {
                    //     $order_no = 1;
                    // }


                    // $order_id = 'O'.date('Y').'/'.str_pad(($data['month']+1),2,"0",STR_PAD_LEFT).'/'.str_pad($data['site_id'],2,"0",STR_PAD_LEFT).'/'.str_pad($order_no,3,"0",STR_PAD_LEFT);

                    // $proc_master = ProcureMaster::find($proc_master->id);
                    // if (isset($proc_master->order_id) && !empty($proc_master->order_id) && $proc_master->order_id != "") {

                    //     if ($proc_master->status == 2) {

                    //         $proc_master->status = 3;
                    //         $proc_master->confirmed_date = date('Y-m-d');
                    //         $proc_master->update();

                    //     }

                    // } else {

                    //     $proc_master->order_no = $order_no;
                    //     $proc_master->order_id = $order_id;
                    //     $proc_master->status = 1;
                    //     $proc_master->approved_by = $user->id;
                    //     $proc_master->order_processed_date = date('Y-m-d');
                    //     $proc_master->update();

                    // }

                } else {

                    $req_no = 'R'.date('Y').'/'.str_pad(($data['month']+1),2,"0",STR_PAD_LEFT).'/'.str_pad($data['site_id'],2,"0",STR_PAD_LEFT).'/'.str_pad($proc_master->id,3,"0",STR_PAD_LEFT);

                    $proc_master = ProcureMaster::find($proc_master->id);
                    $proc_master->req_no = $req_no;
                    $proc_master->update();

                }



                if ($is_new_requisition == 1) {

                    $items = json_decode($data['items']);
                    $deleted_items = array();
                    if (array_key_exists('deleted_items', $data) && isset($data['deleted_items'])) {
                        $deleted_items = json_decode($data['deleted_items']);
                    }

                    if ($proc_master->status == 3) {

                        foreach ($items as $key => $value) {

                            $procure_billing = new ProcureBilling;
                            $procure_billing->procure_master_id = $proc_master->id;
                            $procure_billing->item_id = $value->item_id;
                            $procure_billing->description = $value->description;
                            $procure_billing->quantity = $value->quantity;
                            $procure_billing->total = $value->vendor_total;
                            $procure_billing->rate = $value->vendor_rate;

                            $procure_billing->save();

                        }


                    } else {

                        foreach ($items as $key => $value) {
                            
                            if(property_exists($value, 'proc_item_id') && isset($value->proc_item_id) && !empty($value->proc_item_id) && $value->proc_item_id != "") {

                                $procure_item = ProcureItems::find($value->proc_item_id);

                                $procure_item->procure_master_id = $proc_master->id;
                                $procure_item->item_id = $value->item_id;
                                $procure_item->description = $value->description;
                                $procure_item->quantity = $value->quantity;
                                $procure_item->vendor_total = $value->vendor_total;
                                $procure_item->vendor_rate = $value->vendor_rate;
                                $vendor_id_arr = explode('|', $value->vendor_id);
                                $procure_item->vendor_id = $vendor_id_arr[0];

                                $procure_item->update();


                            } else {

                                $procure_item = new ProcureItems;
                                $procure_item->procure_master_id = $proc_master->id;
                                $procure_item->item_id = $value->item_id;
                                $procure_item->description = $value->description;
                                $procure_item->quantity = $value->quantity;
                                $procure_item->vendor_total = $value->vendor_total;
                                $procure_item->vendor_rate = $value->vendor_rate;
                                $vendor_id_arr = explode('|', $value->vendor_id);
                                $procure_item->vendor_id = $vendor_id_arr[0];

                                $procure_item->save();



                                $procure_item_fm = new ProcureItemsFM;
                                $procure_item_fm->procure_master_id = $proc_master->id;
                                $procure_item_fm->item_id = $value->item_id;
                                $procure_item_fm->description = $value->description;
                                $procure_item_fm->quantity = $value->quantity;
                                $procure_item_fm->vendor_total = $value->vendor_total;
                                $procure_item_fm->vendor_rate = $value->vendor_rate;
                                $vendor_id_arr = explode('|', $value->vendor_id);
                                $procure_item_fm->vendor_id = $vendor_id_arr[0];

                                $procure_item_fm->save();

                            }


                        }

                    }


                    foreach ($deleted_items as $key => $value) {

                        if(property_exists($value, 'proc_item_id') && isset($value->proc_item_id) && !empty($value->proc_item_id) && $value->proc_item_id != "") {

                            $procure_item = ProcureItems::find($value->proc_item_id);
                            $procure_item->delete();

                        }

                    }

                } else {


                    $procure_master_array = array();


                    foreach ($vendor_items as $key => $value) {

                        $procure_master_array[] = array(
                            'user_id' => $proc_master->user_id,
                            'site_id' => $proc_master->site_id,
                            'zone_id' => $proc_master->zone_id,
                            'parent_id' => $proc_master->id,
                            'month' => $proc_master->month,
                            'year' => $proc_master->year,
                            'req_no' => $proc_master->req_no,
                            'is_chargeable' => $data['is_chargeable'],
                            'selected_vendor' => (int) $key,
                            'status' => $data['status'],
                            'approved_by' => $user->id,
                            'order_processed_date' => date('Y-m-d'),
                            'items' => $value,
                            'created_date' => $proc_master->created_at
                        );

                    }



                    foreach ($procure_master_array as $pmkey => $pmvalue) {

                        $proc_master_order = ProcureMaster::orderBy('order_no','desc')->first();
                        if (!empty($proc_master_order)) {
                            $order_no = $proc_master_order->order_no + 1;
                        } else {
                            $order_no = 1;
                        }

                        $order_id = 'O'.date('Y').'/'.str_pad(($data['month']+1),2,"0",STR_PAD_LEFT).'/'.str_pad($data['site_id'],2,"0",STR_PAD_LEFT).'/'.str_pad($order_no,3,"0",STR_PAD_LEFT); 

                        $proc_master = ProcureMaster::find($proc_master->id);
                        if (isset($proc_master->order_id) && !empty($proc_master->order_id) && $proc_master->order_id != "") {

                            if ($proc_master->status == 2) {

                                $proc_master->status = 3;
                                $proc_master->confirmed_date = date('Y-m-d');
                                $proc_master->update();

                            }

                        } 

                        
                        if(($proc_master->parent_id != 0 && $proc_master->status > 0) || ($proc_master->parent_id == 0 && $proc_master->status == -1) ) {

                            $proc_master_new = ProcureMaster::find($proc_master->id);
                            if ($proc_master_new->status == -1) {
                                $proc_master_new->status = $data['status'];
                            }

                        } else {                   

                            $proc_master_new = new ProcureMaster;
                            $proc_master_new->user_id = $pmvalue['user_id'];
                            $proc_master_new->zone_id = $pmvalue['zone_id'];
                            $proc_master_new->site_id = $pmvalue['site_id'];
                            $proc_master_new->parent_id = $pmvalue['parent_id'];
                            $proc_master_new->month = $pmvalue['month'];
                            $proc_master_new->year = $pmvalue['year'];
                            $proc_master_new->req_no = $pmvalue['req_no'];
                            $proc_master_new->order_no = $order_no;
                            $proc_master_new->order_id = $order_id;
                            $proc_master_new->is_chargeable = $pmvalue['is_chargeable'];
                            $proc_master_new->selected_vendor = $pmvalue['selected_vendor'];
                            $proc_master_new->status = $pmvalue['status'];
                            $proc_master_new->approved_by = $pmvalue['approved_by'];
                            $proc_master_new->order_processed_date = $pmvalue['order_processed_date'];

                            if ($pmvalue['status'] == 1 || $pmvalue['status'] == '1') {
                                
                                $user = User::find($pmvalue['user_id']);
                                if (!empty($user)) {
                                    
                                    $user_name = $user->name;
                                    $user_email = $user->email;
                                    $status_date = date('d-M-Y', strtotime($pmvalue['order_processed_date']));
                                    $requisition_date = date('d-M-Y', strtotime($pmvalue['created_date']));
                                    $msg = 'processed';

                                    $email = $user_email;
                                    $bccEmail = 'tanveer.khan@mrhomecare.in';

                                    \Mail::send('requisition_status', ['user_name' => $user_name, 'status_date' => $status_date, 'requisition_date' => $requisition_date, 'msg' => $msg ], function ($message) use ($email, $bccEmail)
                                    {
                                        $message->subject("Order Processed");
                                        $message->from('info@silagroup.co.in', 'SILA Procurement');
                                        $message->to($email);
                                        $message->bcc($bccEmail);
                                        // $message->replyTo('procurement@silagroup.co.in');
                                        //$message->cc(array('customercare@mrhomecare.in','accounts@mrhomecare.in'));

                                    });



                                }


                            }

                        }

                        if($proc_master_new->save()) {


                                if ($proc_master_new->status == 3) {

                                    foreach ($pmvalue['items'] as $key => $value) {

                                        $procure_billing = new ProcureBilling;
                                        $procure_billing->procure_master_id = $proc_master_new->id;
                                        $procure_billing->item_id = $value->item_id;
                                        $procure_billing->description = $value->description;
                                        $procure_billing->quantity = $value->quantity;
                                        $procure_billing->total = $value->vendor_total;
                                        $procure_billing->rate = $value->vendor_rate;

                                        $procure_billing->save();

                                    }


                                } else {

                                    foreach ($pmvalue['items'] as $key => $value) {
                                        
                                        if(property_exists($value, 'proc_item_id') && isset($value->proc_item_id) && !empty($value->proc_item_id) && $value->proc_item_id != "") {

                                            $procure_item = ProcureItems::find($value->proc_item_id);

                                            $procure_item->procure_master_id = $proc_master_new->id;
                                            $procure_item->item_id = $value->item_id;
                                            $procure_item->description = $value->description;
                                            $procure_item->quantity = $value->quantity;
                                            $procure_item->vendor_total = $value->vendor_total;
                                            $procure_item->vendor_rate = $value->vendor_rate;
                                            $vendor_id_arr = explode('|', $value->vendor_id);
                                            $procure_item->vendor_id = $vendor_id_arr[0];
                                            $procure_item->status = $proc_master_new->status == 0 ? 0 : 1;

                                            $procure_item->update();


                                        } else {

                                            $procure_item = new ProcureItems;
                                            $procure_item->procure_master_id = $proc_master_new->id;
                                            $procure_item->item_id = $value->item_id;
                                            $procure_item->description = $value->description;
                                            $procure_item->quantity = $value->quantity;
                                            $procure_item->vendor_total = $value->vendor_total;
                                            $procure_item->vendor_rate = $value->vendor_rate;
                                            $vendor_id_arr = explode('|', $value->vendor_id);
                                            $procure_item->vendor_id = $vendor_id_arr[0];
                                            $procure_item->status = $proc_master_new->status == 0 ? 0 : 1;

                                            $procure_item->save();

                                        }


                                    }

                                }




                        }



                    }




                }

                


            }



        }

        


        return response()->json('Request Successfully Submitted!', 200);

    }


    public function update_requisition_status($id, $status) {

        $proc_master = ProcureMaster::find($id);
        $proc_master->status = $status;
        $proc_master->delivered_date = date('Y-m-d');

        if($proc_master->update()) {

            $user = User::find($proc_master->user_id);
            if (!empty($user)) {
                
                $user_name = $user->name;
                $user_email = $user->email;
                $status_date = date('d-M-Y');
                $requisition_date = date('d-M-Y', strtotime($proc_master->created_at));
                $msg = 'delivered';

                $email = $user_email;
                $bccEmail = 'tanveer.khan@mrhomecare.in';

                \Mail::send('requisition_status', ['user_name' => $user_name, 'status_date' => $status_date, 'requisition_date' => $requisition_date, 'msg' => $msg ], function ($message) use ($email, $bccEmail)
                {
                    $message->subject("Order Delivered");
                    $message->from('info@silagroup.co.in', 'SILA Procurement');
                    $message->to($email);
                    $message->bcc($bccEmail);
                    // $message->replyTo('procurement@silagroup.co.in');
                    //$message->cc(array('customercare@mrhomecare.in','accounts@mrhomecare.in'));

                });



            }

            return response()->json('Status updated Submitted!', 200);
        }

    }

    public function get_requisition_items($id) {

        $proc_master = ProcureMaster::find($id);
        if ($proc_master->parent_id == 0) {
            $items = ProcureItems::where('procure_master_id','=',$id)->where('status','=',0)->get();
        } else {
            $items = ProcureItems::where('procure_master_id','=',$id)->where('status','=',1)->get();
        }
        foreach ($items as $key => $value) {
            $value->vendor_id = $value->vendor_id.'|'.$value->vendor_rate;
        }
        return response()->json(array('data' => $items, 'details' => $proc_master),200);

    }


    public function get_all_requisition_items($id) {

        $proc_master = ProcureMaster::find($id);

        $items = ProcureItems::where('procure_master_id','=',$id)->get();
        foreach ($items as $key => $value) {
            $req_item = Item::find($value->item_id);
            if (isset($req_item) && !empty($req_item)) {
                $value->rate = $req_item->rate;
                $value->total = ((float) $req_item->rate) * ((float) $value->quantity);
            }

        }

        return response()->json(array('data' => $items),200);

    }


    public function export_to_excel($data, $filepath, $filename) {

        $object = new PHPExcel();
        $object->setActiveSheetIndex(0);

        $columns = array('Sr. No.','Site Name','Month', 'Is chargeable?','Total', 'Status');

        $row = 2;

        // $objDrawing = new PHPExcel_Worksheet_Drawing();
        // $objDrawing->setName('test_img');
        // $objDrawing->setDescription('test_img');
        // $objDrawing->setPath(public_path()."/images/logo.png");
        // $objDrawing->setCoordinates('B'.$row);                      
        // //setOffsetX works properly
        // $objDrawing->setOffsetX(5); 
        // $objDrawing->setOffsetY(5);                
        // //set width, height
        // $objDrawing->setWidth(48); 
        // $objDrawing->setHeight(25); 
        // $objDrawing->setWorksheet($object->getActiveSheet());
        // $object->getActiveSheet()->mergeCells('B'.$row.':F3');

        // $end_char = 'F';
        // $end_col = PHPExcel_Cell::columnIndexFromString($end_char);

        // $end_char_final = PHPExcel_Cell::stringFromColumnIndex(--$end_col);



        // $row = 5;
        // $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, 'Site');
        // $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $site_name);
        // $object->getActiveSheet()->mergeCells('C'.$row.':'.$end_char_final.$row);


        // $row++;
        // $row++;

        $fill_color = 'FFf6a602';

        for ($i=0; $i < count($columns); $i++) { 
            $object->getActiveSheet()->setCellValueByColumnAndRow(($i+1), $row, $columns[$i]);
            $start_char = PHPExcel_Cell::stringFromColumnIndex(($i+1));
            $object->getActiveSheet()->getStyle($start_char.$row)->getFont()->setBold(true);
            //if($i != 0) {  
                $object->getActiveSheet()->getStyle($start_char.$row)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setARGB($fill_color);
            //}
        }

        //$row++;

        foreach ($data as $key => $value) {

            $row++;

            $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, ($key+1));
            $object->getActiveSheet()->getStyle('B'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
            
            $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $value->site_name);
            $object->getActiveSheet()->getStyle('C'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(3, $row, $value->month_str);
            $object->getActiveSheet()->getStyle('D'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, ($value->is_chargeable == 0 || $value->is_chargeable == '0' ? 'No' : 'Yes'));
            $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true); 

            $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, round($value->total_price,2));
            $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true); 

            $object->getActiveSheet()->setCellValueByColumnAndRow(6, $row, $value->status_label);
            $object->getActiveSheet()->getStyle('G'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);            

        }

        // $row++;

        // $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, 'Pre GST');
        // $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
        // $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
        // $object->getActiveSheet()->getStyle('E'.$row)->getFont()->setBold(true);

        // $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, round($total_pre_gst,2));
        // $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
        // $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);

        // $row++;

        // $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, 'Tax');
        // $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
        // $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
        // $object->getActiveSheet()->getStyle('E'.$row)->getFont()->setBold(true);

        // $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, round($tax,2));
        // $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
        // $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);

        // $row++;

        // $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, 'Total');
        // $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
        // $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
        // $object->getActiveSheet()->getStyle('E'.$row)->getFont()->setBold(true);

        // $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, round($total,2));
        // $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
        // $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);



        $styleArray = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array('argb' => 'FF000000'),
                ),
            ),
        );

        $object->getActiveSheet()->getStyle('B5:'.'G'.$row)->applyFromArray($styleArray);

        $object_writer = PHPExcel_IOFactory::createWriter($object,'Excel5');
        $object_writer->save($filepath.'/'.$filename.'.xls');

        $path = url('/').'/uploads/excel/'.$filename.'.xls';
        return $path;

    }


    public function get_report_data(Request $request) {

        $response = array();
        $data = $request->all();
        $chargeable_type = 0;


        $requisitions = ProcureMaster::leftJoin('sites', function($join) {
            $join->on('procure_master.site_id', '=', 'sites.id');
        })->where('procure_master.status','=',3)->where('procure_master.parent_id','!=',0)->select(
            'procure_master.id',
            'procure_master.order_id',
            'procure_master.order_no',
            'procure_master.req_no',
            'procure_master.user_id',
            'procure_master.approved_by',
            'procure_master.zone_id',
            'procure_master.month',
            'procure_master.year',
            'procure_master.site_id',
            'procure_master.is_chargeable',
            'procure_master.selected_vendor',
            'procure_master.status',
            'procure_master.order_processed_date',
            'procure_master.delivered_date',
            'procure_master.confirmed_date',
            'sites.billing_type',
            'sites.budgeted_amount',
            'sites.state_id'
        );

        if (isset($data['month']) && !empty($data['month']) && $data['month'] != "") {
            $requisitions = $requisitions->where('month','=',$data['month']);
        }

        if (isset($data['state']) && !empty($data['state']) && $data['state'] != "") {
            $requisitions = $requisitions->where('state_id','=',$data['state']);
        }

        if (isset($data['billing_type']) && !empty($data['billing_type']) && $data['billing_type'] != "") {
            $requisitions = $requisitions->where('billing_type','=',$data['billing_type']);
        }

        if (isset($data['site']) && !empty($data['site']) && $data['site'] != "") {
            $requisitions = $requisitions->where('site_id','=',$data['site']);
        }

        if (array_key_exists('chargeable_type', $data)) {
            $requisitions = $requisitions->where('is_chargeable','=',$data['chargeable_type']);
        } else {
            $requisitions = $requisitions->where('is_chargeable','=',1);
        }

        $rsql = $requisitions->toSql();
        $requisitions = $requisitions->get();

        $sales_total_arr = array();
        $purchase_total_arr = array();
        $profit_arr = array();

        $sales_total = 0;
        $purchase_total = 0;
        $profit_total = 0;
        $pb_sql = array();
        $pd_data = array();
        $r_billing = array();

        $site_ids = array();
        $sites = array();


        if (count($requisitions) > 0) {

            foreach ($requisitions as $key => $value) {

                if ($value->site_id != 0 && !in_array($value->site_id, $site_ids)) {
                    $site_ids[] = $value->site_id;
                }
                
                $procure_billing = ProcureBilling::leftJoin('req_items', function($join_s) {
                    $join_s->on('procure_billing.item_id', '=', 'req_items.id');
                })->where('procure_master_id','=',$value->id)->select('procure_billing.item_id','procure_billing.quantity','procure_billing.rate','req_items.type_id');


                if (isset($data['item_type']) && !empty($data['item_type']) && $data['item_type'] != "") {
                    $procure_billing = $procure_billing->where('type_id','=',$data['item_type']);
                }

                $pb_sql[] = $procure_billing->toSql();

                $procure_billing = $procure_billing->get();



                if (count($procure_billing) > 0) {

                    
                    foreach ($procure_billing as $pkey => $pvalue) {
                        
                        $item = Item::find($pvalue->item_id);

                        if ($value->billing_type == 0 || $value->billing_type == '0') {
                            $sales_total = $sales_total + 0;
                        } else {
                            $sales_total = $sales_total + ($item->rate * $pvalue->quantity);
                        }

                        if (isset($data['chargeable_type']) && ($data['chargeable_type'] == 0 || $data['chargeable_type'] == '0')) {
                            $sales_total_arr[$item->type_id] = 0;
                        } else {
                            $sales_total_arr[$item->type_id] = $sales_total;
                        }


                        $purchase_total = $purchase_total + ($pvalue->rate * $pvalue->quantity);
                        $purchase_total_arr[$item->type_id] = $purchase_total;

                        if ($pkey == count($procure_billing)-1) {
                            
                            if (isset($data['chargeable_type']) && ($data['chargeable_type'] == 0 || $data['chargeable_type'] == '0')) {
                                $profit_arr[$item->type_id] = 0;
                            } else {
                                $profit_arr[$item->type_id] = $sales_total - $purchase_total;
                            }

                        }


                    }

                    // $r_billing[] = $value->billing_type;

                    if ($value->billing_type == 0 || $value->billing_type == '0') {
                        
                        foreach ($sales_total_arr as $skey => $svalue) {
                            $budgeted_amount = (int) $value->budgeted_amount;
                            $sales_total_arr[$skey] = $sales_total_arr[$skey] + $budgeted_amount;
                        }

                        foreach ($profit_arr as $prkey => $prvalue) {
                            $profit_arr[$prkey] = (float) $sales_total_arr[$prkey] - (float) $purchase_total_arr[$prkey];
                        }

                    }


                }

            }

            
        }

        if (count($site_ids) > 0) {
            
            $sites = Site::whereIn('id',$site_ids)->orderBy('name')->get();
            foreach ($sites as $key => $value) {
                $value->report_data = $this->get_sitewise_sales_report($data, $value->id);
            }

        }

        $response['billing_type'] = $r_billing;
        $response['sales_total_arr'] = $sales_total_arr;

        $formatted_data = array();

        foreach ($sales_total_arr as $key => $value) {
                
            $item_type = ItemType::find($key);

            $formatted_data[$key]['name'] = $item_type->name;
            $formatted_data[$key]['data'][] = $value;

        }

        foreach ($purchase_total_arr as $key => $value) {
                
            $item_type = ItemType::find($key);

            $formatted_data[$key]['name'] = $item_type->name;
            $formatted_data[$key]['data'][] = $value;

        }

        foreach ($profit_arr as $key => $value) {
                
            $item_type = ItemType::find($key);

            $formatted_data[$key]['name'] = $item_type->name;
            $formatted_data[$key]['data'][] = $value;

        }

        $graph_data = array();

        foreach ($formatted_data as $key => $value) {
            
            $graph_data[] = $value;

        }

        $response['data'] = $graph_data;
        $response['sql'] = $rsql;
        $response['pb_sql'] = $pb_sql;
        $response['sites'] = $sites;


        return response()->json($response);


    }

    public function get_sitewise_sales_report($data, $site_id) {

        $requisitions = ProcureMaster::leftJoin('sites', function($join) {
            $join->on('procure_master.site_id', '=', 'sites.id');
        })->where('procure_master.status','=',3)->where('procure_master.parent_id','!=',0)->select(
            'procure_master.id',
            'procure_master.order_id',
            'procure_master.order_no',
            'procure_master.req_no',
            'procure_master.user_id',
            'procure_master.approved_by',
            'procure_master.zone_id',
            'procure_master.month',
            'procure_master.year',
            'procure_master.site_id',
            'procure_master.is_chargeable',
            'procure_master.selected_vendor',
            'procure_master.status',
            'procure_master.order_processed_date',
            'procure_master.delivered_date',
            'procure_master.confirmed_date',
            'sites.billing_type',
            'sites.budgeted_amount',
            'sites.state_id'
        );


        if (isset($data['month']) && !empty($data['month']) && $data['month'] != "") {
            $requisitions = $requisitions->where('month','=',$data['month']);
        }

        if (isset($data['state']) && !empty($data['state']) && $data['state'] != "") {
            $requisitions = $requisitions->where('state_id','=',$data['state']);
        }

        if (isset($data['billing_type']) && !empty($data['billing_type']) && $data['billing_type'] != "") {
            $requisitions = $requisitions->where('billing_type','=',$data['billing_type']);
        }

        if (array_key_exists('chargeable_type', $data)) {
            $requisitions = $requisitions->where('is_chargeable','=',$data['chargeable_type']);
        } else {
            $requisitions = $requisitions->where('is_chargeable','=',1);
        }

        $requisitions = $requisitions->where('site_id','=',$site_id);

        
        $rsql = $requisitions->toSql();
        $requisitions = $requisitions->get();

        $sales_total_arr = array();
        $purchase_total_arr = array();
        $profit_arr = array();

        $sales_total = 0;
        $purchase_total = 0;
        $profit_total = 0;
        $pb_sql = array();
        $pd_data = array();
        $r_billing = array();

        $site_ids = array();
        $sites = array();


        if (count($requisitions) > 0) {

            foreach ($requisitions as $key => $value) {

                if ($value->site_id != 0 && !in_array($value->site_id, $site_ids)) {
                    $site_ids[] = $value->site_id;
                }
                
                $procure_billing = ProcureBilling::leftJoin('req_items', function($join_s) {
                    $join_s->on('procure_billing.item_id', '=', 'req_items.id');
                })->where('procure_master_id','=',$value->id)->select('procure_billing.item_id','procure_billing.quantity','procure_billing.rate','req_items.type_id');


                if (isset($data['item_type']) && !empty($data['item_type']) && $data['item_type'] != "") {
                    $procure_billing = $procure_billing->where('type_id','=',$data['item_type']);
                }

                $pb_sql[] = $procure_billing->toSql();

                $procure_billing = $procure_billing->get();



                if (count($procure_billing) > 0) {

                    
                    foreach ($procure_billing as $pkey => $pvalue) {
                        
                        $item = Item::find($pvalue->item_id);

                        if ($value->billing_type == 0 || $value->billing_type == '0') {
                            $sales_total = $sales_total + 0;
                        } else {
                            $sales_total = $sales_total + ($item->rate * $pvalue->quantity);
                        }

                        if (isset($data['chargeable_type']) && ($data['chargeable_type'] == 0 || $data['chargeable_type'] == '0')) {
                            $sales_total_arr[$item->type_id] = 0;
                        } else {
                            $sales_total_arr[$item->type_id] = $sales_total;
                        }


                        $purchase_total = $purchase_total + ($pvalue->rate * $pvalue->quantity);
                        $purchase_total_arr[$item->type_id] = $purchase_total;

                        if ($pkey == count($procure_billing)-1) {
                            
                            if (isset($data['chargeable_type']) && ($data['chargeable_type'] == 0 || $data['chargeable_type'] == '0')) {
                                $profit_arr[$item->type_id] = 0;
                            } else {
                                $profit_arr[$item->type_id] = $sales_total - $purchase_total;
                            }

                        }


                    }

                    // $r_billing[] = $value->billing_type;

                    if ($value->billing_type == 0 || $value->billing_type == '0') {
                        
                        foreach ($sales_total_arr as $skey => $svalue) {
                            $budgeted_amount = (int) $value->budgeted_amount;
                            $sales_total_arr[$skey] = $sales_total_arr[$skey] + $budgeted_amount;
                        }

                        foreach ($profit_arr as $prkey => $prvalue) {
                            $profit_arr[$prkey] = (float) $sales_total_arr[$prkey] - (float) $purchase_total_arr[$prkey];
                        }

                    }


                }

            }

            
        }


        $response['sales'] = $sales_total_arr;
        $response['purchase'] = $purchase_total_arr;
        $response['profit'] = $profit_arr;


        return $response;


    }

}
