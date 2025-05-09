import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { UserModel } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

declare module 'next-auth/jwt' {
    interface JWT {
        rol: 'user' | 'admin';
    }
}

declare module 'next-auth' {
    interface User {
        rol: 'user' | 'admin';
    }
    interface Session {
        user: {
            rol: 'user' | 'admin';
        } & DefaultSession['user']
    }
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email y contraseña son requeridos');
                }

                try {
                    await dbConnect();
                    
                    console.log('Searching for user with email:', credentials.email);
                    const user = await UserModel.findOne({ email: credentials.email });
                    console.log('User found:', user);

                    if (!user) {
                        throw new Error('No existe una cuenta con este email');
                    }

                    const isValid = await user.comparePassword(credentials.password);

                    if (!isValid) {
                        throw new Error('Contraseña incorrecta');
                    }

                    console.log('User role:', user.rol);

                    return {
                        id: user._id?.toString() || '',
                        email: user.email,
                        nombre: user.nombre,
                        rol: user.rol as 'user' | 'admin'
                    };
                } catch (error) {
                    console.error('Authentication error:', error);
                    throw error;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log('Setting role in JWT:', user.rol);
                token.rol = user.rol;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                console.log('Setting role in session:', token.rol);
                session.user.rol = token.rol;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error'
    }
}); 