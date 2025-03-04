<?php

namespace App\Exports;

use AllowDynamicProperties;
use App\Models\Queuing\Appointment;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\WithMapping;
use App\Traits\TextFormatTraits;


#[AllowDynamicProperties] class UpAppointmentExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping
{
    use Exportable, TextFormatTraits;
    public function __construct(bool $isTomorrow){
        $this->isTomorrow = $isTomorrow;
    }
    public function query(){
        return Appointment::query()
            ->with(['customer', 'serviceAdvisor'])
            ->where('app_type', 'APPOINTMENT')
            ->when($this->isTomorrow, function($query){
                $query->whereDate('app_datetime', Carbon::tomorrow());
            }, function($query){
                $query->whereDate('app_datetime', '>=' ,Carbon::tomorrow());
            })
            ->orderBy('app_datetime', 'asc');
    }
    public function headings(): array
    {
        return [
            'Schedule Date',
            'Queue Type',
            'Customer Name',
            'Email Address',
            'Contact Number',
            'Viber',
            'Senior / PWD',
            'Service Advisor',
            'Preferred By Customer'
        ];
    }
    public function map($appointment): array
    {
        return [
            Carbon::parse($appointment->app_datetime)->format('M j, Y g:i A'),
            $appointment->app_type,
            $appointment->customer->name,
            $appointment->customer->email,
            $this->formatPHNumber($appointment->customer->contact_number) ?? 'No Contact Number',
            $appointment->customer->viber ?? 'No Viber Contact',
            $appointment->customer->is_senior_or_pwd ? 'Yes' : 'No',
            $appointment->serviceAdvisor->name ?? 'No Service Advisor',
            $appointment->isPreferred ? 'Yes' : 'No',
        ];
    }
}
