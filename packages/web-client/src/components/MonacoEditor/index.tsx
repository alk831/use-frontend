import React, { useRef, useEffect } from 'react';
import { ControlledEditor as NativeMonacoEditor, EditorDidMount } from '@monaco-editor/react';
import { NormalizedError } from '../../utils';
import { monaco } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

const MARKER_NAME = 'custom_marker';

export interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  error?: NormalizedError | null
}

export const MonacoEditor = (props: MonacoEditorProps) => {
  const editorRef = useRef<MonacoEditor>();
  const monacoRef = useRef<Monaco>();

  const handleEditorDidMount: EditorDidMount = (_, editor: any) => {
    editorRef.current = editor;
  }

  useEffect(() => {
    monaco
      .init()
      .then(monacoInstance => monacoRef.current = monacoInstance);
  }, []);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const model = (editorRef.current as any).getModel();

    if (props.error == null) {
      monacoRef.current.editor.setModelMarkers(
        model,
        MARKER_NAME,
        []
      );
    } else {
      const { line, column, message } = props.error;

      monacoRef.current.editor.setModelMarkers(
        model,
        MARKER_NAME,
        [
          {
            startLineNumber: line,
            startColumn: column,
            endLineNumber: line,
            endColumn: column,
            message: message,
            severity: monacoRef.current.MarkerSeverity.Error
          }
        ]
      );
    }
  }, [props.error]);

  return (
    <NativeMonacoEditor 
      language="javascript"
      value={props.value}
      height="500px"
      width="500px"
      onChange={(event, value) => value && props.onChange(value)}
      editorDidMount={handleEditorDidMount}
    />
  );
}

type Monaco = typeof monacoEditor;
type MonacoEditor = Monaco['editor'];