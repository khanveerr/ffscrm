<?php

namespace App\Http\Controllers;

use App\Zone;
use App\ItemType;
use App\State;
use App\ReqVendor;
use Illuminate\Http\Request;
use JWTAuth;
use Excel;
use PHPExcel; 
use PHPExcel_IOFactory;
use PHPExcel_Style_Border;
use PHPExcel_Helper_HTML;
use PHPExcel_Shared_Font;
use PHPExcel_Worksheet_Drawing;
use PHPExcel_Cell;
use PHPExcel_Style_Fill;

class ReqVendorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($keyword = null)
    {
        //
        $vendors = ReqVendor::where('status','=',1);

        if ($keyword != null && !empty($keyword)) {
            $vendors = $vendors->where('name','like','%'.$keyword.'%');
        }

        $vendors = $vendors->orderBy('vendor_code_no','asc')->paginate(30);


        foreach ($vendors as $key => $value) {
            
            $item_type = ItemType::find($value->item_type_id);
            if(isset($item_type) && !empty($item_type)) {
                $value->item_type_name = $item_type->name;
            } else {
                $value->item_type_name = '';
            }

            $zone = Zone::find($value->zone_id);
            if(isset($zone) && !empty($zone)) {
                $value->zone_name = $zone->zone_name;
            } else {
                $value->zone_name = '';
            }

            $state = State::find($value->state_id);
            if(isset($state) && !empty($state)) {
                $value->state_name = $state->name;
            } else {
                $value->state_name = '';
            }

        }
        return response()->json($vendors,200);
    }

    public function get_vendors($zone_id, $type_id)
    {
        //
        $vendors = ReqVendor::where('status','=',1);
        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }

        if (isset($zone_id) && $zone_id != "" && !empty($zone_id) && $zone_id != "null") {
            
            $vendors = $vendors->where('zone_id','=',$zone_id);
        }

        // if (isset($type_id) && $type_id != "" && !empty($type_id) && $type_id != "null") {
            
        //     $vendors = $vendors->where('item_type_id','=',$type_id);

        // }

        $vendors = $vendors->where('name','<>','')->orderBy('name','asc')->get();

        foreach ($vendors as $key => $value) {
            
            $state = State::find($value->state_id);
            if(isset($state) && !empty($state)) {
                $value->vendor_name = $value->name." - ".$state->name;
            } else {
                $value->vendor_name = $value->name;
            }

        }

        
        
        return response()->json($vendors,200);
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

            $vendor = ReqVendor::find($data['id']);
            $vendor->zone_id = $data['zone_id'];
            $vendor->state_id = $data['state_id'];
            $vendor->item_type_id = $data['item_type_id'];
            $vendor->name = $data['name'];
            // Added new field
            $vendor->pincode = isset($data['pincode']) ? $data['pincode'] : '';
            $vendor->email = isset($data['email']) ? $data['email'] : '';

            $vendor->address = $data['address'];
            $vendor->gst_no = $data['gst_no'];

            //New Field
            $vendor->pan_no = isset($data['pan_no']) ? $data['pan_no'] : '';

            $vendor->code = $data['code'];
            $vendor->contact_person = $data['contact_person'];
            $vendor->contact_no = $data['contact_no'];
            $vendor->status = 1;

            if($vendor->save()) {
                $this->generate_vendor_code($vendor->id,$vendor->gst_no);
                return response()->json('Vendor Updated Successfully', 200);
            } else {
                return response()->json('Vendor Update Failed', 400);
            }

        } else {

            $vendor = new ReqVendor;
            $vendor->zone_id = $data['zone_id'];
            $vendor->state_id = $data['state_id'];
            $vendor->item_type_id = $data['item_type_id'];
            $vendor->name = $data['name'];
            $vendor->address = $data['address'];

            // New Field
            $vendor->pincode = isset($data['pincode']) ? $data['pincode'] : '';
            $vendor->email = isset($data['email']) ? $data['email'] : '';

            $vendor->gst_no = $data['gst_no'];

            //New Field
            $vendor->pan_no = isset($data['pan_no']) ? $data['pan_no'] : '';

            $vendor->code = $data['code'];
            $vendor->contact_person = $data['contact_person'];
            $vendor->contact_no = $data['contact_no'];
            $vendor->vendor_code = '';
            $vendor->status = 1;

            if($vendor->save()) {
                $this->generate_vendor_code($vendor->id,$vendor->gst_no);
                return response()->json('Vendor Added Successfully', 200);
            } else {
                return response()->json('Vendor Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ReqVendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function show(ReqVendor $vendor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ReqVendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $vendor = ReqVendor::find($id);
        $vendor->item_type_id = (int) $vendor->item_type_id;
        $vendor->state_id = (int) $vendor->state_id;
        $vendor->status = (int) $vendor->status;
        $vendor->zone_id = (int) $vendor->zone_id;
        return response()->json($vendor, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ReqVendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ReqVendor $vendor)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Vendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $vendor = ReqVendor::find($id);
        if($vendor->delete()) {
            return response()->json('Vendor Deleted Successfully', 200);
        } else {
            return response()->json('Vendor Delete Failed', 400);
        }

    }

    public function generate_vendor_code($id,$gst_no) {

        if (isset($gst_no) && !empty($gst_no)) {

            $vendor_code = '';
            $vendor_code_no = 0;
            
            $gst_vendor = ReqVendor::where('gst_no','=',$gst_no)->get();

            if (count($gst_vendor) > 1) {

                $gst_vendor1 = ReqVendor::where('gst_no','=',$gst_no)->first();

                if (isset($gst_vendor1) && !empty($gst_vendor1)) {
                    
                    $vendor_code = $gst_vendor1->vendor_code;
                    $vendor_code_no = $gst_vendor1->vendor_code_no;

                    $vendor = ReqVendor::find($id);
                    if (!empty($gst_vendor)) {
                        $vendor->vendor_code = $vendor_code;
                        $vendor->vendor_code_no = $vendor_code_no;
                        $vendor->update();
                    }
                    

                }
                

            } else {

                $vendor_code = $this->get_vendor_code();

                $vendor = ReqVendor::find($id);
                $vendor->vendor_code = $vendor_code['code'];
                $vendor->vendor_code_no = $vendor_code['no'];
                $vendor->update();

            }

        }


    }

    public function get_vendor_code() {

        $response = array();
        $vendor = ReqVendor::orderBy('vendor_code_no','desc')->first();

        if (!empty($vendor)) {
            
            if (isset($vendor->vendor_code_no) && isset($vendor->vendor_code)) {
                $last_vendor_code_no = $vendor->vendor_code_no;
            } else {
                $last_vendor_code_no = 0;
            }

            $new_vendor_code_no = $last_vendor_code_no + 1;
            $new_vendor_code = 'V'.$new_vendor_code_no;


            $response['no'] = $new_vendor_code_no;
            $response['code'] = $new_vendor_code;

        } else {

            $last_vendor_code_no = 0;
            $new_vendor_code_no = $last_vendor_code_no + 1;
            $new_vendor_code = 'V'.$new_vendor_code_no;


            $response['no'] = $new_vendor_code_no;
            $response['code'] = $new_vendor_code;
        }

        return $response;


    }

    public function isNotNullAndEmpty($value, $default_value) {

        if (isset($value) && !empty($value) && $value != "null" && $value != "" && $value != "false" && $value != "true" && !is_bool($value)) {
            return $value;
        } else {

            return $default_value;

        }

    }


    public function export_vendor_master() {

        $vendors_with_gst = ReqVendor::where('gst_no','<>','')->orderBy('vendor_code_no','asc')->orderBy('zone_id','asc')->orderBy('state_id','asc')->orderBy('item_type_id','asc')->get();
        //$vendors_without_gst = ReqVendor::where('gst_no','=','')->orderBy('vendor_code_no','asc')->orderBy('zone_id','asc')->orderBy('state_id','asc')->orderBy('item_type_id','asc')->get();


        $result = array();

        foreach ($vendors_with_gst as $key => $value) {

            $result[] = array(
                'id' => $value->id,
                'vendor_code_no' => $value->vendor_code_no,
                'vendor_code' => $value->vendor_code,
                'zone_id' => $value->zone_id,
                'state_id' => $value->state_id,
                'item_type_id' => $value->item_type_id,
                'name' => $value->name,
                'address' => $value->address,
                'email' => $value->email,
                'pincode' => $value->pincode,
                'gst_no' => $value->gst_no,
                'pan_no' => $value->pan_no,
                'code' => $value->code,
                'contact_person' => $value->contact_person,
                'contact_no' => $value->contact_no
            );
            
        }

        // foreach ($vendors_without_gst as $key => $value) {

        //     $result[] = array(
        //         'id' => $value->id,
        //         'vendor_code_no' => $value->vendor_code_no,
        //         'vendor_code' => $value->vendor_code,
        //         'zone_id' => $value->zone_id,
        //         'state_id' => $value->state_id,
        //         'item_type_id' => $value->item_type_id,
        //         'name' => $value->name,
        //         'address' => $value->address,
        //         'email' => $value->email,
        //         'pincode' => $value->pincode,
        //         'gst_no' => $value->gst_no,
        //         'pan_no' => $value->pan_no,
        //         'code' => $value->code,
        //         'contact_person' => $value->contact_person,
        //         'contact_no' => $value->contact_no
        //     );
            
        // }

        //$result = array_merge($vendors_with_gst,$vendors_without_gst);

        foreach ($result as $key => $value) {
            

            if (array_key_exists('item_type_id', $value) && isset($value['item_type_id'])) {
                $item_type = ItemType::find($value['item_type_id']);
                if(isset($item_type) && !empty($item_type)) {
                    $value['type_name'] = $item_type->name;
                } else {
                    $value['type_name'] = '';
                }
            } else {
                $value['type_name'] = '';
            }

            if (array_key_exists('state_id', $value) && isset($value['state_id'])) {
                $state = State::find($value['state_id']);
                if(isset($state) && !empty($state)) {
                    $value['state_name'] = $state->name;
                } else {
                    $value['state_name'] = '';
                }
            } else {
                $value['state_name'] = '';
            }


            $value['email'] = (array_key_exists('email', $value)) ? $this->isNotNullAndEmpty($value['email'],'') : '';
            $value['address'] = (array_key_exists('address', $value)) ? $this->isNotNullAndEmpty($value['address'],'') : '';
            $value['pincode'] = (array_key_exists('pincode', $value)) ? $this->isNotNullAndEmpty($value['pincode'],'') : '';
            $value['contact_person'] = (array_key_exists('contact_person', $value)) ? $this->isNotNullAndEmpty($value['contact_person'],'') : '';
            $value['contact_no'] = (array_key_exists('contact_no', $value)) ? $this->isNotNullAndEmpty($value['contact_no'],'') : '';
            $value['pan_no'] = (array_key_exists('pan_no', $value)) ? $this->isNotNullAndEmpty($value['pan_no'],'') : '';
            $value['gst_no'] = (array_key_exists('gst_no', $value)) ? $this->isNotNullAndEmpty($value['gst_no'],'') : '';
            $value['vendor_code'] = (array_key_exists('vendor_code', $value)) ? $this->isNotNullAndEmpty($value['vendor_code'],'') : '';


            $result[$key] = $value;

        }

        // return $result;

        $ext = 'xls';
        $filename = 'vendor_master_'.time();
        $filepath = public_path()."/uploads/excel";
        $path = $this->export_to_excel($result,$filepath,$filename);

        return response()->json(['path' => $path, 'filename' => $filename.'.'.$ext]);


    }



    public function export_to_excel($data, $filepath, $filename) {

        $object = new PHPExcel();
        $object->setActiveSheetIndex(0);

        $columns = array('Vendor Code','Company','Type','Email','Address','Pincode','State','Contact Person','Contact No','Pan No','GST No');

        $row = 1;


        for ($i=0; $i < count($columns); $i++) { 
            $object->getActiveSheet()->setCellValueByColumnAndRow($i, $row, $columns[$i]);
            $start_char = PHPExcel_Cell::stringFromColumnIndex($i);
            $object->getActiveSheet()->getStyle($start_char.$row)->getFont()->setBold(true);
        }


        foreach ($data as $key => $value) {

            $row++;

            $object->getActiveSheet()->setCellValueByColumnAndRow(0, $row, $value['vendor_code']);
            $object->getActiveSheet()->getStyle('A'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
            
            $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, $value['name']);
            $object->getActiveSheet()->getStyle('B'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $value['type_name']);
            $object->getActiveSheet()->getStyle('C'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(3, $row, $value['email']);
            $object->getActiveSheet()->getStyle('D'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, $value['address']);
            $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);            

            $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, $value['pincode']);
            $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);            

            $object->getActiveSheet()->setCellValueByColumnAndRow(6, $row, $value['state_name']);
            $object->getActiveSheet()->getStyle('G'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);            

            $object->getActiveSheet()->setCellValueByColumnAndRow(7, $row, $value['contact_person']);
            $object->getActiveSheet()->getStyle('H'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);            

            $object->getActiveSheet()->setCellValueByColumnAndRow(8, $row, $value['contact_no']);
            $object->getActiveSheet()->getStyle('I'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('I')->setAutoSize(true);            

            $object->getActiveSheet()->setCellValueByColumnAndRow(9, $row, $value['pan_no']);
            $object->getActiveSheet()->getStyle('J'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('J')->setAutoSize(true);            

            $object->getActiveSheet()->setCellValueByColumnAndRow(10, $row, $value['gst_no']);
            $object->getActiveSheet()->getStyle('K'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('K')->setAutoSize(true);            

        }

        // $styleArray = array(
        //     'borders' => array(
        //         'allborders' => array(
        //             'style' => PHPExcel_Style_Border::BORDER_THIN,
        //             'color' => array('argb' => 'FF000000'),
        //         ),
        //     ),
        // );

        // $object->getActiveSheet()->getStyle('B5:'.'F'.$row)->applyFromArray($styleArray);

        $object_writer = PHPExcel_IOFactory::createWriter($object,'Excel5');
        $object_writer->save($filepath.'/'.$filename.'.xls');

        $path = url('/').'/uploads/excel/'.$filename.'.xls';
        return $path;

    }

}
