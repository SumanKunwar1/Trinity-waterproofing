import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative w-full h-2 bg-gray-200 rounded-full">
      <SliderPrimitive.Range className="absolute h-full bg-blue-600 rounded-full transition-all" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block w-6 h-6 rounded-full bg-blue-600 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-transform" />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
