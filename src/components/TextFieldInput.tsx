'use client'
import {useState} from "react";
import md5 from 'crypto-js/md5'

export type TextFieldInputProps = {
}
export default function TextFieldInput() {
  const [url, setUrl] = useState('')
  return (
    <div className="flex items-center bg-white rounded-[20px]">
      <input
        type="text"
        className="border-[2px] border-[#087EA2] grow px-10 py-4 text-[#4B4343] text-2xl focus:outline-0 w-[20rem] rounded-l-[20px] border-r-0"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className='bg-[#087EA2] text-white text-xl w-24 h-[68px] rounded-r-[20px]' onClick={async () => {
        const config = {
          url,
          match: `${url}/**`,
          maxPagesToCrawl: 100,
          outputFileName: `${md5(url).toString()}.json`
        }
        await fetch('http://localhost:5000/crawl', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(config)
        })
      }}>生成</button>
    </div>
  )
}