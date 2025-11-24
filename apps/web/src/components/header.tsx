import { Slash } from 'lucide-react'
import Image from 'next/image'
import alienLogo from '@/assets/alien.svg'
import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'

export const Header = () => {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={alienLogo}
          alt="logo"
          width={40}
          height={40}
          className="size-6 dark:invert"
        />
        <Slash className="-rotate-[24deg] size-3 text-border" />
        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
