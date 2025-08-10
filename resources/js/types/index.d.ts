import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    displayMenu?: boolean; // Optional property to control visibility in the sidebar
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    phone: string;
    status: string; // e.g., 'active', 'inactive', etc.
    email: string;
    profile_picture?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface TransactionCategory {
    id: number;
    name: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Transaction {
    id: number;
    transaction_date: DateTime;
    amount: number;
    type: 'income' | 'expense' | 'savings';
    category: TransactionCategory;
    payment_method: string;
    description?: string;
    user_id: number;
    user?: User;
    attachments?: Attachment[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Attachment {
    id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    transaction_id: number;
    [key: string]: unknown; // This allows for additional properties...
}
