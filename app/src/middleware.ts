import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        // Verificar si el usuario tiene el rol necesario para acceder a la ruta
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        console.log('Middleware - Token:', token);
        console.log('Middleware - Path:', path);

        // Rutas que requieren rol de admin
        if (path.startsWith('/admin') && token?.rol !== 'admin') {
            console.log('Middleware - Access denied: Not admin');
            return NextResponse.redirect(new URL('/', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
);

export const config = {
    matcher: [
        '/turnos/:path*',
        '/admin/:path*',
        '/perfil/:path*'
    ]
}; 