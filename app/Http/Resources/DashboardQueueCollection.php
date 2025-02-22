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
            'title' => 'Counter ' .$this->appointmentVehicle->serviceAdvisor->sa->group_no.' - #'.$this->queue_id_type,
            'start' => $this->appointmentVehicle->app_datetime,
        ];
    }
}
