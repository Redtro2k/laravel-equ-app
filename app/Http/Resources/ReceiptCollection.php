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
            'queue_number' => $this->vehicleWalkin->queue_id_type,
            'date_issued' => now()->format('M j, Y g:i A'),
            'qr_code' => route('customer.printed', $this->qr_slug),
            'customer_name' => $this->customer->name,
            'status' => $this->statusLog($this->status)
        ];
    }

    public function statusLog($status): array
    {
        return match($status){
            "pending" => ['type' => 'yellow', 'text' => 'Please go to the receptionist and ask for a queue ticket.'],
            "queue" => ['type' => 'yellow','text' => 'You’re in the queue—please wait.'],
            "processing" => ['type' => 'indigo', 'text' => 'You are now in line'],
            "completed" => ['type' => 'green', 'text' => 'Congratulations!'],
            default => ['type' => 'red', 'text' => 'error...'],
        };
    }
}
