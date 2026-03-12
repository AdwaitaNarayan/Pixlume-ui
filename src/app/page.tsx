"use client";

import Gallery from "../../components/Gallery";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Hero Section */}
      <header className="relative w-full overflow-hidden bg-white py-24 shadow-sm dark:bg-black sm:py-32">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-50 to-transparent dark:from-zinc-950" />
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 dark:opacity-20 blur-3xl">
          <div className="h-[30rem] w-[30rem] rounded-full bg-cyan-400 mix-blend-multiply opacity-50 dark:mix-blend-screen" />
          <div className="h-[25rem] w-[25rem] rounded-full bg-blue-600 mix-blend-multiply opacity-40 dark:mix-blend-screen -ml-32 mt-32" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl">
            Welcome to <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Pixlume</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            A high-resolution photography platform. Discover, search, and download premium image variants ranging from thumbnails to breathtaking 4K resolutions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight * 0.7,
                  behavior: "smooth",
                });
              }}
              className="rounded-full bg-cyan-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all duration-300 hover:scale-105"
            >
              Explore Gallery
            </button>
          </div>
        </div>
      </header>

      {/* Main Content (Gallery) */}
      <main className="relative z-20 -mt-10 bg-white dark:bg-zinc-950 rounded-t-[3rem] shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <Gallery />
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-zinc-200 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-8">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Pixlume. Built with Next.js, FastAPI, & PostgreSQL.
          </p>
        </div>
      </footer>
    </div>
  );
}
