import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { getPageTitle } from "@/utils/navigation";

export function AppLayout() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav title={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
