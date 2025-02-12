<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\TextFormatTraits;
class ReceiptCollection extends JsonResource
{
    use TextFormatTraits;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->app_type,
            'queue_number' => $this->formatTextTicket($this->vehicleWalkin->queue_number),
            'current_time' => now()->format('M j, Y g:i A'),
            'qr_code' => route('customer.printed', $this->qr_slug),
            'customer_name' => $this->customer->name
        ];
    }
}
