<?php

namespace App\Http\Controllers;

use App\Company;
use App\Vendor;
use App\Inventory;
use App\Category;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $inventories = Inventory::where('status','=',1)->paginate(10);
        foreach ($inventories as $key => $value) {
            
            $company = Company::find($value->company_id);
            $vendor = Vendor::find($value->vendor_id);
            $category = Category::find($value->category_id);

            if(isset($company) && !empty($company)) {
                $value->company_name = $company->name;
            } else {
                $value->company_name = '';
            }

            if(isset($vendor) && !empty($vendor)) {
                $value->vendor_name = $vendor->name;
            } else {
                $value->vendor_name = '';
            }

            if($category->name == 'Machines') {
                $value->is_machines = 1;
            } else {
                $value->is_machines = 0;
            }

        }
        return response()->json($inventories,200);
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


        if(array_key_exists('id', $data) && isset($data['id']) && !empty($data['id'])) {

            $inventory = Inventory::find($data['id']);
            $inventory->company_id = $data['company_id'];
            $inventory->request_from_id = $data['request_from_id'];
            $inventory->approved_by_id = $data['approved_by_id'];
            $inventory->category_id = $data['category_id'];
            $inventory->product_description = $data['product_description'];
            $inventory->vendor_id = $data['vendor_id'];
            $inventory->brand_id = $data['brand_id'];
            $inventory->serial_no = $data['serial_no'];
            $inventory->model_no_id = $data['model_no_id'];
            $inventory->asset_code = $data['asset_code'];
            $inventory->asset_code_no = 1;
            $inventory->purchase_cost = (int) $data['purchase_cost'];
            $inventory->status = 1;

            if($inventory->save()) {
                return response()->json('Inventory Updated Successfully', 200);
            } else {
                return response()->json('Inventory Update Failed', 400);
            }

        } else {

            $inventory = new Inventory;
            $inventory->company_id = $data['company_id'];
            $inventory->request_from_id = $data['request_from_id'];
            $inventory->approved_by_id = $data['approved_by_id'];
            $inventory->category_id = $data['category_id'];
            $inventory->product_description = $data['product_description'];
            $inventory->vendor_id = $data['vendor_id'];
            $inventory->brand_id = $data['brand_id'];
            $inventory->serial_no = $data['serial_no'];
            $inventory->model_no_id = $data['model_no_id'];
            $inventory->asset_code = $data['asset_code'];
            $inventory->asset_code_no = 1;
            $inventory->purchase_cost = (int) $data['purchase_cost'];
            $inventory->status = 1;

            if($inventory->save()) {
                return response()->json('Inventory Added Successfully', 200);
            } else {
                return response()->json('Inventory Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Inventory  $inventory
     * @return \Illuminate\Http\Response
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Inventory  $inventory
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $inventory = Inventory::find($id);
        return response()->json($inventory, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Inventory  $inventory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Inventory $inventory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Inventory  $inventory
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $inventory = Inventory::find($id);
        if($inventory->delete()) {
            return response()->json('Inventory Deleted Successfully', 200);
        } else {
            return response()->json('Inventory Delete Failed', 400);
        }

    }
}
