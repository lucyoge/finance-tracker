<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Helpers\Utils;
use App\Models\Reference;
use Illuminate\Http\Request;
use App\Traits\ResponseTrait;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    use ResponseTrait;
    public function fetchUsers(Request $request)
    {
        $users = User::where('role', '!=', 'admin')
            ->orderBy('firstname', 'asc')->orderBy('lastname', 'asc')
            ->get();
        return $this->successResponse('Users fetched successfully', [
            'users' => $users
        ]);
    }

    public function addUser(Request $request)
    {
         $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Password::defaults()],
        ]);

        list($firstname, $lastname) = Utils::splitNames($request->name);

        $user = User::create([
            'firstname' => $firstname,
            'lastname' => $lastname,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return $this->successResponse('User added successfully', [
            'user' => $user
        ]);
    }

    public function saveCompleteRegistration(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'address' => 'required|string|max:255',
            'ssn' => 'required|string|max:11',
            'zip' => 'required|string|max:20',
            'emergency_contact' => 'required|string|max:255',
            'drivers_license' => 'required|file|max:2048',
            'reference_fullname' => 'required|string|max:255',
            'profile_picture' => 'nullable|file|max:2048'
        ]);

        $user = User::findOrFail($request->user()->id);

        $user->update([
            'address' => $request->address,
            'ssn' => $request->ssn,
            'zip' => $request->zip,
            'military_unit' => $request->military_unit,
            'job_title' => $request->job_title,
            'is_military' => $request->has('is_military') && $request->is_military === 'on',
            'profile_picture' => $request->hasFile('profile_picture') ? env('APP_URL', 'http://127.0.0.1:8000') . '/storage/' . $request->file('profile_picture')->store('profile_pictures', 'public') : null,
            'emergency_contact' => $request->emergency_contact,
            'drivers_license' => $request->hasFile('drivers_license') ? env('APP_URL', 'http://127.0.0.1:8000') . '/storage/' . $request->file('drivers_license')->store('drivers_licenses', 'public') : null,
            'status' => 'active',
        ]);

        list($firstname, $lastname) = Utils::splitNames($request->reference_fullname);

        $reference = Reference::create([
            'user_id' => $user->id,
            'firstname' => $firstname,
            'lastname' => $lastname,
            'phone' => $request->reference_contact,
            'email' => $request->reference_email,
            'relationship' => $request->reference_relationship,
        ]);
        
        return $this->successResponse('User registration completed successfully', [
            'user' => $user,
            'reference' => $reference
        ]);
    }
}
