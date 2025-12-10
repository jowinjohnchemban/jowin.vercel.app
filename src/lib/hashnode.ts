/**
 * Hashnode API integration for fetching blog posts
 * Documentation: https://apidocs.hashnode.com/
 * Publication Host: hashnode.jowinjc.in
 */

const HASHNODE_API = "https://gql.hashnode.com";
const API_TIMEOUT = 15000; // 15 second timeout

/**
 * Helper to add timeout to fetch requests
 */
function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = API_TIMEOUT
): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("API request timeout")), timeout)
    ),
  ]);
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: {
    url?: string;
  };
  publishedAt: string;
  readTimeInMinutes: number;
  author: {
    name: string;
    username: string;
    photo?: {
      url?: string;
    };
  };
  tags?: Array<{
    name: string;
    slug?: string;
  }>;
}

export interface BlogPostDetail extends BlogPost {
  content?: {
    html?: string;
    markdown?: string;
  };
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: {
      code: string;
    };
  }>;
}

interface HashNodePublicationData {
  publication: {
    posts: {
      edges: Array<{
        node: BlogPost;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor?: string;
      };
    };
  };
}

/**
 * Fetch blog posts from Hashnode for the publication at hashnode.jowinjc.in
 * Uses cursor-based pagination as per Hashnode API documentation
 * @param first - Number of posts to fetch (default: 10, max: 20 for performance)
 * @returns Array of blog posts
 */
export async function getBlogPosts(first: number = 10): Promise<BlogPost[]> {
  // Limit to 20 posts for better performance
  const limit = Math.min(first, 20);

  // Extended query: attempts to fetch tags (some Hashnode schemas may not expose these fields)
  const extendedQuery = `
    query GetBlogPosts($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node {
              id
              title
              excerpt: brief
              slug
              coverImage { url }
              tags { name slug }
              publishedAt
              readTimeInMinutes
              author { name username }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  `;

  // Basic fallback query without optional fields
  const basicQuery = `
    query GetBlogPostsBasic($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node {
              id
              title
              excerpt: brief
              slug
              coverImage { url }
              publishedAt
              readTimeInMinutes
              author { name username }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  `;

  try {
    // Try extended query first
    let response = await fetchWithTimeout(HASHNODE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: extendedQuery,
        variables: { host: "hashnode.jowinjc.in", first: limit },
      }),
    });

    // If the extended query is rejected (400) try the basic query as a fallback
    if (!response.ok && response.status === 400) {
      const text = await response.text().catch(() => "");
      console.warn("Extended Hashnode query failed with 400, retrying basic query. Response body:", text);
      response = await fetchWithTimeout(HASHNODE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: basicQuery,
          variables: { host: "hashnode.jowinjc.in", first: limit },
        }),
      });
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Hashnode API error: ${response.status} ${response.statusText} - ${body}`
      );
    }

    const result: GraphQLResponse<HashNodePublicationData> = await response.json();

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      throw new Error(
        `GraphQL error: ${result.errors.map((e) => e.message).join(", ")}`
      );
    }

    if (!result.data?.publication?.posts?.edges) {
      console.warn(
        "No posts found for publication hashnode.jowinjc.in, or unexpected response structure"
      );
      return [];
    }

    return result.data.publication.posts.edges.map((edge) => edge.node);
  } catch (error) {
    console.error("Error fetching blog posts from Hashnode:", error);
    return [];
  }
}

/**
 * Get a single blog post by slug with full content
 * @param slug - Blog post slug
 * @returns Blog post with content or null
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostDetail | null> {
  // Validate slug parameter
  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    console.warn("Invalid slug provided to getBlogPostBySlug:", slug);
    return null;
  }

  const extendedQuery = `
    query GetBlogPost($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          id
          title
          excerpt: brief
          slug
          coverImage { url }
          tags { name slug }
          publishedAt
          readTimeInMinutes
          author { name username }
          content { html }
        }
      }
    }
  `;

  const basicQuery = `
    query GetBlogPostBasic($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          id
          title
          excerpt: brief
          slug
          coverImage { url }
          publishedAt
          readTimeInMinutes
          author { name username }
          content { html }
        }
      }
    }
  `;

  try {
    const cleanSlug = slug.trim();

    // Try extended query first
    let response = await fetchWithTimeout(HASHNODE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: extendedQuery, variables: { host: "hashnode.jowinjc.in", slug: cleanSlug } }),
    });

    // If extended fails with 400, retry basic query
    if (!response.ok && response.status === 400) {
      const text = await response.text().catch(() => "");
      console.warn(`Extended post query failed for slug "${cleanSlug}"; retrying basic query. Response body:`, text);
      response = await fetchWithTimeout(HASHNODE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: basicQuery, variables: { host: "hashnode.jowinjc.in", slug: cleanSlug } }),
      });
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Hashnode API error: ${response.status} ${response.statusText} - ${body}`);
    }

    const result: GraphQLResponse<{ publication: { post: BlogPostDetail | null } }> = await response.json();

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      console.error(
        `GraphQL error for slug "${cleanSlug}":`,
        result.errors
      );
      throw new Error(
        `GraphQL error: ${result.errors.map((e) => e.message).join(", ")}`
      );
    }

    const post = result.data?.publication?.post;
    
    if (!post) {
      return null;
    }

    // Ensure content is properly formatted
    return {
      ...post,
      content: post.content || { html: "" },
    };
  } catch (error) {
    console.error(`Error fetching blog post "${slug}" from Hashnode:`, error);
    return null;
  }
}
