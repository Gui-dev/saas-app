import { Slash } from 'lucide-react'
import Image from 'next/image'
import alienLogo from '@/assets/alien.svg'
import { ability } from '@/auth/auth'
import { OrganizationSwitcher } from './organization-switcher'
import { PendingInvites } from './pending-invites'
import { ProfileButton } from './profile-button'
import { ProjectSwitcher } from './project-switcher'
import { ThemeSwitcher } from './theme/theme-switcher'
import { Separator } from './ui/separator'

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
        <Slash className="-rotate-24 size-3 text-border" />
        <OrganizationSwitcher />

        {permissions?.can('get', 'Project') && (
          <>
            <Slash className="-rotate-24 size-3 text-border" />
            <ProjectSwitcher />
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <PendingInvites />
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
