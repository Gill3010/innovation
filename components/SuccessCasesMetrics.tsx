'use client';

import React, { useState, useEffect } from 'react';

interface Metric {
  id: string;
  label: string;
  value: string;
  icon: React.ReactElement;
  delay: string;
  color: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export default function SuccessCasesMetrics() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const metrics: Metric[] = [
    {
      id: 'journals',
      label: 'Journals',
      value: '4',
      delay: '100ms',
      color: 'blue',
      icon: (
        <svg className="w-8 h-8 landscape:w-6 landscape:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'events',
      label: 'Events',
      value: '4',
      delay: '150ms',
      color: 'purple',
      icon: (
        <svg className="w-8 h-8 landscape:w-6 landscape:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'publishing',
      label: 'Digital Publishing',
      value: '1',
      delay: '200ms',
      color: 'emerald',
      icon: (
        <svg className="w-8 h-8 landscape:w-6 landscape:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      id: 'courses',
      label: 'Courses',
      value: '2',
      delay: '250ms',
      color: 'amber',
      icon: (
        <svg className="w-8 h-8 landscape:w-6 landscape:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      value: '+17',
      delay: '300ms',
      color: 'red',
      icon: (
        <svg className="w-8 h-8 landscape:w-6 landscape:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'blog',
      label: 'Blog',
      value: '1',
      delay: '350ms',
      color: 'indigo',
      icon: (
        <svg className="w-8 h-8 landscape:w-6 landscape:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'users',
      label: 'Integrated Users',
      value: '+5,000',
      delay: '400ms',
      color: 'cyan',
      icon: (
        <svg className="w-8 h-8 landscape:w-6 landscape:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  // Static data for charts
  const growthData: Array<{month: string, value: number}> = [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1800 },
    { month: 'Mar', value: 2400 },
    { month: 'Apr', value: 3100 },
    { month: 'May', value: 3800 },
    { month: 'Jun', value: 4200 },
  ];

  const categoryData: ChartDataPoint[] = [
    { label: 'Journals', value: 28, color: 'blue' },
    { label: 'Events', value: 28, color: 'purple' },
    { label: 'Publishing', value: 7, color: 'emerald' },
    { label: 'Courses', value: 14, color: 'amber' },
    { label: 'Projects', value: 7, color: 'red' },
    { label: 'Other', value: 16, color: 'indigo' },
  ];

  const donutData: ChartDataPoint[] = [
    { label: 'Active Users', value: 58, color: 'blue' },
    { label: 'New Users', value: 24, color: 'purple' },
    { label: 'Enterprise', value: 18, color: 'emerald' },
  ];

  const getColorClasses = (color: string, isHovered: boolean) => {
    const colors = {
      blue: {
        bg: isHovered ? 'bg-blue-50' : 'bg-white',
        icon: isHovered ? 'text-blue-600' : 'text-blue-500',
        border: 'border-blue-200',
        accent: 'bg-blue-600'
      },
      purple: {
        bg: isHovered ? 'bg-purple-50' : 'bg-white',
        icon: isHovered ? 'text-purple-600' : 'text-purple-500',
        border: 'border-purple-200',
        accent: 'bg-purple-600'
      },
      emerald: {
        bg: isHovered ? 'bg-emerald-50' : 'bg-white',
        icon: isHovered ? 'text-emerald-600' : 'text-emerald-500',
        border: 'border-emerald-200',
        accent: 'bg-emerald-600'
      },
      amber: {
        bg: isHovered ? 'bg-amber-50' : 'bg-white',
        icon: isHovered ? 'text-amber-600' : 'text-amber-500',
        border: 'border-amber-200',
        accent: 'bg-amber-600'
      },
      red: {
        bg: isHovered ? 'bg-red-50' : 'bg-white',
        icon: isHovered ? 'text-red-600' : 'text-red-500',
        border: 'border-red-200',
        accent: 'bg-red-600'
      },
      indigo: {
        bg: isHovered ? 'bg-indigo-50' : 'bg-white',
        icon: isHovered ? 'text-indigo-600' : 'text-indigo-500',
        border: 'border-indigo-200',
        accent: 'bg-indigo-600'
      },
      cyan: {
        bg: isHovered ? 'bg-cyan-50' : 'bg-white',
        icon: isHovered ? 'text-cyan-600' : 'text-cyan-500',
        border: 'border-cyan-200',
        accent: 'bg-cyan-600'
      }
    };
    return colors[color as keyof typeof colors];
  };

  const getColorValue = (color: string): string => {
    const colors: {[key: string]: string} = {
      blue: '#2563eb',
      purple: '#9333ea',
      emerald: '#059669',
      amber: '#d97706',
      red: '#dc2626',
      indigo: '#4f46e5',
      cyan: '#0891b2',
    };
    return colors[color] || '#6b7280';
  };

  // Helper functions for chart rendering
  const renderLineChart = () => {
    const maxValue = Math.max(...growthData.map(d => d.value));
    const width = 600;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = growthData.map((d, i) => {
      const x = (chartWidth / (growthData.length - 1)) * i;
      const y = chartHeight - (d.value / maxValue) * chartHeight;
      return `${x + padding.left},${y + padding.top}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => {
          const y = padding.top + (chartHeight / 4) * i;
          const value = maxValue - (maxValue / 4) * i;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs fill-gray-500"
              >
                {Math.round(value).toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        <g>
          {growthData.map((d, i) => {
            const x = padding.left + (chartWidth / (growthData.length - 1)) * i;
            return (
              <text
                key={i}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600 font-medium"
              >
                {d.month}
              </text>
            );
          })}
        </g>

        {/* Line path */}
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          points={points}
        />

        {/* Data points */}
        {growthData.map((d, i) => {
          const x = padding.left + (chartWidth / (growthData.length - 1)) * i;
          const y = padding.top + chartHeight - (d.value / maxValue) * chartHeight;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#2563eb"
              />
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="#2563eb"
                opacity="0.2"
              />
            </g>
          );
        })}
      </svg>
    );
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...categoryData.map(d => d.value));
    const width = 600;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = (chartWidth / categoryData.length) * 0.7;
    const spacing = (chartWidth / categoryData.length) * 0.3;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => {
          const y = padding.top + (chartHeight / 4) * i;
          const value = maxValue - (maxValue / 4) * i;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs fill-gray-500"
              >
                {Math.round(value)}%
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {categoryData.map((d, i) => {
          const x = padding.left + i * (barWidth + spacing) + spacing / 2;
          const barHeight = (d.value / maxValue) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={getColorValue(d.color)}
                stroke="#fff"
                strokeWidth="2"
              />
              {/* Value label on bar */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs font-semibold fill-gray-900"
              >
                {d.value}%
              </text>
              {/* Category label */}
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 15}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-medium"
              >
                {d.label.length > 8 ? d.label.substring(0, 8) : d.label}
              </text>
            </g>
          );
        })}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#d1d5db"
          strokeWidth="2"
        />
      </svg>
    );
  };

  const renderDonutChart = () => {
    const total = donutData.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -90;

    const calculateAngle = (value: number, total: number) => (value / total) * 360;

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {donutData.map((d, i) => {
            const angle = calculateAngle(d.value, total);
            const largeArcFlag = angle > 180 ? 1 : 0;
            const radius = 70;
            const x1 = 100 + radius * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 100 + radius * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 100 + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 100 + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);

            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z',
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={i}
                d={pathData}
                fill={getColorValue(d.color)}
                stroke="#fff"
                strokeWidth="2"
                transform="rotate(0 100 100)"
              />
            );
          })}
          <circle cx="100" cy="100" r="50" fill="#fff" stroke="#e5e7eb" strokeWidth="2" />
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="text-3xl font-bold fill-gray-900"
          >
            {total}%
          </text>
          <text
            x="100"
            y="110"
            textAnchor="middle"
            className="text-xs fill-gray-600 font-medium"
          >
            Total
          </text>
        </svg>
      </div>
    );
  };

  return (
    <section
      className="w-full min-h-screen bg-gray-50 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 landscape:pl-20"
      aria-labelledby="success-cases-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className={`text-center mb-12 md:mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              Real Impact
            </span>
          </div>
          <h1
            id="success-cases-heading"
            className="text-4xl md:text-5xl lg:text-6xl landscape:text-3xl font-bold text-gray-900 mb-4 landscape:mb-2 tracking-tight"
          >
            Success Cases
          </h1>
          <p className="text-base md:text-lg landscape:text-sm text-gray-600 max-w-2xl mx-auto">
            Our achievements speak for themselves — measurable results across multiple platforms
          </p>
        </div>

        {/* Metrics Grid */}
        <ul className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 landscape:grid-cols-7 gap-4 md:gap-5 lg:gap-6 landscape:gap-2 mb-12 landscape:mb-6">
          {metrics.map((metric) => {
            const isHovered = hoveredId === metric.id;
            const colorClasses = getColorClasses(metric.color, isHovered);
            
            return (
              <li key={metric.id} className="list-none">
                <div 
                  className={`${colorClasses.bg} rounded-2xl landscape:rounded-lg border-2 ${colorClasses.border} p-6 md:p-7 landscape:p-3 transition-all duration-300 h-full flex flex-col items-center text-center cursor-pointer transform ${
                    isHovered ? 'scale-105 -translate-y-1' : 'scale-100'
                  } ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: metric.delay }}
                  onMouseEnter={() => setHoveredId(metric.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="article"
                  aria-label={`${metric.label}: ${metric.value}`}
                >
                  {/* Icon Container */}
                  <div className={`${colorClasses.icon} mb-4 landscape:mb-2 transition-all duration-300 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}>
                    {metric.icon}
                  </div>
                  
                  {/* Value */}
                  <p className="text-3xl md:text-4xl landscape:text-xl font-bold text-gray-900 mb-2 landscape:mb-1 transition-all duration-300">
                    {metric.value}
                  </p>
                  
                  {/* Label */}
                  <p className="text-xs md:text-sm landscape:text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                    {metric.label}
                  </p>

                  {/* Accent Bar */}
                  <div className={`mt-4 landscape:mt-2 h-1 landscape:h-0.5 w-12 landscape:w-8 ${colorClasses.accent} rounded-full transition-all duration-300 ${
                    isHovered ? 'w-full' : 'w-12 landscape:w-8'
                  }`}></div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Charts Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
            {/* Line Chart - Growth Trend */}
            <div 
              className={`bg-white border-2 border-gray-200 rounded-xl p-6 transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Growth Trend</h3>
                <p className="text-sm text-gray-600">User engagement over 6 months</p>
              </div>
              <div className="h-52 w-full">
                {renderLineChart()}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600"></div>
                    <span className="text-gray-700 font-medium">Active Growth</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-blue-600"></div>
                    <span className="text-gray-700 font-medium">Data Points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart - Category Distribution */}
            <div 
              className={`bg-white border-2 border-gray-200 rounded-xl p-6 transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '550ms' }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Category Distribution</h3>
                <p className="text-sm text-gray-600">Percentage breakdown by type</p>
              </div>
              <div className="h-80 w-full">
                {renderBarChart()}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {categoryData.map((item, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 shrink-0" 
                        style={{ backgroundColor: getColorValue(item.color) }}
                      ></div>
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Donut Chart with Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Donut Chart */}
            <div 
              className={`bg-white border-2 border-gray-200 rounded-xl p-6 transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">User Segmentation</h3>
                <p className="text-sm text-gray-600">Distribution of user types</p>
              </div>
              <div className="flex items-center justify-center min-h-[200px]">
                {renderDonutChart()}
              </div>
              <div className="mt-8 space-y-3">
                {donutData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 shrink-0" 
                        style={{ backgroundColor: getColorValue(item.color) }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <div 
              className={`bg-white border-2 border-gray-200 rounded-xl p-6 transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '650ms' }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 border-2 border-blue-200 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                    <p className="text-2xl font-bold text-gray-900">+42%</p>
                    <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 border-2 border-purple-200 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">5,000+</p>
                    <p className="text-xs text-gray-500 mt-1">Currently engaged</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Projects Completed</p>
                    <p className="text-2xl font-bold text-gray-900">17</p>
                    <p className="text-xs text-gray-500 mt-1">In production</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div 
          className={`mt-8 text-center transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <p className="text-sm text-gray-500">
            ✓ No backend connection • All metrics displayed statically with realistic placeholders
          </p>
        </div>
      </div>
    </section>
  );
}