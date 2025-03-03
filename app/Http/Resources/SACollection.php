<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SACollection extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' =>  $this->name,
            'group_no' => 'Counter '.$this->sa->group_no,
            'current_assigned_customer' => $this->appointments
                ->first()->vehicleWalkin->queue_id_type ?? 'No Queue'
        ];
    }
}
