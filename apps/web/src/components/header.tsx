import alienLogo from '@/assets/alien.svg'
import Image from 'next/image'
import { ProfileButton } from './profile-button'

export const Header = () => {
  return (
    <div className="flex max-w-[1200px] items-center justify-between mx-auto">
      <div className="flex items-center gap-3">
        <Image
          src={alienLogo}
          alt="logo"
          width={40}
          height={40}
          className="size-6 dark:invert"
        />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
