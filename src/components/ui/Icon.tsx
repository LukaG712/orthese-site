import {
  BookOpen,
  Boxes,
  Compass,
  Cpu,
  Database,
  FileCode2,
  Globe,
  Layers,
  LayoutGrid,
  Sparkles,
  Terminal,
} from "lucide-react";

interface AssetIconProps {
  name: string;
  className?: string;
}

export function AssetIcon({ name, className = "h-4 w-4" }: AssetIconProps) {
  switch (name) {
    case "globe":
      return <Globe className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "terminal":
      return <Terminal className={className} />;
    case "layers":
      return <Layers className={className} />;
    case "database":
      return <Database className={className} />;
    case "book":
      return <BookOpen className={className} />;
    case "file-code":
      return <FileCode2 className={className} />;
    case "cpu":
      return <Cpu className={className} />;
    case "layout":
      return <LayoutGrid className={className} />;
    case "boxes":
      return <Boxes className={className} />;
    case "compass":
      return <Compass className={className} />;
    default:
      return <Layers className={className} />;
  }
}
