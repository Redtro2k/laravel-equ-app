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
            'title' => '#'. $this->formatTextTicket($this->appointment->app_id). '| '. $this->plate_number,
            'start' => $this->dateFormat($this->appointment->app_datetime),
            'end' => $this->dateFormat($this->appointment->app_end_datetime),
            'description' => 'the customer '. $this->customer->name . ' has been set an Appointment and assign to Service Advisor '.$this->appointment->serviceAdvisor->name.'.'
        ];
    }
    public function dateFormat($date)
    {
        return Carbon::parse($date)->format("Y-m-d\TH:i:sP");
    }
}