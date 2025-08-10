import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
    // ...  other turbopack options
  },
};

export default withPayload(nextConfig);
