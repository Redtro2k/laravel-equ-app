<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //
    protected $guarded = [];
    public function vehicle(){
        return $this->hasMany(Vehicle::class, 'customer_id', 'id');
    }
}
