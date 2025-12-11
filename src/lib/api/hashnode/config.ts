/**
 * Hashnode API Configuration
 * @module lib/api/hashnode/config
 */

export const HASHNODE_CONFIG = {
  /** GraphQL API endpoint */
  API_URL: 'https://gql.hashnode.com',
  
  /** Publication hostname */
  PUBLICATION_HOST: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'hashnode.jowinjc.in',
  
  /** Request timeout in milliseconds */
  TIMEOUT_MS: 15000,
  
  /** Maximum posts per request */
  MAX_POSTS_PER_REQUEST: 20,
  
  /** Default number of posts to fetch */
  DEFAULT_POSTS_COUNT: 10,
} as const;

export type HashnodeConfig = typeof HASHNODE_CONFIG;
