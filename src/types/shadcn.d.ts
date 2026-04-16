cat > src/types/shadcn.d.ts << 'EOF'
declare module 'react-day-picker' {
  import * as React from 'react';
  export type DateRange = {
    from: Date;
    to?: Date;
  };
  export type SelectMode = 'single' | 'multiple' | 'range' | 'default';
  export interface DayPickerProps {
    mode?: SelectMode;
    selected?: Date | Date[] | DateRange | null;
    onSelect?: (date: any) => void;
    className?: string;
    classNames?: any;
    showOutsideDays?: boolean;
    [key: string]: any;
  }
  export const DayPicker: React.FC<DayPickerProps>;
}

declare module 'embla-carousel-react' {
  export type EmblaOptionsType = any;
  export type EmblaCarouselType = any;
  export default function useEmblaCarousel(options?: any): any[];
}

declare module 'cmdk' {
  import * as React from 'react';
  export const Command: React.FC<any>;
  export const CommandInput: React.FC<any>;
  export const CommandList: React.FC<any>;
  export const CommandEmpty: React.FC<any>;
  export const CommandGroup: React.FC<any>;
  export const CommandItem: React.FC<any>;
  export const CommandSeparator: React.FC<any>;
}

declare module 'vaul' {
  import * as React from 'react';
  export const Drawer: React.FC<any> & {
    Close: React.FC<any>;
    Portal: React.FC<any>;
    Overlay: React.FC<any>;
    Content: React.FC<any>;
    Title: React.FC<any>;
    Description: React.FC<any>;
  };
}
EOF