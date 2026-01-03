/**
 * Type Definitions for Hashnode API
 *
 * **Data Models** representing Hashnode API responses.
 * These types provide compile-time safety and IDE autocomplete for
 * all Hashnode-related data structures.
 *
 * @module lib/api/hashnode/types
 *
 * @architecture
 * - **Interface Segregation**: Small, focused interfaces
 * - **Type Composition**: Complex types built from primitives
 * - **API Contracts**: Mirrors Hashnode GraphQL schema
 *
 * @types
 * - `BlogPost` - Basic blog post (list view)
 * - `BlogPostDetail` - Full post with content (detail view)
 * - `Publication` - Site-wide metadata
 * - `GraphQLResponse<T>` - Wrapper for GraphQL responses
 * - `Author`, `Tag`, `CoverImage` - Supporting types
 *
 * @example Type Usage
 * ```typescript
 * import type { BlogPost, BlogPostDetail } from './types';
 *
 * const post: BlogPost = {
 *   id: '1',
 *   title: 'Hello World',
 *   excerpt: 'My first post',
 *   // ...
 * };
 * ```
 */

/** ISO 8601 date string */
export type ISODateString = string;

/** URL string */
export type URLString = string;

/** Base blog post interface */
export interface BlogPost {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly slug: string;
  readonly coverImage?: CoverImage;
  readonly publishedAt: ISODateString;
  readonly readTimeInMinutes: number;
  readonly author: Author;
  readonly tags?: readonly Tag[];
}

/** Detailed blog post with content */
export interface BlogPostDetail extends BlogPost {
  readonly content?: PostContent;
}

/** Cover image data */
export interface CoverImage {
  readonly url?: URLString;
}

/** Author information */
export interface Author {
  readonly name: string;
  readonly username: string;
  readonly profilePicture?: URLString;
}

/** Tag data */
export interface Tag {
  readonly name: string;
  readonly slug?: string;
}

/** Post content in multiple formats */
export interface PostContent {
  readonly html?: string;
  readonly markdown?: string;
  readonly text?: string;
}

/** GraphQL response wrapper */
export interface GraphQLResponse<T = unknown> {
  readonly data?: T;
  readonly errors?: readonly GraphQLError[];
}

/** GraphQL error structure */
export interface GraphQLError {
  readonly message: string;
  readonly extensions?: {
    readonly code?: string;
    readonly [key: string]: unknown;
  };
  readonly path?: readonly (string | number)[];
  readonly locations?: readonly {
    readonly line: number;
    readonly column: number;
  }[];
}

/** Hashnode publication response */
export interface PublicationPostsResponse {
  readonly publication: {
    readonly posts: {
      readonly edges: readonly PublicationPostEdge[];
      readonly pageInfo: PageInfo;
    };
  };
}

/** Hashnode single post response */
export interface PublicationPostResponse {
  readonly publication: {
    readonly post: BlogPostDetail | null;
  };
}

/** Post edge in connection */
export interface PublicationPostEdge {
  readonly node: BlogPost;
  readonly cursor: string;
}

/** Pagination info */
export interface PageInfo {
  readonly hasNextPage: boolean;
  readonly hasPreviousPage?: boolean;
  readonly startCursor?: string;
  readonly endCursor?: string;
}

/** Hashnode publication details */
export interface Publication {
  readonly id: string;
  readonly title: string;
  readonly displayTitle?: string;
  readonly descriptionSEO?: string;
  readonly about?: {
    readonly text?: string;
  };
  readonly url: URLString;
  readonly author?: Author;
  readonly favicon?: URLString;
  readonly ogMetaData?: {
    readonly image?: URLString;
  };
  readonly isTeam?: boolean;
  readonly followersCount?: number;
}

/** Hashnode publication response */
export interface PublicationResponse {
  readonly publication: Publication | null;
}

/** Utility type for API responses */
export type APIResponse<T> = GraphQLResponse<T>;

/** Utility type for paginated responses */
export interface PaginatedResponse<T> {
  readonly edges: readonly {
    readonly node: T;
    readonly cursor: string;
  }[];
  readonly pageInfo: PageInfo;
}

/** Utility type for extracting node type from paginated response */
export type NodeType<T extends PaginatedResponse<any>> = T['edges'][0]['node'];
