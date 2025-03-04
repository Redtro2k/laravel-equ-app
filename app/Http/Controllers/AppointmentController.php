<?php

namespace App\Http\Controllers;

use App\Http\Resources\QueuingSingleCollection;
use App\Models\Queuing\Appointment;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Customer;
use App\Http\Requests\Appointment\AppointmentStoreRequest;
use App\Models\User;
use Carbon\Carbon;
use App\Http\Resources\VehicleCollection;
use App\Traits\GenerateTicketTraits;

class AppointmentController extends Controller
{
    //
    use GenerateTicketTraits;
    public function index(){
        $sa = User::has('sa')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'group_no' => $user->sa->group_no ?? null,
                ];
            });
        $vehicles = VehicleCollection::collection(Vehicle::all());

        $search = request()->has('search') ? request()->input('search') : null;


        $selectAppointment = Appointment::find($search);

        return Inertia::render('Appointment/Index', [
            'Sa' => $sa,
            'Vehicles' => $vehicles,
            'select_appointment' => request()->filled('search') ? new QueuingSingleCollection($selectAppointment) : null
        ]);
    }
    public function store(AppointmentStoreRequest $request){
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

            $date = Carbon::createFromFormat('Y-m-d h:i A', $request->date_time);
            $now = Carbon::now();

            $newAppointment->appointment()->create([
                'advisor' => $this->generateSA($request->sa),
                'appointment_by' => auth()->user()->id,
                'app_datetime' => $date,
                'comment' => $request->comment,
                'isPreferred' => $request->input('sa') !== 0,
                'qr_slug' => $now->isSameDay($date) ? Str::uuid() : null,
                'app_type' => $now->isSameDay($date) ? 'WALK-IN' : 'APPOINTMENT',
                'status' => $now->isSameDay($date) ? 'queue' : 'pending',
            ]);
            // identify the current date or not
            if($now->isSameDay($date)){
                $newAppointment->walkIn()->create([
                    'date_arrived' => $now,
                    'queue_number' => $this->generateTicket()
                ]);
            }
        return redirect()->route('appointment.index')->with('success', 'Successfully appointment');

    }
    public function addQueue(Request $request){
        $newQueuing = Appointment::find($request->id);
        $date = Carbon::parse($request->app_date);
        if(!$newQueuing){
            abort(404);
        }
        if(Carbon::now()->isSameDay($date)){
            $newQueuing->update([
                'qr_slug' => str::uuid(),
                'status' => 'queue'
            ]);
            $newQueuing->vehicleWalkin()->create([
                'vehicle_id' => $newQueuing->vehicle_id,
                'date_arrived' => Carbon::now(),
                'queue_number' => $this->generateTicket(true)
            ]);
        }
    }
}
