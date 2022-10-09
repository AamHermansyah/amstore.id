import { NextResponse } from 'next/server'
import { userMustLogin } from './utils';

const userAuth = [
    { 
        HAS_LOGIN_PATHNAME: ['/auth/user-login', '/auth/user-signup']
    },
    {
        MUST_LOGIN_PATHNAME: ['/user/checkout', '/user/transaction']
    }
];

const adminAuth = [
    {
        HAS_LOGIN_PATHNAME: ['/auth/admin-login']
    },
    {
        MUST_LOGIN_PATHNAME: ['/dashboard', '/admin/category', '/admin/transaction', '/admin/checkout']
    }
]

export function middleware(req, res){
    for(let i = 0; i < userAuth.length; i++){
        const key = Object.keys(userAuth[i])[0];
        for(let j = 0; j < userAuth[i][key].length; j++){
            if(req.nextUrl.pathname.startsWith(userAuth[i][key][j])){
                if(userMustLogin(i === 0 ? false : true, req.cookies.get('token_user'))) {
                    return NextResponse.redirect(new URL(i === 0 ? '/' : '/auth/user-login', req.url))
                }
            }
        }
    }

    for(let i = 0; i < adminAuth.length; i++){
        const key = Object.keys(adminAuth[i])[0];
        for(let j = 0; j < adminAuth[i][key].length; j++){
            if(req.nextUrl.pathname.startsWith(adminAuth[i][key][j])){
                if(userMustLogin(i === 0 ? false : true, req.cookies.get('token_admin'))) {
                    return NextResponse.redirect(new URL(i === 0 ? '/dashboard' : '/auth/admin-login', req.url))
                }
            }
        }
    }
}
