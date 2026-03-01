import { Contact } from '../models/Contact.js';
import { Testimonial } from '../models/Testimonial.js';

const adminController = {
    // Render Main Dashboard (Messages & Overview)
    async dashboard(req, res) {
        try {
            const messages = await Contact.findAll();
            res.render('admin/dashboard', {
                user: req.user,
                messages
            });
        } catch (error) {
            console.error('Error fetching admin dashboard:', error);
            res.status(500).send('Server Error');
        }
    },

    // Render Testimonials Management View
    async testimonialsView(req, res) {
        try {
            const testimonials = await Testimonial.findAll();
            res.render('admin/testimonials', {
                user: req.user,
                testimonials
            });
        } catch (error) {
            console.error('Error fetching testimonials view:', error);
            res.status(500).send('Server Error');
        }
    },

    // Add new testimonial
    async createTestimonial(req, res) {
        try {
            const { content, authorName, authorTitle, isActive } = req.body;
            await Testimonial.create({
                content,
                authorName,
                authorTitle,
                isActive: isActive === 'on' ? true : false,
            });
            res.redirect('/admin/testimonials');
        } catch (error) {
            console.error('Error creating testimonial:', error);
            res.status(500).send('Server Error');
        }
    },

    // Delete testimonial
    async deleteTestimonial(req, res) {
        try {
            const { id } = req.params;
            const testimonial = await Testimonial.findByPk(id);
            if (testimonial) {
                await testimonial.destroy();
            }
            res.redirect('/admin/testimonials');
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            res.status(500).send('Server Error');
        }
    },

    // Toggle testimonial active status
    async toggleTestimonial(req, res) {
        try {
            const { id } = req.params;
            const testimonial = await Testimonial.findByPk(id);
            if (testimonial) {
                testimonial.isActive = !testimonial.isActive;
                await testimonial.save();
            }
            res.redirect('/admin/testimonials');
        } catch (error) {
            console.error('Error toggling testimonial:', error);
            res.status(500).send('Server Error');
        }
    }
};

export { adminController };
