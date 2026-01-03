/**
 * IP Geolocation Service
 * Fetches IP information from ipinfo.io
 * @module lib/services/ip-geolocation
 */

export interface IPInfo {
  readonly country: string;
  readonly region: string;
  readonly city: string;
  readonly timezone: string;
  readonly org: string;
  readonly postal: string;
  readonly loc?: string;
}

export interface IPGeolocationProvider {
  getIPInfo(ip: string): Promise<IPInfo>;
}

/**
 * IPInfo.io provider implementation
 */
export class IPInfoProvider implements IPGeolocationProvider {
  private readonly apiToken?: string;
  private readonly baseUrl = 'https://ipinfo.io';

  constructor(apiToken?: string) {
    this.apiToken = apiToken;
  }

  async getIPInfo(ip: string): Promise<IPInfo> {
    const defaultInfo: IPInfo = {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
      timezone: "Unknown",
      org: "Unknown",
      postal: "Unknown",
    };

    try {
      const url = this.apiToken
        ? `${this.baseUrl}/${ip}/json?token=${this.apiToken}`
        : `${this.baseUrl}/${ip}/json`;

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          country: data.country || "Unknown",
          region: data.region || "Unknown",
          city: data.city || "Unknown",
          timezone: data.timezone || "Unknown",
          org: data.org || "Unknown",
          postal: data.postal || "Unknown",
          loc: data.loc,
        };
      }
    } catch (error) {
      console.error("[IPInfoProvider] Lookup failed:", error);
    }

    return defaultInfo;
  }
}

/**
 * IP Geolocation Service
 */
export class IPGeolocationService {
  private provider: IPGeolocationProvider;

  constructor(provider: IPGeolocationProvider) {
    this.provider = provider;
  }

  async getIPInfo(ip: string): Promise<IPInfo> {
    return this.provider.getIPInfo(ip);
  }

  /**
   * Format location string from IP info
   */
  formatLocation(ipInfo: IPInfo): string {
    const parts = [ipInfo.city, ipInfo.region, ipInfo.country].filter(
      (part) => part !== "Unknown"
    );
    const location = parts.join(", ");
    
    if (ipInfo.postal !== "Unknown") {
      return `${location} (${ipInfo.postal})`;
    }
    
    return location || "Unknown";
  }
}
