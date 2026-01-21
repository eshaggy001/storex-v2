import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '@/components/Sidebar';
import React from 'react';

describe('Sidebar Component', () => {
    const defaultProps = {
        activeView: 'dashboard',
        setActiveView: vi.fn(),
        isAssistantOpen: false,
        toggleAssistant: vi.fn(),
        language: 'en' as const,
    };

    it('renders all main navigation items', () => {
        render(<Sidebar {...defaultProps} />);

        // Check for dashboard icon/button (using title or identifying text)
        expect(screen.getByTitle('Dashboard')).toBeInTheDocument();
        expect(screen.getByTitle('Products')).toBeInTheDocument();
        expect(screen.getByTitle('Messages')).toBeInTheDocument();
        expect(screen.getByTitle('Orders')).toBeInTheDocument();
        expect(screen.getByTitle('Customers')).toBeInTheDocument();
        expect(screen.getByTitle('Wallet')).toBeInTheDocument();
        expect(screen.getByTitle('Store Settings')).toBeInTheDocument();
        expect(screen.getByTitle('Personal Profile')).toBeInTheDocument();
    });

    it('calls setActiveView when a nav item is clicked', () => {
        render(<Sidebar {...defaultProps} />);

        const productsBtn = screen.getByTitle('Products');
        fireEvent.click(productsBtn);

        expect(defaultProps.setActiveView).toHaveBeenCalledWith('products');
    });

    it('highlights the active view item', () => {
        const { rerender } = render(<Sidebar {...defaultProps} activeView="dashboard" />);

        const dashboardBtn = screen.getByTitle('Dashboard');
        // Check for active class (bg-white text-black)
        expect(dashboardBtn.className).toContain('bg-white');

        rerender(<Sidebar {...defaultProps} activeView="products" />);
        const productsBtn = screen.getByTitle('Products');
        expect(productsBtn.className).toContain('bg-white');
    });

    it('calls toggleAssistant when the AI button is clicked', () => {
        render(<Sidebar {...defaultProps} />);

        const assistantBtn = screen.getByTitle('AI Assistant');
        fireEvent.click(assistantBtn);

        expect(defaultProps.toggleAssistant).toHaveBeenCalled();
    });

    it('renders in Mongolian when language is set to mn', () => {
        render(<Sidebar {...defaultProps} language="mn" />);

        expect(screen.getByTitle('Хянах самбар')).toBeInTheDocument();
    });
});
