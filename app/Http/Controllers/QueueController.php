<?php

namespace App\Http\Controllers;

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
            ->with('vehicleWalkin', 'vehicle')
            ->where('appointments.status', 'queue')
            ->whereBetween('appointments.app_datetime', [now()->startOfDay(), now()->endOfDay()]);

            $current = request()->filled('current')
                ? (clone $appointmentQueries)->where('appointments.id', request('current'))->first()
                : (clone $appointmentQueries)->first();

            $next = (clone $appointmentQueries)->skip(1)->first();

        return Inertia::render('ServiceAdvisor/Index', [
            'queries' => QueueCollection::collection($appointmentQueries->paginate(25)),
            'current' =>  $current != null && $current->count() > 0 ? new QueueCollection($current) : null,
            'next' => $next !== null ?? new QueueCollection($next),
            'type_of_queues' => [
                'walkin' => $appointmentQueries->walkInOnly()->count(),
                'appointment' => $appointmentQueries->appointmentOnly()->count(),
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
        $startedObserver = new AppointmentObserver();
        $appointment = Appointment::find($id);

        $startedObserver->end($appointment);

        $appointment->vehicleWalkin->is_complete = true;
        $appointment->vehicleWalkin->save();
        //create logs
        $appointment->history()->create(['type' => 'completed']);
       // next que
        $next_appointment = Appointment::next($appointment->id);
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
        $appointment->log->callout = 1;
        $appointment->log->save();
        $appointment->history()->create(['type' => 'call']);
        return redirect()->back();
    }
}
