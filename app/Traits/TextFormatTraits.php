<?php

namespace App\Traits;

trait TextFormatTraits
{
    //
    public function formatTextTicket($ticket, $length = 5): string
    {
        if($ticket % 2 != 0){
            $ticket += 1;
        }
        return str_pad($ticket, $length, "0", STR_PAD_LEFT);
    }
}
