import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export const DashboardCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  className
}: DashboardCardProps) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 cursor-pointer bg-gradient-card",
        className
      )}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-lg leading-none tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-hero transition-all duration-300 group-hover:w-full" />
    </Card>
  );
};
