import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Prevents the scroll animation that causes the "jumping" effect
        });
    }, [pathname, search]);

    return null;
}
