<?php

namespace App\Http\Controllers;

use App\Item;
use App\ItemPrice;
use App\Site;
use App\State;
use App\User;
use App\Zone;
use App\ProcureMaster;
use App\ProcureItems;
use App\ReqVendor;
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

class ProcurementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function index()
    // {
    //     //
    //     $brands = Brand::where('status','=',1)->paginate(10);
    //     return response()->json($brands,200);
    // }

    public function get_items($zone_id = null) {

        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

        if ($zone_id == null || $zone_id == "null") {
            $zone_id = $user->zone_id;
        }
        $items = Item::where('zone_id','=',$zone_id)->get();

        $req_items = array();

        foreach ($items as $key => $value) {
            $value->quantity = 0;
            //$value->old_rate = $value->rate;
            $value->total = 0;
            $value->pre_gst_amount = 0;
            $value->is_chargeable = 0;
            if (!isset($value->vendor_rate) || empty($value->vendor_rate) || $value->vendor_rate == 0) {
                $value->vendor_rate = 0;
            }
            
            if (!isset($value->vendor_id) || empty($value->vendor_id) || $value->vendor_id == 0) {
                $value->vendor_id = 0;
            }

            if (!isset($value->vendor_total) || empty($value->vendor_total) || $value->vendor_total == 0) {
                $value->vendor_total = 0;
            }

            $item_prices = ItemPrice::where('item_id','=',$value->id)->where('status','=',1)->get();
            if (count($item_prices) > 0) {

                foreach ($item_prices as $v_key => $v_value) {
                    $vendor = ReqVendor::find($v_value->vendor_id);
                    if (!empty($vendor)) {
                        $state = State::find($vendor->state_id);
                        if(!empty($state)) {
                            $v_value->vendor_name = $vendor->name.' - '.$state->name;
                        } else {
                            $v_value->vendor_name = $vendor->name;
                        }
                    } else {
                        $v_value->vendor_name = '';
                    }
                }


                $value->vendors = $item_prices;
                $req_items[] = $value;
            }

        }

        return response()->json($req_items,200);

    }

    public function export_po($id) {

        $requisition = ProcureMaster::find($id);
        $data = array();

        $months = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

        $zone = Zone::find($user->zone_id);
        if(!empty($zone)) {
            $zone_code = $zone->code;
        } else {
            $zone_code = '';
        }


        if (!empty($requisition)) {

            $vendor_code = '';

            $data['month_name'] = $months[$requisition->month];
            $data['year_name'] = $requisition->year;

            $approver = User::find($requisition->approved_by);
            if (!empty($approver)) {
                $data['approved_by'] = $approver->name;
            }
            
            $site = Site::find($requisition->site_id);
            if (!empty($site)) {
                $data['site_name'] = $site->name;
                $data['site_address'] = $site->site_address;
                $data['site_contact_person'] = $site->contact_person;
                $data['site_contact_no'] = $site->contact_no;
                $data['site_state_id'] = $site->state_id;

                $state = State::find($site->state_id);
                if (!empty($state)) {
                    
                    $data['site_state_name'] = $state->name;
                    $data['site_state_code'] = $state->code;

                }
            }    

            $vendor = ReqVendor::find($requisition->selected_vendor);
            if (!empty($vendor)) {
                
                $data['vendor_name'] = $vendor->name;
                $data['vendor_address'] = $vendor->address;
                $data['vendor_contact_person'] = $vendor->contact_person;
                $data['vendor_contact_no'] = $vendor->contact_no;
                $vendor_code = $vendor->code;

                $state = State::find($vendor->state_id);
                if (!empty($state)) {
                    
                    $data['vendor_state_name'] = $state->name;
                    $data['vendor_state_code'] = $state->code;

                }

            }

            $is_chargeable_label = $requisition->is_chargeable == 1 || $requisition->is_chargeable == '1' ? 'C' : 'NC';
            $voucher_no_format = $is_chargeable_label.'/'.date('My').'/'.$zone_code.'/'.str_pad($requisition->order_no,3,"0",STR_PAD_LEFT);

            $data['voucher_no'] = $voucher_no_format;
            if (!empty($requisition->order_processed_date)) {
                $data['voucher_date'] = date('d-M-Y', strtotime($requisition->order_processed_date));
            } else {
                $data['voucher_date'] = date('d-M-Y');
            }
            
            // $data['due_on'] = date('d-M-Y');

            $items = ProcureItems::where('procure_master_id','=',$id)->get();
            $procure_items = [];

            $quantity_total = 0;
            $amount_total = 0;

            foreach ($items as $key => $value) {


                $procure_items[] = array(
                    'sr_no' => $key+1,
                    'description' => str_replace("&", "and", $value->description).' - '.$vendor_code,
                    // 'due_on' => date('d-M-Y'),
                    'quantity' => $value->quantity,
                    'rate' => round($value->vendor_rate,2),
                    'per' => 'Nos.',
                    'amount' => round(( $value->quantity *  $value->vendor_rate ), 2)
                );

                $quantity_total = $quantity_total + $value->quantity;
                $amount_total = $amount_total + round(( $value->quantity *  $value->vendor_rate ), 2);

            }


            $data['items'] = $procure_items;
            $data['total_quantity'] = $quantity_total;
            $data['total_amount'] = $amount_total;
            $data['total_amount_words'] = $this->inWords($amount_total);


        }

        // return response()->json($data,200);

        $data['site_name'] = str_replace("&", "and", $data['site_name']);

        // return response()->json($data,200);

        $filename = $data['site_name'];
        $filepath = public_path()."/uploads/po";


        $rendererLibraryPath = base_path() . '/vendor/tecnick.com/tcpdf/tcpdf.php';
        
        require_once $rendererLibraryPath;

        $data = view('export.po_export', ['data' => $data]);

        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        $pdf->setFontSubsetting(FALSE);
        //    Set margins, converting inches to points (using 72 dpi)
        $pdf->SetMargins(PDF_MARGIN_LEFT, 16, PDF_MARGIN_RIGHT);
        $pdf->SetAutoPageBreak(TRUE, 16);
        //$pdf->SetLineStyle(array('width' => 0.1, 'cap' => 'butt', 'join' => 'miter', 'solid' => 1, 'color' => array(0, 0, 0)));

        $pdf->setPrintHeader(FALSE);
        $pdf->setPrintFooter(FALSE);

        $pdf->SetFont('helvetica', '', 9);

        $pdf->AddPage();

        $pdf->writeHTML($data, true, false, false, false, '');

        // $pdf->SetDisplayMode('fullpage', 'continuous');

        $pdf->output($filepath.'/'.$filename.'.pdf', 'F');

        $path = url('/').'/uploads/po/'.$filename.'.pdf';
        
        return response()->json(['path' => $path, 'filename' => $filename.'.pdf']);


        return response()->json($path,200);

    }


    public function inWords($total_amount_rs)
    {
        $digit = 0;
        
        $a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
        $b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
        $number = explode('.', $total_amount_rs);
        $num =  (int)$number[0];
        if(array_key_exists('1', $number)) {
            $digit = (int)$number[1];
        }

        if (strlen($num) > 9) {
            return 'overflow';
        }
        //$n = ('000000000' + $num) .substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        $n_num = substr(('000000000' . $num), -9);
        $n_pattern = '/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/';
        preg_match($n_pattern, $n_num, $n);

        if($digit != 0) {
            $d_num = substr(('00' . $digit), -2);
            $d_pattern = '/^(\d{2})$/';
            preg_match($d_pattern, $d_num, $d);
        }

        if (!$n) {
            return;
        }

        $str = '';

        $str .= ($n[1] != 0) ? ( array_key_exists($n[1], $a) ? $a[$n[1]] :  ($b[$n[1][0]] . ' ' . $a[$n[1][1]])) . 'Crore ' : '';
        $str .= ($n[2] != 0) ? ( array_key_exists($n[2], $a) ? $a[$n[2]] :  ($b[$n[2][0]] . ' ' . $a[$n[2][1]])) . 'Lakh ' : '';
        $str .= ($n[3] != 0) ? ( array_key_exists($n[3], $a) ? $a[$n[3]] :  ($b[$n[3][0]] . ' ' . $a[$n[3][1]])) . 'Thousand ' : '';
        $str .= ($n[4] != 0) ? ( array_key_exists($n[4], $a) ? $a[$n[4]] :  ($b[$n[4][0]] . ' ' . $a[$n[4][1]])) . 'Hundred ' : '';
        $str .= ($n[5] != 0) ? ( array_key_exists($n[5], $a) ? $a[$n[5]] :  ($b[$n[5][0]] . ' ' . $a[$n[5][1]])) . 'Rupee ' : '';
        $str .= ($digit != 0 && $d[1] != 0) ? (($str != '' ) ? "and " : '') . ( array_key_exists($d[1], $a) ? $a[$d[1]] : ($b[$d[1][0]] . ' ' . $a[$d[1][1]])) . 'Paise ' : 'Only';

        return $str;


    }


    public function export(Request $req) {

        $data = $req->all();

        $site_id = $data['site_id'];
        $items = json_decode($data['items']);
        $export_type = $data['export_type'];

        $site = Site::find($site_id);
        if(isset($site) && !empty($site)) {
            $site_name = $site->name;
        } else {
            $site_name = '';
        }

        $tax = $data['tax'];
        $total = $data['total'];

        $filename = $site_name;

        if($export_type == 'pdf') {

            $ext = 'pdf';
            $filepath = public_path()."/uploads/pdf";
            $path = $this->export_to_pdf($site_name, $items, $filepath, $filename, $tax, $total);

        } else {

            $ext = 'xls';
            $filepath = public_path()."/uploads/excel";
            $path = $this->export_to_excel($site_name, $items, $filepath, $filename, $tax, $total);


        }


        return response()->json(['path' => $path, 'filename' => $filename.'.'.$ext]);

        //return response()->json($items);

    }


    public function export_by_proc_id(Request $req) {

        $data = $req->all();

        $procure_master_id = $data['id'];
        $procure_master = ProcureMaster::find($procure_master_id);


        $site_id = $procure_master->site_id;
        $export_type = $data['export_type'];

        $items = ProcureItems::where('procure_master_id','=',$procure_master_id)->get();

        $total_pre_gst = 0;
        $total_tax = 0;
        $total_rate = 0;

        $tax = 0;
        $pre_gst = 0;
        $total = 0;

        foreach ($items as $key => $value) {
            
            $req_item = Item::find($value->item_id);
            $tax = ($req_item->rate * $value->quantity) * ($req_item->gst_per / 100);
            $pre_gst = ($req_item->rate * $value->quantity);
            $total = ($req_item->rate * $value->quantity) + $tax;

            $value->rate = $req_item->rate;
            $value->pre_gst = $pre_gst;
            $value->total = $total;


            $total_tax = $total_tax + $tax;
            $total_pre_gst = $total_pre_gst + $pre_gst;
            $total_rate = $total_rate + $total;

        }


        $site = Site::find($site_id);
        if(isset($site) && !empty($site)) {
            $site_name = $site->name;
        } else {
            $site_name = '';
        }

        $tax = round($total_tax,2);
        $total = round($total_rate,2);

        $filename = $site_name;

        if($export_type == 'pdf') {

            $ext = 'pdf';
            $filepath = public_path()."/uploads/pdf";
            $path = $this->export_to_pdf($site_name, $items, $filepath, $filename, $total_pre_gst, $tax, $total);

        } else {

            $ext = 'xls';
            $filepath = public_path()."/uploads/excel";
            $path = $this->export_to_excel($site_name, $items, $filepath, $filename, $total_pre_gst, $tax, $total);


        }


        return response()->json(['path' => $path, 'filename' => $filename.'.'.$ext]);

        //return response()->json($items);

    }


    public function export_to_pdf($site_name, $items, $filepath, $filename, $total_pre_gst, $tax, $total) {

        $rendererLibraryPath = base_path() . '/vendor/tecnick.com/tcpdf/tcpdf.php';
        

        require_once $rendererLibraryPath;

        $data = view('export.item_pdf_layout', ['items' => $items, 'site_name' => $site_name, 'total_pre_gst' => $total_pre_gst,'tax' => $tax, 'total' => $total]);

        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        $pdf->setFontSubsetting(FALSE);
        //    Set margins, converting inches to points (using 72 dpi)
        $pdf->SetMargins(PDF_MARGIN_LEFT, 16, PDF_MARGIN_RIGHT);
        $pdf->SetAutoPageBreak(TRUE, 16);
        //$pdf->SetLineStyle(array('width' => 0.1, 'cap' => 'butt', 'join' => 'miter', 'solid' => 1, 'color' => array(0, 0, 0)));

        $pdf->setPrintHeader(FALSE);
        $pdf->setPrintFooter(FALSE);

        $pdf->SetFont('helvetica', '', 9);

        $pdf->AddPage('L');

        $pdf->writeHTML($data, true, false, false, false, '');

        $pdf->output($filepath.'/'.$filename.'.pdf', 'F');

        $path = url('/').'/uploads/pdf/'.$filename.'.pdf';
        return $path;

    }



    public function export_to_excel($site_name, $items, $filepath, $filename, $total_pre_gst, $tax, $total) {

        $object = new PHPExcel();
        $object->setActiveSheetIndex(0);

        $columns = array('Sr. No.','Item','Quantity', 'Price','Total');

        $row = 2;

        $objDrawing = new PHPExcel_Worksheet_Drawing();
        $objDrawing->setName('test_img');
        $objDrawing->setDescription('test_img');
        $objDrawing->setPath(public_path()."/images/logo.png");
        $objDrawing->setCoordinates('B'.$row);                      
        //setOffsetX works properly
        $objDrawing->setOffsetX(5); 
        $objDrawing->setOffsetY(5);                
        //set width, height
        $objDrawing->setWidth(48); 
        $objDrawing->setHeight(25); 
        $objDrawing->setWorksheet($object->getActiveSheet());
        $object->getActiveSheet()->mergeCells('B'.$row.':F3');

        $end_char = 'F';
        $end_col = PHPExcel_Cell::columnIndexFromString($end_char);

        $end_char_final = PHPExcel_Cell::stringFromColumnIndex(--$end_col);



        $row = 5;
        $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, 'Site');
        $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $site_name);
        $object->getActiveSheet()->mergeCells('C'.$row.':'.$end_char_final.$row);


        $row++;
        $row++;

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

        foreach ($items as $key => $value) {

            $row++;

            $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, ($key+1));
            $object->getActiveSheet()->getStyle('B'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
            
            $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $value->description);
            $object->getActiveSheet()->getStyle('C'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(3, $row, $value->quantity);
            $object->getActiveSheet()->getStyle('D'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, $value->rate);
            $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true); 

            $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, round(($value->quantity * $value->rate),2));
            $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);            

        }

        $row++;

        $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, 'Pre GST');
        $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
        $object->getActiveSheet()->getStyle('E'.$row)->getFont()->setBold(true);

        $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, round($total_pre_gst,2));
        $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);

        $row++;

        $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, 'Tax');
        $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
        $object->getActiveSheet()->getStyle('E'.$row)->getFont()->setBold(true);

        $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, round($tax,2));
        $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);

        $row++;

        $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, 'Total');
        $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
        $object->getActiveSheet()->getStyle('E'.$row)->getFont()->setBold(true);

        $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, round($total,2));
        $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);



        $styleArray = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array('argb' => 'FF000000'),
                ),
            ),
        );

        $object->getActiveSheet()->getStyle('B5:'.'F'.$row)->applyFromArray($styleArray);

        $object_writer = PHPExcel_IOFactory::createWriter($object,'Excel5');
        $object_writer->save($filepath.'/'.$filename.'.xls');

        $path = url('/').'/uploads/excel/'.$filename.'.xls';
        return $path;

    }


    public function import_data() {

        // $items = Item::get();
        // $no_price_item = array();

        // foreach ($items as $key => $value) {
            
        //     $item_price = ItemPrice::where('item_id','=',$value->id)->get();
        //     if (count($item_price) > 0) {
                
        //     } else {
        //         $no_price_item[] = $value->alias_code;
        //     }

        // }

        $filepath = base_path(). '/public/data/sila_proc_sites.csv';

        $data = Excel::load($filepath, function($reader) { })->get();
        // $email_ids = array();
        //$codes = array();

        foreach ($data as $key => $value) {

            $site = Site::where('site_code','=',$value['site_code_as_per_xcube'])->first();

            if (isset($site) && !empty($site)) {

                $site_up = Site::find($site->id);
                $site_up->group_code = $value['group_code_as_per_xcube'];
                $site_up->name = $value['site_name_as_per_xcube'];
                $site_up->gst_no = $value['gstinuin'];
                $site_up->cost_centre = $value['costcentre'];
                $site_up->billing_name = $value['billing_name_as_per_tally'];
                $site_up->update();

            } else {

                if (isset($value['state']) && !empty($value['state']) && strpos($value['site_code_no'], '_') === FALSE && $value['site_code_no'] != 'N/A') {

                    $site_add = new Site;
                    $site_add->group_code = $value['group_code_as_per_xcube'];
                    $site_add->site_code = $value['site_code_as_per_xcube'];
                    $site_add->zone_id = $value['zone'];
                    $site_add->state_id = $value['state'];
                    $site_add->name = $value['site_name_as_per_xcube'];
                    $site_add->gst_no = $value['gstinuin'];
                    $site_add->cost_centre = $value['costcentre'];
                    $site_add->site_address = $value['address'];
                    $site_add->billing_name = $value['billing_name_as_per_tally'];
                    $site_add->status = 1;
                    $site_add->location_id = 0;
                    $site_add->billing_type = -1;
                    $site_add->budgeted_amount = 0;
                    $site_add->contact_person = '';
                    $site_add->contact_no = '';
                    $site_add->remarks = '';
                    $site_add->site_address = '';
                    $site_add->site_code_no = $value['site_code_no'];
                    $site_add->save();

                }


            }

            // $user = User::where('email','=',$value['email'])->first();

            // if (isset($user) && !empty($user)) {
                
                // $user_up = User::find($user->id);
                // $user_up->code = $value['employee_number'];
                // $user_up->update();

            // } else {

                // $email_ids[] = $value['email'];

                // if(isset($value['zone']) && !empty($value['zone'])) {

                //     $uadd = new User;
                //     $uadd->code = $value['employee_number'];
                //     $uadd->name = $value['full_name'];
                //     $uadd->email = $value['email'];
                //     $uadd->password = bcrypt($value['password']);
                //     $uadd->user_type = 'F';
                //     $uadd->zone_id = $value['zone'];
                //     // $uadd->zone_id = $value['zone'];
                //     $uadd->save();

                // }

        }

        //     $alias_code = $value['sila_allias_code'];

        //     foreach ($value as $rvkey => $rvvalue) {

        //         if ($rvkey != 'sila_allias_code') {
                    
        //             $vendor = ReqVendor::find($rvkey);
        //             if (isset($vendor) && !empty($vendor) && isset($rvvalue) && !empty($rvvalue) && $rvvalue != "null") {
                        
        //                 $item = Item::where('alias_code','=',$alias_code)->first();
        //                 if (isset($item) && !empty($item)) {
                            
        //                     $item_price = new ItemPrice;
        //                     $item_price->item_id = $item->id;
        //                     $item_price->vendor_id = $rvkey;
        //                     $item_price->rate = (float) $rvvalue;
        //                     $item_price->status = 1;
        //                     $item_price->save();

        //                 }

        //             }    


        //         }
                


        //     }

        //     // $codes[] = $value['sila_allias_code'];

        // }

        // foreach ($data as $key => $value) {

        //     $item = User::where('email','=',$value->email)->get();
        //     if (count($item) > 0) {
                
        //     } else {

        //         // $user = new User;
        //         // $user->name = $value->name;
        //         // $user->email = $value->email;
        //         // $user->password = bcrypt($value->password);
        //         // $user->user_type = 'F';
        //         // $user->zone_id = $value->zone;
        //         // $user->state_id = $value->state;

        //         // $user->save();

        //     }

        // }


        return response()->json($data);

    }


}
