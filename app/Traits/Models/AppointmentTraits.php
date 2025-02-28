<?php

namespace App\Traits\Models;

trait AppointmentTraits
{
    //
    public function scopeGetPWD(){
        return self::with(['customer' => function ($query) {
            $query->orderBy('is_senior_or_pwd', 'asc');
        }]);
    }

    public function scopeNowQueries($query)
    {
        return self::select('appointments.*') // Select all columns from appointments
        ->join('vehicles', 'appointments.vehicle_id', '=', 'vehicles.id') // Join vehicles
        ->join('customers', 'vehicles.customer_id', '=', 'customers.id') // Join customers
        ->orderByRaw('CASE
            WHEN customers.is_senior_or_pwd = 1 THEN 0  -- PWD/Senior First
            WHEN appointments.app_type = "APPOINTMENT" THEN 1  -- Appointment Second
            WHEN appointments.app_type = "WALK-IN" THEN 2  -- Walk-In Last
            ELSE 3
            END')
        ->orderBy('created_at', 'asc'); // Order by appointment time within priority group
    }
    public function scopeAppointmentOnly(){
        return self::whereBetween('appointments.app_datetime', [now()->startOfDay(), now()->endOfDay()])->where('appointments.app_type', 'APPOINTMENT');
    }
    public function scopeWalkInOnly(){
        return self::whereBetween('appointments.app_datetime', [now()->startOfDay(), now()->endOfDay()])->where('appointments.app_type', 'WALK-IN');
    }
}
