import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Jowin John Chemban - Portfolio</title>
        <meta name="description" content="Portfolio of Jowin John Chemban" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header Section */}
      <header className="bg-gray-900 text-white py-6 px-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Jowin John Chemban</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/">Home</Link></li>
            <li><a href="https://blog.jowinjc.in" target="_blank" rel="noopener noreferrer">Blog</a></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Portfolio Section */}
      <main className="py-16 px-10 bg-gray-100">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Hi, I’m Jowin!</h2>
          <p className="text-lg text-gray-700">I’m a passionate IT Infrastructure Engineer with expertise in server management, cloud environments, and cybersecurity.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Skills</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Linux & Windows Server Management</li>
              <li>Cloud Environments (AWS, Azure)</li>
              <li>Infrastructure Monitoring</li>
              <li>Cybersecurity Practices</li>
            </ul>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Projects</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li><strong>Zendir:</strong> A secure TCP communication app in Rust</li>
              <li><strong>ElectroMartGlobal:</strong> E-commerce platform</li>
              <li>Portfolio hosted at <a href="https://jowin.vercel.app" target="_blank" className="text-blue-500">jowin.vercel.app</a></li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>&copy; 2025 Jowin John Chemban. All rights reserved.</p>
      </footer>
    </div>
  );
}

export function Contact() {
  return (
    <div>
      <Head>
        <title>Contact Me - Jowin John Chemban</title>
      </Head>
      <header className="bg-gray-900 text-white py-6 px-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Me</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/">Home</Link></li>
            <li><a href="https://blog.jowinjc.in" target="_blank" rel="noopener noreferrer">Blog</a></li>
          </ul>
        </nav>
      </header>

      <main className="py-16 px-10 bg-gray-100">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold">Get in Touch</h2>
          <p className="text-lg text-gray-700">Fill out the form below to reach out to me.</p>
          <form className="bg-white shadow-md rounded-lg p-8 mt-8 mx-auto max-w-md">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
              <input type="text" id="name" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
              <input type="email" id="email" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message</label>
              <textarea id="message" rows="4" className="w-full px-3 py-2 border rounded-lg"></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Send</button>
          </form>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>&copy; 2025 Jowin John Chemban. All rights reserved.</p>
      </footer>
    </div>
  );
}
