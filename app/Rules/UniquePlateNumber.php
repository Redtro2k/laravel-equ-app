<?php

namespace App\Rules;

use App\Models\Vehicle;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniquePlateNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $vehicle = Vehicle::with('walkIn')->where('plate_number', $value)->first();
        if (!$vehicle || !$vehicle->walkIn || $vehicle->walkIn->is_complete) {
            return;
        }

        $fail('The :attribute must be unique');
    }
}
