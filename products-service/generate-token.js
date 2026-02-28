
import jwt from 'jsonwebtoken';

const secret = 'chapinbank2026';

const tokenAhorro = jwt.sign(
    { sub: 'user-ahorro-001', role: 'USER_ROLE', accountType: 'AHORRO' },
    secret,
    { expiresIn: '24h' }
);

const tokenMonetaria = jwt.sign(
    { sub: 'user-monetaria-002', role: 'USER_ROLE', accountType: 'MONETARIA' },
    secret,
    { expiresIn: '24h' }
);

const tokenAdmin = jwt.sign(
    { sub: 'admin-001', role: 'ADMIN_ROLE', accountType: 'MONETARIA' },
    secret,
    { expiresIn: '24h' }
);

console.log('AHORRO:\n', tokenAhorro);
console.log('\nMONETARIA:\n', tokenMonetaria);
console.log('\nADMIN:\n', tokenAdmin);