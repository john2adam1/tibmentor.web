import { Home, Trophy, User, BookOpen } from 'lucide-react';

/**
 * Main navigation: same 4 items as the mobile app tab bar
 * (Asosiy, Kurslarim, Reyting, Profil).
 * Bell (notifications) and PREMIUM live in the header / sidebar, not in the menu.
 */
export const NAV_ITEMS = [
    { name: 'Asosiy', href: '/dashboard', icon: Home },
    { name: 'Kurslarim', href: '/courses?tab=my', icon: BookOpen },
    { name: 'Reyting', href: '/leaderboard', icon: Trophy },
    { name: 'Profil', href: '/profile', icon: User },
];

/** Is the nav item active for the current URL? */
export function isNavActive(href: string, pathname: string, onMyTab: boolean): boolean {
    const [path] = href.split('?');
    if (path === '/courses') {
        if (pathname === '/courses') return onMyTab;
        return pathname.startsWith('/courses/');
    }
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname === path || pathname.startsWith(path + '/');
}

/** Pages that render their own full-screen header (no tab bar / app header). */
export function isImmersivePath(pathname: string): boolean {
    return pathname.startsWith('/lessons');
}
