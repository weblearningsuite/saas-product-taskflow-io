"use client";

import { FC } from "react";
import { Project, Priority, Status } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Users, 
  Star,
  StarOff,
  MoreHorizontal,
  Archive,
  Copy,
  Share2
} from "lucide-react";
import { useTaskStore } from "@/lib/store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  viewType: "grid" | "list" | "table" | "calendar";
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const priorityClasses: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusClasses: Record<Status, string> = {
  todo: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  archived: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

export const ProjectCard: FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  viewType,
  isFavorite,
  onFavoriteToggle
}) => {
  const { deleteProject, completeProject, tags } = useTaskStore();
  
  const isCompleted = project.status === "completed";
  
  const handleComplete = () => {
    completeProject(project.id);
  };
  
  const handleDelete = () => {
    deleteProject(project.id);
  };

  const handleDuplicate = () => {
    // Implement project duplication logic
  };

  const handleShare = () => {
    // Implement project sharing logic
  };

  const handleArchive = () => {
    // Implement project archiving logic
  };
  
  if (viewType === "list") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        layout
        transition={{ duration: 0.2 }}
      >
        <Card className={cn(
          "transition-all duration-200 hover:shadow-md", 
          isCompleted ? "opacity-70" : "opacity-100"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onFavoriteToggle}
                  className={cn(
                    "hover:text-yellow-500",
                    isFavorite && "text-yellow-500"
                  )}
                >
                  {isFavorite ? (
                    <Star className="h-4 w-4 fill-current" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
                <div>
                  <h3 className={cn(
                    "text-lg font-medium",
                    isCompleted && "line-through opacity-70"
                  )}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="w-24" />
                  <span className="text-sm font-medium">{Math.round(project.progress)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={priorityClasses[project.priority]}>
                    {project.priority}
                  </Badge>
                  <Badge className={statusClasses[project.status]}>
                    {project.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {project.teamMembers.length}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(project)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleComplete} disabled={isCompleted}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicate}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleArchive} className="text-yellow-600">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md", 
        isCompleted ? "opacity-70" : "opacity-100"
      )}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-start gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onFavoriteToggle}
                className={cn(
                  "hover:text-yellow-500",
                  isFavorite && "text-yellow-500"
                )}
              >
                {isFavorite ? (
                  <Star className="h-4 w-4 fill-current" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
              <div>
                <h3 className={cn(
                  "text-lg font-medium line-clamp-2",
                  isCompleted && "line-through opacity-70"
                )}>
                  {project.name}
                </h3>
                <div className="flex gap-1 mt-1">
                  <Badge className={priorityClasses[project.priority]}>
                    {project.priority}
                  </Badge>
                  <Badge className={statusClasses[project.status]}>
                    {project.status}
                  </Badge>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleComplete} disabled={isCompleted}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleArchive} className="text-yellow-600">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {project.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {project.description}
            </p>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Progress value={project.progress} className="flex-1" />
              <span className="text-sm font-medium">{Math.round(project.progress)}%</span>
            </div>
            
            {project.teamMembers.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{project.teamMembers.length} team members</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (!tag) return null;
              
              return (
                <Badge 
                  key={tagId} 
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    borderColor: `${tag.color}40`,
                  }}
                  variant="outline"
                >
                  {tag.name}
                </Badge>
              );
            })}
          </div>
          
          {(project.startDate || project.dueDate) && (
            <div className="flex gap-4 text-xs text-muted-foreground mt-3">
              {project.startDate && (
                <div>Start: {format(new Date(project.startDate), "PPP")}</div>
              )}
              {project.dueDate && (
                <div>Due: {format(new Date(project.dueDate), "PPP")}</div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="text-xs text-muted-foreground">
            Created: {format(new Date(project.createdAt), "PP")}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};