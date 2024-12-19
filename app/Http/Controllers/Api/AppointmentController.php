<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Queuing\Appointment;

class AppointmentController extends Controller
{
    //
    public function index(Request $request){
        if(!$request->wantsJson()){
            abort(403);

        }else{
            return response()->json(Appointment::all());
        }
    }
}
