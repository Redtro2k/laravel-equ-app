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
            'title' => $this->vehicleWalkin()->exists()
                    ? 'Queue No.'.$this->formatTextTicket($this->vehicleWalkin->queue_number)
                    : 'Set Appointment by on '.$this->queuingDateFormat($this->app_datetime)->format('M j, Y g:i A'),
            'appt_id' => $this->formatTextTicket($this->app_id),
            'appt_type' => $this->app_type,
            'date_arrival' => $this->relationLoaded('walkIn') ?  $this->queuingDateFormat($this->vehicle->walkIn->date_arrived)->diffForHumans() : 'pending',
            'name' => $this->vehicle->customer->name,
            'plate' => strtoupper($this->vehicle->plate_number),
            'cs_no' => strtoupper($this->vehicle->cs_no),
            'appointment_date' => $this->app_datetime,
            'sa_name' => $this->serviceAdvisor->name,
        ];
    }
    public function queuingDateFormat($date)
    {
        if (!$date) {
            return null;
        }

        return Carbon::createFromFormat('Y-m-d H:i:s', $date);
    }
}
