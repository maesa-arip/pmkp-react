<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

/**
 * Approved by the user on 2026-09-20. The super admin role is an explicit permission list,
 * not a blanket grant, so it could read every MUTU dictionary through
 * MutuIndicatorInput::canViewAll() (which accepts the role) but was refused on save by
 * authorize() (which only accepts this permission). Granting the permission removes that
 * asymmetry. Idempotent: it skips when the row already exists.
 */
return new class extends Migration
{
    private const ROLE = 'super admin';

    private const PERMISSION = 'lihat semua data indikator mutu';

    public function up(): void
    {
        $this->link(true);
    }

    public function down(): void
    {
        $this->link(false);
    }

    private function link(bool $grant): void
    {
        $roleId = DB::table('roles')->where('name', self::ROLE)->value('id');
        $permissionId = DB::table('permissions')->where('name', self::PERMISSION)->value('id');
        // A server whose role or permission is named differently is left untouched on purpose.
        if (! $roleId || ! $permissionId) {
            return;
        }
        $row = ['role_id' => $roleId, 'permission_id' => $permissionId];
        if ($grant) {
            if (! DB::table('role_has_permissions')->where($row)->exists()) {
                DB::table('role_has_permissions')->insert($row);
            }
        } else {
            DB::table('role_has_permissions')->where($row)->delete();
        }
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
