import {ChangeEvent} from "react";

export type TextFieldInputProps = {
  value: string | number
  onChange: (e: ChangeEvent<HTMLInputElement>)  => void
}
export default function TextFieldInput({value, onChange}: TextFieldInputProps) {
  return (
    <div className="flex items-center bg-white rounded-[20px]">
      <input
        type="text"
        className="border-[2px] border-[#087EA2] grow px-10 py-4 text-[#4B4343] text-2xl focus:outline-0 w-[20rem] rounded-l-[20px] border-r-0"
        value={value}
        onChange={onChange}
      />
      <button className='bg-[#087EA2] text-white text-xl w-24 h-[68px] rounded-r-[20px]'>生成</button>
    </div>
  )
}