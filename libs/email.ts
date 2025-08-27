import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendTicketUpdateEmail = async (to: string, ticketId: string) => {
  await transporter.sendMail({
    from: "Helpdesk <helpdesk@example.com>",
    to,
    subject: "Ticket Status Updated",
    html: `Your ticket <a href="/tickets/${ticketId}">#${ticketId}</a> has been updated.`,
  });
};
