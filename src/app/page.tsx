'use client'
import Toggle from "@/components/Toggle";
import {useEffect, useRef, useState} from "react";
import Loading from "@/components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [uuid, setUuid] = useState('')
  const [download, setDownload] = useState(false)
  const [showAdvancedSetting, setShowAdvancedSetting] = useState(false)
  const [url, setUrl] = useState('')
  const [maxPageCount, setMaxPageCount] = useState(10)

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
        }).catch(() => clearInterval(interval))
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
      }).then(res => {
        if (res.ok) {
          return res.blob()
        } else {
          return Promise.reject('download api is not ok')
        }
      })
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
        .catch(err => {
          console.log('download error', err)
        })
        .finally(() => {
          setUuid('')
          setLoading(false)
          setDownload(false)
        })
    }
  }, [download]);

  return (
    <main className="flex flex-col h-full gap-y-4">
      <div className='flex flex-col items-center gap-y-4 mx-auto'>
        <div className='flex items-center bg-white rounded-[20px] h-fit mt-40 mx-auto'>
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
                maxPagesToCrawl: maxPageCount
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
        <div className='self-start'>
          <p className='text-xl'>高级设置</p>
          <Toggle className='self-start' onChange={(value) => {
            setShowAdvancedSetting(value)
          }}/>
          {
            showAdvancedSetting && (
              <div className='flex self-start'>
                <div>
                  <input
                    type="number"
                    placeholder="最大爬取页数"
                    className="input input-primary w-full max-w-xs focus:outline-0 focus:border-[#087EA2] border-[#087EA2]"
                    value={maxPageCount}
                    onChange={(e) => setMaxPageCount(Number(e.target.value))}
                  />
                </div>
              </div>
            )
          }
        </div>
      </div>
    </main>
  )
}
