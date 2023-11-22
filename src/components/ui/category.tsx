import { HiChevronRight } from "react-icons/hi";

interface Props {
  logo: JSX.Element;
  title: string;
  desc: string;
}

export default function Category(props: Props) {
  const { logo, title, desc } = props;
  return (
    <div
    className="group w-[419px] px-[40px] py-[30px] flex flex-col rounded-[12px] shadow-lg hover:bg-[#0B49EA] hover:text-white cursor-pointer">
      <div className="flex gap-x-[20px] items-center mb-[30px]">
        <div className="p-[12px] bg-sky-100 rounded-[10px] group-hover:bg-white">
          {logo}
        </div>
        <h4 className="font-bold m-0 text-[24px] text-2xl">{title}</h4>
      </div>
      <p className="text-slate-600 text-[16px] group-hover:text-white">
        {desc}
      </p>
      <div className="flex gap-x-[10px] mt-[22px] items-center text-primary">
        <p className="text-[18px] group-hover:text-white mb-0">
          Learn more
        </p>
        <HiChevronRight className="text-[25px] font-thin group-hover:text-white" />
      </div>
    </div>
  )
}
