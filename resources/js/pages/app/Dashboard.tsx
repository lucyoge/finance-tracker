import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, CalendarIcon, Handshake, Phone, PieChart, ReceiptText, Repeat, Target, User } from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const user = usePage<SharedData>().props.auth.user;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <section className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex gap-3 items-start justify-start">
                            <Handshake className="h-6 w-6 md:h-8 md:w-8 mt-1 text-corporate-blue" />
                            <div>
                                <h2 className="text-2xl md:text-3xl mb-2">Hello, <strong className="font-black">{user.firstname}</strong></h2>
                            </div>
                        </div>
                    </div>
                    <aside className="">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="border border-corporate-blue/50 backdrop-blur-2xl bg-white/50 rounded-sm md:rounded-lg p-1 md:p-2 md:px-4 shadow-sm">
                                    <div className="flex gap-3 items-center justify-center space-x-2">
                                        <CalendarIcon className="h-5 w-5 text-corporate-blue mx-auto" />
                                        <span className="hidden md:block text-sm font-medium text-slate-900">
                                            {format(new Date(), 'PPP')}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-full md:w-auto backdrop-blur-2xl block md:hidden">
                                <DropdownMenuItem>
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon className="h-5 w-5 text-corporate-blue" />
                                        <span className="text-sm font-medium text-slate-900">
                                            {format(new Date(), 'PPP')}
                                        </span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </aside>
                </section>

                <section className='flex gap-3 flex-wrap md:flex-nowrap mb-3 md:mb-5'>
                    <Link href={route('manage_transactions')} className="border inline-flex flex-grow md:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg bg-white/50 backdrop-blur-2xl shadow-sm">
                        <Repeat className="h-5 w-5 text-corporate-blue" />
                        <div className="flex-1">
                            <h3 className="text-xs md:text-sm font-medium">Transactions</h3>
                        </div>
                    </Link>
                    <Link href={route('budgeting')} className="border inline-flex flex-grow md:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg bg-white/50 backdrop-blur-2xl shadow-sm">
                        <PieChart className="h-5 w-5 text-corporate-blue" />
                        <div className="flex-1">
                            <h3 className="text-xs md:text-sm font-medium">Budgeting</h3>
                        </div>
                    </Link>
                    <Link href={`#`} className="border inline-flex flex-grow md:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg bg-white/50 backdrop-blur-2xl shadow-sm">
                        <Bell className="h-5 w-5 text-corporate-blue" />
                        <div className="flex-1">
                            <h3 className="text-xs md:text-sm font-medium">Notifications</h3>
                        </div>
                    </Link>
                </section>
                <section className='grid gap-5 lg:grid-cols-5'>
                    <aside className='lg:col-span-3 min-h-10 rounded-xl shadow-2xl bg-white/50 backdrop-blur-2xl border border-corporate-blue/50 p-4'>
                        <div className="flex flex-col items-center justify-center h-full py-10">
                            <span className="text-4xl mb-4">🔄</span>
                            <h4 className="text-lg font-semibold mb-2 text-slate-700">No transaction yet</h4>
                            <p className="text-sm text-slate-500 text-center">
                                You have not recorded any transactions yet. Once you do, your transaction history will appear here.
                            </p>
                        </div>
                    </aside>
                    <aside className='lg:col-span-2 min-h-10 rounded-xl shadow-2xl bg-white/50 backdrop-blur-2xl border border-corporate-blue/50 p-4'>
                        <div className="flex flex-col items-center justify-center h-full py-10">
                            <span className="text-4xl mb-4">📊</span>
                            <h4 className="text-lg font-semibold mb-2 text-slate-700">No Analysis and Report</h4>
                            <p className="text-sm text-slate-500 text-center">
                                You have not generated any reports yet. Your analysis and reports will be displayed here once available.
                            </p>
                        </div>
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}
