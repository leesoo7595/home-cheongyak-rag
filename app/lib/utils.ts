import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function anchorifyPageRefs(md: string) {
  // 코드블럭 기준으로 split (``` ... ```)
  const parts = md.split(/(```[\s\S]*?```)/g)

  // 코드블럭이 아닌 부분만 치환
  return parts
    .map((part) => {
      if (part.startsWith('```')) return part

      // (페이지 4), 페이지 4, (p. 12), p.12
      const re = /(\(?\s*(?:페이지|p\.?)\s*(\d+)\s*\)?)/gi
      return part.replace(re, (full, _m, pageStr) => {
        const page = Number(pageStr)
        if (!Number.isFinite(page)) return full
        return `[${full}](page:${page})`
      })
    })
    .join('')
}
