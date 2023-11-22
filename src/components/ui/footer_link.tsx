import { HiArrowNarrowRight } from "react-icons/hi";

export default function FooterLink({text} : {text: string}) {
  return (
    <a href="" className="flex items-center gap-x-2 mb-6 text-slate-500 capitalize cursor-pointer group">
      <p className="group-hover:underline">{text}</p>
      <HiArrowNarrowRight className="hidden group-hover:block" />
    </a>
  )
}
