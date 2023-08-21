'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { getProviders, signIn, signOut, useSession } from 'next-auth/react';

const Nav = () => {
  const { data: session } = useSession();
  const [provider, setProvider] = useState(null)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const setUpProviders = async () => {
    const response = await getProviders();
    setProvider(response)
  }
  useEffect(() => {
    setUpProviders()
  }, [])

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <Link href={"/"} className='flex gap-2 flex-center'>
        <Image
          src={"/assets/images/logo.svg"}
          alt='Promptopia Logo'
          width={30}
          height={30}
          className='object-contain'
        />
        <p className='logo_text'>Promptopia</p>
      </Link>
      <div className="sm:flex hidden">

        {/* Desktop Navigation */}
        {session?.user ? <div className='flex gap-3 md:gap-5'>
          <Link href="/" className='black_btn'>Create Post</Link>
          <button className='outline_btn' type='button' onClick={signOut}>Sign Out</button>
          <Link href="/profile">
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className='rounded-full'
              alt='profile'
            />
          </Link>
        </div> : <>
          {provider && Object.values(provider).map(provider => (
            <button type='button' key={provider.name} className='black_btn' onClick={() => signIn(provider.id)}>Sign In</button>
          ))}
        </>}
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative'>
        {session?.user ? <div className='flex'>
          <Image
            src={session?.user.image}
            width={37}
            height={37}
            className='rounded-full'
            alt='profile'
            onClick={() => setToggleDropdown((prev) => !prev)}
          />
          {toggleDropdown && <div className='dropdown'>
            <Link href={"/profile"} className='dropdown_link' onClick={() => setToggleDropdown(false)}>Profile</Link>
            <Link href={"/create-post"} className='dropdown_link' onClick={() => setToggleDropdown(false)}>Create Post</Link>
            <button className='mt-2 w-full black_btn' onClick={() => { setToggleDropdown(false); signOut() }} type='button'>Sign Out</button>
          </div>}
        </div> : <>
          {provider && Object.values(provider).map(provider => (
            <button type='button' key={provider.name} className='black_btn' onClick={() => signIn(provider.id)}>Sign In</button>
          ))}
        </>}
      </div>
    </nav>
  )
}

export default Nav;