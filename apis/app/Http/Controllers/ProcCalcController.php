<?php

namespace App\Http\Controllers;

use App\ProcCalc;
use App\ItemCalc;
use App\ItemMaster;
use App\Company;
use App\User;
use App\CostCentre;
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

class ProcCalcController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $items = ProcCalc::paginate(10);

        foreach ($items as $key => $value) {
            
            $user = User::find($value->user_id);
            if(isset($user) && !empty($user)) {
                $value->user_name = $user->name;
            } else {
                $value->user_name = '';
            }

            $company = Company::find($value->company_id);
            if(isset($company) && !empty($company)) {
                $value->company_name = $company->name;
            } else {
                $value->company_name = '';
            }

            $cost_centre = CostCentre::find($value->cost_centre_id);
            if(isset($cost_centre) && !empty($cost_centre)) {
                $value->cost_centre_name = $cost_centre->name;
            } else {
                $value->cost_centre_name = '';
            }

        }

        return response()->json($items,200);
    }

    public function getProcItems($id) {

        $proc_calc = ProcCalc::find($id);

        $company = Company::find($proc_calc->company_id);
        if(isset($company) && !empty($company)) {
            $proc_calc->company_name = $company->name;
        } else {
            $proc_calc->company_name = '';
        }

        $cost_centre = CostCentre::find($proc_calc->cost_centre_id);
        if(isset($cost_centre) && !empty($cost_centre)) {
            $proc_calc->cost_centre_name = $cost_centre->name;
        } else {
            $proc_calc->cost_centre_name = '';
        }

        $items = ItemCalc::where('proc_calc_id','=',$id)->get();
        return response()->json(array('data' => $items, 'details' => $proc_calc),200);

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


        // if($data['id'] != null && !empty($data['id']) && $data['id'] != "") {

        //     $item = ProcCalc::find($data['id']);
        //     $item->name = $data['name'];

        //     if($item_type->save()) {
        //         return response()->json('Item Updated Successfully', 200);
        //     } else {
        //         return response()->json('Item Update Failed', 400);
        //     }

        // } else {

        $user = JWTAuth::parseToken()->authenticate();

        if(array_key_exists('proc_calc_id', $data) && isset($data['proc_calc_id']) && !empty($data['proc_calc_id']) && $data['proc_calc_id'] != "") {

            $proc_calc = ProcCalc::find($data['proc_calc_id']);
            //$proc_calc->user_id = $user->id;
            $proc_calc->company_id = $data['company_id'];
            $proc_calc->type = $data['type'];
            $proc_calc->cost_centre_id = $data['cost_centre_id'];
            $proc_calc->month = $data['month'];
            $proc_calc->year = $data['year'];


        } else {

            $proc_calc = new ProcCalc;
            $proc_calc->user_id = $user->id;
            $proc_calc->company_id = $data['company_id'];
            $proc_calc->type = $data['type'];
            $proc_calc->cost_centre_id = $data['cost_centre_id'];
            $proc_calc->month = $data['month'];
            $proc_calc->year = $data['year'];


        }


        if($proc_calc->save()) {

            $items = json_decode($data['items']);

            foreach ($items as $key => $value) {

                $item_master = ItemMaster::where('name','=',$value->description)->get();
                if(count($item_master) > 0) {

                } else {
                    $item_master = new ItemMaster;
                    $item_master->name = $value->description;
                    $item_master->save();
                }
                
                
                if(property_exists($value, 'id') && isset($value->id) && !empty($value->id) && $value->id != "") {

                    $item_calc = ItemCalc::find($value->id);

                    $item_calc->proc_calc_id = $proc_calc->id;
                    $item_calc->description = $value->description;
                    $item_calc->brand = $value->brand;
                    $item_calc->unit = $value->unit;
                    $item_calc->description = $value->description;
                    $item_calc->hsn_code = $value->hsn_code;
                    $item_calc->gst_perc = $value->gst_perc;
                    $item_calc->cost_pre_gst = $value->cost_pre_gst;
                    $item_calc->mrp = isset($value->mrp) && !empty($value->mrp) ? $value->mrp : NULL;
                    $item_calc->mrp_pre_gst = isset($value->mrp_pre_gst) && !empty($value->mrp_pre_gst) ? $value->mrp_pre_gst : NULL;
                    $item_calc->maximum_profit_chargeable = isset($value->maximum_profit_chargeable) && !empty($value->maximum_profit_chargeable) ? $value->maximum_profit_chargeable : NULL;
                    $item_calc->profit_margin = $value->profit_margin;
                    $item_calc->selling_price = $value->selling_price;
                    $item_calc->image_file = $value->image_file;

                    $item_calc->update();


                } else {

                    $item_calc = new ItemCalc;
                    $item_calc->proc_calc_id = $proc_calc->id;
                    $item_calc->description = $value->description;
                    $item_calc->brand = $value->brand;
                    $item_calc->unit = $value->unit;
                    $item_calc->hsn_code = isset($value->hsn_code) && $value->hsn_code != null ? $value->hsn_code : '';
                    $item_calc->gst_perc = $value->gst_perc;
                    $item_calc->cost_pre_gst = $value->cost_pre_gst;
                    $item_calc->mrp = isset($value->mrp) && !empty($value->mrp) ? $value->mrp : NULL;
                    $item_calc->mrp_pre_gst = isset($value->mrp_pre_gst) && !empty($value->mrp_pre_gst) ? $value->mrp_pre_gst : NULL;
                    $item_calc->maximum_profit_chargeable = isset($value->maximum_profit_chargeable) && !empty($value->maximum_profit_chargeable) ? $value->maximum_profit_chargeable : NULL;
                    $item_calc->profit_margin = $value->profit_margin;
                    $item_calc->selling_price = $value->selling_price;
                    $item_calc->image_file = $value->image_file;

                    $item_calc->save();

                }


            }


        }



        // if($item->save()) {
            return response()->json('Item Added Successfully', 200);
        // } else {
        //     return response()->json('Item Add Failed', 400);
        // }

        // }
    }

    public function upload_image(Request $request) {

        $image_file = $request->file('image_file');

        $filename = time().'.jpg';
        $filepath = public_path()."/uploads/images/";
        $thumbnailImage = Image::make($image_file);
        $thumbnailImage->resize(150,150, function($constraint) {
            $constraint->aspectRatio();
        });
        $thumbnailImage->save($filepath.$filename);


        return response()->json($filename,200);


    }


    public function update_item(Request $request) {

        $data = $request->all();

        $item_calc = ItemCalc::find($data['item_id']);

        $item_calc->brand = $data['brand'];
        $item_calc->unit = $data['unit'];
        $item_calc->hsn_code = $data['hsn_code'];
        $item_calc->gst_perc = $data['gst_perc'];
        $item_calc->cost_pre_gst = $data['cost_pre_gst'];
        $item_calc->mrp = isset($data['mrp']) && !empty($data['mrp']) ? $data['mrp'] : NULL;
        $item_calc->mrp_pre_gst = isset($data['mrp_pre_gst']) && !empty($data['mrp_pre_gst']) ? $data['mrp_pre_gst'] : NULL;
        $item_calc->maximum_profit_chargeable = isset($data['maximum_profit_chargeable']) && !empty($data['maximum_profit_chargeable']) ? $data['maximum_profit_chargeable'] : NULL;
        $item_calc->profit_margin = $data['profit_margin'];
        $item_calc->selling_price = $data['selling_price'];
        $item_calc->image_file = $data['image_file'];

        $item_calc->update();

         return response()->json('Item Updated Successfully', 200);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ProcCalc  $ProcCalc
     * @return \Illuminate\Http\Response
     */
    public function show(ProcCalc $ProcCalc)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ProcCalc  $ProcCalc
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $item = ProcCalc::find($id);
        return response()->json($item, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ProcCalc  $ProcCalc
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProcCalc $ProcCalc)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ProcCalc  $ProcCalc
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $item = ProcCalc::find($id);
        if($item->delete()) {
            return response()->json('Item Deleted Successfully', 200);
        } else {
            return response()->json('Item Delete Failed', 400);
        }
    }


    public function export($id, $type) {

         $proc_calc = ProcCalc::find($id);

        $company = Company::find($proc_calc->company_id);
        if(isset($company) && !empty($company)) {
            $proc_calc->company_name = $company->name;
        } else {
            $proc_calc->company_name = '';
        }

        $cost_centre = CostCentre::find($proc_calc->cost_centre_id);
        if(isset($cost_centre) && !empty($cost_centre)) {
            $proc_calc->cost_centre_name = $cost_centre->name;
        } else {
            $proc_calc->cost_centre_name = '';
        }

        $created_month = date('m',strtotime($proc_calc->created_at));
        $created_year = date('Y',strtotime($proc_calc->created_at));
        $financial_year = '';

        if($created_month <= 3) {
            $financial_year = ($created_year-1).'-'.$created_year;
        } else {
            $financial_year = $created_year.'-'.($created_year+1);
        }

        $proc_calc->financial_year = $financial_year;
        $is_brand = 0;
        $is_unit = 0;
        $is_mrp = 0;
        $is_hsn_code = 0;

        $items = ItemCalc::where('proc_calc_id','=',$id)->get();
        $show_hide_column = array();

        foreach ($items as $key => $value) {

            if(isset($value->image_file) && !empty($value->image_file) && $value->image_file != "") {
                $is_image = 1;
            }

            if(isset($value->hsn_code) && !empty($value->hsn_code) && $value->hsn_code != "") {
                $is_hsn_code = 1;
            }
            
            if(isset($value->brand) && !empty($value->brand) && $value->brand != "") {
                $is_brand = 1;
            }

            if(isset($value->unit) && !empty($value->unit) && $value->unit != "") {
                $is_unit = 1;
            }

            if(isset($value->mrp) && !empty($value->mrp) && $value->mrp != "") {
                $is_mrp = 1;
            }

        }

        $filename = $proc_calc->cost_centre_name;
        $path = '';
        $ext = '';

        $show_hide_column['is_brand'] = $is_brand;
        $show_hide_column['is_unit'] = $is_unit;
        $show_hide_column['is_mrp'] = $is_mrp;
        $show_hide_column['is_hsn_code'] = $is_hsn_code;
        $show_hide_column['is_image'] = $is_image;


        if($type == 'pdf') {

            $ext = 'pdf';
            $filepath = public_path()."/uploads/pdf";
            $path = $this->export_to_pdf($proc_calc, $items, $filepath, $filename, $show_hide_column);

        } else {

            $ext = 'xls';
            $filepath = public_path()."/uploads/excel";
            $path = $this->export_to_excel($proc_calc, $items, $filepath, $filename, $show_hide_column);


        }


        return response()->json(['path' => $path, 'filename' => $filename.'.'.$ext]);



    }

    public function export_to_pdf($proc_calc, $items, $filepath, $filename, $show_hide_column) {

        $rendererLibraryPath = base_path() . '/vendor/tecnick.com/tcpdf/tcpdf.php';
        

        require_once $rendererLibraryPath;

        $data = view('export.pdf_layout', ['items' => $items, 'proc_calc' => $proc_calc, 'show_hide_column' => $show_hide_column]);

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

    public function export_to_excel($proc_calc, $items, $filepath, $filename, $show_hide_column) {

        $object = new PHPExcel();
        $object->setActiveSheetIndex(0);

        $columns = array('','Sr. No.','Item Description', 'HSN Code','Brand','Unit','MRP (If Any)','Pre GST Rate (In. Rs.)','GST %');

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
        $object->getActiveSheet()->mergeCells('B'.$row.':E3');

        $end_char = 'E';
        $end_col = PHPExcel_Cell::columnIndexFromString($end_char);

        if($show_hide_column['is_hsn_code'] == 1) {
            $end_col++;
        }

        if($show_hide_column['is_brand'] == 1) {
            $end_col++;
        }

        if($show_hide_column['is_unit'] == 1) {
            $end_col++;
        }

        if($show_hide_column['is_mrp'] == 1) {
            $end_col++;
        }

        $end_char_final = PHPExcel_Cell::stringFromColumnIndex(--$end_col);



        $row = 5;
        $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, 'Company');
        $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $proc_calc->company_name);
        $object->getActiveSheet()->mergeCells('C'.$row.':'.$end_char_final.$row);

        $row++;
        $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, 'Financial Year');
        $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $proc_calc->financial_year);
        $object->getActiveSheet()->mergeCells('C'.$row.':'.$end_char_final.$row);

        $row++;
        $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, 'Type');
        $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $proc_calc->type);
        $object->getActiveSheet()->mergeCells('C'.$row.':'.$end_char_final.$row);

        $row++;
        $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, 'Site');
        $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $proc_calc->cost_centre_name);
        $object->getActiveSheet()->mergeCells('C'.$row.':'.$end_char_final.$row);


        $row++;
        $row++;

        $fill_color = 'FFf6a602';

        for ($i=0; $i < count($columns); $i++) { 
            $object->getActiveSheet()->setCellValueByColumnAndRow($i, $row, $columns[$i]);
            $start_char = PHPExcel_Cell::stringFromColumnIndex($i);
            $object->getActiveSheet()->getStyle($start_char.$row)->getFont()->setBold(true);
            if($i != 0) {  
                $object->getActiveSheet()->getStyle($start_char.$row)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setARGB($fill_color);
            }
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

            $object->getActiveSheet()->setCellValueByColumnAndRow(3, $row, isset($value->hsn_code) && !empty($value->hsn_code) ? $value->hsn_code : '-');
            $object->getActiveSheet()->getStyle('D'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, isset($value->brand) && !empty($value->brand) ? $value->brand : '-');
            $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, isset($value->unit) && !empty($value->unit) ? $value->unit : '-');
            $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(6, $row, isset($value->mrp) && !empty($value->mrp) ? $value->mrp : '-');
            $object->getActiveSheet()->getStyle('G'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(7, $row, $value->selling_price);
            $object->getActiveSheet()->getStyle('H'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(8, $row, $value->gst_perc);
            $object->getActiveSheet()->getStyle('I'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('I')->setAutoSize(true);

            

        }

        $styleArray = array(
            'borders' => array(
                'allborders' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array('argb' => 'FF000000'),
                ),
            ),
        );

        $object->getActiveSheet()->getStyle('B5:'.'I'.$row)->applyFromArray($styleArray);

        $object_writer = PHPExcel_IOFactory::createWriter($object,'Excel5');
        $object_writer->save($filepath.'/'.$filename.'.xls');

        $path = url('/').'/uploads/excel/'.$filename.'.xls';
        return $path;

    }

}
