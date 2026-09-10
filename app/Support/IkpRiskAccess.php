<?php

namespace App\Support;

use App\Models\RiskRegister;
use App\Models\User;

class IkpRiskAccess
{
    public static function canViewAll(User $user): bool
    {
        return $user->can('lihat semua data ikp')
            || $user->can('lihat data semua risk register');
    }

    public static function unitIds($value): array
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            $value = json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
        }

        $values = is_array($value) ? $value : explode(',', (string) $value);

        return array_values(array_unique(array_map('intval', array_filter(
            $values,
            fn ($id) => is_scalar($id) && ctype_digit(trim((string) $id))
        ))));
    }

    public static function canSelect(User $user, RiskRegister $risk): bool
    {
        if ((int) $risk->tipe_id !== 1 || $risk->trashed()) {
            return false;
        }

        if (self::canViewAll($user)) {
            return true;
        }

        $unitId = (int) $user->pic_id;
        $riskUnitIds = self::unitIds($risk->pic_id);

        return $unitId > 0 && (in_array($unitId, $riskUnitIds, true)
            || in_array(0, $riskUnitIds, true));
    }
}
