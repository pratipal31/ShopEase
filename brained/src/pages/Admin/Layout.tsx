import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Video,
  Target,
  Zap,
  GitBranch,
  Users,
  FlaskConical,
  BarChart3,
  Package,
  Settings,
  Circle,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '../../components/ui/sidebar';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import trackingClient from '../../services/trackingClient';
import api from '../../services/api';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  // Recording control component
  const RecordingControl: React.FC = () => {
    const [isRec, setIsRec] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
      api
        .get('/api/analytics/recording')
        .then((r) => setIsRec(!!r.data.enabled))
        .catch(() => { });
    }, []);

    const toggle = async () => {
      setLoading(true);
      try {
        const res = await api.post('/api/analytics/recording', { enabled: !isRec });
        setIsRec(!!res.data.enabled);
        if (res.data.enabled) trackingClient.startRecording();
        else trackingClient.stopRecording();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex flex-col gap-2">
        <Button
          disabled={loading}
          onClick={toggle}
          className={`w-full ${isRec
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-60`}
          size="sm"
        >
          <Circle className={`w-3 h-3 mr-2 ${isRec ? 'fill-white' : ''}`} />
          {isRec ? 'Stop Recording' : 'Start Recording'}
        </Button>
        <span className="text-xs text-muted-foreground text-center">
          {isRec ? 'Recording active' : 'Recorder idle'}
        </span>
      </div>
    );
  };

  const menuItems = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    },
  ];

  const analyticsItems = [
    {
      title: 'Overview',
      url: '/admin/analytics/overview',
      icon: TrendingUp,
    },
    {
      title: 'Session Recordings',
      url: '/admin/analytics/recordings',
      icon: Video,
    },
    {
      title: 'Heatmaps',
      url: '/admin/analytics/heatmap',
      icon: Target,
    },
    {
      title: 'Performance',
      url: '/admin/analytics/performance',
      icon: Zap,
    },
    {
      title: 'Funnel Analysis',
      url: '/admin/analytics/funnels',
      icon: GitBranch,
    },
    {
      title: 'Cohort Analysis',
      url: '/admin/analytics/cohorts',
      icon: Users,
    },
    {
      title: 'A/B Testing',
      url: '/admin/analytics/experiments',
      icon: FlaskConical,
    },
    {
      title: 'Events & Metrics',
      url: '/admin/analytics',
      icon: BarChart3,
    },
  ];

  const managementItems = [
    {
      title: 'Products',
      url: '/admin/products',
      icon: Package,
    },
    {
      title: 'Tracking Setup',
      url: '/admin/tracking',
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
              P
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sm">PagePulse</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {analyticsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {location.pathname === item.url && (
                          <ChevronRight className="ml-auto w-4 h-4" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {location.pathname === item.url && (
                          <ChevronRight className="ml-auto w-4 h-4" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="p-2">
            <Separator className="mb-2" />
            <RecordingControl />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 shadow-sm">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center justify-between flex-1 gap-2">
            <span className="font-semibold text-lg truncate">
              {analyticsItems.find((item) => item.url === location.pathname)?.title ||
                managementItems.find((item) => item.url === location.pathname)?.title ||
                menuItems.find((item) => item.url === location.pathname)?.title ||
                'Admin'}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
