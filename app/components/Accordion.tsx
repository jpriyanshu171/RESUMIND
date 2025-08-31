import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { cn } from "~/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Accordion must be used within an Accordion Provider");
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
}) => {
  const [activeItems, setActiveItems] = useState<string[]>(defaultOpen ? [defaultOpen] : []);

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      else return prev.includes(id) ? [] : [id];
    });
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
    <div className={`space-y-2 ${className}`}>{children}</div>
  </AccordionContext.Provider>;
};

interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ id, children, className = "" }) => {
  return <div className={cn("overflow-hidden rounded-lg shadow-sm bg-white", className)}>{children}</div>;
};

interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right",
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  const defaultIcon = <ChevronDown className={cn("w-4 h-4 transition-transform text-gray-400", { "rotate-180 text-blue-500": isActive })} />;

  return (
    <button
      onClick={() => toggleItem(itemId)}
      className={cn(
        "w-full px-3 py-2 flex items-center justify-between text-sm font-medium hover:bg-gray-50 rounded-lg",
        className
      )}
    >
      <div className="flex items-center space-x-2">
        {iconPosition === "left" && (icon || defaultIcon)}
        <div className="flex-1 text-gray-800">{children}</div>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  );
};

interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ itemId, children, className = "" }) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out text-sm leading-tight",
        isActive ? "max-h-screen opacity-100 px-3 py-2" : "max-h-0 opacity-0",
        className
      )}
    >
      <div className="text-gray-700">{children}</div>
    </div>
  );
};
