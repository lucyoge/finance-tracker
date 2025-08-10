import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarIcon, Eye, Handshake, Phone, ReceiptText, Trash, User, UserCheck, UserPlus, Users, X } from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import httpClient from '@/lib/axios';
import { useInitials } from '@/hooks/use-initials';
import { Skeleton } from '@/components/ui/skeleton';
import CustomModal from '@/components/custom/CustomModal';
import AddUserForm from '@/components/custom/AddUserForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manage Users',
        href: '/manage-users'
    }
];

export default function ManageUsers() {
    const user = usePage<SharedData>().props.auth.user;
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const getInitials = useInitials();
    const today = new Date();
    const [showModal, setShowModal] = useState(false);
    const [currentForm, setCurrentForm] = useState<'basic' | 'complete' | 'personal'>('basic');

    const fetchUsers = async () => {
        setFetching(true);
        const response = await httpClient.get(route('api.fetch-users'));
        if (response.status !== 200) {
            console.error('Failed to fetch users');
            return;
        }
        setUsers(response.data.body.users);
        setFetching(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <section className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex gap-3 items-start justify-start">
                            <Users className="h-6 w-6 mt-1 text-corporate-blue" />
                            <div>
                                <h2 className="text-2xl mb-2 font-semibold">Manage Users</h2>
                            </div>
                        </div>
                    </div>
                    <aside className="">
                        <Button
                            type="button"
                            variant={"hero"}
                            onClick={() => setShowModal(true)}
                            className="inline-flex justify-center bg-corporate-blue/90 items-center space-x-1 rounded-sm md:rounded-lg p-1 md:p-2 md:px-4 shadow-sm"
                        >
                            <UserPlus className="h-6 w-6 text-white" />
                            <span className="hidden md:block text-sm font-medium text-white">
                                Add New User
                            </span>
                        </Button>
                    </aside>
                </section>

                <section className='flex gap-3 flex-wrap md:flex-nowrap mb-3 md:mb-5'>
                    <div className="border inline-flex flex-grow md:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg bg-white/50 backdrop-blur-2xl shadow-sm">
                        <Users className="h-5 w-5 text-corporate-blue" />
                        <div className="flex-1">
                            <h3 className="text-xs md:text-sm font-medium">All</h3>
                        </div>
                    </div>
                    <div className="border inline-flex flex-grow md:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg bg-white/50 backdrop-blur-2xl shadow-sm">
                        <UserCheck className="h-5 w-5 text-corporate-blue" />
                        <div className="flex-1">
                            <h3 className="text-xs md:text-sm font-medium">Active</h3>
                        </div>
                    </div>
                    <div className="border inline-flex flex-grow md:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg bg-white/50 backdrop-blur-2xl shadow-sm">
                        <Phone className="h-5 w-5 text-corporate-blue" />
                        <div className="flex-1">
                            <h3 className="text-xs md:text-sm font-medium">Contact Us</h3>
                        </div>
                    </div>
                </section>
                <section className='grid'>
                    {users && users.length > 0 ? (<aside className='min-h-10 rounded-xl shadow-2xl bg-white/50 backdrop-blur-2xl border border-corporate-blue/50'>
                        <table className="w-full table-auto hidden md:table">
                            <thead className="text-left border-b border-corporate-blue/50">
                                <tr>
                                    <th className="py-2 px-4">Tenant</th>
                                    <th className="py-2 px-4">Email</th>
                                    <th className="py-2 px-4">Phone</th>
                                    <th className="py-2 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user: any) => <tr key={user.id} className="not-last:border-b border-corporate-blue/50 text-left">
                                    <td className="py-2 px-4">
                                        <div className="flex items-start gap-2">
                                            <Avatar className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                                                <AvatarImage src={user.profile_picture} alt={`${user.firstname}`} />
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(user.firstname, user.lastname)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <span className="font-medium">{user.firstname} {user.lastname}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4">{user.phone}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex items-start gap-2">
                                            <Button variant="ghost" className="text-corporate-blue hover:text-corporate-blue/90">
                                                <Eye className="h-5 w-5" />
                                            </Button>
                                            <Button variant="ghost" className="text-red-500 hover:text-red-500/90">
                                                <Trash className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                        <div className="md:hidden text-left text-sm">
                            {users.map((user: any) => (
                                <div key={user.id} className="flex items-start justify-between gap-4 py-2 px-4 not-last:border-b border-corporate-blue/50">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                                            <AvatarImage src={user.profile_picture} alt={`${user.firstname}`} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(user.firstname, user.lastname)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <span className="font-medium">{user.firstname} {user.lastname}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" className="text-corporate-blue hover:text-corporate-blue/90">
                                            <Eye className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" className="text-red-500 hover:text-red-500/90">
                                            <Trash className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>) :
                        (
                            <>
                                {fetching ? (
                                    <section className="flex flex-col gap-4 p-4 md:py-8 lg:col-span-3 min-h-10 rounded-xl shadow-2xl bg-white/50 backdrop-blur-2xl border border-corporate-blue/50">
                                        <table className="w-full">
                                            <tbody>
                                                {Array.from({ length: 2 }).map((_, i) => (
                                                    <tr key={i} className="border-b border-corporate-blue/50">
                                                        <td className="pl-4 pr-2 py-2">
                                                            <Skeleton className="h-4 w-28" />
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            <Skeleton className="h-4 w-28" />
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            <Skeleton className="h-4 w-28" />
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            <Skeleton className="h-4 w-28" />
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            <Skeleton className="h-4 w-28" />
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            <Skeleton className="h-4 w-28" />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>
                                ) : (
                                    <section className="flex flex-col items-center justify-center gap-4 p-4 md:py-8 lg:col-span-3 min-h-10 rounded-xl shadow-2xl bg-white/50 backdrop-blur-2xl border border-corporate-blue/50">
                                        <div className="flex items-center justify-center">
                                            <Users className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <h2 className="text-2xl font-semibold text-gray-300">No user records available</h2>
                                        <p className="text-center text-sm text-gray-500">Please check back later or contact support if you have any questions.</p>
                                    </section>
                                )}
                            </>
                        )}
                </section>
            </div>

            {/* Custom Modal for adding new user */}
            <section>
                <CustomModal show={showModal} maxWidth={`${currentForm === "basic" ? "sm" : "3xl"}`} onClose={() => setShowModal(false)}>
                    <header className="border-b border-corporate-blue/50 mb-3">
                        <div className="py-2 px-4 flex justify-between items-center">
                            <div className="flex items-center gap-2 ">
                                <button
                                    className="flex items-center gap-2 text-slate-700 hover:text-airnex-blue-500 md:hidden mr-10"
                                    onClick={() => setShowModal(false)}
                                >
                                    <ArrowLeft />{" "}
                                    <span className="text-sm">Back</span>
                                </button>
                                <h1 className="text-base font-bold">
                                    Add New User
                                </h1>
                            </div>
                            <button
                                className="text-slate-700 hover:text-airnex-blue-500 hidden md:block"
                                onClick={() => setShowModal(false)}
                            >
                                <X />
                            </button>
                        </div>
                    </header>
                    <section className='bg-white'>
                        <AddUserForm onClose={() => {fetchUsers(); setShowModal(false); setCurrentForm('personal');}} onFormChange={(e) => {setCurrentForm(e); console.log(e);}} />
                    </section>
                </CustomModal>
            </section>
        </AppLayout>
    );
}
