"use client";

import { UserMenu, useTheme } from "@parkerburgess/wandering-parker-ui";

type Props = {
  userName: string;
};

// The page stays a server component; the theme toggle and palette picker need
// useTheme, so the menu lives in this small client island.
export default function HeaderUserMenu({ userName }: Props) {
  const { resolvedTheme, setTheme, palette, setPalette } = useTheme();

  function handleToggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <UserMenu
      userName={userName}
      theme={resolvedTheme}
      onToggleTheme={handleToggleTheme}
      palette={palette}
      onSelectPalette={setPalette}
    />
  );
}
