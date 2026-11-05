'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'tm-theme';

interface ThemeContextValue {
    theme: ThemeMode;
    setTheme: (t: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    setTheme: () => { },
    toggleTheme: () => { },
});

function readStoredTheme(): ThemeMode {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') return stored;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch {
        /* ignore */
    }
    return 'light';
}

/**
 * Dark theme provider for the student panel only.
 * The `dark` class is added to <html> while mounted and removed on unmount,
 * so the landing / auth pages always stay light.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>('light');

    useEffect(() => {
        setThemeState(readStoredTheme());
        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    const setTheme = useCallback((t: ThemeMode) => {
        setThemeState(t);
        try {
            localStorage.setItem(STORAGE_KEY, t);
        } catch {
            /* ignore */
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
