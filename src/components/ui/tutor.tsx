import Image from "next/image"
import { FaLinkedin, FaTwitter } from "react-icons/fa6"

interface Props {
  name: string;
  job: string;
  desc: string;
}

export default function Tutor(props: Props) {
  const { name, job, desc } = props;
  return (
    <a href="">
      <div className="w-[261px] text-center d-flex flex-col items-center gap-y-4">
        <Image
          src="/Tutor1.png"
          width={80}
          height={80}
          priority={true}
          alt="Logó"
          className="rounded-full"
        />
        <div className="">
          <h5 className="text-lg font-semibold leading-6 mb-2">{name}</h5>
          <p className="text-base text-primary mb-2">{job}</p>
          <p className="text-slate-600 mb-3">{desc}</p>
          <div className="flex justify-center gap-x-4 text-slate-600">
            <FaTwitter className="w-5 h-5"/>
            <FaLinkedin className="w-5 h-5"/>
          </div>
        </div>
      </div>
    </a>
  )
}
