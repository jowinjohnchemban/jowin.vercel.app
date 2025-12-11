/**
 * Type definitions for Hashnode API
 * @module lib/api/hashnode/types
 */

/** Base blog post interface */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: CoverImage;
  publishedAt: string;
  readTimeInMinutes: number;
  author: Author;
  tags?: Tag[];
}

/** Detailed blog post with content */
export interface BlogPostDetail extends BlogPost {
  content?: PostContent;
}

/** Cover image data */
export interface CoverImage {
  url?: string;
}

/** Author information */
export interface Author {
  name: string;
  username: string;
  profilePicture?: string;
}

/** Tag data */
export interface Tag {
  name: string;
  slug?: string;
}

/** Post content in multiple formats */
export interface PostContent {
  html?: string;
  markdown?: string;
  text?: string;
}

/** GraphQL response wrapper */
export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

/** GraphQL error structure */
export interface GraphQLError {
  message: string;
  extensions?: {
    code: string;
  };
}

/** Hashnode publication response */
export interface PublicationPostsResponse {
  publication: {
    posts: {
      edges: Array<{
        node: BlogPost;
      }>;
      pageInfo: PageInfo;
    };
  };
}

/** Hashnode single post response */
export interface PublicationPostResponse {
  publication: {
    post: BlogPostDetail | null;
  };
}

/** Pagination info */
export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

/** Hashnode publication details */
export interface Publication {
  id: string;
  title: string;
  displayTitle?: string;
  descriptionSEO?: string;
  about?: {
    text?: string;
  };
  url: string;
  author?: {
    name: string;
    username: string;
    profilePicture?: string;
  };
  favicon?: string;
  ogMetaData?: {
    image?: string;
  };
}

/** Hashnode publication response */
export interface PublicationResponse {
  publication: Publication | null;
}
