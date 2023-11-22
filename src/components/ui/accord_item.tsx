import React , { useState } from "react";

export default function AccordItem({ text, count, star, setFilterCount }: { text: string | undefined; count: number; star: undefined | number; setFilterCount: React.Dispatch<React.SetStateAction<number>> }) {
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <div className="flex items-center justify-between mb-2.5">
      <div className="flex items-center gap-x-2">
        <input
          defaultValue={""}
          type="checkbox"
          id={star ? `${star}` : `${text}`}
          className="bg-primary"
          checked={checked}
          onChange={(e)=> {
            setChecked(!checked);
            setFilterCount((p: number) => {
              if (e.target.checked) return (p+1); else return (p-1);
            })
          }}
        />
        <label className="cursor-pointer" htmlFor={star ? `${star}` : `${text}`}>
          {
            star ? 
            <p className="mb-[3px]"><span className="text-warning text-lg">★</span> <span className={"text-sm font-medium" + (checked ? " text-primary"  : "")}>{`${star} Star${star === 5 ? "" : ` & up`}`}</span></p>
            :
            <p className={
              "text-sm font-medium capitalize" +
              (checked ? " text-primary" : "")
            }>
              {text}
            </p>
          }
          
        </label>
      </div>
      <p className="text-xs text-slate-500">{count}</p>
    </div>
  );
}