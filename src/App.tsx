import './App.css'
import { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from './components/ui/input-group'
import { ArrowUpIcon, PlusIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu'
import { Separator } from './components/ui/separator'
import { useSendChatCompletionsMutation } from './hooks/queries/useSendChatCompletionsMutation'

function App() {
  const [value, setValue] = useState('')
  const sendChatCompletions = useSendChatCompletionsMutation()
  
  return (
    <div className="grid w-full gap-6 p-6">
      <h2 className="scroll-m-20 px-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">지금 무슨 생각을 하고 있어?</h2>
      <InputGroup>
        <InputGroupTextarea placeholder="Ask, Search or Chat..." 
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setValue(e.target.value)
        }/>
        <InputGroupAddon align="block-end">
          <InputGroupButton
            variant="outline"
            className="rounded-full"
            size="icon-xs"
          >
            <PlusIcon />
          </InputGroupButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost">Auto</InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="[--radius:0.95rem]"
            >
              <DropdownMenuItem>Auto</DropdownMenuItem>
              <DropdownMenuItem>Agent</DropdownMenuItem>
              <DropdownMenuItem>Manual</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupText className="ml-auto">52% used</InputGroupText>
          <Separator orientation="vertical" className="!h-4" />
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
            onClick={() => {
              sendChatCompletions.mutate({
                messages: [
                  {
                    role: 'user',
                    content: value,
                  },
                ],
              })
            }}
          >
            <ArrowUpIcon color="black"/>
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default App
