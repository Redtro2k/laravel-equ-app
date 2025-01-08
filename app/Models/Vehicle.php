<?php

namespace App\Models;

use App\Models\Queuing\Appointment;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    //
    protected $guarded = [];
    public function customer(){
        return $this->belongsTo(Customer::class);
    }
    public function appointment(){
        return $this->hasOne(Appointment::class, 'vehicle_id', 'id');
    }
    public function walkIn(){
        return $this->hasOne(WalkIn::class, 'vehicle_id', 'id');
    }
}
