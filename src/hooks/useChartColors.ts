import { useEffect, useState } from 'react';

interface ChartColors {
  gridStroke: string;
  axisTickFill: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipColor: string;
  legendColor: string;
  incomeFill: string;
  expenseFill: string;
  pieColors: string[];
}

export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>({
    gridStroke: '#E2E8F0',
    axisTickFill: '#64748B',
    tooltipBg: '#FFFFFF',
    tooltipBorder: '#E2E8F0',
    tooltipColor: '#172554',
    legendColor: '#172554',
    incomeFill: '#16A34A',
    expenseFill: '#DC2626',
    pieColors: ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#9333EA', '#06B6D4', '#EC4899', '#84CC16', '#64748B'],
  });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      
      const getVar = (name: string, fallback: string) => {
        const val = style.getPropertyValue(name).trim();
        return val || fallback;
      };

      const isDark = root.classList.contains('dark');

      setColors({
        gridStroke: getVar('--finora-border', isDark ? '#1E2A3E' : '#E2E8F0'),
        axisTickFill: getVar('--finora-text-secondary', isDark ? '#94A3B8' : '#64748B'),
        tooltipBg: getVar('--finora-bg-secondary', isDark ? '#111928' : '#FFFFFF'),
        tooltipBorder: getVar('--finora-border', isDark ? '#1E2A3E' : '#E2E8F0'),
        tooltipColor: getVar('--finora-text-primary', isDark ? '#F1F5F9' : '#172554'),
        legendColor: getVar('--finora-text-primary', isDark ? '#F1F5F9' : '#172554'),
        incomeFill: getVar('--finora-green', isDark ? '#22C55E' : '#16A34A'),
        expenseFill: getVar('--finora-red', isDark ? '#EF4444' : '#DC2626'),
        pieColors: [
          getVar('--finora-primary', isDark ? '#3B82F6' : '#2563EB'),
          getVar('--finora-green', isDark ? '#22C55E' : '#16A34A'),
          getVar('--finora-orange', isDark ? '#FBBF24' : '#F59E0B'),
          getVar('--finora-red', isDark ? '#EF4444' : '#DC2626'),
          getVar('--finora-purple', isDark ? '#A855F7' : '#9333EA'),
          getVar('--finora-cyan', isDark ? '#22D3EE' : '#06B6D4'),
          getVar('--finora-pink', isDark ? '#F472B6' : '#EC4899'),
          getVar('--finora-lime', isDark ? '#A3E635' : '#84CC16'),
          getVar('--finora-text-secondary', isDark ? '#94A3B8' : '#64748B'),
        ],
      });
    };

    updateColors();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateColors();
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return colors;
}