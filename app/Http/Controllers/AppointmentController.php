<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Customer;
use App\Http\Requests\Appointment\AppointmentStoreRequest;

class AppointmentController extends Controller
{
    //
    public function index(){
        return Inertia::render('Appointment/Index');
    }
    public function store(AppointmentStoreRequest $request){
        $request->validated();

        if($request->user()->cannot('store', Customer::class)){
            abort(403);
        }
        Customer::updateOrCreate(
            ['email' => $request->email],[
            'name' => $request->name,
            'contact_number' => $request->contact_number,
            'has_viber' => $request->has_viber,
            'viber' => $request->viber,
            'source' => $request->source,
            'is_senior_or_pwd' => $request->is_senior_or_pwd,
            'created_by' => auth()->user()->id
        ]);
        return response()->json(['message' => 'Appointment added successfully.']);
    }
}
