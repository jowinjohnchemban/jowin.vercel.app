/**
 * Turnstile Verification Service
 * @module lib/security/turnstile
 */

/**
 * Turnstile verification result
 */
export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes?: string[];
  hostname?: string;
  challengeTs?: string;
}

/**
 * Turnstile service for captcha verification
 */
export class TurnstileService {
  private readonly secretKey: string;
  private readonly endpoint =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  /**
   * Verify a Turnstile token
   * @param token - The token from the client-side widget
   * @param remoteip - Optional IP address of the visitor
   * @returns Verification result
   */
  async verify(
    token: string,
    remoteip?: string
  ): Promise<TurnstileVerificationResult> {
    try {
      // Use FormData as recommended by Cloudflare docs
      const formData = new FormData();
      formData.append("secret", this.secretKey);
      formData.append("response", token);

      if (remoteip) {
        formData.append("remoteip", remoteip);
      }

      const response = await fetch(this.endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      return {
        success: data.success === true,
        errorCodes: data["error-codes"] || [],
        hostname: data.hostname,
        challengeTs: data.challenge_ts,
      };
    } catch (error) {
      console.error("[TurnstileService] Verification error:", error);
      return {
        success: false,
        errorCodes: ["internal-error"],
      };
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.secretKey && this.secretKey.length > 0;
  }
}
