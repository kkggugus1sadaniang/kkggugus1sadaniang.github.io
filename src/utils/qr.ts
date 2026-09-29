import QRCode from 'qrcode';

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 256,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    // fallback 1x1 transparent png
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAAElFTkSuQmCC';
  }
}
