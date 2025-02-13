<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Queuing\Appointment;
class ReceiptController extends Controller
{
    //
    public function show($id){
        $appointment = Appointment::with('customer')->where('qr_slug')->get();
        if(!$appointment){
            return abort(403);
        }
    }
}
