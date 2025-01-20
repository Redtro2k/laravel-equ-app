<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class QueueController extends Controller
{
    public function show($id){
        
        return Inertia::render('ServiceAdvisor/Show');
    }
}
