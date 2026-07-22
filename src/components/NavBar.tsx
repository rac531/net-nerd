import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
      <Link href="/" className="text-sm font-semibold tracking-wide text-white">
        netnerd
      </Link>
      <div className="flex gap-6 text-sm text-gray-400">
        <Link href="/practice" className="hover:text-red-500">Practice</Link>
        <Link href="/review" className="hover:text-red-500">Review</Link>
        <Link href="/dashboard" className="hover:text-red-500">Dashboard</Link>
      </div>
    </nav>
  )
}