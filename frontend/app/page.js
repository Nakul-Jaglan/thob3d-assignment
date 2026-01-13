import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-around p-10 min-h-[85vh]">
        <section className="pb-10">
          <h1 className="text-left md:text-center text-4xl font-bold pb-10">Welcome to the Internship Assignment Project of Thob 3D Studios</h1>
          <p className="text-lg">I have built two sections for this project:</p>
          <ul className="list-disc list-inside pb-5">
            <li>
              AI Generated Code: This section showcases my skills in leveraging AI technologies to generate code and build applications.
            </li>
            <li>
              Self Written Code: This section highlights my personal coding abilities and projects that I have developed from scratch.
            </li>
          </ul>
          <p>
            Both sections are exactly same in terms of functionality but differ in the approach used to create them and mainly in terms of design and UI/UX.
          </p>
          <p>
            Feel free to explore both sections to get a comprehensive view of my capabilities as a developer.
          </p>
        </section>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <Link href="/ai/home" className="no-underline hover:scale-110 transition-all duration-200">
            <section className="bg-white/80 hover:bg-white p-10 rounded-lg text-black ">
              <h1 className="text-2xl font-bold">AI Generated Code</h1>
              <p className="text-lg">Click here to see my AI Coding Skills</p>
            </section>
          </Link>

          <Link href="/home" className="no-underline hover:scale-110 transition-all duration-200">
            <section className="bg-white/80 hover:bg-white p-10 rounded-lg text-black ">
              <h1 className="text-2xl font-bold">Self Written Code</h1>
              <p className="text-lg">Click here to see my own coding skills</p>
            </section>
          </Link>
        </div>
      </main>

      <footer>
        <div className="text-center p-5 border-t mt-10">
          <p className="text-lg text-gray-500">
            Built with ❤️ by <Link href="https://nakul.fun" target="_blank" className="text-blue-500 hover:underline">Nakul</Link>
          </p>
        </div>
      </footer>
    </>
  );
}
