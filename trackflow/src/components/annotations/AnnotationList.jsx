import { BookOpen } from "lucide-react"

export function AnnotationList(){

    return(
         <div className="w-full flex flex-col gap-2 border border-gray-300 p-2 rounded">
      <div className="flex justify-start items-center pb-2 gap-2">
      <BookOpen size={20} color="#e0e0e0" />
        <span className="text-md "> VOS ANNOTATIONS</span>
      </div>

        <div className="w-75 border border-gray-300"></div>
    </div>
    )
}