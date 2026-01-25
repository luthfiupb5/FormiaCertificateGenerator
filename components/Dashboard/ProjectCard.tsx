import Link from 'next/link';
import { Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns'; // We might need to install date-fns or write a simple helper
import clsx from 'clsx';

interface Project {
    id: string;
    name: string;
    updated_at: string;
    thumbnail_url?: string;
}

interface ProjectCardProps {
    project: Project;
    onDelete?: (id: string) => void;
}

// Simple date formatter if date-fns is not desired/installed, but assuming we can use native Intl for now
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
        return 'Today';
    } else if (diffDays < 2) {
        return 'Yesterday';
    } else {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    }
};

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
    return (
        <div className="group relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1">
            {/* Thumbnail Area */}
            <Link href={`/canvas?id=${project.id}`} className="block aspect-[4/3] bg-neutral-900 relative overflow-hidden">
                {project.thumbnail_url ? (
                    <img
                        src={project.thumbnail_url}
                        alt={project.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                        {/* Abstract placeholder */}
                        <div className="w-16 h-20 border-2 border-white/10 rounded opacity-20 transform rotate-12 group-hover:rotate-6 transition-transform decoration-clone" />
                    </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <span className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Edit className="w-4 h-4" /> Edit
                    </span>
                </div>
            </Link>

            {/* Content Area */}
            <div className="p-4 bg-[#111] relative z-10">
                <div className="flex justify-between items-start gap-2">
                    <Link href={`/canvas?id=${project.id}`} className="block flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors" title={project.name}>
                            {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                            <Clock className="w-3 h-3" />
                            <span>Edited {formatDate(project.updated_at)}</span>
                        </div>
                    </Link>

                    {/* Action Menu (could be a dropdown in full impl, for now just a delete button trigger) */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete?.(project.id);
                        }}
                        className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Project"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
