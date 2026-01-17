import { useState } from "react";
import type { LanguageDropdownProps } from "@/types";
import { languages } from "@/constants/data";
import { CustomDropdown } from "@/components/shared/dropdowns/custom-dropdown";

export function LanguageDropdown({
  initialLanguage = "English",
  onChange,
  className = "",
}: LanguageDropdownProps) {
  const [language, setLanguage] = useState(initialLanguage);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (onChange) {
      onChange(newLanguage);
    }
  };

  return (
    <div
      className={`ml-0 mr-auto mb-14 md:mb-0 w-full md:min-w-[269px] lg:min-w-[unset] md:max-w-[314px] lg:max-w-[269px] xl:max-w-[314px] relative inline-block text-left overflow-visible z-[3] ${className}`}
    >
      <p className="pb-3 md:pb-4 text-app-white/50 font-normal text-sm md:text-base">
        Language
      </p>
      <CustomDropdown
        value={language}
        options={languages}
        onChange={handleLanguageChange}
      />
    </div>
  );
}
