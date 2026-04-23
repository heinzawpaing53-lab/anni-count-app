import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentType, PropsWithChildren } from "react";

export function ThemeProvider({
  children,
}: PropsWithChildren) {
  const Provider = NextThemesProvider as unknown as ComponentType<
    PropsWithChildren<{
      attribute: string;
      defaultTheme: string;
      enableSystem: boolean;
    }>
  >;

  return <Provider attribute="class" defaultTheme="system" enableSystem>{children}</Provider>;
}
