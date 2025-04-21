'use client'

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"

type Props = {
  users: { id: string; email: string; full_name: string }[]
}

export function UserSelect({ users }: Props) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const selected = users.find((u) => u.id === selectedUserId)

  return (
    <div className="space-y-1">
      <Label>User</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            {selected
              ? `${selected.full_name} (${selected.email})`
              : "Select user"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search user..." />
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandList>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => setSelectedUserId(user.id)}
                  className="cursor-pointer"
                >
                  {user.full_name} ({user.email})
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <input type="hidden" name="user_id" value={selectedUserId ?? ""} />
    </div>
  )
}
