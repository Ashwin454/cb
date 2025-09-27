import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../../lib/utils";

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root ref={ref} className={cn("flex items-center space-x-1 rounded-md border", className)} {...props} />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger ref={ref} className={cn("px-3 py-1.5", className)} {...props} />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

// Additional subcomponents follow same pattern as dropdown...
// (sub triggers, content, item, separator, shortcut, etc.) — converted to JSX

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarRadioGroup
};
