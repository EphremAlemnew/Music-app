# Fix DropdownMenuHeader Import Error

The error indicates that `DropdownMenuHeader` is being imported but doesn't exist.

## Fix:
Replace any import of `DropdownMenuHeader` with `DropdownMenuLabel`:

```typescript
// Wrong:
import { DropdownMenuHeader } from "@/components/ui/dropdown-menu"

// Correct:
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu"
```

## Available exports from dropdown-menu:
- DropdownMenu
- DropdownMenuTrigger  
- DropdownMenuContent
- DropdownMenuLabel (use this instead of DropdownMenuHeader)
- DropdownMenuItem
- DropdownMenuSeparator
- DropdownMenuGroup
- DropdownMenuCheckboxItem
- DropdownMenuRadioGroup
- DropdownMenuRadioItem
- DropdownMenuShortcut
- DropdownMenuSub
- DropdownMenuSubTrigger
- DropdownMenuSubContent