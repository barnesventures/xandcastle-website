export function generateRestockNotificationEmail(data: {
  productTitle: string;
  variantTitle: string;
  productUrl: string;
  customerName?: string;
}) {
  const subject = `Back in Stock: ${data.productTitle}`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #7c3aed;
    }
    .content {
      padding: 30px 0;
    }
    .product-info {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #7c3aed;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px 0;
      border-top: 1px solid #e5e5e5;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Xandcastle</div>
    </div>
    
    <div class="content">
      <h1>Great news! Your item is back in stock!</h1>
      
      <p>Hi${data.customerName ? ` ${data.customerName}` : ''},</p>
      
      <p>The item you were waiting for is now available:</p>
      
      <div class="product-info">
        <h2>${data.productTitle}</h2>
        <p><strong>Variant:</strong> ${data.variantTitle}</p>
      </div>
      
      <p>Don't miss out - popular items sell out quickly!</p>
      
      <div style="text-align: center;">
        <a href="${data.productUrl}" class="button">Shop Now</a>
      </div>
      
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${data.productUrl}</p>
    </div>
    
    <div class="footer">
      <p>You received this email because you signed up for restock notifications.</p>
      <p>&copy; ${new Date().getFullYear()} Xandcastle. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${subject}

Hi${data.customerName ? ` ${data.customerName}` : ''},

Great news! The item you were waiting for is back in stock:

${data.productTitle}
Variant: ${data.variantTitle}

Don't miss out - popular items sell out quickly!

Shop Now: ${data.productUrl}

You received this email because you signed up for restock notifications.

© ${new Date().getFullYear()} Xandcastle. All rights reserved.
  `.trim();

  return { subject, html, text };
}