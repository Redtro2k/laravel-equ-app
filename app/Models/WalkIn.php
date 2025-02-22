<?php

namespace App\Models;

use App\Models\Queuing\Appointment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use \App\Traits\TextFormatTraits;


class WalkIn extends Model
{
    use TextFormatTraits;
    protected $guarded = [];
    protected $appends = ['queue_id_type'];
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

    public function getQueueIdTypeAttribute(){
         $alias = $this->appointmentVehicle->app_type === 'WALK-IN' ? 'WAL' : 'APP';
         return $alias.'-'.$this->formatTextTicket($this->queue_number);
    }
}
