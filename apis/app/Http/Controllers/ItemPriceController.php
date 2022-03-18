<?php

namespace App\Http\Controllers;

use App\ItemPrice;
use App\ReqVendor;
use Illuminate\Http\Request;
use Image;

class ItemPriceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($item_id)
    {
        //
        $item_prices = ItemPrice::where('item_id','=',$item_id)->get();

        foreach ($item_prices as $key => $value) {

            $value->item_id = (int) $value->item_id;
            $value->rate = (float) $value->rate;
            $value->status = (int) $value->status;
            $value->vendor_id = (int) $value->vendor_id;

            $vendor = ReqVendor::find($value->vendor_id);
            if (!empty($vendor)) {
                $value->vendor_name = $vendor->name;
            } else {
                $value->vendor_name = '';
            }
        }

        return response()->json($item_prices,200);
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


        if(isset($data['id']) && $data['id'] != null && !empty($data['id']) && $data['id'] != "") {

            $item = ItemPrice::find($data['id']);
            $item->item_id = $data['item_id'];
            $item->vendor_id = $data['vendor_id'];
            $item->rate = $data['rate'];
            $item->status = $data['status'];

            if($item->save()) {
                return response()->json('Item Price Updated Successfully', 200);
            } else {
                return response()->json('Item Price Update Failed', 400);
            }

        } else {


            $item = ItemPrice::where('item_id','=',$data['item_id'])->where('vendor_id','=',$data['vendor_id'])->get();

            if (count($item) > 0) {
                return response()->json('Item Price Already Added', 400);
            } else {

                $item = new ItemPrice;
                $item->item_id = $data['item_id'];
                $item->vendor_id = $data['vendor_id'];
                $item->rate = $data['rate'];
                //$item->status = $data['status'];

                if($item->save()) {
                    return response()->json('Item Price Added Successfully', 200);
                } else {
                    return response()->json('Item Price Add Failed', 400);
                }

            }

        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function show(Item $Item)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $item = ItemPrice::find($id);
        return response()->json($item, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Item $item)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $item = ItemPrice::find($id);
        if($item->delete()) {
            return response()->json('Item Price Deleted Successfully', 200);
        } else {
            return response()->json('Item Price Delete Failed', 400);
        }
    }
}
