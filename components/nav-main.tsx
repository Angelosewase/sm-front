"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuItem as SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";

export type Route = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  link: string;
  subs?: {
    title: string;
    link: string;
    icon?: React.ReactNode;
  }[];
};

export default function DashboardNavigation({ routes }: { routes: Route[] }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  return (
    <SidebarGroup className=" p-0">
      {!isCollapsed && (
        <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Menu
        </SidebarGroupLabel>
      )}
      <SidebarMenu className="mt-2">
        {routes.map((route) => {
          const isOpen = !isCollapsed && openCollapsible === route.id;
          const hasSubRoutes = !!route.subs?.length;

          const isActive = pathname === route.link;

          return (
          <SidebarMenuItem key={route.id}>
            {hasSubRoutes ? (
              <Collapsible
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenCollapsible(open ? route.id : null)
                }
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      "group relative flex w-full items-center  rounded-lg px-4 py-4 transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : isOpen
                        ? "bg-sidebar-accent/50 text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                      isCollapsed && "justify-center px-2"
                    )}
                    size={"lg"}
                  >
                    {/* Vertical purple indicator bar */}
                    {isActive && (
                      <div className="absolute  top-0 h-full w-1 rounded-r-full" />
                    )}
                    
                    {/* Circular avatar icon with gradient */}
                    <div className={cn(
                      "flex shrink-0 items-center justify-center rounded-full",
                      "bg-gradient-to-b ",
                      "text-white shadow-sm",
                      isCollapsed && "h-10 w-10"
                    )}>
                      <div className="flex items-center justify-center">
                        {route.icon ? (
                          <div className="text-white [&>svg]:shrink-0">
                            {route.icon}
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-white/20" />
                        )}
                      </div>
                    </div>
                    
                    {!isCollapsed && (
                      <div className="flex flex-1 items-center justify-between min-w-0">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-base font-semibold text-foreground truncate">
                            {route.title}
                          </span>
                          {route.subtitle && (
                            <span className="text-xs text-muted-foreground truncate">
                              {route.subtitle}
                            </span>
                          )}
                        </div>
                        {hasSubRoutes && (
                          <span className="ml-2 shrink-0">
                            {isOpen ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {!isCollapsed && (
                  <CollapsibleContent>
                    <SidebarMenuSub className="my-1 ml-3.5 ">
                      {route.subs?.map((subRoute) => (
                        <SidebarMenuSubItem
                          key={`${route.id}-${subRoute.title}`}
                          className="h-auto"
                        >
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subRoute.link}
                              prefetch={true}
                              className={cn(
                                "flex items-center rounded-md px-4 py-2 text-base font-medium transition-colors",
                                pathname === subRoute.link
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "text-muted-foreground hover:bg-sidebar-muted hover:text-foreground"
                              )}
                            >
                              {subRoute.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            ) : (
              <SidebarMenuButton tooltip={route.title} asChild>
                <Link
                  href={route.link}
                  prefetch={true}
                  className={cn(
                    "group relative flex items-center  rounded-lg px-4 py-4 transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  {/* Vertical purple indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary" />
                  )}
                  
                  {/* Circular avatar icon with gradient */}
                  <div className={cn(
                    "flex  items-center justify-center rounded-full mr-2",
                    isCollapsed && "ml-2 h-10 w-10"
                  )}>
                    <div className="flex items-center justify-center">
                      {route.icon ? (
                        <div className=" [&>svg]:shrink-0">
                          {route.icon}
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-white/20" />
                      )}
                    </div>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex flex-1 items-center justify-between min-w-0">
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-base font-semibold text-foreground truncate">
                          {route.title}
                        </span>
                        {route.subtitle && (
                          <span className="text-xs text-muted-foreground truncate">
                            {route.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        );
      })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
