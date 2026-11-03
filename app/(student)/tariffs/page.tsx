'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TariffsRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pkg = searchParams?.get('package');

    useEffect(() => {
        router.replace(pkg ? `/premium?package=${pkg}` : '/premium');
    }, [pkg, router]);

    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );
}

export default function TariffsPage() {
    return (
        <Suspense fallback={null}>
            <TariffsRedirect />
        </Suspense>
    );
}
