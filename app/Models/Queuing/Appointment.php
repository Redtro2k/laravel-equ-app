<?php

namespace App\Models\Queuing;

use App\Models\ServiceAdvisor;
use App\Models\Vehicle;
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
        return $this->belongsTo(Vehicle::class, 'id', 'vehicle_id');
    }
    public function serviceAdvisor(){
        return $this->belongsTo(User::class, 'advisor', 'id');
    }

}
