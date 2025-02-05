<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logs extends Model
{
    protected $guarded = [];
    public function logeable(){
        return $this->morphTo();
    }
}
