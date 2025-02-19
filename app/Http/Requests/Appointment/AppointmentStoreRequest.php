<?php

namespace App\Http\Requests\Appointment;

use App\Rules\AvailableDate;
use App\Rules\LastCharacterNumberValidation;
use App\Rules\UniquePlateNumber;
use Illuminate\Foundation\Http\FormRequest;

class AppointmentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    protected function prepareForValidation(): void
    {
        $this->merge([
            'auth' => auth()->user(),
        ]);
    }


    public function rules(): array
    {
        $roles = collect([
            'name' => 'required',
            'email' => 'required',
            'contact_number' => 'required',
            'has_viber' => 'required',
            'viber' => 'nullable',
            'source' => 'nullable',
            'is_senior_or_pwd' => 'nullable',
        ]);
        if(request()->routeIs('appointment.store')){ // for vehicle
            $roles = $roles->merge([
                'model' => 'required|string',
                'plate_number' => ['required', new UniquePlateNumber(), new LastCharacterNumberValidation()],
                'cs_no' => 'required|string',
                'selling_dealer' => 'nullable|string',
            ]);
        }
        if(request()->routeIs('appointment.store')){ // for appointment
            $roles = $roles->merge([
                'date_time' => ['required', 'date', new AvailableDate()], // Ensure 12-hour format with AM/PM,
                'sa' => 'nullable|integer',
            ]);
        }
        return $roles->toArray();
    }
}
