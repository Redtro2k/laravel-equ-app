<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
        return redirect()->intended(route('dashboard', absolute: false));
    }
    public function destroy(Request $request): RedirectResponse
    {
        $user = User::find(auth()->user()->id);
        $user->is_active = 0; // Ensure you're setting an integer or boolean value.
        $user->save();
//
        Auth::guard('web')->logout();
//
        $request->session()->invalidate();
//
        $request->session()->regenerateToken();
//
        return redirect('/');
    }
}
