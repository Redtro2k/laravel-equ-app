<?php

namespace App\Http\Controllers;

use App\Http\Resources\QueuingSingleCollection;
use App\Models\Queuing\Appointment;
use App\Models\Vehicle;
use Illuminate\Http\Request;
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
                'app_datetime' => $date,
                'app_id' => 001,
                'app_type' => Carbon::now()->isSameDay(Carbon::parse($date)) ? 'WALK-IN' : 'APPOINTMENT',
                'appointment_by' => auth()->user()->id
            ]);
            // identify the current date or not
            if(Carbon::now()->isSameDay($date)){
                $newAppointment->walkIn()->create([
                    'date_arrived' => Carbon::now(),
                    'queue_number' => $this->generateTicket()
                ]);
            }
    }

    public function addQueue(Request $request){
        $newQueuing = Appointment::find($request->id);
        $date = Carbon::parse($request->app_date);
        if(!$newQueuing){
            abort(404);
        }
        if(Carbon::now()->isSameDay($date)){
            $newQueuing->walkIn()->create([
                'date_arrived' => Carbon::now(),
                'queue_number' => $this->generateTicket()
            ]);
        }
    }
}
