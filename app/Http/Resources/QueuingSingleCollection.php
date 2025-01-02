<?php

namespace App\Http\Resources;

use App\Traits\TextFormatTraits;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class QueuingSingleCollection extends JsonResource
{

    use TextFormatTraits;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'appt_id' => $this->formatTextTicket($this->app_id),
            'name' => $this->vehicle->customer->name,
            'plate' => strtoupper($this->vehicle->plate_number),
            'cs_no' => strtoupper($this->vehicle->cs_no),
            'appointment_date' => $this->app_datetime,
            'sa_name' => $this->serviceAdvisor->name,
        ];
    }
}
