import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';

export interface ApiRequest extends NextApiRequest {
    session?: Session;
}

export interface ApiResponse extends NextApiResponse {
    locals?: {
        user?: Session['user'];
    };
} 