<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\{User, WalkIn};
use Inertia\Inertia;
use Carbon\Carbon;
use App\Http\Resources\{SACollection, DashboardQueueCollection};
class QueueDasboardController extends Controller
{
    //e
    public function index(){

        $sa = User::with(['sa', 'appointments' => function($query){
            $query->where('status', 'processing');
        }])->role('sa')->get();

        $queue = WalkIn::with(['vehicles', 'appointmentVehicle'])
            ->whereHas('appointmentVehicle', function ($query) {
                $query->where('status', 'queue');
            })
        ->whereBetween('date_arrived', [Carbon::now('Asia/Manila')->startOfDay(), Carbon::now('Asia/Manila')->endOfDay()])
        ->orderBy('queue_number', 'ASC')
        ->get();
        $collection = DashboardQueueCollection::collection($queue);
        return Inertia::render('Queue', ['sas' => SACollection::collection($sa), 'queue' => $collection]);
    }
}
