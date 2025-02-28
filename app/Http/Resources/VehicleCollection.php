<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\TextFormatTraits;

class VehicleCollection extends JsonResource
{
    use TextFormatTraits;

    public function toArray(Request $request): array
    {
        return [
            'title' => $this->walkIn()->exists()
                ? $this->walkIn->queue_id_type
                : $this->plate_number,
            'start' => $this->appointment->app_datetime,
            'end' => $this->appointment->app_end_datetime,
            'description' => 'the customer '. $this->customer->name . ' has been set an Appointment and assign to Service Advisor '.$this->appointment->serviceAdvisor->name.'.',
            'id' => $this->appointment->id,

        ];
    }
    public function dateFormat($date)
    {
        if(!$date){
            return null;
        }
        else{
            return Carbon::parse($date)->format("Y-m-d\TH:i:sP");
        }
    }
}
