<?php

namespace App\Http\Controllers;

use App\ItemCalc;
use Illuminate\Http\Request;

class ItemCalcController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $items = ItemCalc::all();
        return response()->json($items,200);
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

            $item = ItemCalc::find($data['id']);
            $item->description = $data['description'];
            $item->hsn_code = $data['hsn_code'];
            $item->brand = $data['brand'];
            $item->unit = $data['unit'];
            $item->gst_perc = $data['gst_perc'];
            $item->cost_pre_gst = $data['cost_pre_gst'];
            $item->mrp = $data['mrp'];
            $item->mrp_pre_gst = $data['mrp_pre_gst'];
            $item->max_profit_chargeable = $data['maximum_profit_chargeable'];
            $item->profit_margin = $data['profit_margin'];
            $item->selling_price = $data['selling_price'];

            if($item->save()) {
                return response()->json('Item Updated Successfully', 200);
            } else {
                return response()->json('Item Update Failed', 400);
            }

        } else {

            $item = new ItemCalc;
            $item->description = $data['description'];
            $item->brand = $data['brand'];
            $item->unit = $data['unit'];
            $item->hsn_code = $data['hsn_code'];
            $item->gst_perc = $data['gst_perc'];
            $item->cost_pre_gst = $data['cost_pre_gst'];
            $item->mrp = $data['mrp'];
            $item->mrp_pre_gst = $data['mrp_pre_gst'];
            $item->max_profit_chargeable = $data['maximum_profit_chargeable'];
            $item->profit_margin = $data['profit_margin'];
            $item->selling_price = $data['selling_price'];

            if($item->save()) {
                return response()->json('Item Added Successfully', 200);
            } else {
                return response()->json('Item Add Failed', 400);
            }

        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ItemCalc  $ItemCalc
     * @return \Illuminate\Http\Response
     */
    public function show(ItemCalc $ItemCalc)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ItemCalc  $ItemCalc
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $item = ItemCalc::find($id);
        return response()->json($item, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ItemCalc  $ItemCalc
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ItemCalc $ItemCalc)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ItemCalc  $ItemCalc
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $item = ItemCalc::find($id);
        if($item->delete()) {
            return response()->json('Item Deleted Successfully', 200);
        } else {
            return response()->json('Item Delete Failed', 400);
        }
    }
}
