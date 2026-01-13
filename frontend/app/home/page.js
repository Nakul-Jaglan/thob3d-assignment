"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function HomePage() {
    const router = useRouter()
    
    useEffect(() => {
        router.replace('/dashboard');
    }, [router])

  return (
    <div>HomePage</div>
  )
}

export default HomePage