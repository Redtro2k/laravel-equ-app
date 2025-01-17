<?php

namespace App\Models;

use App\Models\Queuing\Appointment;
use Illuminate\Database\Eloquent\Model;

class WalkIn extends Model
{
    //
    protected $guarded = [];
    public function vehicles(){
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'id');
    }
    public function appointmentVehicle(){
        return $this->hasOneThrough(
            Appointment::class,
            Vehicle::class,
            'id',
            'vehicle_id',
            'vehicle_id',
            'id'
        );
    }
}
