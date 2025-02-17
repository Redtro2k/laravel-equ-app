<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReceiptCollection;
use Illuminate\Http\Request;
use App\Models\Queuing\Appointment;
use Inertia\Inertia;
class ReceiptController extends Controller
{
    //
    public function show($id){
        $appointment = Appointment::with('customer', 'log', 'serviceAdvisor', 'serviceAdvisor.sa')->where('qr_slug', $id)->first();
        if(!$appointment){
            return abort(403);
        }
        return Inertia::render('Printed/Show', [
            'customer' => new ReceiptCollection($appointment)
        ]);
    }
}
