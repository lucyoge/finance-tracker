import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Transaction, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ArrowDownCircle, ArrowLeft, ArrowUpCircle, CalendarIcon, Eye, Fence, FenceIcon, Handshake, Home, Hotel, Phone, PiggyBank, Plus, ReceiptText, Repeat, Trash, Trash2, User, UserCheck, UserPlus, Users, X } from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import httpClient from '@/lib/axios';
import { useInitials } from '@/hooks/use-initials';
import { Skeleton } from '@/components/ui/skeleton';
import CustomModal from '@/components/custom/CustomModal';
import TransactionForm from '@/components/custom/TransactionForm';
import TransactionDetails from '@/components/custom/TransactionDetails';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manage Transactions',
        href: '/manage-transactions'
    }
];

export interface TransactionPagination {
    current_page: number;
    data: Transaction[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export default function ManageTransactions() {
    const user = usePage<SharedData>().props.auth.user;
    const [transactions, setTransactions] = useState<TransactionPagination>();
    const [fetching, setFetching] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    type Category = { id: number; name: string };
    const [categories, setCategories] = useState<Category[]>([]);
    const [showCategories, setShowCategories] = useState(false);
    const [currentType, setCurrentType] = useState('all');

    // State for form errors and processing
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Show or toggle the view property details
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    // Handler for adding a property
    const handleAddTransaction = async (formData: FormData) => {
        setProcessing(true);
        try {
            await httpClient.post(route('api.add-transaction'), formData)
                .then(response => {
                    if (response.status === 200) {
                        setShowAddModal(false);
                        fetchTransactions();
                        setErrors({});
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 422) {
                        setErrors(error.response?.data?.errors || {});
                    }
                    alert('Failed to add transaction. Please check the form and try again.');
                    console.log('Error adding transaction:', error.response?.data?.errors);
                });
        } catch (error: any) {
            setErrors(error.response?.data?.errors || {});
        }
        setProcessing(false);
    };

    const fetchTransactions = async (type: string = currentType) => {
        setFetching(true);
        const response = await httpClient.get(route('api.fetch-transactions', { type }));
        if (response.status !== 200) {
            console.error('Failed to fetch transactions');
            return;
        }
        setTransactions(response.data.body.transactions);
        console.log(response.data.body.transactions);

        setFetching(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Fetch categories from the API
    const fetchCategories = async () => {
        try {
            const response = await httpClient.get(route('api.fetch-transaction-categories'));
            if (response.status === 200) {
                setCategories(response.data.body.categories);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const addCategory = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setProcessing(true);
        try {
            event.currentTarget.reset();
            await httpClient.post(route('api.add-transaction-category'), formData)
                .then(response => {
                    if (response.status === 200) {
                        fetchCategories();
                        setErrors({}); // Reset the form after successful submission
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 422) {
                        setErrors(error.response?.data?.errors || {});
                    }
                    alert('Failed to add category. Please check the form and try again.');
                    console.log('Error adding category:', error.response?.data?.errors);
                });
        } catch (error: any) {
            setErrors(error.response?.data?.errors || {});
        }
        setProcessing(false);
    };

    async function deleteCategory(id: any): Promise<void> {
        if (!window.confirm('You are about to delete this category. Click OK to proceed.')) return;
        setProcessing(true);
        try {
            const response = await httpClient.delete(route('api.delete-transaction-category', { id }));
            if (response.status === 200) {
                fetchCategories();
            } else {
                alert('Failed to delete category.');
            }
        } catch (error) {
            alert('Failed to delete category.');
            console.error('Error deleting category:', error);
        }
        setProcessing(false);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Properties" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <section className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex gap-3 items-start justify-start">
                            <Repeat className="h-6 w-6 mt-1 text-corporate-blue" />
                            <div className='flex-shrink-0'>
                                <h2 className="text-lg md:text-2xl mb-2 font-semibold">Manage Transactions</h2>
                            </div>
                        </div>
                    </div>
                    <aside className=" flex items-center gap-2">
                        <Button
                            type="button"
                            variant={"gold"}
                            onClick={() => setShowCategories(true)}
                            className="inline-flex justify-center bg-corporate-gold items-center space-x-1 rounded-sm md:rounded-lg py-0 px-0 md:p-2 md:px-4 shadow-sm"
                        >
                            <Hotel className="h-6 w-6 text-white" />
                            <span className="hidden md:block text-sm font-medium text-white">
                                Categories
                            </span>
                        </Button>
                        <Button
                            type="button"
                            variant={"hero"}
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex justify-center bg-corporate-blue/90 items-center space-x-1 rounded-sm md:rounded-lg p-1 md:p-2 md:px-4 shadow-sm"
                        >
                            <Plus className="h-6 w-6 text-white" />
                            <span className="hidden md:block text-sm font-medium text-white">
                                Add New
                            </span>
                        </Button>
                    </aside>
                </section>

                <section className='flex gap-3 flex-wrap md:flex-nowrap mb-3 md:mb-5'>
                    <div onClick={() => {setCurrentType('all'); fetchTransactions('all');}} role='button' className={`border cursor-pointer inline-flex flex-grow sm:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg backdrop-blur-2xl shadow-sm ${currentType == 'all' ? 'bg-corporate-blue text-white' : 'bg-white/50'}`}>
                        <Repeat className={`h-5 w-5 ${currentType == 'all' ? 'text-white' : 'text-corporate-blue'}`} />
                        <div className={`md:flex-1 ${currentType == 'all' ? 'flex-1' : 'hidden sm:inline'}`}>
                            <h3 className="text-xs md:text-sm font-medium">All</h3>
                        </div>
                    </div>
                    <div onClick={() => {setCurrentType('income'); fetchTransactions('income');}} role='button' className={`border cursor-pointer inline-flex flex-grow sm:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg backdrop-blur-2xl shadow-sm ${currentType == 'income' ? 'bg-corporate-blue text-white' : 'bg-white/50'}`}>
                        <ArrowDownCircle className={`h-5 w-5 ${currentType == 'income' ? 'text-green-300' : 'text-green-500'}`} />
                        <div className={`md:flex-1 ${currentType == 'income' ? 'flex-1' : 'hidden sm:inline'}`}>
                            <h3 className="text-xs md:text-sm font-medium">Income</h3>
                        </div>
                    </div>
                    <div onClick={() => {setCurrentType('expense'); fetchTransactions('expense');}} role='button' className={`border cursor-pointer inline-flex flex-grow sm:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg backdrop-blur-2xl shadow-sm ${currentType == 'expense' ? 'bg-corporate-blue text-white' : 'bg-white/50'}`}>
                        <ArrowUpCircle className={`h-5 w-5 ${currentType == 'expense' ? 'text-red-400' : 'text-red-500'}`} />
                        <div className={`md:flex-1 ${currentType == 'expense' ? 'flex-1' : 'hidden sm:inline'}`}>
                            <h3 className="text-xs md:text-sm font-medium">Expense</h3>
                        </div>
                    </div>
                    <div onClick={() => {setCurrentType('savings'); fetchTransactions('savings');}} role='button' className={`border cursor-pointer inline-flex flex-grow sm:flex-grow-0 items-center justify-between gap-2 py-2 px-4 rounded-lg backdrop-blur-2xl shadow-sm ${currentType == 'savings' ? 'bg-corporate-blue text-white' : 'bg-white/50'}`}>
                        <PiggyBank className={`h-5 w-5 ${currentType == 'savings' ? 'text-white' : 'text-corporate-blue'}`} />
                        <div className={`md:flex-1 ${currentType == 'savings' ? 'flex-1' : 'hidden sm:inline'}`}>
                            <h3 className="text-xs md:text-sm font-medium">Savings</h3>
                        </div>
                    </div>
                </section>
                {(showTransactionDetails && selectedTransaction) ?
                    (<TransactionDetails transaction={selectedTransaction} onClose={() => setShowTransactionDetails(false)} />)
                    :
                    (<section className=''>
                        <div className='flex justify-between items-center pb-4 px-4 w-full'>
                            <span className='text-sm'>
                                Page <strong>{transactions?.current_page}</strong> of <strong>{transactions?.last_page}</strong>
                            </span>
                            <span className='text-sm'>
                                <strong className='text-corporate-blue'>Total Records:</strong> {transactions?.total}
                            </span>
                        </div>

                        {transactions?.data && transactions.data.length > 0 ? (<aside className='min-h-10 rounded-xl shadow-2xl bg-white/50 backdrop-blur-2xl border border-corporate-blue/50'>
                            <table className="w-full table-auto hidden md:table">
                                <thead className="text-left border-b border-corporate-blue/50">
                                    <tr>
                                        <th className="py-2 px-4">Type</th>
                                        <th className="py-2 px-4">Amount</th>
                                        <th className="py-2 px-4 hidden lg:table-cell">Transaction Date</th>
                                        <th className="py-2 px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.map((transaction: Transaction) => <tr key={transaction.id} className="not-last:border-b border-corporate-blue/50 text-left">
                                        <td className="py-2 px-4">
                                            <div className="flex items-center">
                                                {transaction.type === 'income' && (
                                                    <ArrowDownCircle className="h-5 w-5 text-green-500 capitalize" />
                                                )}
                                                {transaction.type === 'expense' && (
                                                    <ArrowUpCircle className="h-5 w-5 text-red-500 capitalize" />
                                                )}
                                                {transaction.type === 'savings' && (
                                                    <PiggyBank className="h-5 w-5 text-yellow-500 capitalize" />
                                                )}
                                                <span className="ml-2">{transaction.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">{transaction.amount.toLocaleString('en-UK', { style: 'currency', currency: 'GBP' })}</td>
                                        <td className="py-2 px-4 line-clamp-1 hidden lg:table-cell">{new Date(transaction.transaction_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td className="py-2 px-4">
                                            <div className="flex items-start gap-2">
                                                <Button onClick={() => { setShowTransactionDetails(true); setSelectedTransaction(transaction); }} variant="ghost" className="text-corporate-blue hover:text-corporate-blue/90">
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
                                {transactions?.data.map((transaction: Transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between gap-4 py-2 px-4 not-last:border-b border-corporate-blue/50">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 items-center flex gap-2">
                                                {transaction.type === 'income' && (
                                                    <ArrowDownCircle className="h-5 w-5 text-green-500 capitalize" />
                                                )}
                                                {transaction.type === 'expense' && (
                                                    <ArrowUpCircle className="h-5 w-5 text-red-500 capitalize" />
                                                )}
                                                {transaction.type === 'savings' && (
                                                    <PiggyBank className="h-5 w-5 text-yellow-500 capitalize" />
                                                )}
                                                <span className="font-medium">{transaction.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <span className="font-medium">{transaction.amount.toLocaleString('en-UK', { style: 'currency', currency: 'GBP' })}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => { setShowTransactionDetails(true); setSelectedTransaction(transaction); }} variant="ghost" className="text-corporate-blue hover:text-corporate-blue/90">
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
                                        <section className="flex flex-col gap-4 p-4 md:py-8 lg:col-span-3 min-h-10 rounded-xl shadow-2xl bg-white/50 backdrop-blur-2xl border border-corporate-blue/50 max-w-full overflow-x-auto">
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
                                                <Fence className="h-8 w-8 text-gray-300" />
                                            </div>
                                            <h2 className="text-2xl font-semibold text-gray-300">No transaction records available</h2>
                                            <p className="text-center text-sm text-gray-500">You have no transaction records. Click the button below to add one.</p>
                                            <Button variant={`corporate`} className="mt-4 text-white" onClick={() => setShowAddModal(true)}>Add Transaction</Button>
                                        </section>
                                    )}
                                </>
                            )}
                    </section>)}
            </div>

            <section>
                <CustomModal show={showAddModal} maxWidth="2xl">
                    <section className="flex flex-col max-h-screen sm:max-h-[90vh]">
                        <header className="">
                            <div className="py-2 px-4 flex justify-between items-center">
                                <div className="flex items-center gap-2 ">
                                    <button
                                        className="flex items-center gap-2 text-slate-700 hover:text-airnex-blue-500 md:hidden mr-10"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        <ArrowLeft />{" "}
                                        <span className="text-sm">Back</span>
                                    </button>
                                    <h1 className="text-base font-bold">
                                        Add Transaction
                                    </h1>
                                </div>
                                <button
                                    className="text-slate-700 hover:text-airnex-blue-500 hidden md:block"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    <X />
                                </button>
                            </div>
                        </header>

                        <section className="flex-grow overflow-y-auto">
                            {/* Content Here */}
                            <TransactionForm onSubmit={handleAddTransaction} errors={errors} processing={processing} />
                        </section>
                    </section>
                </CustomModal>
            </section>

            {/* Category Modal */}
            <section>
                <CustomModal show={showCategories} maxWidth="sm">
                    <section className="flex flex-col max-h-screen sm:max-h-[90vh]">
                        <header className="">
                            <div className="py-2 px-4 flex justify-between items-center">
                                <div className="flex items-center gap-2 ">
                                    <button
                                        className="flex items-center gap-2 text-slate-700 hover:text-airnex-blue-500 md:hidden mr-10"
                                        onClick={() => setShowCategories(false)}
                                    >
                                        <ArrowLeft />{" "}
                                        <span className="text-sm">Back</span>
                                    </button>
                                    <h1 className="text-base font-bold">
                                        Manage Categories
                                    </h1>
                                </div>
                                <button
                                    className="text-slate-700 hover:text-airnex-blue-500 hidden md:block"
                                    onClick={() => setShowCategories(false)}
                                >
                                    <X />
                                </button>
                            </div>
                            <section className="px-4 py-2">
                                <form onSubmit={addCategory}>
                                    <div className='rounded-lg border border-slate-200 shadow-md dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center'>
                                        <input
                                            type="text"
                                            name="category"
                                            id="category"
                                            className="w-full focus:ring-0 text-sm min-h-8 active:ring-0 focus:outline-0 active:outline-0 py-2 px-3"
                                            placeholder="Enter a new category"
                                        />
                                        <button type='submit' className='text-sm px-3 py-1 cursor-pointer rounded-lg min-h-full bg-corporate-blue text-white hover:bg-corporate-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
                                            Add
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </header>

                        <section className="flex-grow overflow-y-auto">
                            {/* Content Here */}
                            <ul className='divide-y divide-slate-500 pb-2'>
                                {(categories && categories.length > 0) && categories.map((category, index) => (
                                    <li className='px-4 py-2' key={index}>
                                        <div className="flex items-center justify-between">
                                            <span className='capitalize'>{category.name}</span>
                                            <button onClick={() => deleteCategory(category.id)} className='text-red-500 hover:text-red-700 py-2 px-3'>
                                                <Trash2 className='text-xs' size={18} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </section>
                </CustomModal>
            </section>
        </AppLayout>
    );
}
