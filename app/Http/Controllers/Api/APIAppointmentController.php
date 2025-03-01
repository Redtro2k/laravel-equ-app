<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\{QueueCollection, CustomerCollection};
use Illuminate\Http\Request;
use App\Models\Queuing\Appointment;

class APIAppointmentController extends Controller
{
    //
    public function show($id){
        sleep(2);
        $appointment = Appointment::with(['vehicleWalkin', 'vehicle', 'customer'])->find($id);
        $appointmentCollection = new QueueCollection($appointment);
        if(!$appointment){
            return response()->json(['message' => 'Appointment not found'], 404);
        }
            return response()->json(['appointment' => $appointmentCollection, 'customer' => $appointment->customer], 200);
    }
}
