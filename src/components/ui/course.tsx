import Image from "next/image";

interface Props {
  info: {category: string, title: string, desc: string};
  rating: {rate: number, count: number};
  ins: {name: string, enroll: string};
  price: number;
}

export default function Course(props: Props) {
  const { info, rating, ins, price } = props;
  return (
    <a href="">    
      <div className="w-[309px] p-6 flex flex-col gap-y-6 rounded-lg shadow-lg">
        <Image
          src="/Course_logo.jpg"
          width={0}
          height={240}
          priority={true}
          alt="Logó"
          className="w-100 rounded"
        />
        <div>
          <div className="flex flex-col gap-y-2 mb-2">
            <p className="text-sm text-primary font-semibold">{info.category}</p>
            <p className="text-xl font-semibold">{info.title}</p>
            <p className="text-sm text-slate-600 ">{info.desc}</p>
          </div>
          <div className="flex items-center mb-3">
            <p className="text-sm text-primary mr-1.5">{rating.rate}</p>
            <p className="text-warning mr-2.5">★ ★ ★ ★ ★</p>
            <p className="text-slate-500 text-sm">({rating.count})</p>
          </div>
          <div className="flex justify-between">
            <div className="flex">
              <Image
                src="/Tutor1.png"
                width={40}
                height={40}
                priority={true}
                alt="Logo"
                className="rounded-full w-10 h-10 mr-3"
              />
              <div className="flex-col">
                <p className="text-primary text-sm">{ins.name}</p>
                <p className="text-slate-600 text-sm">{ins.enroll}</p>
              </div>
            </div>
            <div className="flex items-end">
              <h4 className="text-primary text-2xl font-bold">${price}</h4>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}
