// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres' // database-adapter-import
import { resendAdapter } from '@payloadcms/email-resend' // email-adapter-import
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, './payload-types.ts'),
  },
  // database-adapter-config-start
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
      ssl: {
        rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' ? false : true,
      },
    }
  }),
  // database-adapter-config-end

  // email-adapter-config-start
  email: resendAdapter({
    defaultFromAddress: 'noreply@mail.jowinjc.in',
    defaultFromName: 'Jowin - jowinjc.in',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  // email-adapter-config-end

  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
