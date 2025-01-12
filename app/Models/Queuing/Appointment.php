<?php

namespace App\Models\Queuing;

use App\Models\ServiceAdvisor;
use App\Models\Vehicle;
use App\Models\WalkIn;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Appointment extends Model
{
    //
    protected $guarded = [];

    public function receptionist(){
        return $this->belongsTo(User::class, 'id', 'appointment_by');
    }
    public function vehicle(){
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'id');
    }
    public function vehicleWalkin(){
        return $this->hasOneThrough(
            WalkIn::class,  // Final target model
            Vehicle::class, // Intermediate model
            'id',           // Foreign key on the Vehicle table
            'vehicle_id',   // Foreign key on the WalkIn table
            'vehicle_id',   // Local key on the Appointment table
            'id'            // Local key on the Vehicle table
        );
    }
    public function serviceAdvisor(){
        return $this->belongsTo(User::class, 'advisor', 'id');
    }

}
