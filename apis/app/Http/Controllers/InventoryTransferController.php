<?php

namespace App\Http\Controllers;

use App\InventoryTransfer;
use App\CostCentre;
use App\Site;
use Illuminate\Http\Request;

class InventoryTransferController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        //
        $inventory_transfers = InventoryTransfer::where('inventory_id','=',$id)->where('status','=',1)->paginate(10);

        foreach ($inventory_transfers as $key => $value) {
            
            $site = Site::find($value->site_id);
            $trasferred_site = Site::find($value->transferred_site_id);
            if(!empty($site)) {
                $value->site_name = $site->name;
            } else {
                $value->site_name = '';
            }

            if(!empty($trasferred_site)) {
                $value->transferred_to_site_name = $trasferred_site->name;
            } else {
                $value->transferred_to_site_name = '';
            }

            $cost_centre = CostCentre::find($value->cost_centre_id);
            if(!empty($cost_centre)) {
                $value->cost_centre_name = $cost_centre->name;
            } else {
                $value->cost_centre_name = '';
            }

            $value->assigned_date_str = date('d M Y', strtotime($value->assigned_date));

        }

        return response()->json($inventory_transfers,200);
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


        if(array_key_exists('id', $data) && $data['id'] != null && !empty($data['id']) && $data['id'] != "") {

            $inventory_transfer = InventoryTransfer::find($data['id']);
            $inventory_transfer->inventory_id = $data['inventory_id'];
            $inventory_transfer->site_id = $data['site_id'];
            $inventory_transfer->cost_centre_id = $data['cost_centre_id'];
            $inventory_transfer->rental_amount = (int) $data['rental_amount'];
            $inventory_transfer->transferred_site_id = $data['transferred_site_id'];
            $inventory_transfer->status = 1;

            if($inventory_transfer->save()) {
                return response()->json('Inventory transfer Updated Successfully', 200);
            } else {
                return response()->json('Inventory transfer Update Failed', 400);
            }

        } else {

            $inventory_transfer = new InventoryTransfer;
            $inventory_transfer->inventory_id = $data['inventory_id'];
            $inventory_transfer->site_id = $data['site_id'];
            $inventory_transfer->cost_centre_id = $data['cost_centre_id'];
            $inventory_transfer->rental_amount = (int) $data['rental_amount'];
            $inventory_transfer->transferred_site_id = $data['transferred_site_id'];
            $inventory_transfer->status = 1;

            if($inventory_transfer->save()) {
                return response()->json('Inventory transfer Added Successfully', 200);
            } else {
                return response()->json('Inventory transfer Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\InventoryTransfer  $inventory_transfer
     * @return \Illuminate\Http\Response
     */
    public function show(InventoryTransfer $brand)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\InventoryTransfer  $inventory_transfer
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $inventory_transfer = InventoryTransfer::find($id);
        return response()->json($inventory_transfer, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\InventoryTransfer  $inventory_transfer
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Brand $brand)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\InventoryTransfer  $inventory_transfer
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $inventory_transfer = InventoryTransfer::find($id);
        if($inventory_transfer->delete()) {
            return response()->json('Inventory transfer Deleted Successfully', 200);
        } else {
            return response()->json('Inventory transfer Delete Failed', 400);
        }

    }
}
