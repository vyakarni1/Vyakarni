
import UnifiedNavigation from "@/components/UnifiedNavigation";
import { logger } from "@/utils/logger";

interface HeaderProps {
  variant?: "default" | "transparent";
}

/**
 * @deprecated Use UnifiedNavigation instead. This component is kept for backward compatibility.
 */
const Header = ({ variant = "default" }: HeaderProps) => {
  logger.debug('Header component used (deprecated)', { variant }, 'Header');
  
  // Map old Header variant to UnifiedNavigation variant
  const unifiedVariant = variant === "transparent" ? "transparent" : "default";
  
  return <UnifiedNavigation variant={unifiedVariant} />;
};

export default Header;
