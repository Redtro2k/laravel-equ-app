<?php

namespace App\Observers;

use App\Models\Queuing\Appointment;
use Illuminate\Support\Facades\Log;

class AppointmentObserver
{
    /**
     * Handle the Appointment "created" event.
     */
    public function created(Appointment $appointment): void
    {
        //
    }

    // custom functtion
    public function started(Appointment $appointment): void
    {
        Log::info("Appointment started". $appointment->id);
        $appointment->log()->updateOrCreate( // for start
            ['appointment_id' => $appointment->id],
            ['start_time' => now()]);
    }

    public function end(Appointment $appointment): void
    {
        $appointment->log()->updateOrCreate(
            ['appointment_id' => $appointment->id],
            ['end_time' => now()]); // for start
    }

    public function updated(Appointment $appointment): void
    {
        //
    }
    /**
     * Handle the Appointment "deleted" event.
     */
    public function deleted(Appointment $appointment): void
    {
        //
    }

    /**
     * Handle the Appointment "restored" event.
     */
    public function restored(Appointment $appointment): void
    {
        //
    }

    /**
     * Handle the Appointment "force deleted" event.
     */
    public function forceDeleted(Appointment $appointment): void
    {
        //
    }
}
