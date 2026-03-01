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

                    // Check if user exists
                    let user = await User.findOne({ where: { email } });

                    if (!user) {
                        // First time login - Create user
                        // In a real app, you might want to restrict this to specific emails
                        user = await User.create({
                            googleId: profile.id,
                            name: profile.displayName,
                            email: email,
                            role: (email === process.env.ADMIN_EMAIL) ? 'admin' : 'user'
                        });
                    } else if (!user.googleId) {
                        // Link google ID if email matches but no google ID linked yet
                        user.googleId = profile.id;
                        await user.save();
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
