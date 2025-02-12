<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Queuing\Appointment;
use Inertia\Inertia;
use App\Http\Resources\ReceiptCollection;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrGeneratorController extends Controller
{
    //
    public function show($id){
        $appointment = Appointment::with(['customer', 'vehicleWalkin'])->where('qr_slug', $id)->first();
        $collection = new ReceiptCollection($appointment);
        return Inertia::render('QRcode/Show', [
            'receipt' => new ReceiptCollection($appointment),
        ]);
    }
}
