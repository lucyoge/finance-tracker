import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckOptionsInput, CheckOptionValues } from './CheckOptionsInput';
import { Attachment } from '@/types';
import InputError from '../input-error';
import httpClient from '@/lib/axios';
import { Hotel, LoaderCircle } from 'lucide-react';
import { set } from 'date-fns';

interface TransactionFormProps {
    onSubmit: (formData: FormData) => void;
    errors: { [key: string]: string };
    processing: boolean;
}

interface TransactionForm {
    id?: number;
    transaction_date: string;
    amount: number | string;
    type: string;
    category: string;
    payment_method: string;
    description?: string;
    attachments?: Attachment[];
}

export default function TransactionForm({ onSubmit, errors, processing }: TransactionFormProps) {
    const [formData, setFormData] = useState<TransactionForm>({
        transaction_date: '',
        amount: '',
        type: 'Income',
        category: '',
        payment_method: '',
        description: '',
    });
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isCategoriesFocused, setIsCategoriesFocused] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        httpClient.get(route('api.fetch-transaction-categories')).then((response) => {
            if (response.status !== 200) {
                console.error('Failed to fetch categories');
                return;
            }
            setCategories(response.data.body.categories);
        });
    };

    const handleCategoriesFocus = (focused: boolean) => {
        setIsCategoriesFocused(focused);
    };

    const handleCategoriesChange = (values: string[]) => {
        setSelectedCategories(values);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? target.checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            // setFormData(prev => ({ ...prev, attachments: fileArray }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let data = new FormData(e.currentTarget);
        Object.keys(formData).forEach(key => {
            if (key === 'attachments') {
                formData.attachments?.forEach((file, index) => {
                    data.append(`attachments[${index}]`, file as any);
                });
            } else {
                const value = formData[key as keyof TransactionForm];
                if (typeof value === 'boolean' || typeof value === 'number') {
                    data.append(key, value.toString());
                } else {
                    data.append(key, value as string);
                }
            }
        });

        // Append selectedCategories to FormData
        selectedCategories.forEach((amenity, index) => {
            data.append(`categories[${index}]`, amenity);
        });

        onSubmit(data);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 max-h-full">
            <p className='mb-6'>Please fill in the transaction details below.</p>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="transaction_date">Transaction Date*</Label>
                        <Input
                            id="transaction_date"
                            name="transaction_date"
                            type="date"
                            max={new Date().toISOString().split('T')[0]} // Prevent future dates
                            required
                            value={formData.transaction_date}
                            onChange={handleChange}
                        />
                        <InputError message={errors.transaction_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (£)*</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            required
                            value={formData.amount}
                            onChange={handleChange}
                        />
                        <InputError message={errors.amount} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Type*</Label>
                        <Select
                            name="type"
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                            defaultValue='Income'
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Income">Income</SelectItem>
                                <SelectItem value="Expenses">Expenses</SelectItem>
                                <SelectItem value="Savings">Savings</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            name="categories"
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                            <SelectTrigger className='capitalize'>
                                <SelectValue placeholder="Select categories" />
                            </SelectTrigger>
                            <SelectContent className='capitalize'>
                                {(() => {
                                    const filteredCategories = categories.filter(
                                        (category) => category.type === formData.type.toLowerCase()
                                    );
                                    if (filteredCategories.length === 0) {
                                        return <SelectItem value=" " disabled>No Category</SelectItem>;
                                    }
                                    return filteredCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ));
                                })()}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="payment_method">Payment Method</Label>
                        <Select
                            name="payment_method"
                            value={formData.payment_method}
                            onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Wallet">Wallet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Image Upload - Would need separate implementation */}
                    <div className="grid gap-2">
                        <Label>Attachments</Label>
                        <Input type="file" name='attachments' multiple accept="image/*" onChange={handleFileChange} />
                        <InputError message={errors.attachments} />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="description">Description/Note</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={5}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full md:w-auto md:self-end bg-corporate-blue/90 text-white"
                    disabled={processing}
                    variant={"corporate"}
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Add Transaction
                </Button>
            </form>
        </div>
    );
}
