// Email Service - Giả lập gửi email (không dùng SMTP thật)
// Trong production, thay thế bằng nodemailer + SMTP thật

const sendPasswordResetEmail = async (userEmail, resetToken, userName) => {
  // Tạo reset URL
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  
  // Tạo nội dung email giả lập
  const emailContent = {
    to: userEmail,
    from: 'noreply@group10-project.com',
    subject: '🔐 Đặt Lại Mật Khẩu - Group 10 Project',
    html: generateResetPasswordEmailHTML(userName, resetToken, resetUrl),
    text: generateResetPasswordEmailText(userName, resetToken, resetUrl)
  };

  // Log email ra console thay vì gửi thật
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                     📧 EMAIL TEST MODE                         ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║ From:    ${emailContent.from.padEnd(53)} ║`);
  console.log(`║ To:      ${emailContent.to.padEnd(53)} ║`);
  console.log(`║ Subject: ${emailContent.subject.padEnd(53)} ║`);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║                      EMAIL CONTENT (TEXT)                      ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(emailContent.text.split('\n').map(line => `║ ${line.padEnd(62)} ║`).join('\n'));
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║                        RESET TOKEN                             ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║ ${resetToken.padEnd(62)} ║`);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║                        RESET URL                               ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║ ${resetUrl.padEnd(62)} ║`);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║ ⏰ Token expires in: 15 minutes                                ║');
  console.log('║ 🔒 This is a TEST email (not actually sent)                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Trả về success (giả lập email đã gửi)
  return {
    success: true,
    messageId: `test-${Date.now()}@group10-project.com`,
    preview: resetUrl
  };
};

// Tạo HTML email template
const generateResetPasswordEmailHTML = (userName, resetToken, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
        .token-box { background: #fff; padding: 15px; border: 2px dashed #2196F3; border-radius: 5px; margin: 20px 0; text-align: center; font-family: monospace; font-size: 16px; word-break: break-all; }
        .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Đặt Lại Mật Khẩu</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${userName}</strong>,</p>
          
          <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
          
          <p><strong>🔑 Token reset password của bạn:</strong></p>
          <div class="token-box">${resetToken}</div>
          
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">🔄 Đổi Mật Khẩu Ngay</a>
          </p>
          
          <div class="warning">
            <p style="margin: 0;"><strong>⚠️ Lưu ý quan trọng:</strong></p>
            <ul style="margin: 10px 0 0 0;">
              <li>Token này sẽ <strong>hết hạn sau 15 phút</strong></li>
              <li>Token chỉ có thể sử dụng <strong>1 lần</strong></li>
              <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
            </ul>
          </div>
          
          <p>Nếu nút không hoạt động, copy link sau vào trình duyệt:</p>
          <p style="word-break: break-all; font-size: 12px; color: #666;">${resetUrl}</p>
        </div>
        <div class="footer">
          <p>© 2025 Group 10 Project. All rights reserved.</p>
          <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Tạo text email template (fallback cho email client không hỗ trợ HTML)
const generateResetPasswordEmailText = (userName, resetToken, resetUrl) => {
  return `
Xin chào ${userName},

Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.

🔑 TOKEN RESET PASSWORD:
${resetToken}

🔗 LINK ĐỔI MẬT KHẨU:
${resetUrl}

⚠️ LƯU Ý:
- Token hết hạn sau 15 phút
- Token chỉ dùng được 1 lần
- Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này

Trân trọng,
Group 10 Project Team

---
© 2025 Group 10 Project. All rights reserved.
Email này được gửi tự động, vui lòng không trả lời.
  `.trim();
};

module.exports = {
  sendPasswordResetEmail
};

