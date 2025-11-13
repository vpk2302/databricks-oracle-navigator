import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { DashboardCard } from "@/components/DashboardCard";
import { GitBranch, Package, BookOpen, Bot } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              MyISCP Migration Assistant
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visualize Oracle PL/SQL functionality, explore data lineage, and plan your 
              Oracle → Databricks migration with AI-powered insights
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <DashboardCard
              title="Lineage Simulator"
              description="Interactive visualization of data flows and dependencies between Oracle objects"
              icon={GitBranch}
              onClick={() => navigate('/explorer')}
              className="animate-fade-in [animation-delay:100ms]"
            />
            
            <DashboardCard
              title="Object Explorer"
              description="Browse packages, procedures, functions, tables, views, and triggers with detailed metadata"
              icon={Package}
              onClick={() => navigate('/explorer')}
              className="animate-fade-in [animation-delay:200ms]"
            />
            
            <DashboardCard
              title="Knowledge Base"
              description="Search and explore knowledge transfer documents and migration best practices"
              icon={BookOpen}
              onClick={() => navigate('/knowledge-base')}
              className="animate-fade-in [animation-delay:300ms]"
            />
            
            <DashboardCard
              title="AI Assistant"
              description="Get intelligent answers about business logic, dependencies, and migration strategies"
              icon={Bot}
              onClick={() => navigate('/explorer')}
              className="animate-fade-in [animation-delay:400ms]"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4 animate-fade-in [animation-delay:500ms]">
            <div className="rounded-lg border border-border bg-card p-4 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-default">
              <div className="text-2xl font-bold text-primary transition-transform duration-300 hover:scale-110 inline-block">8</div>
              <div className="text-sm text-muted-foreground">Oracle Objects</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-default">
              <div className="text-2xl font-bold text-primary transition-transform duration-300 hover:scale-110 inline-block">3</div>
              <div className="text-sm text-muted-foreground">Schemas</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-default">
              <div className="text-2xl font-bold text-primary transition-transform duration-300 hover:scale-110 inline-block">9</div>
              <div className="text-sm text-muted-foreground">Dependencies</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-default">
              <div className="text-2xl font-bold text-primary transition-transform duration-300 hover:scale-110 inline-block">3</div>
              <div className="text-sm text-muted-foreground">KB Articles</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
