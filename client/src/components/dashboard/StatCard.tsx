import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: number | string;
  change?: {
    value: string;
    type: "increase" | "decrease";
  };
  linkText: string;
  linkHref: string;
};

export default function StatCard({
  icon,
  iconBgColor,
  iconColor,
  title,
  value,
  change,
  linkText,
  linkHref,
}: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-md rounded-lg transition-shadow duration-200 hover:shadow-lg">
      <div className="p-5 flex items-center">
        <div className={cn("flex-shrink-0 rounded-md p-3", iconBgColor)}>
          <span className={cn("material-icons", iconColor)}>{icon}</span>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div 
                  className={cn(
                    "ml-2 flex items-baseline text-sm font-semibold",
                    change.type === "increase" 
                      ? "text-green-600" 
                      : "text-red-600"
                  )}
                >
                  <span className="material-icons text-sm">
                    {change.type === "increase" ? "arrow_upward" : "arrow_downward"}
                  </span>
                  <span className="sr-only">{change.type === "increase" ? "Aumentou" : "Diminuiu"}</span>
                  {change.value}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref}>
            <div className="font-medium text-primary-600 hover:text-primary-800 cursor-pointer transition-colors duration-200">{linkText}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
