<?php

namespace App\Traits;

trait TextFormatTraits
{
    public function formatTextTicket($ticket, $length = 5): string
    {
            return str_pad($ticket, $length, "0", STR_PAD_LEFT);
    }
    function formatPHNumber($number): array|string|null
    {
        // Ensure it's exactly 11 digits
        if (preg_match('/^09\d{9}$/', $number)) {
            return preg_replace('/(09\d{2})(\d{3})(\d{4})/', '$1-$2-$3', $number);
        }
        return "Invalid number";
    }
}
