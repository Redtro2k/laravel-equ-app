<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Models\WalkIn;
use App\Models\User;

trait GenerateTicketTraits
{
    //
    public function generateTicket(): int
    {
        $get_customer_by_current_date = WalkIn::whereDate('created_at', Carbon::today())->latest()->first();
        $checkValue = $get_customer_by_current_date->queue_number ?? 0;
        return $checkValue + 1;
    }

    public function generateSA($sa = null){
        if($sa == null || $sa == 0){
            $advisor = User::with(['sa'])
                ->withCount(['appointments' => function ($query) {
                    $query->where('app_datetime', '>=', now());
                }
                ])
                ->role('sa')
                ->where('is_active', 1)
                ->get();
            // get user SA where active are zero
            if($advisor->count() > 0){
                // if zero yung irereturn kukuha siya ng isa random na SA
                return $advisor->random()->id;
            }
            else{
                return $advisor->orderBy('appointments_count', 'asc')->first()->id;
            }
        }
        else{
            return $sa;
        }
    }
}
