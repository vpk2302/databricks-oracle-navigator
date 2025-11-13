import { useState } from "react";
import { Header } from "@/components/Header";
import { ObjectExplorer } from "@/components/ObjectExplorer";
import { LineageGraph } from "@/components/LineageGraph";
import { ObjectDetailsPanel } from "@/components/ObjectDetailsPanel";
import { AIAssistantDrawer } from "@/components/AIAssistantDrawer";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

const Explorer = () => {
  const [selectedObjectId, setSelectedObjectId] = useState<string>();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isMobileExplorerOpen, setIsMobileExplorerOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header 
        onMenuClick={() => setIsMobileExplorerOpen(!isMobileExplorerOpen)} 
        showMenuButton={true}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Object Explorer */}
        <div className={`
          ${isMobileExplorerOpen ? 'fixed inset-0 z-30 bg-background' : 'hidden'} 
          lg:relative lg:block lg:w-80
        `}>
          <ObjectExplorer
            onObjectSelect={(id) => {
              setSelectedObjectId(id);
              setIsMobileExplorerOpen(false);
            }}
            selectedObjectId={selectedObjectId}
          />
        </div>

        {/* Center Panel - Lineage Graph */}
        <div className="flex-1 relative">
          <LineageGraph
            selectedObjectId={selectedObjectId}
            onNodeClick={setSelectedObjectId}
          />
          
          {/* Floating AI Button */}
          <Button
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg lg:hidden"
            onClick={() => setIsAIOpen(true)}
          >
            <Bot className="h-6 w-6" />
          </Button>
        </div>

        {/* Right Panel - Object Details */}
        <div className="hidden lg:block lg:w-96">
          <ObjectDetailsPanel objectId={selectedObjectId} />
        </div>
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Desktop AI Button */}
      <Button
        size="lg"
        className="hidden lg:flex fixed bottom-6 right-6 h-12 gap-2 shadow-lg"
        onClick={() => setIsAIOpen(true)}
      >
        <Bot className="h-5 w-5" />
        AI Assistant
      </Button>
    </div>
  );
};

export default Explorer;
