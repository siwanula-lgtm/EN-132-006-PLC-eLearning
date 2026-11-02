import {
  Cog,
  Cpu,
  Factory,
  Laptop,
  LayoutPanelTop,
  ListTree,
  MonitorSmartphone,
  Network,
  ToggleRight,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Cog,
  Cpu,
  Factory,
  Laptop,
  LayoutPanelTop,
  ListTree,
  MonitorSmartphone,
  Network,
  ToggleRight,
  Wrench,
};

export default function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Cpu;
  return <Icon className={className} />;
}
