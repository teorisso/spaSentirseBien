// src/pages/_app.tsx
import '../styles/globals.css';
import '@fontsource/roboto';
import '@fontsource/amiri';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

function AppContent({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isAdminRoute = router.pathname.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && <Header />}
            <Component {...pageProps} />
            {!isAdminRoute && <Footer />}
            <Toaster position="top-right" />
        </>
    );
}

export default function App(props: AppProps) {
    return (
        <SessionProvider>
            <AuthProvider>
                <AppContent {...props} />
            </AuthProvider>
        </SessionProvider>
    );
}
