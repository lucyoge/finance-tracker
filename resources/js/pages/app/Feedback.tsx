import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import httpClient from '@/lib/axios';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Feedbacks', href: '/feedbacks' },
];

interface FeedbackFormProps {
    onSubmit: (formData: FormData) => void;
    errors: { [key: string]: string };
    processing: boolean;
}

interface FeedbackFormState {
    type: string;
    title: string;
    description: string;
    attachment: File | null;
}

export default function Feedback() {
    const [formData, setFormData] = useState<FeedbackFormState>({
        type: '',
        title: '',
        description: '',
        attachment: null,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, files } = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' ? (files && files[0] ? files[0] : null) : value,
        }));
    };

    const handleSelectChange = (name: keyof FeedbackFormState, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'attachment' && value) {
                data.append(key, value);
            } else {
                data.append(key, value?.toString() ?? '');
            }
        });
        
        httpClient.post(route('api.submit-feedback'), data).then((response) => {
            if (response.status === 200) {
                setProcessing(false);
                setFormData({
                    type: '',
                    title: '',
                    description: '',
                    attachment: null,
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feedbacks" />
            <div className="max-w-2xl p-4">
                <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="type">Type*</Label>
                            <Select
                                name="type"
                                value={formData.type || 'general'}
                                onValueChange={(value) => handleSelectChange('type', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select feedback type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="complaint">Complaint</SelectItem>
                                    <SelectItem value="suggestion">Suggestion</SelectItem>
                                    <SelectItem value="request">Request</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="title">Title*</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="description">Description*</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                required
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="attachment">Attachment</Label>
                            <Input
                                id="attachment"
                                name="attachment"
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleChange}
                            />
                            <InputError message={errors.attachment} />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full md:w-auto md:self-end bg-corporate-blue/90 text-white"
                        disabled={processing}
                        variant="corporate"
                    >
                        {processing ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
