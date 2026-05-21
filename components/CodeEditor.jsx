'use client'

import { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { monacoLanguageFromFileName } from '@/lib/codeAnalyzer'
import { getActiveEditorTheme } from '@/lib/extensions'

function resolveMonacoTheme(isDarkMode) {
  const ext = getActiveEditorTheme()
  if (ext === 'one-dark') return 'nexus-dark'
  if (ext === 'github-light') return 'nexus-light'
  return isDarkMode !== false ? 'nexus-dark' : 'nexus-light'
}

let themesRegistered = false

function registerThemes(monaco) {
  themesRegistered = true

  monaco.editor.defineTheme('nexus-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '',                foreground: 'e6edf3' },
      { token: 'comment',         foreground: '8b949e', fontStyle: 'italic' },
      { token: 'comment.line',    foreground: '8b949e', fontStyle: 'italic' },
      { token: 'comment.block',   foreground: '8b949e', fontStyle: 'italic' },
      { token: 'string',          foreground: 'a5d6ff' },
      { token: 'string.escape',   foreground: '79c0ff' },
      { token: 'number',          foreground: '79c0ff' },
      { token: 'number.float',    foreground: '79c0ff' },
      { token: 'keyword',         foreground: 'ff7b72', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'ff7b72', fontStyle: 'bold' },
      { token: 'identifier',      foreground: 'e6edf3' },
      { token: 'type',            foreground: 'ffa657' },
      { token: 'type.identifier', foreground: 'ffa657' },
      { token: 'delimiter',       foreground: 'e6edf3' },
      { token: 'delimiter.bracket',foreground: 'e6edf3' },
      { token: 'delimiter.parenthesis',foreground: 'e6edf3' },
      { token: 'operator',        foreground: 'ff7b72' },
      { token: 'tag',             foreground: '7ee787' },
      { token: 'metatag',         foreground: '7ee787' },
      { token: 'attribute.name',  foreground: 'ffa657' },
      { token: 'attribute.value', foreground: 'a5d6ff' },
      { token: 'variable',        foreground: 'e6edf3' },
      { token: 'variable.predefined', foreground: 'ffa657' },
      { token: 'constant',        foreground: '79c0ff' },
      { token: 'regexp',          foreground: 'a5d6ff' },
      { token: 'annotation',      foreground: 'ffa657' },
      { token: 'invalid',         foreground: 'f85149', fontStyle: 'underline' },
    ],
    colors: {
      'editor.background':                  '#0d1117',
      'editor.foreground':                  '#e6edf3',
      'editorLineNumber.foreground':        '#3d444d',
      'editorLineNumber.activeForeground':  '#e6edf3',
      'editor.lineHighlightBackground':     '#161b22',
      'editor.lineHighlightBorder':         '#00000000',
      'editor.selectionBackground':         '#264f7866',
      'editor.inactiveSelectionBackground': '#264f7833',
      'editorCursor.foreground':            '#58a6ff',
      'editorBracketMatch.background':      '#58a6ff22',
      'editorBracketMatch.border':          '#58a6ff',
      'editorError.foreground':             '#f85149',
      'editorWarning.foreground':           '#d29922',
      'editorGutter.background':            '#0d1117',
      'scrollbarSlider.background':         '#30363d88',
      'scrollbarSlider.hoverBackground':    '#484f58',
      'editorWidget.background':            '#161b22',
      'editorWidget.border':                '#30363d',
      'editorSuggestWidget.background':     '#161b22',
      'editorSuggestWidget.border':         '#30363d',
      'editorSuggestWidget.selectedBackground': '#264f78',
      'input.background':                   '#0d1117',
      'input.border':                       '#30363d',
    },
  })

  monaco.editor.defineTheme('nexus-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '',                     foreground: '1f2328' },
      { token: 'comment',              foreground: '57606a', fontStyle: 'italic' },
      { token: 'comment.line',         foreground: '57606a', fontStyle: 'italic' },
      { token: 'comment.block',        foreground: '57606a', fontStyle: 'italic' },
      { token: 'string',               foreground: '0a3069' },
      { token: 'string.escape',        foreground: '0550ae' },
      { token: 'number',               foreground: '0550ae' },
      { token: 'number.float',         foreground: '0550ae' },
      { token: 'keyword',              foreground: 'cf222e', fontStyle: 'bold' },
      { token: 'keyword.control',      foreground: 'cf222e', fontStyle: 'bold' },
      { token: 'keyword.operator',     foreground: 'cf222e' },
      { token: 'keyword.other',        foreground: 'cf222e' },
      { token: 'identifier',           foreground: '1f2328' },
      { token: 'type',                 foreground: '953800' },
      { token: 'type.identifier',      foreground: '953800' },
      { token: 'entity.name.function', foreground: '8250df' },
      { token: 'entity.name.type',     foreground: '953800' },
      { token: 'entity.name.class',    foreground: '953800' },
      { token: 'support.function',     foreground: '8250df' },
      { token: 'support.class',        foreground: '953800' },
      { token: 'support.type',         foreground: '0550ae' },
      { token: 'delimiter',            foreground: '1f2328' },
      { token: 'delimiter.bracket',    foreground: '1f2328' },
      { token: 'delimiter.parenthesis',foreground: '1f2328' },
      { token: 'delimiter.curly',      foreground: '1f2328' },
      { token: 'operator',             foreground: 'cf222e' },
      { token: 'tag',                  foreground: '116329' },
      { token: 'metatag',              foreground: '116329' },
      { token: 'attribute.name',       foreground: '953800' },
      { token: 'attribute.value',      foreground: '0a3069' },
      { token: 'variable',             foreground: 'e36209' },
      { token: 'variable.predefined',  foreground: 'e36209' },
      { token: 'variable.parameter',   foreground: '1f2328' },
      { token: 'constant',             foreground: '0550ae' },
      { token: 'constant.language',    foreground: '0550ae' },
      { token: 'regexp',               foreground: '0a3069' },
      { token: 'annotation',           foreground: '953800' },
      { token: 'invalid',              foreground: 'cf222e', fontStyle: 'underline' },
    ],
    colors: {
      'editor.background':                  '#ffffff',
      'editor.foreground':                  '#24292f',
      'editorLineNumber.foreground':        '#8c959f',
      'editorLineNumber.activeForeground':  '#24292f',
      'editor.lineHighlightBackground':     '#f6f8fa',
      'editor.lineHighlightBorder':         '#00000000',
      'editor.selectionBackground':         '#0969da33',
      'editor.inactiveSelectionBackground': '#0969da18',
      'editorCursor.foreground':            '#0969da',
      'editorBracketMatch.background':      '#0969da22',
      'editorBracketMatch.border':          '#0969da',
      'editorError.foreground':             '#cf222e',
      'editorWarning.foreground':           '#9a6700',
      'editorGutter.background':            '#f6f8fa',
      'scrollbarSlider.background':         '#8c959f44',
      'scrollbarSlider.hoverBackground':    '#8c959f88',
      'editorWidget.background':            '#ffffff',
      'editorWidget.border':                '#d0d7de',
      'editorSuggestWidget.background':     '#ffffff',
      'editorSuggestWidget.border':         '#d0d7de',
      'editorSuggestWidget.selectedBackground': '#0969da18',
      'input.background':                   '#ffffff',
      'input.border':                       '#d0d7de',
    },
  })
}

