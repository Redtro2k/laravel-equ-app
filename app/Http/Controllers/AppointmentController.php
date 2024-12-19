<?php

namespace App\Http\Controllers;

use App\Models\Queuing\Appointment;
use App\Models\Vehicle;
use Inertia\Inertia;
use App\Models\Customer;
use App\Http\Requests\Appointment\AppointmentStoreRequest;
use App\Models\User;
use Carbon\Carbon;
use App\Http\Resources\VehicleCollection;

class AppointmentController extends Controller
{
    //
    public function index(){
        $sa = User::has('sa')
            ->get()
            ->map(function ($user) {
                return [
                    'name' => $user->name,
                    'group_no' => $user->sa->group_no ?? null,
                ];
            });
        $vehicles = VehicleCollection::collection(Vehicle::all());
        return Inertia::render('Appointment/Index', [
            'Sa' => $sa,
            'Vehicles' => $vehicles,
        ]);
    }
    public function store(AppointmentStoreRequest $request){
        $request->validated();

        if($request->user()->cannot('store', Customer::class)){
            abort(403);
        }
        $customer = Customer::updateOrCreate(
            ['email' => $request->email],[
            'name' => $request->name,
            'contact_number' => $request->contact_number,
            'has_viber' => $request->has_viber,
            'viber' => $request->viber,
            'source' => $request->source,
            'is_senior_or_pwd' => $request->is_senior_or_pwd,
            'created_by' => auth()->user()->id,
        ]);
        $newVehicle = Customer::find($customer->id);
        $vehicle = $newVehicle->vehicle()->create([
            'model' => $request->model,
            'plate_number' => $request->plate_number,
            'cs_no' => $request->cs_no,
            'selling_dealer' => $request->selling_dealer
        ]);
        $newAppointment = Vehicle::find($vehicle->id);

        $date = Carbon::createFromFormat('Y-m-d h:i:s A', $request->date_time);

        $newAppointment->appointment()->create([
            'advisor' => 2,
            'app_datetime' => $date->format('Y-m-d h:i:s'),
            'app_id' => 001,
            'appointment_by' => auth()->user()->id
        ]);
    }
}
