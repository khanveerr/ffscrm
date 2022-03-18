<?php

namespace App\Http\Controllers;

use App\ItemType;
use Illuminate\Http\Request;

class ItemTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($keyword = null)
    {
        //
        $item_types = ItemType::where('status','=',1);

        if ($keyword != null && !empty($keyword) && $keyword != "undefined") {
            $item_types = $item_types->where('name','like','%'.$keyword.'%');
        }

        $item_types = $item_types->orderBy('name','asc')->paginate(30);

        return response()->json($item_types,200);
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

            $item_type = ItemType::find($data['id']);
            $item_type->name = $data['name'];
            $item_type->code = $data['code'];
            $item_type->status = 1;

            if($item_type->save()) {
                return response()->json('Item Type Updated Successfully', 200);
            } else {
                return response()->json('Item Type Update Failed', 400);
            }

        } else {

            $item_type = new ItemType;
            $item_type->name = $data['name'];
            $item_type->code = $data['code'];
            $item_type->status = 1;

            if($item_type->save()) {
                return response()->json('Item Type Added Successfully', 200);
            } else {
                return response()->json('Item Type Add Failed', 400);
            }

        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ItemType  $itemType
     * @return \Illuminate\Http\Response
     */
    public function show(ItemType $itemType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ItemType  $itemType
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $item_type = ItemType::find($id);
        return response()->json($item_type, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ItemType  $itemType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ItemType $itemType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ItemType  $itemType
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $item_type = ItemType::find($id);
        if($item_type->delete()) {
            return response()->json('Item Type Deleted Successfully', 200);
        } else {
            return response()->json('Item Type Delete Failed', 400);
        }
    }
}
