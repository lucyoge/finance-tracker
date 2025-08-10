<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index()
    {
        return inertia('Index', [
            'title' => 'Welcome to Silk Corp Housing',
            'description' => 'Your one-stop solution for corporate housing needs.',
        ]);
    }
    public function about()
    {
        return inertia('About', [
            'title' => 'About Us',
            'description' => 'Learn more about our mission and values.',
        ]);
    }

    public function contact()
    {
        return inertia('Contact', [
            'title' => 'Contact Us',
            'description' => 'Get in touch with us for any inquiries.',
        ]);
    }

    public function faq()
    {
        return inertia('Faq', [
            'title' => 'FAQ',
            'description' => 'Frequently Asked Questions',
        ]);
    }

    public function blog()
    {
        return inertia('Blog', [
            'title' => 'Blog',
            'description' => 'Read our latest articles and updates.',
        ]);
    }

    public function blogPost($slug)
    {
        return inertia('BlogPost', [
            'title' => 'Blog Post',
            'description' => 'Details about the blog post with slug: ' . $slug,
        ]);
    }

    public function team()
    {
        return inertia('Team', [
            'title' => 'Our Team',
            'description' => 'Meet the team behind Silk Corp Housing.',
        ]);
    }

    public function amenities()
    {
        return inertia('Amenities', [
            'title' => 'Amenities',
            'description' => 'Explore the amenities we offer.',
        ]);
    }

    public function industries()
    {
        return inertia('Industries', [
            'title' => 'Industries',
            'description' => 'Discover the industries we serve.',
        ]);
    }

    public function corporateHousing()
    {
        return inertia('CorporateHousing', [
            'title' => 'Corporate Housing',
            'description' => 'Learn about our corporate housing services.',
        ]);
    }

    // Protected routes for authenticated users
    public function completeRegistration()
    {
        return inertia('app/CompleteRegistration');
    }

    public function dashboard()
    {
        return inertia('app/Dashboard');
    }

    public function manageTransactions()
    {
        return inertia('app/ManageTransactions');
    }

    public function budgeting()
    {
        return inertia('app/Budgeting');
    }

    public function goals()
    {
        return inertia('app/Goals');
    }

    public function manageUsers()
    {
        return inertia('app/ManageUsers');
    }

    public function leaseRequests()
    {
        return inertia('app/LeaseRequests');
    }

    public function leaseRecords()
    {
        return inertia('app/LeaseRecords');
    }

    public function paymentHistory()
    {
        return inertia('app/PaymentHistory');
    }
}
