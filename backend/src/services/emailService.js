import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Cache compiled templates
// compiling templates from raw HTML every time is expensive
const templateCache = {};

/**
 * Load and compile a Handlebars template
 * @param {string} templateName - e.g., 'welcome', 'reset-password'
 * @returns {Promise<Function>}
 */
async function loadTemplate(templateName) {
  if (templateCache[templateName]) {
    return templateCache[templateName];
  }
  const templatePath = path.join(process.cwd(), 'templates', 'email', `${templateName}.hbs`);
  const source = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(source);
  templateCache[templateName] = template;
  return template;
}

/**
 * Send an email (low-level)
 */
export async function sendEmail(to, subject, text, html = null) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };
  const info = await transporter.sendMail(mailOptions);
  return info.messageId; // Return messageId for tracking
}

/**
 * Send email using a template
 * @param {string} to
 * @param {string} subject
 * @param {string} templateName - name of template file (without extension)
 * @param {Object} context - data to inject into template
 */
export async function sendTemplatedEmail(to, subject, templateName, context) {
  const template = await loadTemplate(templateName);
  const html = template(context);
  // Generate plain text version by stripping HTML (optional)
  const text = html.replace(/<[^>]*>?/gm, '');
  return sendEmail(to, subject, text, html);
}
