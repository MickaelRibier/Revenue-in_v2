// const express = require('express');
import express from 'express';
import passport from 'passport';

export const router = express.Router();

import { mainController } from './controllers/mainController.js';
import { adminController } from './controllers/adminController.js';

const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// ─── Admin Auth Middleware (supports both Google OAuth & local password) ───
const adminAuth = (req, res, next) => {
    if (req.session.localAdmin || (req.isAuthenticated() && req.user && req.user.role === 'admin')) {
        return next();
    }
    res.redirect('/admin/login');
};

// ─── Public Routes ───
router.get('/', mainController.index);
router.post('/contact', mainController.post);

// ─── Auth Routes ───

// Show the login page
router.get('/admin/login', (req, res) => {
    // Fully logged in as admin → go to dashboard
    if (req.session.localAdmin || (req.isAuthenticated() && req.user && req.user.role === 'admin')) {
        return res.redirect('/admin');
    }
    // Authenticated via Google but NOT admin → show access denied (prevents redirect loop)
    if (req.isAuthenticated() && req.user && req.user.role !== 'admin') {
        return res.render('admin/login', {
            googleEnabled,
            error: `Access denied: the account "${req.user.email}" is not authorised as admin.`
        });
    }
    const error = req.session.loginError || null;
    delete req.session.loginError;
    res.render('admin/login', { googleEnabled, error });
});

// Local password login (fallback when Google OAuth is not configured)
router.post('/auth/local', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
        req.session.localAdmin = true;
        res.redirect('/admin');
    } else {
        req.session.loginError = 'Incorrect password. Please try again.';
        res.redirect('/admin/login');
    }
});

// Google OAuth routes (only if credentials are configured)
if (googleEnabled) {
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get(
        '/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/admin/login' }),
        (req, res) => res.redirect('/admin')
    );
}

router.get('/logout', (req, res, next) => {
    req.session.localAdmin = false;
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// ─── Admin Routes (Protected) ───
router.get('/admin', adminAuth, adminController.dashboard);
router.get('/admin/testimonials', adminAuth, adminController.testimonialsView);
router.post('/admin/testimonials', adminAuth, adminController.createTestimonial);
router.post('/admin/testimonials/:id/delete', adminAuth, adminController.deleteTestimonial);
router.post('/admin/testimonials/:id/toggle', adminAuth, adminController.toggleTestimonial);

// module.exports = router;
