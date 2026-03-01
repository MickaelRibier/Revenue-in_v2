import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from './models/User.js';
import 'dotenv/config';

// Serialize user into the sessions
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the sessions
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Setup Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;

                    // Support comma-separated list of admin emails
                    const adminEmails = (process.env.ADMIN_EMAIL || '')
                        .split(',')
                        .map(e => e.trim().toLowerCase())
                        .filter(Boolean);
                    const isAdmin = adminEmails.includes(email.toLowerCase());

                    // Check if user exists
                    let user = await User.findOne({ where: { email } });

                    if (!user) {
                        user = await User.create({
                            googleId: profile.id,
                            name: profile.displayName,
                            email: email,
                            role: isAdmin ? 'admin' : 'user'
                        });
                    } else {
                        // Always sync role and googleId in case admin list changed
                        let changed = false;
                        if (!user.googleId) { user.googleId = profile.id; changed = true; }
                        const expectedRole = isAdmin ? 'admin' : 'user';
                        if (user.role !== expectedRole) { user.role = expectedRole; changed = true; }
                        if (changed) await user.save();
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );
} else {
    console.warn('⚠️ GOOGLE_CLIENT_ID or SECRET not set. Social login will fail.');
}

export { passport };
