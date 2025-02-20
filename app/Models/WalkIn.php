<?php

namespace App\Models;

use App\Models\Queuing\Appointment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class WalkIn extends Model
{
    //
    protected $guarded = [];
    protected $appends = ['type_queue_id'];
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

    public function history(){
        return $this->morphMany(Logs::class,'logeable');
    }

    public function getTypeQueueIdAttribute(){
        return $this->appointmentVehicle->app_type;
    }
}
