import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { OrganizationForm } from '../../org/organization-form'

const CreateOrganization = () => {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent className="p-4">
        <SheetHeader>
          <SheetTitle>Criar organização</SheetTitle>
        </SheetHeader>

        <OrganizationForm />
      </InterceptedSheetContent>
    </Sheet>
  )
}

export default CreateOrganization
