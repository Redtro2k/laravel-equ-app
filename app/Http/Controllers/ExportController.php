<?php

namespace App\Http\Controllers;


use App\Exports\UpAppointmentExport;
use Maatwebsite\Excel\Facades\Excel;


class ExportController extends Controller
{
    //
    public function upAppointments()
    {
        $check = request()->filled('isTomorrow') || request()->isTomorrow ?? false;
        return Excel::download(new UpAppointmentExport($check), 'upAppointments.xlsx');
    }
}
