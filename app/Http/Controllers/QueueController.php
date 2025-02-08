<?php

namespace App\Http\Controllers;

use App\Models\WalkIn;
use Carbon\Carbon;
use Illuminate\Http\Request;
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
        sleep(1);
        $queues = Appointment::sa(2);

//        $c_queues = clone $queues;
//
//        $currentQueue = $queues->first();
//        $nextQueue = $queues->skip(1)->first();
//
//        $finished = $c_queues->whereHas('vehicleWalkin', function($q){
//            $q->where('is_complete', true);
//        })->count();
        dd();

//        return Inertia::render('ServiceAdvisor/Show', [
//            'queues' => QueueCollection::collection($queues->paginate(5)),
//            'current' => $currentQueue ? new QueueCollection($queues->current()->first()) : null,
//            'next' => $nextQueue ? new QueueCollection($nextQueue) : null,
//            'finished' => $finished,
//            'solve' => [
//                'all_complete' => $finished,
//                'all_queue' => $queues->count()
//            ],
//        ]);
    }
    public function setActive($id){
        if(!auth()->check()){
            return abort(419);
        }
        if(!auth()->user()->hasRole('sa')){
            return abort(403);
        }
        if(auth()->user()->is_active){
            return redirect()->back()->with('warning', 'Your account is already active.');
        }
        $user = User::find(auth()->user()->id);
        $user->is_active = true;
        $user->save();

        $appointment = Appointment::find($id);
        if($appointment){
            $observer = new AppointmentObserver();
            $observer->started($appointment);
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
