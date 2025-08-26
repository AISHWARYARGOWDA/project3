// Minimal print-to-PDF helper (opens styled window and invokes print)
export function openPrintWindow({ title = "Report", html }) {
    const w = window.open("", "_blank");
    w.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body{ font-family: Segoe UI, Arial, sans-serif; padding:24px; }
            .brand-head{ display:flex; align-items:center; gap:12px; margin-bottom:16px; border-bottom:3px solid #0072CE; padding-bottom:10px; }
            .brand-head img{ height:44px;}
            .brand-title{ font-weight:700; font-size:20px; color:#0072CE;}
            .muted{ color:#555; }
            table{ border:1px solid #ccc !important; }
            th,td{ border:1px solid #ddd !important; padding:6px 8px !important;}
            .section{ margin-top:16px; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print(); // user can save as PDF
  }