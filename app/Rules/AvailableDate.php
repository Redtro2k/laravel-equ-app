<?php

namespace App\Rules;

use App\Models\Queuing\Appointment;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AvailableDate implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //
        if(!Carbon::parse($value)->isSameDay(now())){
            $convert_date = Carbon::parse($value)->floorMinutes(30);
            $appointment = Appointment::whereBetween('app_datetime', [$convert_date, $convert_date->addMinutes(30)])
                ->where('app_type', 'APPOINTMENT')
                ->count();
            if($appointment >= 3){
                $fail("the $attribute is not available.");
            }
        }
    }
}