/** Apply parent-driven code changes without wiping Monaco undo history. */
function applyExternalCode(editor, nextCode) {
  const model = editor.getModel()
  if (!model) return
  const current = editor.getValue()
  if (current === nextCode) return

  editor.pushUndoStop()
  editor.executeEdits('optivix-sync', [
    {
      range: model.getFullModelRange(),
      text: nextCode,
      forceMoveMarkers: true,
    },
  ])
  editor.pushUndoStop()
}

export default function CodeEditor({ code, setCode, isDarkMode, fileKey = 'workspace', themeRevision = 0 }) {
  const monacoRef = useRef(null)
  const editorRef = useRef(null)
  const lastEmittedRef = useRef(code)
  const monacoTheme = resolveMonacoTheme(isDarkMode)

  useEffect(() => {
    lastEmittedRef.current = code
  }, [fileKey])

  // Fix Bugs / open file / etc. — sync without setValue (preserves Ctrl+Z)
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (lastEmittedRef.current === code) return
    applyExternalCode(editor, code)
    lastEmittedRef.current = code
  }, [code])

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(monacoTheme)
    }
  }, [monacoTheme, themeRevision])

  const handleChange = (value) => {
    if (value === undefined) return
    lastEmittedRef.current = value
    setCode(value)
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Editor
        key={fileKey}
        height="100%"
        defaultLanguage={monacoLanguageFromFileName(fileKey)}
        defaultValue={code}
        onChange={handleChange}
        options={{
          minimap:                    { enabled: false },
          fontSize:                   14,
          fontFamily:                 '"JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", monospace',
          fontLigatures:              true,
          lineHeight:                 1.7,
          letterSpacing:              0.3,
          padding:                    { top: 16, bottom: 16 },
          scrollBeyondLastLine:       false,
          smoothScrolling:            true,
          cursorBlinking:             'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderWhitespace:           'none',
          bracketPairColorization:    { enabled: true },
          wordWrap:                   'on',
          autoClosingBrackets:        'always',
          autoClosingQuotes:          'always',
          formatOnPaste:              true,
          formatOnType:               true,
          suggestOnTriggerCharacters: true,
          quickSuggestions:           { other: true, comments: false, strings: false },
          tabSize:                    2,
          insertSpaces:               true,
          renderLineHighlight:        'line',
          occurrencesHighlight:       'singleFile',
          selectionHighlight:         true,
          showUnused:                 true,
          showDeprecated:             true,
          inlineSuggest:              { enabled: true },
          scrollbar:                  { verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
          glyphMargin:                false,
          lineNumbers:                'on',
          lineDecorationsWidth:       4,
        }}
        beforeMount={(monaco) => {
          monacoRef.current = monaco
          registerThemes(monaco)
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor
          monacoRef.current = monaco
          registerThemes(monaco)
          monaco.editor.setTheme(monacoTheme)
          const model = editor.getModel()
          if (model) {
            monaco.editor.setModelLanguage(model, monacoLanguageFromFileName(fileKey))
          }
          if (editor.getValue() !== code) {
            editor.setValue(code)
          }
          lastEmittedRef.current = code
        }}
      />
    </div>
  )
}
