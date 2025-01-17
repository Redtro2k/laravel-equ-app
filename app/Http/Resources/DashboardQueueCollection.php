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
            'title' => $this->formatTextTicket($this->queue_number),
            'description' => $this->vehicles->plate_number,
            'start' => $this->appointmentVehicle->app_datetime,
        ];
    }
}
