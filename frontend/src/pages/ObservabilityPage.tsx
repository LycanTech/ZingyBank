import React, { useState } from 'react';
import { ExternalLink, BarChart3, Search, MessageSquare, Mail, Activity } from 'lucide-react';

const TOOLS = [
  {
    name: 'Grafana',
    description: 'Metrics dashboards, alerts, and log exploration',
    url: 'http://localhost:3001',
    icon: BarChart3,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    name: 'Jaeger',
    description: 'Distributed tracing — follow requests across all 11 services',
    url: 'http://localhost:16686',
    icon: Search,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    name: 'Kafka UI',
    description: 'Inspect topics, consumer groups, and message payloads',
    url: 'http://localhost:9091',
    icon: MessageSquare,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    name: 'MailHog',
    description: 'Inspect all outbound emails (notifications, OTPs)',
    url: 'http://localhost:8025',
    icon: Mail,
    color: 'text-green-500',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
];

const GRAFANA_PANELS = [
  {
    label: 'API Gateway',
    src: 'http://localhost:3001/d-solo/zingybank-overview?orgId=1&panelId=1&refresh=10s',
  },
  {
    label: 'JVM Heap',
    src: 'http://localhost:3001/d-solo/zingybank-jvm?orgId=1&panelId=2&refresh=10s',
  },
  {
    label: 'Error Rate',
    src: 'http://localhost:3001/d-solo/zingybank-overview?orgId=1&panelId=3&refresh=10s',
  },
  {
    label: 'Request Latency',
    src: 'http://localhost:3001/d-solo/zingybank-overview?orgId=1&panelId=4&refresh=10s',
  },
];

type ActiveTab = 'overview' | 'dashboards';

export default function ObservabilityPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-zingy-600" />
        <div>
          <h1 className="text-2xl font-bold text-bank-text">Observability</h1>
          <p className="text-sm text-bank-muted">Monitoring, tracing, and logging tools</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-bank-border">
        {(['overview', 'dashboards'] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-zingy-600 text-zingy-600'
                : 'border-transparent text-bank-muted hover:text-bank-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-start gap-4 p-5 rounded-xl border ${tool.border} ${tool.bg} hover:shadow-md transition-shadow group`}
            >
              <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-bank-text">{tool.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-bank-muted group-hover:text-bank-text transition-colors" />
                </div>
                <p className="text-sm text-bank-muted mt-0.5">{tool.description}</p>
                <p className="text-xs text-bank-muted mt-1 font-mono">{tool.url}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {activeTab === 'dashboards' && (
        <div className="space-y-4">
          <p className="text-sm text-bank-muted">
            Live Grafana panels embedded below. If panels show a login screen, open{' '}
            <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="text-zingy-600 underline">
              Grafana
            </a>{' '}
            and log in first (admin / Grafana@Admin2024!).
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {GRAFANA_PANELS.map((panel) => (
              <div key={panel.label} className="rounded-xl border border-bank-border overflow-hidden bg-white">
                <div className="px-4 py-2 border-b border-bank-border bg-gray-50">
                  <span className="text-sm font-medium text-bank-text">{panel.label}</span>
                </div>
                <iframe
                  src={panel.src}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  title={panel.label}
                />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-bank-border overflow-hidden bg-white">
            <div className="px-4 py-2 border-b border-bank-border bg-gray-50 flex items-center justify-between">
              <span className="text-sm font-medium text-bank-text">Full Grafana Dashboard</span>
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-zingy-600 hover:underline"
              >
                Open in new tab <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <iframe
              src="http://localhost:3001/dashboards"
              width="100%"
              height="500"
              frameBorder="0"
              title="Grafana"
            />
          </div>
        </div>
      )}
    </div>
  );
}
