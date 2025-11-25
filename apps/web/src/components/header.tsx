import { Slash } from 'lucide-react'
import Image from 'next/image'
import alienLogo from '@/assets/alien.svg'
import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'
import { ability } from '@/auth/auth'
import { Separator } from './ui/separator'
import { ThemeSwitcher } from './theme/theme-switcher'

export const Header = async () => {
  const permissions = await ability()

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

        {permissions?.can('get', 'Project') && <p>Projetos</p>}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
