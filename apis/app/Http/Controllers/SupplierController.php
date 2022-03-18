<?php

namespace App\Http\Controllers;

use App\ProcureMaster;
use App\ProcureItems;
use App\Item;
use App\Site;
use Illuminate\Http\Request;
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

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($year = null, $month = null, $site_id = null)
    {

        //$month = 6;
        // $year = date('Y');
        //$site_id = 1;
        $months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        
        $supplier_lists = ProcureMaster::where('procure_master.status','=',3);

        if ($month != null) {
            $supplier_lists = $supplier_lists->where('month','=',$month);
        }

        if ($year != null) {
            $supplier_lists = $supplier_lists->where('year','=',$year);
        }

        $site_name = '';
        if ($site_id != null) {
            $supplier_lists = $supplier_lists->where('site_id','=',$site_id);
            $site = Site::find($site_id);
            $site_name = $site->name;
        }

        $supplier_lists = $supplier_lists->leftJoin('procure_items', 'procure_master.id', '=', 'procure_items.procure_master_id')
                            ->leftJoin('req_items', 'procure_items.item_id', '=', 'req_items.id')
                            ->select(\DB::raw('procure_items.item_id,procure_master.site_id,req_items.gst_per,SUM(procure_items.quantity) as total_quantity, SUM(req_items.rate) as total_rate'))
                            ->whereNotNull('procure_items.item_id')
                            ->groupBy('procure_items.item_id','req_items.gst_per','procure_master.site_id');

        $supplier_lists_q = $supplier_lists->toSql();
        $supplier_lists = $supplier_lists->get();

        $tax_total = array();
        $tax_total_sum = 0;
        $tax_total['28'] = 0;
        $tax_total['18'] = 0;
        $tax_total['12'] = 0;
        $tax_total['5'] = 0;
        $tax_total['0'] = 0;

        foreach ($supplier_lists as $key => $value) {
            
            $net_total = (float) $value->total_quantity * (float) $value->total_rate;
            $value->net_total = round($net_total,2);

            if (!isset($tax_total[$value->gst_per])) {
                $tax_total[$value->gst_per] = 0;
            }
            $tax_total[$value->gst_per] = $tax_total[$value->gst_per] + $net_total;

            $req_item = Item::find($value->item_id);

            $value->alias_code = $req_item->alias_code;
            $value->description = $req_item->description;
            $value->hsn_code = $req_item->hsn_code;


        }

        $tax_info = array(
            '28' => 'CGST- 14% + SGST - 14% (28%)',
            '18' => 'CGST- 9% + SGST -9% (18%)',
            '12' => 'CGST- 6% + SGST -6 % (12%)',
            '5' => 'CGST- 2.5% + SGST -2.5 % (5%)',
            '0' => 'CGST- 0% + SGST -0 % (0%)'
        );

        $tax_info_arr = array();
        $taxable_value = 0;
        $tax_value = 0;
        $total_value = 0;

        foreach ($tax_total as $key => $value) {
            
            $tax = (float) (((float) $key) / 100) * $value;
            $total = round(($tax+$value),2);

            $tax_info_arr[] = array(
                'text' => $tax_info[$key],
                'value' => $value,
                'tax_label' => $key,
                'tax' => round($tax,2),
                'total' => $total
            );

            $taxable_value = $taxable_value + $value;
            $tax_value = $tax_value + $tax;
            $total_value = $total_value + $total;

        }

        $tax_info_arr[] = array(
            'text' => 'Total',
            'value' => round($taxable_value,2),
            'tax_label' => '',
            'tax' => round($tax_value,2),
            'total' => round($total_value,2)
        );

        $requisition_period = $months[$month].' '.$year;
        // $filename = $site_name.'-'.$requisition_period;
        // $ext = 'xls';
        // $filepath = public_path()."/uploads/excel";
        // $path = $this->export_to_excel($site_name, $requisition_period, $supplier_lists, $tax_info_arr, $filepath, $filename);

        return response()->json(array('site_name' => $site_name, 'requisition_period' => $requisition_period, 'supplier_lists' => $supplier_lists, 'tax_info' => $tax_info_arr, 'supplier_lists_q' => $supplier_lists_q));

        // return response()->json(['path' => $path, 'filename' => $filename.'.'.$ext]);

        // return "Hello";


    }


    public function export($year = null, $month = null, $site_id = null)
    {

        //$month = 6;
        // $year = date('Y');
        //$site_id = 1;
        $months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        
        $supplier_lists = ProcureMaster::where('procure_master.status','=',3);

        if ($month != null) {
            $supplier_lists = $supplier_lists->where('month','=',$month);
        }

        if ($year != null) {
            $supplier_lists = $supplier_lists->where('year','=',$year);
        }

        $site_name = '';
        if ($site_id != null) {
            $supplier_lists = $supplier_lists->where('site_id','=',$site_id);
            $site = Site::find($site_id);
            $site_name = $site->name;
        }

        $supplier_lists = $supplier_lists->leftJoin('procure_items', 'procure_master.id', '=', 'procure_items.procure_master_id')
                            ->leftJoin('req_items', 'procure_items.item_id', '=', 'req_items.id')
                            ->select(\DB::raw('procure_items.item_id,procure_master.site_id,req_items.gst_per,SUM(procure_items.quantity) as total_quantity, SUM(req_items.rate) as total_rate'))
                            ->whereNotNull('procure_items.item_id')
                            ->groupBy('procure_items.item_id','req_items.gst_per','procure_master.site_id')->get();

        $tax_total = array();
        $tax_total_sum = 0;
        $tax_total['28'] = 0;
        $tax_total['18'] = 0;
        $tax_total['12'] = 0;
        $tax_total['5'] = 0;
        $tax_total['0'] = 0;

        foreach ($supplier_lists as $key => $value) {
            
            $net_total = (float) $value->total_quantity * (float) $value->total_rate;
            $value->net_total = round($net_total,2);

            if (!isset($tax_total[$value->gst_per])) {
                $tax_total[$value->gst_per] = 0;
            }
            $tax_total[$value->gst_per] = $tax_total[$value->gst_per] + $net_total;

            $req_item = Item::find($value->item_id);

            $value->alias_code = $req_item->alias_code;
            $value->description = $req_item->description;
            $value->hsn_code = $req_item->hsn_code;


        }

        $tax_info = array(
            '28' => 'CGST- 14% + SGST - 14% (28%)',
            '18' => 'CGST- 9% + SGST -9% (18%)',
            '12' => 'CGST- 6% + SGST -6 % (12%)',
            '5' => 'CGST- 2.5% + SGST -2.5 % (5%)',
            '0' => 'CGST- 0% + SGST -0 % (0%)'
        );

        $tax_info_arr = array();
        $taxable_value = 0;
        $tax_value = 0;
        $total_value = 0;

        foreach ($tax_total as $key => $value) {
            
            $tax = (float) (((float) $key) / 100) * $value;
            $total = round(($tax+$value),2);

            $tax_info_arr[] = array(
                'text' => $tax_info[$key],
                'value' => $value,
                'tax_label' => $key,
                'tax' => round($tax,2),
                'total' => $total
            );

            $taxable_value = $taxable_value + $value;
            $tax_value = $tax_value + $tax;
            $total_value = $total_value + $total;

        }

        $tax_info_arr[] = array(
            'text' => 'Total',
            'value' => round($taxable_value,2),
            'tax_label' => '',
            'tax' => round($tax_value,2),
            'total' => round($total_value,2)
        );

        $requisition_period = $months[$month].' '.$year;
        $filename = $site_name.'-'.$requisition_period;
        $ext = 'xls';
        $filepath = public_path()."/uploads/excel";
        $path = $this->export_to_excel($site_name, $requisition_period, $supplier_lists, $tax_info_arr, $filepath, $filename);

        // return response()->json(array('site_name' => $site_name, 'requisition_period' => , 'supplier_lists' => $supplier_lists, 'tax_info' => $tax_info_arr));

        return response()->json(['path' => $path, 'filename' => $filename.'.'.$ext]);

        // return "Hello";


    }



    public function export_to_excel($site_name, $requisition_period, $supplier_lists, $tax_info_arr, $filepath, $filename) {

        $object = new PHPExcel();
        $object->setActiveSheetIndex(0);

        $columns = array('','Sr No.', 'Sila Alias Code', 'Description', 'HSN Codes', 'GST %', 'Quantity', 'Rates', 'Amount');

        // $row = 5;

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
        // $object->getActiveSheet()->mergeCells('B'.$row.':D3');

        // $end_char = 'D';
        // $end_col = PHPExcel_Cell::columnIndexFromString($end_char);

        // $end_char_final = PHPExcel_Cell::stringFromColumnIndex(--$end_col);



        $row = 5;
        $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, 'Site Name');
        $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $site_name);
        $object->getActiveSheet()->mergeCells('C'.$row.':I'.$row);

        $row++;
        $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, $requisition_period);
        $object->getActiveSheet()->mergeCells('B'.$row.':I'.$row);

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

        foreach ($supplier_lists as $key => $value) {

            $row++;

            $object->getActiveSheet()->setCellValueByColumnAndRow(1, $row, ($key+1));
            $object->getActiveSheet()->getStyle('B'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(2, $row, $value->alias_code);
            $object->getActiveSheet()->getStyle('C'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(3, $row, $value->description);
            $object->getActiveSheet()->getStyle('D'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('D')->setAutoSize(true); 

            $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, $value->hsn_code);
            $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);            

            $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, $value->gst_per. '%');
            $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(6, $row, $value->total_quantity);
            $object->getActiveSheet()->getStyle('G'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(7, $row, $value->total_rate);
            $object->getActiveSheet()->getStyle('H'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);

            $object->getActiveSheet()->setCellValueByColumnAndRow(8, $row, $value->net_total);
            $object->getActiveSheet()->getStyle('I'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('I')->setAutoSize(true);

        }

        $row++;
        $row++;
        $row++;

        $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, 'Taxable Amount');
        $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);

        $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, 'Tax Rate');
        $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);

        $object->getActiveSheet()->setCellValueByColumnAndRow(6, $row, 'Tax Amount');
        $object->getActiveSheet()->getStyle('G'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);

        $object->getActiveSheet()->setCellValueByColumnAndRow(7, $row, 'Total');
        $object->getActiveSheet()->getStyle('H'.$row)->getAlignment()->setWrapText(true);
        $object->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);


        foreach ($tax_info_arr as $key => $value) {
            
            $row++;

            $object->getActiveSheet()->setCellValueByColumnAndRow(3, $row, $value['text']);
            $object->getActiveSheet()->getStyle('D'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);


            $object->getActiveSheet()->setCellValueByColumnAndRow(4, $row, $value['value']);
            $object->getActiveSheet()->getStyle('E'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);


            $object->getActiveSheet()->setCellValueByColumnAndRow(5, $row, $value['tax_label'].( !empty($value['tax_label']) ? '%' : ''));
            $object->getActiveSheet()->getStyle('F'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);


            $object->getActiveSheet()->setCellValueByColumnAndRow(6, $row, $value['tax']);
            $object->getActiveSheet()->getStyle('G'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);


            $object->getActiveSheet()->setCellValueByColumnAndRow(7, $row, $value['total']);
            $object->getActiveSheet()->getStyle('H'.$row)->getAlignment()->setWrapText(true);
            $object->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);



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
