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
            'sa_assigned' => $this->serviceAdvisor->sa->group_no,
            'queue_number' => $this->formatTextTicket($this->vehicleWalkin->queue_number),
            'date_issued' => now()->format('M j, Y g:i A'),
            'qr_code' => route('customer.printed', $this->qr_slug),
            'customer_name' => $this->customer->name,
            'status' => $this->log()->exists() ? $this->statusLog($this->log) : ['type' => 'yellow','text' => 'You’re in the queue—please wait.']
        ];
    }

    public function statusLog($status){
        if($status->start_time){
            if($status->callout > 0){
                return ['type' => 'blue', 'text' => 'The service advisor is calling you.'];
            }
            return ['type' => 'indigo', 'text' => 'You are now in line'];
        }
        else if($status->end_time){
            return ['type' => 'green', 'text' => 'finished'];
        }
        else{
            return null;
        }
    }
}
