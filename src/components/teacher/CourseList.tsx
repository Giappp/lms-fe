'use client';

import React, {useMemo, useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import CourseCard from './CourseCard';
import {CourseResponse} from '@/types';
import {CourseStatus} from '@/types/enum';
import {useCourses} from '@/hooks/useCourses';
import {useAuth} from '@/hooks/useAuth';
import CourseDetailsDrawer from './CourseDetailsDrawer';
import EditCourseModal from './EditCourseModal';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useDebounce} from '@/hooks/useDebounce';
import {Skeleton} from '@/components/ui/skeleton';
import {Badge} from '@/components/ui/badge';
import {
    BookOpen,
    FileText,
    Filter,
    LayoutGrid,
    List,
    Plus,
    RefreshCw,
    Search,
    SortAsc,
    SortDesc,
    TrendingUp,
    Users,
    X
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type ViewMode = 'grid' | 'list';
type SortOption = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc' | 'students-desc';

export default function CourseList() {
    const {user} = useAuth();
    const teacherId = user?.id;

    const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');
    const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');
    const debouncedKeyword = useDebounce(keyword, 300);

    const filters = useMemo(() => ({
        page: 1,
        size: 20,
        teacherId: teacherId,
        status: activeTab === 'published' ? CourseStatus.PUBLISHED : CourseStatus.DRAFT,
        q: debouncedKeyword || undefined,
    }), [teacherId, activeTab, debouncedKeyword]);

    const {courses, isLoading, mutate} = useCourses(filters as any);

    // Sort courses based on selected option
    const sortedCourses = useMemo(() => {
        if (!courses) return [];
        const sorted = [...courses];

        switch (sortBy) {
            case 'name-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'name-desc':
                return sorted.sort((a, b) => b.title.localeCompare(a.title));
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            case 'students-desc':
                return sorted.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
            default:
                return sorted;
        }
    }, [courses, sortBy]);

    const refreshCourses = async () => await mutate();

    const handleView = (course: CourseResponse) => {
        setSelectedCourse(course);
        setIsViewOpen(true);
    };

    const handleEdit = (course: CourseResponse) => {
        setSelectedCourse(course);
        setIsEditOpen(true);
    };

    const onAfterSave = async () => {
        await refreshCourses();
        setIsEditOpen(false);
    };

    const clearSearch = () => {
        setKeyword('');
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const published = courses?.filter(c => c.status === CourseStatus.PUBLISHED).length || 0;
        const drafts = courses?.filter(c => c.status === CourseStatus.DRAFT).length || 0;
        const totalStudents = courses?.reduce((sum, c) => sum + (c.enrolledCount || 0), 0) || 0;

        return {published, drafts, totalStudents};
    }, [courses]);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage and organize your teaching materials
                        </p>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2"/>
                        Create Course
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <BookOpen className="w-5 h-5 text-primary"/>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Published</p>
                                <p className="text-2xl font-bold text-foreground">{stats.published}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-chart-4/10">
                                <FileText className="w-5 h-5 text-chart-4"/>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Drafts</p>
                                <p className="text-2xl font-bold text-foreground">{stats.drafts}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-chart-2/10">
                                <Users className="w-5 h-5 text-chart-2"/>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Students</p>
                                <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search and Filter Bar */}
                <Card className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search courses by title, description..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="pl-9 pr-9"
                            />
                            {keyword && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearSearch}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                >
                                    <X className="w-4 h-4"/>
                                </Button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {/* Sort Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Filter className="w-4 h-4"/>
                                        <span className="hidden sm:inline">Sort</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={() => setSortBy('date-desc')}>
                                        <SortDesc className="w-4 h-4 mr-2"/>
                                        Newest First
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('date-asc')}>
                                        <SortAsc className="w-4 h-4 mr-2"/>
                                        Oldest First
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={() => setSortBy('name-asc')}>
                                        <SortAsc className="w-4 h-4 mr-2"/>
                                        Name (A-Z)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('name-desc')}>
                                        <SortDesc className="w-4 h-4 mr-2"/>
                                        Name (Z-A)
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={() => setSortBy('students-desc')}>
                                        <TrendingUp className="w-4 h-4 mr-2"/>
                                        Most Students
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* View Mode Toggle */}
                            <div className="hidden sm:flex border border-border rounded-md">
                                <Button
                                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="rounded-r-none"
                                >
                                    <LayoutGrid className="w-4 h-4"/>
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="rounded-l-none border-l"
                                >
                                    <List className="w-4 h-4"/>
                                </Button>
                            </div>

                            {/* Refresh Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => refreshCourses()}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
                            </Button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(keyword || sortBy !== 'date-desc') && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
                            <span className="text-sm text-muted-foreground">Active filters:</span>
                            {keyword && (
                                <Badge variant="secondary" className="gap-1">
                                    Search: {keyword}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={clearSearch}
                                    />
                                </Badge>
                            )}
                            {sortBy !== 'date-desc' && (
                                <Badge variant="secondary" className="gap-1">
                                    Sort: {sortBy.replace('-', ' ')}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => setSortBy('date-desc')}
                                    />
                                </Badge>
                            )}
                        </div>
                    )}
                </Card>
            </div>

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="published" className="gap-2">
                        <BookOpen className="w-4 h-4"/>
                        Published
                        {stats.published > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                                {stats.published}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="draft" className="gap-2">
                        <FileText className="w-4 h-4"/>
                        Drafts
                        {stats.drafts > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                                {stats.drafts}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="published" className="mt-6">
                    {isLoading ? (
                        <div className={`grid gap-4 ${
                            viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1'
                        }`}>
                            {Array.from({length: 6}).map((_, i) => (
                                <Skeleton key={i} className="h-48 w-full rounded-lg"/>
                            ))}
                        </div>
                    ) : sortedCourses.length === 0 ? (
                        <Card className="p-12 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-full bg-muted">
                                    <BookOpen className="w-8 h-8 text-muted-foreground"/>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-foreground">
                                        {keyword ? 'No courses found' : 'No published courses yet'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {keyword
                                            ? 'Try adjusting your search terms'
                                            : 'Create your first course to get started'}
                                    </p>
                                </div>
                                {!keyword && (
                                    <Button className="mt-2">
                                        <Plus className="w-4 h-4 mr-2"/>
                                        Create Course
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <div className={`grid gap-4 ${
                            viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1'
                        }`}>
                            {sortedCourses.map((c) => (
                                <CourseCard
                                    key={c.id}
                                    course={c}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="draft" className="mt-6">
                    {isLoading ? (
                        <div className={`grid gap-4 ${
                            viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1'
                        }`}>
                            {Array.from({length: 6}).map((_, i) => (
                                <Skeleton key={i} className="h-48 w-full rounded-lg"/>
                            ))}
                        </div>
                    ) : sortedCourses.length === 0 ? (
                        <Card className="p-12 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-full bg-muted">
                                    <FileText className="w-8 h-8 text-muted-foreground"/>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-foreground">
                                        {keyword ? 'No draft courses found' : 'No draft courses'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {keyword
                                            ? 'Try adjusting your search terms'
                                            : 'Draft courses will appear here'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className={`grid gap-4 ${
                            viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1'
                        }`}>
                            {sortedCourses.map((c) => (
                                <CourseCard
                                    key={c.id}
                                    course={c}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <CourseDetailsDrawer
                course={selectedCourse}
                open={isViewOpen}
                onOpenChange={setIsViewOpen}
                onEdit={handleEdit}
            />
            <EditCourseModal
                course={selectedCourse}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSaved={onAfterSave}
            />
        </div>
    );
}