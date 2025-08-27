import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Budget, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Bell, CalendarIcon, Car, EllipsisVertical, Handshake, Menu, Phone, PieChart, Plus, ReceiptText, Repeat, Target, User, X } from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { ChartRadialShape } from '@/components/charts/ChartRadialShape';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import CustomModal from '@/components/custom/CustomModal';
import BudgetForm from '@/components/custom/BudgetForm';
import httpClient from '@/lib/axios';
import { ChartRadialText } from '@/components/charts/ChartRadialText';
import { Card, CardContent } from '@/components/ui/card';
import BudgetCard from '@/components/custom/BudgetCard';
import BudgetSummaryChart from '@/components/custom/BudgetSummaryChart';
import { ca } from 'date-fns/locale';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Budget',
        href: '/budget',
    },
];

export default function Budgeting() {
    const user = usePage<SharedData>().props.auth.user;
    const [showAddModal, setShowAddModal] = useState(false);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [refreshBudgetSummary, setRefreshBudgetSummary] = useState(false);
    // Define the type for each budget purpose object
    type BudgetPurposeData = {
        total_amount: number;
        total_spent: number;
        remaining: number;
        [key: string]: any; // for any additional properties
    };

    // The array is of objects with a single key (purpose) mapping to BudgetPurposeData
    type BudgetOnPurposeItem = {
        [purpose: string]: BudgetPurposeData;
    };

    const [budgetOnPurpose, setBudgetOnPurpose] = useState<BudgetOnPurposeItem[]>([]);

    // State for form errors and processing
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const fetchBudgets = async () => {
        try {
            const response = await httpClient.get(route('api.fetch-budgets'));
            if (response.status === 200) {
                setBudgets(response.data.body.budgets);
                setBudgetOnPurpose(response.data.body.budgets_on_purpose);
            }
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleAddBudget = async (formData: FormData): Promise<void> => {
        setProcessing(true);
        try {
            await httpClient.post(route('api.add-budget'), formData)
                .then(response => {
                    if (response.status === 200) {
                        setShowAddModal(false);
                        fetchBudgets();
                        setErrors({});
                        setRefreshBudgetSummary(!refreshBudgetSummary); // Toggle to refresh the summary chart
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 422) {
                        setErrors(error.response?.data?.errors || {});
                    }
                    alert('Failed to add budget. Please check the form and try again.');
                    console.log('Error adding budget:', error.response?.data?.errors);
                });
        } catch (error: any) {
            setErrors(error.response?.data?.errors || {});
        }
        setProcessing(false);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Budgeting" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <section className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex gap-3 items-start justify-start">
                            <PieChart className="h-6 w-6 mt-1 text-corporate-blue" />
                            <div className='flex-shrink-0'>
                                <h2 className="text-lg md:text-2xl mb-2 font-semibold">Budgeting</h2>
                            </div>
                        </div>
                    </div>
                    <aside className="">
                        <Button
                            type="button"
                            variant={"hero"}
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex justify-center bg-corporate-blue/90 items-center space-x-1 rounded-sm md:rounded-lg p-1 md:p-2 md:px-4 shadow-sm"
                        >
                            <Plus className="h-6 w-6 text-white" />
                            <span className="hidden md:block text-sm font-medium text-white">
                                New Budget
                            </span>
                        </Button>
                    </aside>
                </section>

                <section className="flex gap-3 flex-wrap md:flex-nowrap">
                    <aside className='md:flex-2/5'>
                        <BudgetSummaryChart refresh={refreshBudgetSummary} />
                    </aside>
                    <aside className='md:flex-3/5'>
                        <div>
                            <h1 className="text-lg font-semibold mb-2">Budget Overview</h1>
                            <p className="text-sm text-muted-foreground mb-4">View your budget summary based on purposes</p>
                        </div>

                        {/* Render a card for each budget purpose */}
                        {budgetOnPurpose && Object.entries(budgetOnPurpose).map(([purposeKey, purposeObj]) => {
                            // Each purposeObj is an object with a single key (e.g., { Emergency: {...} })
                            const [categoryName, categoryData] = Object.entries(purposeObj)[0];
                            const total = categoryData?.total_amount || 0;
                            const spent = categoryData?.total_spent || 0;
                            const saved = categoryData?.total_saved || 0;
                            const extraSaved = categoryData?.extra_saved || 0;
                            const remaining = categoryData?.remaining || 0;
                            const percentage = categoryData?.purpose === 'Savings' ? (saved > 0 ? Math.round((saved / total) * 100) : 0) : (spent > 0 ? Math.round((spent / total) * 100) : 0);
                            return (
                                <Card className="gap-4 p-0 mb-4" key={purposeKey}>
                                    <CardContent className="flex items-center gap-3 py-1 px-4">
                                        <div className='w-24'>
                                            { categoryData.purpose === 'Savings' ? (
                                                <ChartRadialText
                                                    size='md'
                                                    data={[{
                                                        label: categoryName,
                                                        value: saved,
                                                        percentage: percentage,
                                                        fill: (saved > 99) ? "#008000" : (saved > 50) ? "#ff9800" : "#ff0000" // #008000 is a darker green
                                                    }]} />
                                            ) : (
                                                <ChartRadialText
                                                    size='md'
                                                    data={[{
                                                        label: categoryName,
                                                        value: spent,
                                                        percentage: percentage,
                                                        fill: (spent > 99) ? "#008000" : (spent > 50) ? "#ff9800" : "#ff0000"
                                                    }]} />
                                            )}
                                        </div>
                                        <aside className='flex-1 flex justify-between items-start gap-3'>
                                            <div>
                                                <span className="capitalize"> Total {categoryName}</span>
                                                <h3 className='text-lg font-semibold'>
                                                    {total.toLocaleString(undefined, { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })}
                                                </h3>
                                                {categoryData.purpose === 'Savings' ? (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        <span>Saved: {saved.toLocaleString(undefined, { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })}</span><br />
                                                        <span>Extra Saved: {extraSaved.toLocaleString(undefined, { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })}</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        <span>Spent: {spent.toLocaleString(undefined, { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })}</span><br />
                                                        <span>Remaining: {remaining.toLocaleString(undefined, { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='flex items-center justify-between mt-2'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <EllipsisVertical className="h-4 w-4 ml-1" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setShowAddModal(true)}>
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add New Budget
                                                        </DropdownMenuItem>
                                                        {/* <DropdownMenuItem>
                                                            <ReceiptText className="mr-2 h-4 w-4" />
                                                            View Budget Report
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            Set Budget Period
                                                        </DropdownMenuItem> */}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </aside>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </aside>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgets.map(budget => (
                        <BudgetCard key={budget?.id} budget={budget} setShowAddModal={setShowAddModal} />
                    ))}
                </section>
            </div>

            {/* New Budget Modal */}
            <section>
                <CustomModal show={showAddModal} maxWidth="xl" onClose={() => setShowAddModal(false)} closeable={false}>
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
                                        Add Budget
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
                            <BudgetForm onSubmit={handleAddBudget} errors={errors} processing={processing} />
                        </section>
                    </section>
                </CustomModal>
            </section>
        </AppLayout>
    );
}
