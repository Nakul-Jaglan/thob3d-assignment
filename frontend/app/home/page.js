import {useEffect} from 'react'
import Router from 'next/router'

function HomePage() {
    useEffect(() => {
        Router.replace('/dashboard');
    }, [])

  return (
    <div>HomePage</div>
  )
}

export default HomePage