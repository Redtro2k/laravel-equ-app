<?php

namespace App\Models\Queuing;

use App\Models\AppointmentLogs;
use App\Models\Logs;
use App\Models\ServiceAdvisor;
use App\Models\Vehicle;
use App\Models\WalkIn;
use App\Observers\AppointmentObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Traits\BaseModelTraits;

#[ObservedBy([AppointmentObserver::class])]
class Appointment extends Model
{
    //
    use BaseModelTraits;
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
    public function history(){
        return $this->morphMany(Logs::class,'logeable');
    }
    public function log(){
        return $this->hasOne(AppointmentLogs::class, 'appointment_id', 'id');
    }
    public function scopeIsPreferred($query){
        return $query->where('isPreferred', true);
    }
    public function scopeIsNotPreferred($query){
        return $query->where('isPreferred', false);
    }
    public function scopeFinished($query){
        return $query->whereHas('vehicleWalkin', function($q){
            $q->where('is_complete', true);
        });
    }
    public function scopeNotFinished($query){
        return $query->whereHas('vehicleWalkin', function($q){
            $q->where('is_complete', false);
        });
    }
    public function scopeCurrent($query)
    {
        return $query->orderBy('id', 'asc');
    }
    public function scopeNowQueries($query){
        return $query
            ->where('app_datetime', '>=', now()->startOfDay())
            ->where('app_datetime', '<=', now()->endOfDay());
    }
}
