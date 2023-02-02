<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public $loadDefault = 10;
    public function index(Request $request)
    {
        $users = User::query();
        if ($request->q) {
            $users->where('name','like','%'.$request->q.'%')
            ->orWhere('username','like','%'.$request->q.'%')
            ->orWhere('email','like','%'.$request->q.'%')
            ->orWhere('address','like','%'.$request->q.'%')
            ;
        }
        if ($request->has(['field','direction'])) {
            $users->orderBy($request->field,$request->direction);
        }
        $users = (
            UserResource::collection($users->latest()->fastPaginate($request->load)->withQueryString())
        )->additional([
            'attributes' => [
                'total' => User::count(),
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
        // dd($query);
        return inertia('Users/Index',['users'=>$users]);
    }
}
