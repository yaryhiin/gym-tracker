import { Outlet, useLocation, matchPath } from "react-router-dom";

import Header from "./Header";
import NavButtons from "./NavButtons";

type LayoutProps = {
  toggleTheme: () => void;
  theme: string;
  session: boolean;
};

export default function Layout({ toggleTheme, theme, session }: LayoutProps) {
  const location = useLocation();

  const isActiveWorkout =
    matchPath("/workout", location.pathname) ||
    matchPath("/workout/*", location.pathname);

  return (
    <div className={"appShell"}>
      {!isActiveWorkout && (
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          session={session}
        />
      )}
      <main className="container">
        <Outlet />
      </main>
      {!isActiveWorkout && session && <NavButtons />}
    </div>
  );
}
