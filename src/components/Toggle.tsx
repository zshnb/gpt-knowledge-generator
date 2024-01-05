import {useState} from "react";

export type ToggleProps = {
  className?: string
  onChange: (value: boolean) => void
}
export default function Toggle({className, onChange}: ToggleProps) {
  const [checked, setChecked] = useState(false)
  return (
    <div className={`form-control w-fit ${className}`}>
      <label className="cursor-pointer label pl-0">
        <input
          type="checkbox"
          className="toggle toggle-primary checked:bg-[#087EA2] border-[#087EA2]"
          checked={checked}
          onChange={(e) => {
            setChecked(!checked)
            onChange(!checked)
          }}
        />
      </label>
    </div>
  )
}