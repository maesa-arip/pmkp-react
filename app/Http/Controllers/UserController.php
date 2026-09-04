<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Location;
use App\Models\Pic;
use App\Models\RiskRegister;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $users = User::query()->with(['roles', 'pic']);
        if ($request->q) {
            $users->where('name','like','%'.$request->q.'%')
            ->orWhere('email','like','%'.$request->q.'%')
            ;
        }
        if ($request->has(['field','direction'])) {
            $field = in_array($request->field, ['name', 'email', 'created_at'], true) ? $request->field : 'created_at';
            $direction = $request->direction === 'asc' ? 'asc' : 'desc';
            $users->orderBy($field, $direction);
        }
        $users = (
            UserResource::collection($users->latest()->fastPaginate($request->load)->withQueryString())
        )->additional([
            'attributes' => [
                'total' => 1100,
                'per_page' =>10,
            ],
            'filtered' => [
                'load' => $request->load ?? $this->loadDefault,
                'q' => $request->q ?? '',
                'page' => $request->page ?? 1,
                'field' => $request->field ?? '',
                'direction' => $request->direction ?? '',

            ]
        ]);
        $roles = Role::get();
        $pics = Pic::query()
            ->with('location:id,name')
            ->select('id', 'name', 'location_id')
            ->orderBy('name')
            ->get();
        $locations = Location::query()->select('id', 'name')->orderBy('name')->get();
        // $roles = Role::pluck('name', 'id');
        return inertia('Users/Index',['users'=>$users, 'roles'=>$roles, 'pics'=>$pics, 'locations'=>$locations]);
    }
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'string', 'min:6'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'pic_id' => $this->resolvePicId($request),
                'password' => Hash::make($validated['password']),
            ]);

            $user->syncRoles($validated['roles']);
        });

        return back()->with([
            'type' => 'success',
            'message' => 'User berhasil dibuat',
        ]);
    }
    public function update(Request $request, User $user)
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email','unique:users,email,'. optional($user)->id],
            'password' => ['nullable', 'string', 'min:6'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')],
        ]);

        DB::transaction(function () use ($request, $user, $validated) {
            $validated['pic_id'] = $this->resolvePicId($request);

            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            $roles = $validated['roles'];
            unset($validated['roles']);

            $user->update($validated);
            $user->syncRoles($roles);
        });

        return back()->with([
            'type' => 'success',
            'message' => 'User berhasil diubah',
        ]);
    }
    public function destroy(User $user)
    {
        $user->delete();
        return back()->with([
            'type' => 'success',
            'message' => 'User berhasil dihapus',
        ]);
    }

    private function resolvePicId(Request $request): ?int
    {
        if ($request->boolean('create_pic')) {
            $request->merge([
                'new_pic_name' => trim((string) $request->input('new_pic_name')),
                'new_location_name' => trim((string) $request->input('new_location_name')),
            ]);

            $request->validate([
                'new_pic_name' => ['required', 'string', 'max:255'],
            ]);

            if ($request->boolean('create_location')) {
                $request->validate([
                    'new_location_name' => ['required', 'string', 'max:255'],
                ]);

                $location = Location::firstOrCreate([
                    'name' => $request->input('new_location_name'),
                ]);
            } else {
                $request->validate([
                    'location_id' => ['required', 'integer', 'exists:locations,id'],
                ]);

                $location = Location::findOrFail($request->input('location_id'));
            }

            $pic = Pic::firstOrCreate([
                'name' => $request->input('new_pic_name'),
                'location_id' => $location->id,
            ]);

            return $pic->id;
        }

        if (!$request->filled('pic_id')) {
            return null;
        }

        $request->validate([
            'pic_id' => ['integer', 'exists:pics,id'],
        ]);

        return (int) $request->input('pic_id');
    }
}
