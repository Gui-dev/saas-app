import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { OrganizationForm } from '../../create-organization/organization-form'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'

const CreateOrganization = () => {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent className="p-4">
        <SheetHeader>
          <SheetTitle>Criar organizacao</SheetTitle>
        </SheetHeader>

        <OrganizationForm />
      </InterceptedSheetContent>
    </Sheet>
  )
}

export default CreateOrganization
