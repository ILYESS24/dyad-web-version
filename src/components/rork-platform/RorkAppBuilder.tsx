import React, { useState, useRef } from 'react';
import { Play, Square, Save, Download, Share2, Settings, Code, Eye, Smartphone, Monitor, Tablet, Plus, Trash2, Copy, Move } from 'lucide-react';

interface Component {
  id: string;
  type: string;
  name: string;
  props: any;
  children?: Component[];
}

interface AppBuilderState {
  components: Component[];
  selectedComponent: string | null;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  isRunning: boolean;
}

export function RorkAppBuilder() {
  const [state, setState] = useState<AppBuilderState>({
    components: [
      {
        id: '1',
        type: 'Container',
        name: 'Main Container',
        props: { className: 'min-h-screen bg-gray-50' },
        children: [
          {
            id: '2',
            type: 'Header',
            name: 'Header',
            props: { className: 'bg-white shadow-sm border-b' },
            children: [
              {
                id: '3',
                type: 'Text',
                name: 'Logo',
                props: { text: 'My App', className: 'text-2xl font-bold text-blue-600' }
              }
            ]
          }
        ]
      }
    ],
    selectedComponent: '1',
    previewMode: 'desktop',
    isRunning: false
  });

  const componentLibrary = [
    { type: 'Container', name: 'Container', icon: '📦', description: 'Layout container' },
    { type: 'Text', name: 'Text', icon: '📝', description: 'Text element' },
    { type: 'Button', name: 'Button', icon: '🔘', description: 'Clickable button' },
    { type: 'Input', name: 'Input', icon: '📥', description: 'Text input field' },
    { type: 'Image', name: 'Image', icon: '🖼️', description: 'Image element' },
    { type: 'Header', name: 'Header', icon: '📋', description: 'Page header' },
    { type: 'Footer', name: 'Footer', icon: '🦶', description: 'Page footer' },
    { type: 'Card', name: 'Card', icon: '🃏', description: 'Content card' },
    { type: 'List', name: 'List', icon: '📋', description: 'List component' },
    { type: 'Form', name: 'Form', icon: '📝', description: 'Form container' }
  ];

  const addComponent = (type: string) => {
    const newComponent: Component = {
      id: Date.now().toString(),
      type,
      name: `${type} Component`,
      props: getDefaultProps(type)
    };

    setState(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
  };

  const getDefaultProps = (type: string) => {
    const defaults: { [key: string]: any } = {
      Container: { className: 'p-4' },
      Text: { text: 'Sample Text', className: 'text-base' },
      Button: { text: 'Click Me', className: 'px-4 py-2 bg-blue-500 text-white rounded' },
      Input: { placeholder: 'Enter text...', className: 'px-3 py-2 border rounded' },
      Image: { src: '/api/placeholder/300/200', alt: 'Image', className: 'rounded' },
      Header: { className: 'bg-gray-100 p-4' },
      Footer: { className: 'bg-gray-100 p-4' },
      Card: { className: 'bg-white p-4 rounded shadow' },
      List: { items: ['Item 1', 'Item 2', 'Item 3'], className: 'list-disc list-inside' },
      Form: { className: 'space-y-4' }
    };
    return defaults[type] || {};
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    setState(prev => ({
      ...prev,
      components: prev.components.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    }));
  };

  const deleteComponent = (id: string) => {
    setState(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id),
      selectedComponent: prev.selectedComponent === id ? null : prev.selectedComponent
    }));
  };

  const renderComponent = (component: Component): React.ReactNode => {
    const { type, props } = component;
    
    switch (type) {
      case 'Container':
        return (
          <div key={component.id} className={props.className}>
            {component.children?.map(child => renderComponent(child))}
          </div>
        );
      
      case 'Text':
        return (
          <p key={component.id} className={props.className}>
            {props.text}
          </p>
        );
      
      case 'Button':
        return (
          <button key={component.id} className={props.className}>
            {props.text}
          </button>
        );
      
      case 'Input':
        return (
          <input 
            key={component.id} 
            className={props.className}
            placeholder={props.placeholder}
            type="text"
          />
        );
      
      case 'Image':
        return (
          <img 
            key={component.id} 
            src={props.src} 
            alt={props.alt}
            className={props.className}
          />
        );
      
      case 'Header':
        return (
          <header key={component.id} className={props.className}>
            {component.children?.map(child => renderComponent(child))}
          </header>
        );
      
      case 'Footer':
        return (
          <footer key={component.id} className={props.className}>
            {component.children?.map(child => renderComponent(child))}
          </footer>
        );
      
      case 'Card':
        return (
          <div key={component.id} className={props.className}>
            {component.children?.map(child => renderComponent(child))}
          </div>
        );
      
      case 'List':
        return (
          <ul key={component.id} className={props.className}>
            {props.items?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      
      case 'Form':
        return (
          <form key={component.id} className={props.className}>
            {component.children?.map(child => renderComponent(child))}
          </form>
        );
      
      default:
        return <div key={component.id}>Unknown component: {type}</div>;
    }
  };

  const getPreviewSize = () => {
    switch (state.previewMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Component Library Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Components</h3>
        <div className="grid grid-cols-2 gap-2">
          {componentLibrary.map((comp) => (
            <button
              key={comp.type}
              onClick={() => addComponent(comp.type)}
              className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
            >
              <div className="text-2xl mb-1">{comp.icon}</div>
              <div className="text-xs font-medium text-gray-900">{comp.name}</div>
              <div className="text-xs text-gray-500">{comp.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">App Builder</h2>
            
            {/* Preview Mode */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setState(prev => ({ ...prev, previewMode: 'desktop' }))}
                className={`p-2 rounded ${state.previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, previewMode: 'tablet' }))}
                className={`p-2 rounded ${state.previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, previewMode: 'mobile' }))}
                className={`p-2 rounded ${state.previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button 
              onClick={() => setState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
              className={`px-4 py-2 rounded font-medium ${
                state.isRunning 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {state.isRunning ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Component Tree */}
          <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Component Tree</h3>
            <div className="space-y-1">
              {state.components.map(component => (
                <div key={component.id} className="space-y-1">
                  <div
                    className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                      state.selectedComponent === component.id ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setState(prev => ({ ...prev, selectedComponent: component.id }))}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">📦</span>
                      <span className="text-sm font-medium">{component.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteComponent(component.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
            <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${getPreviewSize()} w-full`}>
              <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500">
                  {state.previewMode === 'mobile' ? '375px' : 
                   state.previewMode === 'tablet' ? '768px' : 'Desktop'}
                </div>
              </div>
              <div className="p-6">
                {state.components.map(component => renderComponent(component))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
