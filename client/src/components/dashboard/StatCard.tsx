import { Card } from "@/components/ui/card";
import { Link } from "wouter";

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
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5 flex items-center">
        <div className={`flex-shrink-0 rounded-md ${iconBgColor} p-3`}>
          <span className={`material-icons ${iconColor}`}>{icon}</span>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-neutral-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-neutral-900">{value}</div>
              {change && (
                <div 
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    change.type === "increase" ? "text-red-500" : "text-green-500"
                  }`}
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
      <div className="bg-neutral-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref}>
            <a className="font-medium text-primary-600 hover:text-primary-900">{linkText}</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
