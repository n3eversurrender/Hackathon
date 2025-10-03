import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeHelper {
  /**
   * Generate QR code as Data URL (base64)
   * @param data - Data to encode in QR code
   * @returns Promise<string> - QR code as data URL
   */
  async generateQRCode(data: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 300,
      });
      return qrCodeDataURL;
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  /**
   * Generate unique token for session
   * @param sessionId - Session ID
   * @param courseId - Course ID
   * @param date - Session date
   * @returns string - Unique token
   */
  generateSessionToken(
    sessionId: number,
    courseId: number,
    date: string,
  ): string {
    const data = `${sessionId}:${courseId}:${date}:${Date.now()}`;
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
      .substring(0, 32);
  }

  /**
   * Create session QR data string
   * @param sessionId - Session ID
   * @param token - Unique token
   * @param expiresAt - Expiration timestamp
   * @returns string - Formatted QR data
   */
  createSessionQRData(
    sessionId: number,
    token: string,
    expiresAt?: number,
  ): string {
    const qrData = {
      type: 'ATTENDANCE',
      session_id: sessionId,
      token: token,
      expires_at: expiresAt || Date.now() + 24 * 60 * 60 * 1000, // Default 24 hours
      timestamp: Date.now(),
    };
    return JSON.stringify(qrData);
  }

  /**
   * Verify QR code data
   * @param qrDataString - QR data string to verify
   * @returns object - Parsed and validated QR data
   */
  verifyQRData(qrDataString: string): {
    valid: boolean;
    data?: any;
    error?: string;
  } {
    try {
      const qrData = JSON.parse(qrDataString);

      // Check if QR code is expired
      if (qrData.expires_at && qrData.expires_at < Date.now()) {
        return {
          valid: false,
          error: 'QR code has expired',
        };
      }

      // Verify required fields
      if (
        !qrData.type ||
        qrData.type !== 'ATTENDANCE' ||
        !qrData.session_id ||
        !qrData.token
      ) {
        return {
          valid: false,
          error: 'Invalid QR code format',
        };
      }

      return {
        valid: true,
        data: qrData,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to parse QR code data',
      };
    }
  }
}
