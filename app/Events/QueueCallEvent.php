<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QueueCallEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     *
     * @param string $message
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * The channel the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new Channel('channel-queue'); // ✅ FIX: Use Channel instance
    }

    /**
     * Customize the event name that is broadcast.
     */
    public function broadcastAs(): string
    {
        return 'queueCall'; // ✅ Name to be used in frontend `.listen('.queueCall')`
    }
}
