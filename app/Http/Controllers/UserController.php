<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $users = User::query();
        if ($request->q) {
            $users->where('name','like','%'.$request->q.'%')
            ->orWhere('email','like','%'.$request->q.'%')
            ;
        }
        if ($request->has(['field','direction'])) {
            $users->orderBy($request->field,$request->direction);
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
        return inertia('Users/Index',['users'=>$users]);
    }
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
        ]);
        $request->merge([
            'password' => Hash::make('password'),
        ]);
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);
        return back()->with([
            'type' => 'success',
            'message' => 'User berhasil dibuat',
        ]);
    }
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email','unique:users,email,'. optional($user)->id],
        ]);
        $user->update($validated);
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
}
