<?php

namespace App\Http\Controllers;

use App\Models\WalkIn;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Queuing\Appointment;
use App\Http\Resources\QueueCollection;

class QueueController extends Controller
{
    public function index(){
        if(!auth()->check()){
            return abort(403);
        }
        sleep(2);
        $queues = Appointment::
            with(['serviceAdvisor', 'vehicle', 'vehicle.customer', 'vehicleWalkin'])
            ->has('vehicleWalkin')
            ->whereHas('serviceAdvisor', function($query) {
                    $query->where('advisor', auth()->user()->id);
                })
            ->where('app_datetime', '>=', now());

        $c_queues = clone $queues;

        $currentQueue = $queues->first();
        $nextQueue = $queues->skip(1)->first();

        $finished = $c_queues->whereHas('vehicleWalkin', function($q){
            $q->where('is_complete', true);
        })->count();


        return Inertia::render('ServiceAdvisor/Show', [
            'queues' => QueueCollection::collection($queues->paginate(5)),
            'current' => $currentQueue ? new QueueCollection($currentQueue) : null,
            'next' => $nextQueue ? new QueueCollection($nextQueue) : null,
            'finished' => $finished,
            'solve' => [
                'all_complete' => $finished,
                'all_queue' => $queues->count()
            ],
        ]);
    }
    public function setActive(){
        if(!auth()->check()){
            return abort(419);
        }
//        auth()->user()
        if(auth()->user()->hasRole('sa')){
            return abort(403);
        }
        $user = User::find(auth()->user()->id);
        $user->is_active = true;
        $user->save();

        return redirect()->back();
    }
    public function setInactive(){
        if(!auth()->check()){
            return abort(403);
        }
        if(auth()->user()->hasRole('sa')){
            return abort(403);
        }
        $user = User::find(auth()->user()->id);
        $user->is_active = false;
        $user->save();
        return redirect()->back();
    }
    public function nextCustomer($id){
        $appointment = Appointment::find($id);
        $appointment->vehicleWalkin->is_complete = true;
        $appointment->vehicleWalkin->save();
        return redirect()->back();
    }
}
