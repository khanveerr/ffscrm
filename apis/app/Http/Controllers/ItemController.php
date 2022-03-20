<?php

namespace App\Http\Controllers;

use App\Item;
use App\Zone;
use App\ItemType;
use Illuminate\Http\Request;
use Image;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($zone_id, $type_id, $keyword = null)
    {
        //
        $items = Item::select('id','alias_code','description','hsn_code','gst_per','image','type_id','zone_id','rate');
        if(isset($zone_id) && !empty($zone_id) && $zone_id != null && $zone_id != 0) {
            $items = $items->where('zone_id','=',$zone_id);
        }
        if(isset($type_id) && !empty($type_id) && $type_id != null && $type_id != 0) {
            $items = $items->where('type_id','=',$type_id);
        }

        if ($keyword != null && !empty($keyword)) {
            $items = $items->where('description','like','%'.$keyword.'%');
        }

        $items = $items->orderBy('id')->orderBy('alias_code')->paginate(50);
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

            $item = Item::find($data['id']);
            //$item->alias_code = $data['alias_code'];
            $item->description = $data['description'];
            $item->hsn_code = $data['hsn_code'];
            $item->gst_per = $data['gst_perc'];
            $item->rate = $data['rates'];
            $item->type_id = $data['type_id'];
            $item->zone_id = $data['zone_id'];

            $image_file = $request->file('image_file');

            if(isset($image_file) && !empty($image_file) && $image_file != "") {

                $filename = time().'.jpg';
                $filepath = public_path()."/uploads/req_items/";
                $thumbnailImage = Image::make($image_file);
                $thumbnailImage->resize(150,150, function($constraint) {
                    $constraint->aspectRatio();
                });
                $thumbnailImage->save($filepath.$filename);

                $item->image = $filename;

            } else {

                $item->image = $data['old_image_file'];

            }

            if($item->save()) {
                return response()->json('Item Updated Successfully', 200);
            } else {
                return response()->json('Item Update Failed', 400);
            }

        } else {

            $item = new Item;
            $item->alias_code = $this->get_alias_code($data['zone_id'],$data['type_id']);
            $item->description = $data['description'];
            $item->hsn_code = $data['hsn_code'];
            $item->gst_per = $data['gst_perc'];
            $item->rate = $data['rates'];
            $item->type_id = $data['type_id'];
            $item->zone_id = $data['zone_id'];

            $image_file = $request->file('image_file');

            if(isset($image_file) && !empty($image_file) && $image_file != "") {

                $filename = time().'.jpg';
                $filepath = public_path()."/uploads/req_items/";
                $thumbnailImage = Image::make($image_file);
                $thumbnailImage->resize(150,150, function($constraint) {
                    $constraint->aspectRatio();
                });
                $thumbnailImage->save($filepath.$filename);

                $item->image = $filename;

            }

            if($item->save()) {
                return response()->json('Item Added Successfully', 200);
            } else {
                return response()->json('Item Add Failed', 400);
            }

        }
    }


    public function get_alias_code($zone_id, $type_id) {


        $item = Item::where('zone_id','=',$zone_id)->where('type_id','=',$type_id)->orderBy('id','desc')->first();
        $zone = Zone::find($zone_id);
        $item_type = ItemType::find($type_id);

        $alias_code_str = '';

        if ($zone->zone_name == 'Pan India') {
            
            if ($item_type->name == 'Housekeeping') {
                $alias_code_str = 'HKM';
            } else if ($item_type->name == 'Stationery') {
                $alias_code_str = 'STM';
            } else if ($item_type->name == 'Food & Beverage') {
                $alias_code_str = 'FBM';
            }

        } else if ($zone->zone_name == 'Bangalore') {
            
            if ($item_type->name == 'Housekeeping') {
                $alias_code_str = 'BG';
            } else if ($item_type->name == 'Stationery') {
                $alias_code_str = 'STBR';
            }   

        } else if ($zone->zone_name == 'J&K') {
            
            if ($item_type->name == 'Housekeeping') {
                $alias_code_str = 'SJK';
            }  

        }

        $new_alias_code_no = 0;
        $str_part_len = 0;

        if (!empty($item)) {

            $last_alias_code = $item->alias_code; // HKM7
            $str_part_len = strlen($alias_code_str); //3

            $alias_code_no = substr($last_alias_code, $str_part_len); // 7
            $new_alias_code_no = (int) $alias_code_no + 1;

        } else {
            $new_alias_code_no = 1;
        }

        $alias_code = $alias_code_str.$new_alias_code_no;

        return $alias_code;

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
        $item = Item::find($id);
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
        $item = Item::find($id);
        if($item->delete()) {
            return response()->json('Item Deleted Successfully', 200);
        } else {
            return response()->json('Item Delete Failed', 400);
        }
    }
}
