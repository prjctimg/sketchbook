'use client';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function CodeEditor({ value, onChange, height = '500px' }: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      height={height}
      theme="dark"
      extensions={[javascript()]}
      onChange={(val: string) => onChange(val)}
      className="text-sm"
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
      }}
    />
  );
}
