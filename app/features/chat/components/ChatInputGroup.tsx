'use client'

import type { ChangeEvent, KeyboardEvent } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { ArrowUpIcon } from 'lucide-react'

type ChatInputGroupProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
}
export function ChatInputGroup({
  value,
  onChange,
  onSubmit,
  placeholder = 'Ask, Search or Chat...',
  disabled = false,
}: ChatInputGroupProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing || e.repeat) {
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) {
        onSubmit()
      }
    }
  }

  return (
    <InputGroup>
      <InputGroupTextarea
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <InputGroupAddon align="block-end">
        <InputGroupButton
          type="button"
          variant="default"
          className="ml-auto rounded-full"
          size="icon-xs"
          onClick={() => {
            if (!disabled && value.trim()) {
              onSubmit()
            }
          }}
          disabled={disabled}
        >
          <ArrowUpIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
