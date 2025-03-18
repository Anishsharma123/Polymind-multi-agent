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

interface ArtifactsProps {
  artifacts: ContentArtifact[]
  className?: string
}

// Render a single artifact based on its type
export function ArtifactRenderer({ artifact }: { artifact: ContentArtifact }) {
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
        <div key={index} className="artifact-container">
          <ArtifactRenderer artifact={artifact} />
        </div>
      ))}
    </div>
  );
}

// Helper function to extract artifacts from text
export function extractContentArtifacts(text: string): { artifacts: ContentArtifact[], remainingText: string } {
  let remainingText = text;
  const artifacts: ContentArtifact[] = [];
  
  // Extract mermaid diagrams
  if (remainingText.includes('```mermaid')) {
    const mermaidPattern = /```mermaid\n([\s\S]*?)```/g;
    remainingText = remainingText.replace(mermaidPattern, (match, diagram) => {
      artifacts.push({
        type: 'mermaid',
        content: diagram.trim()
      });
      return '';
    }).trim();
  }
  
  // Extract SVG content
  if (remainingText.includes('```svg')) {
    const svgPattern = /```svg\n([\s\S]*?)```/g;
    remainingText = remainingText.replace(svgPattern, (match, svg) => {
      artifacts.push({
        type: 'svg',
        content: svg.trim()
      });
      return '';
    }).trim();
  }
  
  // Extract HTML content
  if (remainingText.includes('```html')) {
    const htmlPattern = /```html\n([\s\S]*?)```/g;
    remainingText = remainingText.replace(htmlPattern, (match, html) => {
      artifacts.push({
        type: 'html',
        content: html.trim()
      });
      return '';
    }).trim();
  }
  
  // Extract React components
  if (remainingText.includes('```jsx') || remainingText.includes('```tsx')) {
    const reactPattern = /```(jsx|tsx)\n([\s\S]*?)```/g;
    remainingText = remainingText.replace(reactPattern, (match, lang, code) => {
      artifacts.push({
        type: 'react',
        content: code.trim(),
        language: lang
      });
      return '';
    }).trim();
  }
  
  // Extract markdown blocks
  if (remainingText.includes('```markdown')) {
    const markdownPattern = /```markdown\n([\s\S]*?)```/g;
    remainingText = remainingText.replace(markdownPattern, (match, markdown) => {
      artifacts.push({
        type: 'markdown',
        content: markdown.trim()
      });
      return '';
    }).trim();
  }
  
  // Extract other code blocks
  if (remainingText.includes('```')) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let lastIndex = 0;
    let processedText = '';
    
    while ((match = codeBlockRegex.exec(remainingText)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        processedText += remainingText.slice(lastIndex, match.index);
      }
      
      // Add code block to artifacts
      artifacts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2].trim()
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < remainingText.length) {
      processedText += remainingText.slice(lastIndex);
    }
    
    remainingText = processedText.trim();
  }
  
  return { artifacts, remainingText };
} 