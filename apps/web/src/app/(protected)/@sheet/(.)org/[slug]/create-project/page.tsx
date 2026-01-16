import { ProjectForm } from '@/app/(protected)/org/[slug]/create-project/project-form'

import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const CreateProject = () => {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent className="p-4">
        <SheetHeader>
          <SheetTitle>Criar projeto</SheetTitle>
        </SheetHeader>

        <ProjectForm />
      </InterceptedSheetContent>
    </Sheet>
  )
}

export default CreateProject
