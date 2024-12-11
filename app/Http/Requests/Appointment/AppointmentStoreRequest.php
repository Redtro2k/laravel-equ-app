<?php

namespace App\Http\Requests\Appointment;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            //
            'name' => 'required',
            'email' => 'required',
            'contact_number' => 'required',
            'has_viber' => 'required',
            'viber' => 'nullable',
            'source' => 'nullable',
            'is_senior_or_pwd' => 'nullable',
        ];
    }
}
