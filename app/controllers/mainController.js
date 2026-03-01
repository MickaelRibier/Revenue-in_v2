import { main } from './nodeMailer.js';
import { sequelize } from '../data/sequelize.js';

// Only import Contact and Testimonial models if DB is available
let Contact = null;
let Testimonial = null;
if (sequelize) {
  const modContact = await import('../models/Contact.js');
  Contact = modContact.Contact;
  const modTest = await import('../models/Testimonial.js');
  Testimonial = modTest.Testimonial;
}

const mainController = {
  async index(req, res) {
    try {
      let testimonials = [];
      if (Testimonial) {
        try {
          testimonials = await Testimonial.findAll({
            where: { isActive: true },
          });
        } catch (dbErr) {
          console.warn('⚠️ Could not fetch testimonials (Database maybe down or syncing failed). Proceeding without dynamic testimonials.');
        }
      }
      res.render('index', { testimonials });
    } catch (error) {
      console.error('GET / error:', error);
      res.status(500).send('Server error');
    }
  },

  async post(req, res) {
    const formDatas = req.body;
    try {
      // Save to DB if available
      let savedRecord = null;
      if (Contact) {
        savedRecord = await Contact.create({
          name: formDatas.name,
          email: formDatas.email,
          message: formDatas.message,
        });
      }

      // Always try to send email
      await main(formDatas);

      res.json(savedRecord ?? { ok: true, message: 'Email sent (no DB)' });
    } catch (error) {
      console.error('POST /contact error:', error);
      res.status(500).json({ error: 'Failed to process contact form' });
    }
  },
};

export { mainController };
