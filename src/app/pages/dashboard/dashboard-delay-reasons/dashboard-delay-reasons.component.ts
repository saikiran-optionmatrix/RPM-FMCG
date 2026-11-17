import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';

// @ts-ignore
const ExportingModule: any = HC_exporting;
// @ts-ignore
const ExportDataModule: any = HC_exportData;

if (typeof ExportingModule === 'function') {
  ExportingModule(Highcharts);
} else if (ExportingModule && typeof ExportingModule.default === 'function') {
  ExportingModule.default(Highcharts);
}

if (typeof ExportDataModule === 'function') {
  ExportDataModule(Highcharts);
} else if (ExportDataModule && typeof ExportDataModule.default === 'function') {
  ExportDataModule.default(Highcharts);
}

export interface StageDelayReason {
  stageNumber: number;
  stageCode: string;
  stageName: string;
  topReason: string;
}

@Component({
  selector: 'app-dashboard-delay-reasons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard-delay-reasons.component.html',
  styleUrl: './dashboard-delay-reasons.component.scss',
})
export class DashboardDelayReasonsComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = [
    'All',
    'Beverages - BV',
    'Personal Care & Beauty - PC',
    'Packaged Foods & Snacks - FS',
    'Dairy & Nutrition - DN',
    'Home Care - HC'
  ];

  readonly locationsList: string[] = [
    'All',
    'Mumbai',
    'Bengaluru',
    'Delhi NCR',
    'Pune',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
    'Baddi'
  ];

  onApplyFilters(): void {
    setTimeout(() => {
      this.initAllCharts();
    }, 0);
  }

  private charts: Highcharts.Chart[] = [];

  // Top Delay Reason for each of the 12 FMCG Stages
  readonly topDelayReasonsByStage: StageDelayReason[] = [
    { stageNumber: 1, stageCode: 'S1', stageName: 'Consumer Need and Market Opportunity', topReason: 'Target & Market Feasibility Analysis Delay' },
    { stageNumber: 2, stageCode: 'S2', stageName: 'Market and Product Concept Validation', topReason: 'Charter Finalization Delay' },
    { stageNumber: 3, stageCode: 'S3', stageName: 'Product Ideation and Concept Screening', topReason: 'Product formulation, packaging substrate & food-grade ingredient shortage' },
    { stageNumber: 4, stageCode: 'S4', stageName: 'Product Formulation and Product Optimization', topReason: 'Ingredient Compatibility & Formulation Anomaly' },
    { stageNumber: 5, stageCode: 'S5', stageName: 'Product Concept and Formula Selection', topReason: 'Packaging Material & Substrate Rejection' },
    { stageNumber: 6, stageCode: 'S6', stageName: 'Product Formulation and Process Development', topReason: 'Pilot production batch formulation & yield variation' },
    { stageNumber: 7, stageCode: 'S7', stageName: 'Prototype Testing and Safety Assessment', topReason: 'Product efficacy and performance / safety test validation pending' },
    { stageNumber: 8, stageCode: 'S8', stageName: 'Product Concept Approval Filing', topReason: 'Finished consumer product release quality test failure' },
    { stageNumber: 9, stageCode: 'S9', stageName: 'Concept and Feasibility Validation', topReason: 'Product and Manufacturing Transfer Dossier Review Pending' },
    { stageNumber: 10, stageCode: 'S10', stageName: 'Pilot Production and Market Testing', topReason: 'Mixing, blending vessel & packaging line downtime' },
    { stageNumber: 11, stageCode: 'S11', stageName: 'Commercial Scale-Up and Launch Preparation', topReason: 'Consumer sensory & panel recruitment delay' },
    { stageNumber: 12, stageCode: 'S12', stageName: 'Regulatory Affairs & Commercial Product Launch', topReason: 'Regulatory Affairs & Compliance Query Response Delay (FSSAI / FDA)' },
  ];

  // Activities Delay Distribution Data (5 Stages + Others)
  readonly activitiesData = [
    { name: 'S1: Consumer Need & Opportunity', y: 20, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 16, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 28, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 22, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 18, color: '#f59e0b' },
    { name: 'Others', y: 54, color: '#94a3b8' },
  ];

  // Tasks Delay Distribution Data (5 Stages + Others)
  readonly tasksData = [
    { name: 'S1: Consumer Need & Opportunity', y: 18, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 15, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 25, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 20, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 22, color: '#f59e0b' },
    { name: 'Others', y: 48, color: '#94a3b8' },
  ];

  // Issues Delay Distribution Data (5 Stages + Others)
  readonly issuesData = [
    { name: 'S1: Consumer Need & Opportunity', y: 12, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 14, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 22, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 30, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 24, color: '#f59e0b' },
    { name: 'Others', y: 56, color: '#94a3b8' },
  ];

  // To-Do Delay Distribution Data (5 Stages + Others)
  readonly todoData = [
    { name: 'S1: Consumer Need & Opportunity', y: 22, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 26, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 20, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 16, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 24, color: '#f59e0b' },
    { name: 'Others', y: 50, color: '#94a3b8' },
  ];

  // Requirements Delay Distribution Data (5 Stages + Others)
  readonly requirementsData = [
    { name: 'S1: Consumer Need & Opportunity', y: 24, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 28, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 18, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 19, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 15, color: '#f59e0b' },
    { name: 'Others', y: 62, color: '#94a3b8' },
  ];

  private resizeHandler = () => {
    this.charts.forEach((chart) => {
      if (chart) {
        chart.reflow();
      }
    });
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initAllCharts();
      window.addEventListener('resize', this.resizeHandler);
    }, 100);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = [];
  }

  private initAllCharts(): void {
    this.charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = [];

    this.createDonutChart('activitiesDelayChartContainer', this.activitiesData);
    this.createDonutChart('tasksDelayChartContainer', this.tasksData);
    this.createDonutChart('issuesDelayChartContainer', this.issuesData);
    this.createDonutChart('todoDelayChartContainer', this.todoData);
    this.createDonutChart('requirementsDelayChartContainer', this.requirementsData);
  }

  private createDonutChart(containerId: string, seriesData: any[]): void {
    const el = document.getElementById(containerId);
    if (!el) return;

    const chart = Highcharts.chart(containerId, {
      chart: {
        type: 'pie',
        backgroundColor: '#ffffff',
        height: 250,
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: false },
      tooltip: {
        pointFormat: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
      },
      legend: {
        enabled: true,
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {
          fontSize: '11px',
          fontWeight: 'normal',
          color: '#334155',
        },
        itemMarginBottom: 4,
      },
      plotOptions: {
        pie: {
          innerSize: '0%',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.0f}%',
            distance: -20,
            style: {
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#ffffff',
              textOutline: 'none',
            },
          },
        },
      },
      series: [
        {
          name: 'Delays',
          type: 'pie',
          data: seriesData,
        },
      ],
    } as any);

    this.charts.push(chart);
  }
}
