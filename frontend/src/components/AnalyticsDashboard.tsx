import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  TrendingUp,
  FileText,
  Sparkles
} from 'lucide-react';
import { fetchDashboardStats, fetchRecentSessions, DashboardStatsData } from '../services/api';
import { ExamSession } from '../types';
import { useTheme } from '../utils/theme';

export const AnalyticsDashboard: React.FC = () => {
  const [theme] = useTheme();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [recentSessions, setRecentSessions] = useState<ExamSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Auto-refresh interval (0 = off, 30, 60, 300, 600)
  const [refreshInterval, setRefreshInterval] = useState<number>(() => {
    const saved = localStorage.getItem('nihongo_dashboard_refresh_interval');
    return saved ? parseInt(saved, 10) : 60; // default 1 min
  });
  const [countdown, setCountdown] = useState<number>(refreshInterval);

  // Persistent Chart Types from localStorage
  const [chart1Type, setChart1Type] = useState<'line' | 'bar' | 'step'>(() => {
    return (localStorage.getItem('nihongo_chart1_type') as any) || 'line';
  });
  const [chart1Labels, setChart1Labels] = useState<boolean>(() => {
    return localStorage.getItem('nihongo_chart1_labels') === 'true';
  });

  const [chart2Type, setChart2Type] = useState<'radar' | 'bar' | 'polar'>(() => {
    return (localStorage.getItem('nihongo_chart2_type') as any) || 'radar';
  });
  const [chart2Labels, setChart2Labels] = useState<boolean>(() => {
    return localStorage.getItem('nihongo_chart2_labels') === 'true';
  });

  const [chart3Type, setChart3Type] = useState<'horizontal_bar' | 'vertical_bar' | 'line'>(() => {
    return (localStorage.getItem('nihongo_chart3_type') as any) || 'horizontal_bar';
  });
  const [chart3Labels, setChart3Labels] = useState<boolean>(() => {
    return localStorage.getItem('nihongo_chart3_labels') === 'true';
  });

  const [chart4Type, setChart4Type] = useState<'donut' | 'pie' | 'rose'>(() => {
    return (localStorage.getItem('nihongo_chart4_type') as any) || 'donut';
  });
  const [chart4Labels, setChart4Labels] = useState<boolean>(() => {
    return localStorage.getItem('nihongo_chart4_labels') !== 'false'; // default true
  });

  const [chart5Type, setChart5Type] = useState<'area' | 'bar' | 'scatter'>(() => {
    return (localStorage.getItem('nihongo_chart5_type') as any) || 'area';
  });
  const [chart5Labels, setChart5Labels] = useState<boolean>(() => {
    return localStorage.getItem('nihongo_chart5_labels') === 'true';
  });

  // Save Preferences to LocalStorage
  useEffect(() => {
    localStorage.setItem('nihongo_dashboard_refresh_interval', refreshInterval.toString());
  }, [refreshInterval]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart1_type', chart1Type);
  }, [chart1Type]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart1_labels', chart1Labels.toString());
  }, [chart1Labels]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart2_type', chart2Type);
  }, [chart2Type]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart2_labels', chart2Labels.toString());
  }, [chart2Labels]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart3_type', chart3Type);
  }, [chart3Type]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart3_labels', chart3Labels.toString());
  }, [chart3Labels]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart4_type', chart4Type);
  }, [chart4Type]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart4_labels', chart4Labels.toString());
  }, [chart4Labels]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart5_type', chart5Type);
  }, [chart5Type]);

  useEffect(() => {
    localStorage.setItem('nihongo_chart5_labels', chart5Labels.toString());
  }, [chart5Labels]);

  // Load Data function
  const loadData = useCallback(async (isManual = false) => {
    setIsLoading(true);
    try {
      const [statsData, sessionsData] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentSessions(),
      ]);
      setStats(statsData);
      setRecentSessions(sessionsData);
      setLastUpdated(new Date());
      if (isManual) {
        setCountdown(refreshInterval);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshInterval]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Timer Countdown and Auto-Refresh Interval
  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (refreshInterval <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setCountdown(refreshInterval);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadData();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refreshInterval, loadData]);

  // --------------------------------------------------------------------------
  // THEME-AWARE CHART TOKENS
  // --------------------------------------------------------------------------
  const chartTheme = {
    textColor: isDark ? '#94a3b8' : '#64748b',
    textMain: isDark ? '#f8fafc' : '#0f172a',
    axisLineColor: isDark ? '#334155' : '#cbd5e1',
    splitLineColor: isDark ? '#1e293b' : '#f1f5f9',
    tooltipBg: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.96)',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
    tooltipText: isDark ? '#f8fafc' : '#0f172a',
    pieBorderColor: isDark ? '#111827' : '#ffffff',
    radarArea1: isDark ? '#111827' : '#ffffff',
    radarArea2: isDark ? '#162032' : '#f8fafc',
    radarSplitLine: isDark ? '#334155' : '#e2e8f0',
    radarAxisName: isDark ? '#94a3b8' : '#475569',
  };

  // --------------------------------------------------------------------------
  // CHART CONFIGURATIONS (Apache ECharts)
  // --------------------------------------------------------------------------

  // Chart 1: Examination Score Progression & Trends
  const getChart1Option = () => {
    if (!stats || !stats.scoreTrends.length) return {};

    const categories = stats.scoreTrends.map((s) => `รอบ ${s.sessionNumber}`);
    const totalScores = stats.scoreTrends.map((s) => s.totalScore);
    const sec1Scores = stats.scoreTrends.map((s) => s.scoreSec1);
    const sec2Scores = stats.scoreTrends.map((s) => s.scoreSec2);
    const sec3Scores = stats.scoreTrends.map((s) => s.scoreSec3);

    const isStep = chart1Type === 'step';
    const isBar = chart1Type === 'bar';

    return {
      title: { text: '', subtext: '' },
      tooltip: {
        trigger: 'axis',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText, fontSize: 12 },
        formatter: (params: any) => {
          let html = `<div style="font-weight:700;margin-bottom:4px;color:${chartTheme.tooltipText}">${params[0]?.axisValue}</div>`;
          params.forEach((p: any) => {
            html += `<div style="display:flex;align-items:center;gap:6px;font-size:12px;margin:2px 0;color:${chartTheme.tooltipText}">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${p.color};"></span>
              <span>${p.seriesName}: <strong>${p.value}</strong></span>
            </div>`;
          });
          return html;
        },
      },
      legend: {
        data: ['คะแนนรวม (/15)', 'ส่วนที่ 1: แนะนำตัว (/5)', 'ส่วนที่ 2: แปลศัพท์ (/5)', 'ส่วนที่ 3: ตอบภาพ (/5)'],
        top: 0,
        textStyle: { fontSize: 11, color: chartTheme.textColor },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '40px', containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.textColor, fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        max: 15,
        splitLine: { lineStyle: { type: 'dashed', color: chartTheme.splitLineColor } },
        axisLabel: { color: chartTheme.textColor, fontSize: 11 },
      },
      series: [
        {
          name: 'คะแนนรวม (/15)',
          type: isBar ? 'bar' : 'line',
          step: isStep ? 'middle' : false,
          smooth: true,
          data: totalScores,
          itemStyle: { color: '#0284c7' },
          lineStyle: { width: 3 },
          areaStyle: isBar ? undefined : { color: 'rgba(2, 132, 199, 0.15)' },
          label: { show: chart1Labels, position: 'top', color: '#0284c7', fontWeight: 700 },
          markLine: {
            silent: true,
            data: [{ yAxis: 12, name: 'เกณฑ์ผ่าน (12)', lineStyle: { color: '#16a34a', type: 'dashed' } }],
          },
        },
        {
          name: 'ส่วนที่ 1: แนะนำตัว (/5)',
          type: isBar ? 'bar' : 'line',
          step: isStep ? 'middle' : false,
          smooth: true,
          data: sec1Scores,
          itemStyle: { color: '#8b5cf6' },
          label: { show: chart1Labels, position: 'top', fontSize: 10 },
        },
        {
          name: 'ส่วนที่ 2: แปลศัพท์ (/5)',
          type: isBar ? 'bar' : 'line',
          step: isStep ? 'middle' : false,
          smooth: true,
          data: sec2Scores,
          itemStyle: { color: '#f59e0b' },
          label: { show: chart1Labels, position: 'top', fontSize: 10 },
        },
        {
          name: 'ส่วนที่ 3: ตอบภาพ (/5)',
          type: isBar ? 'bar' : 'line',
          step: isStep ? 'middle' : false,
          smooth: true,
          data: sec3Scores,
          itemStyle: { color: '#10b981' },
          label: { show: chart1Labels, position: 'top', fontSize: 10 },
        },
      ],
    };
  };

  // Chart 2: Section 1, 2, 3 Mastery & Competency Radar
  const getChart2Option = () => {
    if (!stats) return {};

    if (chart2Type === 'bar') {
      return {
        tooltip: {
          trigger: 'axis',
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText },
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '20px', containLabel: true },
        xAxis: {
          type: 'category',
          data: ['ส่วนที่ 1 (Jiko)', 'ส่วนที่ 2 (Speed)', 'ส่วนที่ 3 (Visual)'],
          axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
          axisLabel: { color: chartTheme.textColor, fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          max: 5,
          splitLine: { lineStyle: { type: 'dashed', color: chartTheme.splitLineColor } },
          axisLabel: { color: chartTheme.textColor, fontSize: 11 },
        },
        series: [
          {
            name: 'คะแนนเฉลี่ย',
            type: 'bar',
            data: [stats.avgSection1, stats.avgSection2, stats.avgSection3],
            itemStyle: {
              color: (params: any) => {
                const colors = ['#8b5cf6', '#f59e0b', '#10b981'];
                return colors[params.dataIndex % colors.length];
              },
              borderRadius: [4, 4, 0, 0],
            },
            label: { show: chart2Labels, position: 'top', fontWeight: 700, color: chartTheme.textMain },
          },
        ],
      };
    }

    if (chart2Type === 'polar') {
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText },
        },
        polar: { radius: [20, '75%'] },
        angleAxis: { max: 5, startAngle: 75, splitLine: { lineStyle: { color: chartTheme.splitLineColor } } },
        radiusAxis: {
          type: 'category',
          data: ['ส่วนที่ 1 (Jiko)', 'ส่วนที่ 2 (Speed)', 'ส่วนที่ 3 (Visual)'],
          axisLabel: { color: chartTheme.textColor, fontSize: 10 },
        },
        series: {
          type: 'bar',
          data: [
            { value: stats.avgSection1, itemStyle: { color: '#8b5cf6' } },
            { value: stats.avgSection2, itemStyle: { color: '#f59e0b' } },
            { value: stats.avgSection3, itemStyle: { color: '#10b981' } },
          ],
          coordinateSystem: 'polar',
          label: { show: chart2Labels, position: 'middle', formatter: '{c} / 5' },
        },
      };
    }

    // Default: Radar Chart
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      radar: {
        indicator: [
          { name: 'ส่วนที่ 1: แนะนำตนเอง (Jiko Shōkai)', max: 5 },
          { name: 'ส่วนที่ 2: แปลศัพท์ไทย-ญี่ปุ่น (Speed Flash)', max: 5 },
          { name: 'ส่วนที่ 3: ตอบคำถามจากภาพ (Visual Q&A)', max: 5 },
        ],
        shape: 'polygon',
        splitNumber: 5,
        axisName: { color: chartTheme.radarAxisName, fontSize: 11, fontWeight: 600 },
        splitLine: { lineStyle: { color: chartTheme.radarSplitLine } },
        splitArea: { show: true, areaStyle: { color: [chartTheme.radarArea1, chartTheme.radarArea2] } },
      },
      series: [
        {
          name: 'สมรรถนะเฉลี่ย (คะแนนเต็ม 5)',
          type: 'radar',
          data: [
            {
              value: [stats.avgSection1, stats.avgSection2, stats.avgSection3],
              name: 'ระดับคะแนนเฉลี่ยปัจจุบัน',
              areaStyle: { color: 'rgba(2, 132, 199, 0.3)' },
              lineStyle: { color: '#0284c7', width: 2 },
              itemStyle: { color: '#0284c7' },
              label: { show: chart2Labels, formatter: (p: any) => p.value, color: '#0284c7', fontWeight: 700 },
            },
          ],
        },
      ],
    };
  };

  // Chart 3: Question Category Accuracy & Error Distribution
  const getChart3Option = () => {
    if (!stats) return {};

    const categories = stats.categoryAccuracy.map((c) => c.category);
    const accuracies = stats.categoryAccuracy.map((c) => c.accuracy);

    if (chart3Type === 'line') {
      return {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}%',
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText },
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '20px', containLabel: true },
        xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: chartTheme.axisLineColor } }, axisLabel: { interval: 0, rotate: 20, fontSize: 10, color: chartTheme.textColor } },
        yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: chartTheme.textColor }, splitLine: { lineStyle: { type: 'dashed', color: chartTheme.splitLineColor } } },
        series: [
          {
            type: 'line',
            data: accuracies,
            smooth: true,
            itemStyle: { color: '#10b981' },
            lineStyle: { width: 3 },
            areaStyle: { color: 'rgba(16, 185, 129, 0.15)' },
            label: { show: chart3Labels, position: 'top', formatter: '{c}%', fontWeight: 700, color: '#10b981' },
          },
        ],
      };
    }

    if (chart3Type === 'vertical_bar') {
      return {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}%',
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText },
        },
        grid: { left: '3%', right: '4%', bottom: '15%', top: '20px', containLabel: true },
        xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: chartTheme.axisLineColor } }, axisLabel: { interval: 0, rotate: 25, fontSize: 10, color: chartTheme.textColor } },
        yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: chartTheme.textColor }, splitLine: { lineStyle: { type: 'dashed', color: chartTheme.splitLineColor } } },
        series: [
          {
            type: 'bar',
            data: accuracies,
            itemStyle: {
              color: '#0284c7',
              borderRadius: [4, 4, 0, 0],
            },
            label: { show: chart3Labels, position: 'top', formatter: '{c}%', fontWeight: 700, color: chartTheme.textMain },
          },
        ],
      };
    }

    // Default: Horizontal Bar
    return {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: <strong>{c}%</strong>',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      grid: { left: '3%', right: '8%', bottom: '3%', top: '10px', containLabel: true },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: { formatter: '{value}%', color: chartTheme.textColor, fontSize: 10 },
        splitLine: { lineStyle: { type: 'dashed', color: chartTheme.splitLineColor } },
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.textColor, fontSize: 11 },
        inverse: true,
      },
      series: [
        {
          name: 'ความแม่นยำ (%)',
          type: 'bar',
          data: accuracies,
          itemStyle: {
            color: (params: any) => {
              const val = params.value;
              if (val >= 90) return '#16a34a';
              if (val >= 80) return '#0284c7';
              return '#f59e0b';
            },
            borderRadius: [0, 4, 4, 0],
          },
          label: { show: chart3Labels, position: 'right', formatter: '{c}%', fontWeight: 700, fontSize: 11, color: chartTheme.textMain },
        },
      ],
    };
  };

  // Chart 4: Pass / Fail & Mastery Grade Distribution
  const getChart4Option = () => {
    if (!stats) return {};

    const isRose = chart4Type === 'rose';
    const isDonut = chart4Type === 'donut';

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: <strong>{c} ครั้ง ({d}%)</strong>',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      legend: {
        bottom: '0%',
        left: 'center',
        textStyle: { fontSize: 11, color: chartTheme.textColor },
      },
      series: [
        {
          name: 'ผลการประเมิน',
          type: 'pie',
          radius: isDonut ? ['45%', '70%'] : isRose ? ['20%', '75%'] : '70%',
          roseType: isRose ? 'radius' : false,
          center: ['50%', '42%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: chartTheme.pieBorderColor,
            borderWidth: 2,
          },
          label: {
            show: chart4Labels,
            formatter: '{b}\n{d}%',
            fontSize: 10,
            color: chartTheme.textMain,
          },
          data: stats.passFailBreakdown.map((item) => ({
            value: item.value,
            name: item.name,
            itemStyle: { color: item.color },
          })),
        },
      ],
    };
  };

  // Chart 5: Exam Duration vs 180s Benchmark
  const getChart5Option = () => {
    if (!stats || !stats.scoreTrends.length) return {};

    const categories = stats.scoreTrends.map((s) => `รอบ ${s.sessionNumber}`);
    const durations = stats.scoreTrends.map((s) => s.duration);

    if (chart5Type === 'bar') {
      return {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c} วินาที',
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText },
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '25px', containLabel: true },
        xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: chartTheme.axisLineColor } }, axisLabel: { color: chartTheme.textColor, fontSize: 11 } },
        yAxis: { type: 'value', max: 180, axisLabel: { formatter: '{value}s', color: chartTheme.textColor }, splitLine: { lineStyle: { type: 'dashed', color: chartTheme.splitLineColor } } },
        series: [
          {
            type: 'bar',
            data: durations,
            itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] },
            label: { show: chart5Labels, position: 'top', formatter: '{c}s', fontWeight: 700, color: chartTheme.textMain },
            markLine: {
              data: [{ yAxis: 180, name: 'จำกัดเวลา 180s', lineStyle: { color: '#dc2626', type: 'dashed' } }],
            },
          },
        ],
      };
    }

    if (chart5Type === 'scatter') {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} วินาที',
          backgroundColor: chartTheme.tooltipBg,
          borderColor: chartTheme.tooltipBorder,
          textStyle: { color: chartTheme.tooltipText },
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '25px', containLabel: true },
        xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: chartTheme.axisLineColor } }, axisLabel: { color: chartTheme.textColor, fontSize: 11 } },
        yAxis: { type: 'value', max: 180, axisLabel: { formatter: '{value}s', color: chartTheme.textColor }, splitLine: { lineStyle: { type: 'dashed', color: chartTheme.splitLineColor } } },
        series: [
          {
            type: 'scatter',
            symbolSize: 14,
            data: durations,
            itemStyle: { color: '#8b5cf6' },
            label: { show: chart5Labels, position: 'top', formatter: '{c}s', fontWeight: 700, color: chartTheme.textMain },
            markLine: {
              data: [{ yAxis: 180, name: 'จำกัดเวลา 180s', lineStyle: { color: '#dc2626', type: 'dashed' } }],
            },
          },
        ],
      };
    }

    // Default: Area Chart
    return {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: <strong>{c} วินาที</strong>',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '25px', containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.textColor, fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        max: 180,
        axisLabel: { formatter: '{value}s', color: chartTheme.textColor, fontSize: 11 },
        splitLine: { lineStyle: { type: 'dashed', color: chartTheme.splitLineColor } },
      },
      series: [
        {
          name: 'เวลาที่ใช้ (วินาที)',
          type: 'line',
          smooth: true,
          data: durations,
          itemStyle: { color: '#ea580c' },
          lineStyle: { width: 3 },
          areaStyle: {
            color: 'rgba(234, 88, 12, 0.15)',
          },
          label: { show: chart5Labels, position: 'top', formatter: '{c}s', fontWeight: 700, color: '#ea580c' },
          markLine: {
            silent: true,
            data: [{ yAxis: 180, name: 'จำกัดเวลา (180s)', lineStyle: { color: '#dc2626', type: 'dashed' } }],
          },
        },
      ],
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Real-time Auto-refresh Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">ระบบรายงานและสถิติภาพรวม</span>
            <span className="badge badge-ref">PostgreSQL & Local Persistent Sync</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
            Analytics & Examination Performance Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            วิเคราะห์แนวโน้มคะแนนสอบรายส่วน ความแม่นยำตามหมวดคำศัพท์ และประวัติการฝึกซ้อมแบบเรียลไทม์
          </p>
        </div>

        {/* Refresh Controller */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>รีเฟรชอัตโนมัติ:</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value, 10))}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <option value={0}>ปิด (Manual)</option>
              <option value={30}>ทุก 30 วินาที</option>
              <option value={60}>ทุก 1 นาที</option>
              <option value={300}>ทุก 5 นาที</option>
              <option value={600}>ทุก 10 นาที</option>
            </select>
          </div>

          {refreshInterval > 0 && (
            <span style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: 700 }}>
              (อีก {countdown}s)
            </span>
          )}

          <button
            onClick={() => loadData(true)}
            className="btn-primary"
            style={{ padding: '7px 14px', fontSize: '12px' }}
            title="รีเฟรชข้อมูลเดี๋ยวนี้"
          >
            <RotateCcw size={14} className={isLoading ? 'animate-spin' : ''} />
            รีเฟรชข้อมูล
          </button>
        </div>
      </div>

      {/* KPI Top Metrics Strip */}
      {stats && (
        <div className="kpi-metrics-grid">
          {/* KPI 1 */}
          <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>จำนวนรอบที่สอบทั้งหมด</span>
              <FileText size={16} color="var(--primary-600)" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              {stats.totalAttempts} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>รอบ</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>คะแนนรวมเฉลี่ย</span>
              <Award size={16} color="#0284c7" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
              {stats.avgTotalScore} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>/ 15 คะแนน</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>อัตราการผ่านเกณฑ์ (≥12)</span>
              <TrendingUp size={16} color="var(--success-600)" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: stats.passRate >= 75 ? 'var(--success-600)' : 'var(--warning-600)', marginTop: '4px' }}>
              {stats.passRate}% <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>({stats.passCount} รอบ)</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>เวลาเฉลี่ยที่ใช้</span>
              <Clock size={16} color="var(--warning-600)" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              {stats.avgDurationSeconds}s <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>/ 180s</span>
            </div>
          </div>

          {/* KPI 5 */}
          <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ทำคะแนนเต็ม (15/15)</span>
              <Sparkles size={16} color="#8b5cf6" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>
              {stats.perfectCount} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>ครั้ง</span>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Charts Grid */}
      <div className="analytics-charts-grid">
        {/* CHART 1: Historical Score Progression */}
        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>แนวโน้มคะแนนสอบสะสม (Score Progression)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>เปรียบเทียบคะแนนรวมและคะแนนย่อย 3 ส่วนตามลำดับรอบที่สอบ</p>
            </div>

            {/* Customizer Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setChart1Labels(!chart1Labels)}
                className={chart1Labels ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '4px 8px', fontSize: '11px' }}
                title="เปิด/ปิดป้ายกำกับตัวเลขบนกราฟ"
              >
                Labels: {chart1Labels ? 'ON' : 'OFF'}
              </button>

              <select
                value={chart1Type}
                onChange={(e) => setChart1Type(e.target.value as any)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <option value="line">Line (เส้นโค้งเรียบ)</option>
                <option value="bar">Bar (แท่งเปรียบเทียบ)</option>
                <option value="step">Step (ขั้นบันได)</option>
              </select>
            </div>
          </div>

          <div style={{ height: '300px' }}>
            <ReactECharts option={getChart1Option()} style={{ height: '100%', width: '100%' }} notMerge={true} />
          </div>
        </div>

        {/* CHART 2: Section 1, 2, 3 Competency Radar */}
        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>ระดับสมรรถนะรายทักษะ (Section Competency)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>วิเคราะห์ความพร้อมในแต่ละส่วน (คะแนนเต็มส่วนละ 5 คะแนน)</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setChart2Labels(!chart2Labels)}
                className={chart2Labels ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                Labels: {chart2Labels ? 'ON' : 'OFF'}
              </button>

              <select
                value={chart2Type}
                onChange={(e) => setChart2Type(e.target.value as any)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <option value="radar">Radar (ใยแมงมุม)</option>
                <option value="bar">Bar (แท่งคะแนนเฉลี่ย)</option>
                <option value="polar">Polar (พิกัดเชิงขั้ว)</option>
              </select>
            </div>
          </div>

          <div style={{ height: '300px' }}>
            <ReactECharts option={getChart2Option()} style={{ height: '100%', width: '100%' }} notMerge={true} />
          </div>
        </div>

        {/* CHART 3: Category Accuracy Breakdown */}
        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>ความแม่นยำตามหมวดเนื้อหา (Category Accuracy)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>เปอร์เซ็นต์ความถูกต้องของคำศัพท์และไวยากรณ์แต่ละกลุ่ม</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setChart3Labels(!chart3Labels)}
                className={chart3Labels ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                Labels: {chart3Labels ? 'ON' : 'OFF'}
              </button>

              <select
                value={chart3Type}
                onChange={(e) => setChart3Type(e.target.value as any)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <option value="horizontal_bar">แนวนอน (Horizontal Bar)</option>
                <option value="vertical_bar">แนวตั้ง (Vertical Bar)</option>
                <option value="line">Profile (Line Trend)</option>
              </select>
            </div>
          </div>

          <div style={{ height: '300px' }}>
            <ReactECharts option={getChart3Option()} style={{ height: '100%', width: '100%' }} notMerge={true} />
          </div>
        </div>

        {/* CHART 4: Pass / Fail Grade Breakdown */}
        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>สัดส่วนระดับผลการสอบ (Grade Distribution)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>การกระจายตัวของรอบที่ผ่านเกณฑ์ดีเยี่ยมและรอบที่ต้องปรับปรุง</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setChart4Labels(!chart4Labels)}
                className={chart4Labels ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                Labels: {chart4Labels ? 'ON' : 'OFF'}
              </button>

              <select
                value={chart4Type}
                onChange={(e) => setChart4Type(e.target.value as any)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <option value="donut">Donut (วงแหวน)</option>
                <option value="pie">Pie (วงกลมทึบ)</option>
                <option value="rose">Nightingale Rose</option>
              </select>
            </div>
          </div>

          <div style={{ height: '300px' }}>
            <ReactECharts option={getChart4Option()} style={{ height: '100%', width: '100%' }} notMerge={true} />
          </div>
        </div>

        {/* CHART 5: Time Consumption Progression vs 180s Benchmark */}
        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>ระยะเวลาที่ใช้ในการสอบ (Duration vs 180s Benchmark)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ตรวจสอบความเร็วในการทำข้อสอบเทียบกับเกณฑ์จำกัดเวลา 3 นาที (180 วินาที)</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setChart5Labels(!chart5Labels)}
                className={chart5Labels ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                Labels: {chart5Labels ? 'ON' : 'OFF'}
              </button>

              <select
                value={chart5Type}
                onChange={(e) => setChart5Type(e.target.value as any)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <option value="area">Area (พื้นที่ไล่ระดับ)</option>
                <option value="bar">Bar (แท่งวินาที)</option>
                <option value="scatter">Scatter (จุดกระจาย)</option>
              </select>
            </div>
          </div>

          <div style={{ height: '260px' }}>
            <ReactECharts option={getChart5Option()} style={{ height: '100%', width: '100%' }} notMerge={true} />
          </div>
        </div>
      </div>

      {/* Session History Table */}
      <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>บันทึกประวัติการสอบล่าสุด (Exam Sessions Log)</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              ข้อมูลที่บันทึกถาวรลงในฐานข้อมูลและ Local Storage อัปเดตล่าสุด: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <span className="badge badge-primary">บันทึกทั้งหมด {recentSessions.length} รายการ</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 14px' }}>ลำดับ</th>
                <th style={{ padding: '10px 14px' }}>ผู้สอบ</th>
                <th style={{ padding: '10px 14px' }}>เวลาที่ใช้</th>
                <th style={{ padding: '10px 14px' }}>ส่วนที่ 1</th>
                <th style={{ padding: '10px 14px' }}>ส่วนที่ 2</th>
                <th style={{ padding: '10px 14px' }}>ส่วนที่ 3</th>
                <th style={{ padding: '10px 14px' }}>คะแนนรวม</th>
                <th style={{ padding: '10px 14px' }}>สถานะผลสอบ</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    ยังไม่มีประวัติการสอบ กดเข้าสู่โหมด "สอบจริง (3 นาที)" เพื่อเริ่มทดสอบและบันทึกคะแนน
                  </td>
                </tr>
              ) : (
                recentSessions.slice(0, 15).map((s, idx) => {
                  const passed = (s.total_score || 0) >= 12;
                  return (
                    <tr key={s.id || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-main)' }}>#{idx + 1}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)' }}>{s.student_name || 'Poom'}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{s.total_duration_seconds} วินาที</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)' }}>{s.score_section_1} / 5</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)' }}>{s.score_section_2} / 5</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)' }}>{s.score_section_3} / 5</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: passed ? 'var(--success-600)' : 'var(--danger-600)' }}>
                        {s.total_score} / 15
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {passed ? (
                          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> ผ่านเกณฑ์ (≥12)
                          </span>
                        ) : (
                          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} /> ต้องฝึกเพิ่ม
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
