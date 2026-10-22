import loadFile from '@unctad-infovis/general-tools/helpers/LoadFile.js';
import useIsVisible from '@unctad-infovis/general-tools/helpers/UseIsVisible.js';
import Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import 'highcharts/modules/treemap';
import { useEffect, useRef, useState } from 'react';

import ChartHeader from './ChartHeader.jsx';
import ChartMeta from './ChartMeta.jsx';

import './ChartExportStructure.css';

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ' '
  }
});

const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getColors = () => {
  const v = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return [v('--un-color-yellow'), v('--un-color-blue')];
};

// WCAG relative luminance / contrast ratio, used to pick readable dataLabel
// text colour per treemap cell instead of trusting Highcharts' own
// brightness heuristic (which defaulted to black in several cells that
// read better in white).
function relativeLuminance(hex) {
  const rgb = Highcharts.color(hex).rgba;
  const [r, g, b] = rgb.slice(0, 3).map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexA);
  const lB = relativeLuminance(hexB);
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

// Prefers white text, only falling back to black when white wouldn't meet
// WCAG AA (4.5:1) against the cell's actual fill colour.
function pickTextColor(bgHex) {
  return contrastRatio('#ffffff', bgHex) >= 4.5 ? '#fff' : '#000';
}

export default function ChartExportStructure({ title, subtitle, insight, source, note }) {
  const [config, setConfig] = useState(null);
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [visRef, isVisible] = useIsVisible(0.15);

  useEffect(() => {
    loadFile('assets/data/exp_struct.json')
      .then(r => r?.json())
      .then(data => data && setConfig(data));
  }, []);

  useEffect(() => {
    if (!isVisible || !config || !containerRef.current || chartRef.current) return;

    const [level1, level2] = config.series[0].levels;

    chartRef.current = Highcharts.chart(containerRef.current, {
      chart: {
        animation: !REDUCED_MOTION,
        backgroundColor: 'transparent',
        events: {
          render() {
            for (const point of this.series[0].points) {
              if (point.dataLabel && point.color) {
                point.dataLabel.css({ color: pickTextColor(point.color) });
              }
            }
          }
        },
        height: config.chart?.height ?? 440,
        marginTop: config.chart?.marginTop ?? 10,
        // Zero out Highcharts' own default spacing ([10, 10, 15, 10]) – the
        // card already has its own CSS padding, so the two stacked left an
        // unwanted inset between the SVG edge and the treemap cells.
        spacing: [0, 0, 0, 0],
        style: { fontFamily: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif' }
      },
      colors: getColors(),
      credits: { enabled: false },
      exporting: { enabled: false },
      legend: { enabled: false },
      series: [
        {
          allowTraversingTree: true,
          borderColor: '#fff',
          borderWidth: 1,
          cursor: 'pointer',
          data: config.series[0].data,
          interactByLeaf: true,
          levelIsConstant: true,
          name: 'Show all',
          levels: [
            {
              ...level1,
              dataLabels: {
                align: level1.dataLabels.align,
                enabled: true,
                formatter() {
                  return `<b>${this.point.name}</b><br/>$${Highcharts.numberFormat(this.point.value, 0)} billion`;
                },
                style: level1.dataLabels.style,
                verticalAlign: level1.dataLabels.verticalAlign
              }
            },
            {
              ...level2,
              dataLabels: {
                enabled: true,
                style: level2.dataLabels.style
              }
            }
          ],
          type: 'treemap'
        }
      ],
      subtitle: { text: null },
      title: { text: null },
      tooltip: {
        headerFormat: '',
        pointFormatter() {
          return `<b>${this.name}</b><br/>$${Highcharts.numberFormat(this.value, 1)} billion`;
        }
      }
    });
  }, [isVisible, config]);

  useEffect(
    () => () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    },
    []
  );

  return (
    <div className="nps_treemap_wrap" ref={visRef}>
      <ChartHeader title={title} subtitle={subtitle} description={insight} large />
      {/* highcharts-light pins color-scheme: light on the chart container – without it
          Highcharts v13 auto-adapts to the visitor's OS dark-mode preference, which
          washes out breadcrumb/label text (fill: var(--highcharts-neutral-color-*))
          against this always-light card background. */}
      <div className="highcharts-light" ref={containerRef} />
      <ChartMeta source={source} note={note} />
    </div>
  );
}
