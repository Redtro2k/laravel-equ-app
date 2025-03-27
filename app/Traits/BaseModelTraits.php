<?php
namespace App\Traits;

trait BaseModelTraits{
    public static function next($id, $column = 'id', $singleRow = true){
         $query = static::where($column, '>', $id)
            ->orderBy('created_at', 'desc');
        if($singleRow){
            return $query->first();
        }
        return $query;
    }

    public static function prev($id, $column = 'id'){
        return static::where($column, '<', $id)
            ->orderBy($column, 'desc')
            ->first();
    }
    public static function sa($id, $hasIncludeRelation = false) // Caution: for SA function, note require authenticated user
    {
        $query = self::whereHas('serviceAdvisor', function($query) use($id) {
            $query->where('advisor', $id);
        });
        if ($hasIncludeRelation) {
            $query->with(['serviceAdvisor', 'vehicle', 'vehicle.customer', 'vehicleWalkin']);
        }
        return $query;
    }
}
