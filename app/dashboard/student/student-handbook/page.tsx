import { HandbookLayout } from "@/components/handbook/handbook-layout"
import { HandbookContent } from "@/components/handbook/handbook-content"

export const metadata = {
  title: "Student Handbook | Code Blue Medical Training Institute",
  description: "Official student handbook for CBMTI 2024-2029",
}

export default function HandbookPage() {
  return (
    <HandbookLayout>
      <HandbookContent />
    </HandbookLayout>
  )
}
