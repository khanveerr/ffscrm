<?php

namespace App\Http\Controllers;

use App\Company;
use App\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $vendors = Vendor::where('status','=',1)->paginate(10);
        foreach ($vendors as $key => $value) {
            
            $company = Company::find($value->company_id);
            if(isset($company) && !empty($company)) {
                $value->company_name = $company->name;
            } else {
                $value->company_name = '';
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

            $vendor = Vendor::find($data['id']);
            $vendor->name = $data['name'];
            $vendor->company_id = $data['company_id'];
            $vendor->status = 1;

            if($vendor->save()) {
                return response()->json('Vendor Updated Successfully', 200);
            } else {
                return response()->json('Vendor Update Failed', 400);
            }

        } else {

            $vendor = new Vendor;
            $vendor->name = $data['name'];
            $vendor->company_id = $data['company_id'];
            $vendor->status = 1;

            if($vendor->save()) {
                return response()->json('Vendor Added Successfully', 200);
            } else {
                return response()->json('Vendor Add Failed', 400);
            }

        }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Vendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Vendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $vendor = Vendor::find($id);
        return response()->json($vendor, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Vendor  $vendor
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Company $company)
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
        $vendor = Vendor::find($id);
        if($vendor->delete()) {
            return response()->json('Vendor Deleted Successfully', 200);
        } else {
            return response()->json('Vendor Delete Failed', 400);
        }

    }
}
