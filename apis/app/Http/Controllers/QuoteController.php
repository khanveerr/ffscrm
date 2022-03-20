<?php

namespace App\Http\Controllers;

use App\Quote;
use Illuminate\Http\Request;
use JWTAuth;

class QuoteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $quotes = Quote::paginate(10);
        return response()->json($quotes,200);
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
        $user = JWTAuth::parseToken()->authenticate();
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
        $data = $request->all();


        // if($data['id'] != null && !empty($data['id']) && $data['id'] != "") {

        //     $quote = Quote::find($data['id']);
        //     $quote->name = $data['name'];

        //     if($quote->save()) {
        //         return response()->json('Quote Updated Successfully', 200);
        //     } else {
        //         return response()->json('Quote Update Failed', 400);
        //     }

        // } else {

            $quote = new Quote;
            $quote->product_name = $data['product_name'];
            $quote->quantity = $data['quantity'];
            $quote->unit = $data['unit'];
            $quote->rate = $data['rate'];
            $quote->is_credit = 0;
            $quote->pincode = 0;
            $requirements = isset($data['requirements']) ? $data['requirements'] : '';
            $quote->requirements = $requirements;
            $quote->zone_id = $user->zone_id;
            $quote->submitted_by = $user->id;

            if($quote->save()) {

                $email = 'procurement@silagroup.co.in';
                $bccEmail = 'tanveer.khan@mrhomecare.in';

                \Mail::send('request_quote', ['product_name' => $data['product_name'], 'quantity' => $data['quantity'], 'unit' => $data['unit'], 'rate' => $data['rate'], 'requirements' => $requirements, 'submitted_by' => $user->name ], function ($message) use ($email, $bccEmail)
                {
                    $message->subject("Request Quote");
                    $message->from('info@silagroup.co.in', 'SILA Procurement');
                    $message->to($email);
                    $message->bcc($bccEmail);
                    $message->replyTo('procurement@silagroup.co.in');
                    //$message->cc(array('customercare@mrhomecare.in','accounts@mrhomecare.in'));

                });

                return response()->json('Quote Added Successfully', 200);
            } else {
                return response()->json('Quote Add Failed', 400);
            }

        // }

        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Quote  $quote
     * @return \Illuminate\Http\Response
     */
    public function show(Quote $quote)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Quote  $quote
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $quote = Quote::find($id);
        return response()->json($quote, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Quote  $quote
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Quote $quote)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Brand  $brand
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $quote = Quote::find($id);
        if($quote->delete()) {
            return response()->json('Quote Deleted Successfully', 200);
        } else {
            return response()->json('Quote Delete Failed', 400);
        }

    }
}
