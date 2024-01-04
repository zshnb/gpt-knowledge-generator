'use client'
import {ChangeEvent, useEffect, useRef, useState} from "react";
import md5 from 'crypto-js/md5'
import Loading from "@/components/Loading";

export type TextFieldInputProps = {}
export default function TextFieldInput() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uuid, setUuid] = useState('')
  const [download, setDownload] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined
    if (uuid !== '') {
      interval = setInterval(() => {
        fetch(`http://localhost:5001/query/${uuid}`, {
          method: 'get',
        }).then(async res => {
          const json = await res.json()
          if (json.data === 'finished') {
            setDownload(true)
            clearInterval(interval)
          }
        })
      }, 2000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [uuid])

  useEffect(() => {
    if (download) {
      fetch(`http://localhost:5001/query/${uuid}/download`, {
        method: 'get'
      }).then(res => res.blob())
        .then(blob => {
          const href = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = href;
          a.download = `${url}.json`; // 指定下载文件名
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(href);
        })
        .catch(() => {
          setUuid('')
          setLoading(false)
          setDownload(false)
        })
    }
  }, [download]);
  return (
    <div className="flex items-center bg-white rounded-[20px]">
      <input
        type="text"
        className="border-[2px] border-[#087EA2] grow px-10 py-4 text-[#4B4343] text-2xl focus:outline-0 w-[20rem] rounded-l-[20px] border-r-0"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className='bg-[#087EA2] text-white text-xl min-w-24 h-[68px] rounded-r-[20px] basis-auto flex justify-center items-center gap-x-2 px-2'
        onClick={async () => {
          setLoading(true)
          const config = {
            url,
            match: `${url}/**`,
            maxPagesToCrawl: 2
          }
          const res = await fetch('http://localhost:5001/crawl', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
          })
          const json = await res.json()
          setUuid(json.data)
        }}>
        {loading && <Loading/>}
        {loading ? '生成中' : '生成'}
      </button>
    </div>
  )
}