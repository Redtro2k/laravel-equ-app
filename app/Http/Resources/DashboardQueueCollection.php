<?php

namespace App\Http\Resources;

use App\Traits\TextFormatTraits;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardQueueCollection extends JsonResource
{
    use TextFormatTraits;
    public function toArray(Request $request): array
    {

        return [
            'title' => '(SA'.$this->appointmentVehicle->serviceAdvisor->sa->group_no.')#'.$this->formatTextTicket($this->queue_number). ' - '.strtoupper($this->vehicles->plate_number),
            'start' => $this->appointmentVehicle->app_datetime,
        ];
    }
}
