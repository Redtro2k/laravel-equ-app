<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Models\WalkIn;

trait GenerateTicketTraits
{
    //
    public function generateTicket(): int
    {
        $get_customer_by_current_date = WalkIn::whereDate('created_at', Carbon::today())->latest()->first();
        $checkValue = $get_customer_by_current_date->queue_number ?? 0;
        return $checkValue + 1;
    }

    public function generateSA($sa){
        if($sa == 0){
            // create a algrothim for this selecting SA available
        }
    }
}
