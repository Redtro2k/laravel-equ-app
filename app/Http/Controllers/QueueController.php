<?php

namespace App\Http\Controllers;

use App\Events\QueueCallEvent;
use Inertia\Inertia;
use App\Models\Queuing\Appointment;
use App\Http\Resources\QueueCollection;
use App\Models\User;
use App\Observers\AppointmentObserver;

class QueueController extends Controller
{
    public function index(){
        if(!auth()->check()){
            return abort(403);
        }
        if(request()->filled('choose') && !auth()->user()->is_active){
            return redirect()->back()->with('warning', 'you need to set your account active');
        }
        sleep(1);
        $appointmentQueries = Appointment::nowQueries()
            ->with(['vehicleWalkin', 'vehicle'])
            ->whereIn('appointments.status', ['queue', 'processing'])
            ->whereBetween('appointments.app_datetime', [now()->startOfDay(), now()->endOfDay()]);

            $current = request()->filled('current')
                ? (clone $appointmentQueries)->where('appointments.id', request('current'))->first()
                : (clone $appointmentQueries)->first();
            $next = (clone $appointmentQueries)->skip(1)->first();

        return Inertia::render('ServiceAdvisor/Index', [
            'queries' => QueueCollection::collection($appointmentQueries->paginate(25)),
            'current' =>  $current != null && $current->count() > 0 ? new QueueCollection($current) : null,
            'next' => $next != null ? new QueueCollection($next) : null,
            'type_of_queues' => [
                'appointment' => $appointmentQueries->appointmentOnly()->count(),
                'walkin' => $appointmentQueries->walkInOnly()->count(),
            ], // total of appointments  / total of walk-in
            'today_total_queries' => $appointmentQueries->count(),
            'today_queries_count' => [
                'finished' => (clone $appointmentQueries)->finished()->count(),
                'remaining' => (clone $appointmentQueries)->notFinished()->count(),
            ],
        ]);
    }
    public function setActive($id = null){
        if(auth()->user()->is_active){
            return redirect()->back()->with('warning', 'Your account is already active.');
        }
        $user = User::find(auth()->user()->id);
        $user->is_active = true;
        $user->save();

        if($id){
            $appointment = Appointment::find($id);
            if($appointment){
                $appointment->update([
                    'status' => 'processing'
                ]);
                $observer = new AppointmentObserver();
                $observer->started($appointment);
                // call the queuing
                event(new QueueCallEvent("Ticket ".$appointment->vehicleWalkin->queue_id_type.", ". implode(" ", str_split($appointment->vehicle->plate_number))." please proceed to counter ".$appointment->serviceAdvisor->sa->group_no));
            }
        }
        return redirect()->back()->with('success', 'Your account is active.');
    }
    public function setInactive(){
        if(!auth()->check()){
            return abort(419);
        }
        if(!auth()->user()->hasRole('sa')){
            return abort(403);
        }
        if(!auth()->user()->is_active){
            return redirect()->back()->with('warning', 'Your account is already inactive.');
        }
        $user = User::find(auth()->user()->id);
        $user->is_active = false;
        $user->save();
        return redirect()->back()->with('success', 'Your account is inactive.');
    }
    public function nextCustomer($id){
        $appointment = Appointment::find($id);
        $appointment->update([
            'status' => 'completed'
        ]);
        $startedObserver = new AppointmentObserver();
        $startedObserver->end($appointment);

        $appointment->vehicleWalkin->is_complete = true;
        $appointment->vehicleWalkin->save();
        //create logs
        $appointment->history()->create(['type' => 'completed']);
       // next que
        $next_appointment = Appointment::next($appointment->id, 'id', false)
            ->where('status', 'queue')
            ->whereBetween('app_datetime', [now()->startOfDay(), now()->endOfDay()])
            ->with(['vehicleWalkin', 'serviceAdvisor' => function($query){
                $query->where('id', auth()->user()->id);
            }])
            ->first();
        event(new QueueCallEvent("Ticket ".$next_appointment->vehicleWalkin->queue_id_type.", ". implode(" ", str_split($next_appointment->vehicle->plate_number))." please proceed to counter ".$next_appointment->serviceAdvisor->sa->group_no));
        //check if have a next que
        if(!$next_appointment){
            return redirect()->back()->with('warning', 'there is no next queue.');
        }
        $startedObserver->started($next_appointment);
        $next_appointment->log->callout = 1;
        $next_appointment->log->save();
        //set to start que
        return redirect()->back();
    }
    public function callAgain($id){
        $appointment = Appointment::find($id);
        event(new QueueCallEvent("Ticket ".$appointment->vehicleWalkin->queue_id_type.", ". implode(" ", str_split($appointment->vehicle->plate_number))." please proceed to counter ".$appointment->serviceAdvisor->sa->group_no));
        $appointment->log->callout = 1;
        $appointment->log->save();
        $appointment->history()->create(['type' => 'call']);
        return redirect()->back();
    }
}
