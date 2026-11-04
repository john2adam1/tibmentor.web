import { redirect } from 'next/navigation';

// Old debug page: "my courses" now lives in the main courses page.
export default function MyCoursesPage() {
    redirect('/courses?tab=my');
}
