import { Contact } from '../models/Contact.js';
import { Testimonial } from '../models/Testimonial.js';

const adminController = {
    // Render Main Dashboard (Messages & Overview)
    async dashboard(req, res) {
        try {
            const isArchived = req.query.archived === 'true';
            const messages = await Contact.findAll({
                where: {
                    isArchived: isArchived ? true : false
                },
                order: [['id', 'DESC']]
            });
            res.render('admin/dashboard', {
                user: req.user,
                messages,
                isArchivedView: isArchived
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
    },

    // Delete contact message
    async deleteMessage(req, res) {
        try {
            const { id } = req.params;
            const message = await Contact.findByPk(id);
            if (message) {
                await message.destroy();
            }
            res.redirect('back');
        } catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).send('Server Error');
        }
    },

    // Toggle message archive state
    async toggleArchiveMessage(req, res) {
        try {
            const { id } = req.params;
            const message = await Contact.findByPk(id);
            if (message) {
                message.isArchived = !message.isArchived;
                await message.save();
            }
            res.redirect('back');
        } catch (error) {
            console.error('Error archiving message:', error);
            res.status(500).send('Server Error');
        }
    }
};

export { adminController };
