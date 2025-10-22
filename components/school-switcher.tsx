"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, Plus, Eye, Trash } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CreateSchoolDialog,
  SchoolFormData,
} from "@/components/school-profile/create-school-dialog";
import { toast } from "sonner";

type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  if (!activeTeam) return null;

  const Logo = activeTeam.logo;

  const handleCreateSchool = async (data: SchoolFormData) => {
    setIsCreating(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("School created successfully!");
      setCreateDialogOpen(false);
      // Optionally refresh teams list or navigate
    } catch (error) {
      toast.error("Failed to create school");
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewSchool = () => {
    router.push("/setup-school-profile");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-background text-foreground">
                <Logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mb-4"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              School
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={handleViewSchool}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Eye className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                View school profile
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setCreateDialogOpen(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Trash />
              </div>
              <div className="font-medium text-muted-foreground">
                delete school
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

    </SidebarMenu>
  );
}
