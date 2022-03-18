<?php

namespace App\Http\Controllers;

use App\ItemMaster;
use Illuminate\Http\Request;

class ItemMasterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $data = $request->all();
        $items = ItemMaster::where('name','like','%'. $data['s'] .'%')->get();
        if(count($items) > 0) {
            $items = ItemMaster::where('name','like','%'. $data['s'] .'%')->get();
            return response()->json(['results' => $items],200);
        } else {
            return response()->json(['results' => array(array('name' => $data['s']))],200);
        }
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

            $item = ItemMaster::find($data['id']);
            $item->name = $data['name'];

            if($item_type->save()) {
                return response()->json('Item Updated Successfully', 200);
            } else {
                return response()->json('Item Update Failed', 400);
            }

        } else {

            $item = new ItemMaster;
            $item->name = $data['name'];

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
     * @param  \App\ItemMaster  $ItemMaster
     * @return \Illuminate\Http\Response
     */
    public function show(ItemMaster $ItemMaster)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ItemMaster  $ItemMaster
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $item = ItemMaster::find($id);
        return response()->json($item, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ItemMaster  $ItemMaster
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ItemMaster $ItemMaster)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ItemMaster  $ItemMaster
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $item = ItemMaster::find($id);
        if($item->delete()) {
            return response()->json('Item Deleted Successfully', 200);
        } else {
            return response()->json('Item Delete Failed', 400);
        }
    }
}
