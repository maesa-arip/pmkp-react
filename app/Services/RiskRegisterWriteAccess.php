<?php

namespace App\Services;

use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;

class RiskRegisterWriteAccess
{
    public function allows(User $user, RiskRegister $risk): bool
    {
        if ($user->hasRole('super admin') || $user->can('edit data semua risk register')) {
            return true;
        }
        if (! $user->can('edit data risk register sesuai lokasi')) {
            return false;
        }
        if ((int) $risk->user_id === (int) $user->id) {
            return true;
        }
        $location = $user->pic?->location_id;
        if (! $location) {
            return false;
        }
        // Authorize against saved ownership/PIC, never a replacement sent by the caller.
        if ((int) $risk->user?->pic?->location_id === (int) $location) {
            return true;
        }
        $pics = array_filter(AnnualIndicatorService::ids($risk->pic_id));

        return Pic::whereIn('id', $pics)->where('location_id', $location)->exists();
    }
}
