<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Traits\TextFormatTraits;


class QueueCollection extends JsonResource
{
    use TextFormatTraits;
    public function toArray(Request $request): array
    {
        return [
                'appointment_id' => $this->id,
                'queue_no' => $this->when($this->relationLoaded('vehicleWalkin'), fn() => $this->vehicleWalkin->queue_id_type),
                'plate_number' => $this->when($this->relationLoaded('vehicle'), fn() => strtoupper($this->vehicle->plate_number)),
                'cs' => $this->when($this->relationLoaded('vehicle'), fn() => strtoupper($this->vehicle->cs_no)),
                'vehicle_model' => $this->when($this->relationLoaded('vehicle'), fn() => strtoupper($this->vehicle->model)),
                'time' => $this->app_datetime ? Carbon::parse($this->app_datetime)->format('g:i A') : null,
            ];
    }
}
