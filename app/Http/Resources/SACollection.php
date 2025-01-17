<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SACollection extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' =>  $this->name,
            'group_no' => $this->sa->group_no,
        ];
    }
}
