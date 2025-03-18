import { MermaidDiagram } from "./mermaid-diagram"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'

// Content artifact types
export type ArtifactType = 
  | 'mermaid' 
  | 'code' 
  | 'svg' 
  | 'markdown' 
  | 'html' 
  | 'react' 
  | 'text'

export interface ContentArtifact {
  type: ArtifactType
  content: string
  language?: string
  metadata?: Record<string, any>
}

export type Artifact = {
  type: 'mermaid' | 'code' | 'image' | 'svg' | 'html' | 'markdown' | 'react';
  content: string;
  language?: string;
  title?: string;
}

interface ArtifactsProps {
  artifacts: Artifact[]
  className?: string
}

// Render a single artifact based on its type
export function ArtifactRenderer({ artifact }: { artifact: Artifact }) {
  switch (artifact.type) {
    case 'mermaid':
      return <MermaidDiagram chart={artifact.content} />;
    
    case 'code':
      return (
        <div className="my-4 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language={artifact.language}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              background: '#1a1a1a'
            }}
          >
            {artifact.content}
          </SyntaxHighlighter>
        </div>
      );
    
    case 'svg':
      return (
        <div 
          className="my-4 p-2 bg-white rounded-lg w-full max-w-full overflow-auto"
          dangerouslySetInnerHTML={{ __html: artifact.content }}
        />
      );
    
    case 'html':
      return (
        <div className="my-4 p-4 bg-gray-900 rounded-lg w-full overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: artifact.content }} />
          <div className="mt-2 pt-2 border-t border-gray-700">
            <SyntaxHighlighter language="html" style={oneDark} customStyle={{ background: 'transparent' }}>
              {artifact.content}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    
    case 'markdown':
      return (
        <div className="my-4 p-4 bg-gray-900 rounded-lg w-full overflow-auto prose prose-invert max-w-none">
          <ReactMarkdown>{artifact.content}</ReactMarkdown>
        </div>
      );
    
    case 'react':
      return (
        <div className="my-4 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language={artifact.language === 'tsx' ? 'typescript' : 'javascript'}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              background: '#1a1a1a'
            }}
          >
            {artifact.content}
          </SyntaxHighlighter>
        </div>
      );
    
    default:
      return null;
  }
}

// Component to display a collection of artifacts
export function Artifacts({ artifacts, className = "" }: ArtifactsProps) {
  if (!artifacts || artifacts.length === 0) {
    return null;
  }

  return (
    <div className={`my-6 space-y-6 ${className}`}>
      {artifacts.map((artifact, index) => (
        <div key={index} className="rounded-lg overflow-hidden border border-gray-700">
          {artifact.title && (
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-200">{artifact.title}</h3>
            </div>
          )}
          <div className="p-4 bg-gray-900">
            {artifact.type === 'mermaid' && (
              <MermaidDiagram chart={artifact.content} />
            )}
            {artifact.type === 'code' && (
              <SyntaxHighlighter
                language={artifact.language}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  background: '#1a1a1a'
                }}
              >
                {artifact.content}
              </SyntaxHighlighter>
            )}
            {artifact.type === 'image' && (
              <img 
                src={artifact.content} 
                alt={artifact.title || 'Shared image'} 
                className="max-w-full h-auto"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to extract artifacts from text
export function extractContentArtifacts(text: string): { artifacts: Artifact[], remainingText: string } {
  const artifacts: Artifact[] = [];
  
  // Extract mermaid diagrams
  const mermaidPattern = /```mermaid\s*(?:\[([^\]]+)\])?\n([\s\S]*?)```/g;
  let remainingText = text.replace(mermaidPattern, (_, title, diagram) => {
    artifacts.push({
      type: 'mermaid',
      content: diagram.trim(),
      title: title?.trim()
    });
    return '';
  });

  // Extract code blocks
  const codePattern = /```(\w+)?\n([\s\S]*?)```/g;
  remainingText = remainingText.replace(codePattern, (_, language, code) => {
    artifacts.push({
      type: 'code',
      content: code.trim(),
      language: language || 'plaintext'
    });
    return '';
  });

  return {
    artifacts,
    remainingText: remainingText.trim()
  };
} 