"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/components/features/project/project-card";
import { ProjectDialog } from "@/components/features/project/project-dialog";
import { Project } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutGrid, 
  List, 
  Calendar, 
  Plus, 
  Search,
  Filter,
  SortAsc,
  Table,
  Star,
  Clock,
  MoreHorizontal 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProjectsPage() {
  const { projects, tags } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewType, setViewType] = useState<"grid" | "list" | "table" | "calendar">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "priority">("date");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const handleAddProject = () => {
    setSelectedProject(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };
  
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tagId => project.tags.includes(tagId));
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "priority") {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const favoriteProjects = filteredProjects.filter(project => favorites.includes(project.id));
  const otherProjects = filteredProjects.filter(project => !favorites.includes(project.id));
  const sortedProjects = [...favoriteProjects, ...otherProjects];
  
  return (
    <div>
      <PageHeader 
        title="Projects" 
        description="Manage and organize your projects"
        action={{
          label: "New Project",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: handleAddProject,
        }}
      />
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuItem>All Projects</DropdownMenuItem>
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Completed</DropdownMenuItem>
                <DropdownMenuItem>Archived</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SortAsc className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  <Clock className="h-4 w-4 mr-2" />
                  Date Created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  <List className="h-4 w-4 mr-2" />
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("priority")}>
                  <Star className="h-4 w-4 mr-2" />
                  Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="border rounded-md p-1 flex gap-1">
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "table" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("table")}
              >
                <Table className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "calendar" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("calendar")}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              style={{
                backgroundColor: selectedTags.includes(tag.id) ? tag.color : "transparent",
                color: selectedTags.includes(tag.id) ? "white" : tag.color,
                borderColor: tag.color,
              }}
              className="cursor-pointer"
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {favorites.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Favorites</h2>
              <div className={`grid gap-4 ${
                viewType === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {favoriteProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onEdit={handleEditProject}
                    viewType={viewType}
                    isFavorite={true}
                    onFavoriteToggle={() => toggleFavorite(project.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className={`grid gap-4 ${
            viewType === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            <AnimatePresence>
              {otherProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onEdit={handleEditProject}
                  viewType={viewType}
                  isFavorite={favorites.includes(project.id)}
                  onFavoriteToggle={() => toggleFavorite(project.id)}
                />
              ))}
              
              {sortedProjects.length === 0 && (
                <motion.div 
                  className="col-span-full flex flex-col items-center justify-center p-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-lg font-medium mb-2">No projects found</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first project to get started
                  </p>
                  <Button
                    onClick={handleAddProject}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className={`grid gap-4 ${
            viewType === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {sortedProjects
              .filter(project => project.status === "in-progress")
              .map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onEdit={handleEditProject}
                  viewType={viewType}
                  isFavorite={favorites.includes(project.id)}
                  onFavoriteToggle={() => toggleFavorite(project.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className={`grid gap-4 ${
            viewType === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {sortedProjects
              .filter(project => project.status === "completed")
              .map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onEdit={handleEditProject}
                  viewType={viewType}
                  isFavorite={favorites.includes(project.id)}
                  onFavoriteToggle={() => toggleFavorite(project.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="archived">
          <div className={`grid gap-4 ${
            viewType === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {sortedProjects
              .filter(project => project.status === "archived")
              .map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onEdit={handleEditProject}
                  viewType={viewType}
                  isFavorite={favorites.includes(project.id)}
                  onFavoriteToggle={() => toggleFavorite(project.id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <ProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        project={selectedProject} 
      />
    </div>
  );
}