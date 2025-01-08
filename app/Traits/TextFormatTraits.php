<?php

namespace App\Traits;

trait TextFormatTraits
{
    public function formatTextTicket($ticket, $length = 5): string
    {
            return str_pad($ticket, $length, "0", STR_PAD_LEFT);
    }
}
