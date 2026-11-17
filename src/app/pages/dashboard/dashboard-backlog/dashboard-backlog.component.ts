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

export interface ActivityBacklog {
  activityName: string;
  backlogCount: number;
}

export interface StageBacklogSummary {
  stage: string;
  stageCode?: string;
  stageName?: string;
  act: number;
  task: number;
  iss: number;
  todo: number;
  req: number;
}

@Component({
  selector: 'app-dashboard-backlog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard-backlog.component.html',
  styleUrl: './dashboard-backlog.component.scss',
})
export class DashboardBacklogComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectedActivity: string = 'All';
  public selectedYear: number | string = 'All';
  public selectedMonth: number = new Date().getMonth() + 1;
  public selectedDivision: string = 'All';
  public selectedLocation: string = 'All';

  public readonly divisionsList: string[] = [
    'All',
    'Beverages - BV',
    'Personal Care & Beauty - PC',
    'Packaged Foods & Snacks - FS',
    'Dairy & Nutrition - DN',
    'Home Care - HC'
  ];

  public readonly locationsList: string[] = [
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

  public readonly activitiesFilterList = [
    'All',
    'Activities',
    'Tasks',
    'Issues',
    'Todo',
    'Requirements',
  ];

  public readonly availableYears: (number | string)[] = ['All', 2026, 2025, 2024];

  public readonly monthsList = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  public readonly monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  public readonly daysList = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  private readonly yearlyBacklogData: Record<number, number[]> = {
    2026: [12, 15, 18, 22, 20, 25, 23, 28, 19, 24, 16, 14],
    2025: [14, 16, 19, 21, 24, 26, 25, 22, 20, 18, 15, 13],
    2024: [10, 12, 14, 18, 20, 22, 21, 19, 17, 16, 14, 11],
  };

  private readonly monthlyDayBacklogs: Record<number, number[]> = {
    1: [10, 11, 12, 14, 13, 12, 11, 12, 13, 15, 14, 12, 11, 13, 14, 13, 12, 11, 12, 13, 14, 13, 12, 11, 10, 11, 12, 13, 14, 13, 12],
    2: [11, 12, 13, 15, 16, 14, 13, 14, 15, 16, 15, 14, 13, 14, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 12, 13, 14, 15, 13, 12, 11],
    3: [12, 14, 15, 17, 16, 18, 19, 17, 18, 19, 20, 18, 17, 19, 20, 18, 17, 16, 18, 19, 18, 17, 16, 17, 18, 19, 18, 17, 16, 17, 18],
    4: [15, 16, 18, 20, 22, 21, 20, 21, 23, 24, 22, 21, 20, 22, 23, 21, 20, 19, 21, 22, 21, 20, 19, 20, 21, 22, 21, 20, 19, 20, 18],
    5: [16, 17, 18, 19, 21, 20, 19, 20, 21, 22, 20, 19, 18, 20, 21, 20, 19, 18, 19, 20, 21, 20, 19, 18, 17, 18, 19, 20, 19, 18, 17],
    6: [18, 20, 22, 24, 25, 26, 24, 25, 27, 28, 26, 25, 24, 26, 27, 25, 24, 23, 25, 26, 25, 24, 23, 24, 25, 26, 25, 24, 23, 24, 22],
    7: [19, 20, 21, 23, 24, 23, 22, 23, 25, 26, 24, 23, 22, 24, 25, 23, 22, 21, 23, 24, 23, 22, 21, 22, 23, 24, 23, 22, 21, 22, 23],
    8: [20, 22, 24, 26, 27, 28, 29, 27, 28, 30, 28, 27, 26, 28, 29, 27, 26, 25, 27, 28, 27, 26, 25, 26, 27, 28, 27, 26, 25, 26, 28],
    9: [14, 15, 13, 16, 18, 17, 19, 21, 20, 22, 19, 18, 20, 23, 22, 21, 24, 22, 20, 19, 18, 17, 19, 21, 20, 18, 19, 19, 17, 16, 15],
    10: [17, 19, 20, 22, 23, 24, 25, 23, 24, 26, 25, 24, 23, 25, 26, 24, 23, 22, 24, 25, 24, 23, 22, 23, 24, 25, 24, 23, 22, 23, 24],
    11: [13, 14, 15, 16, 17, 18, 17, 16, 17, 18, 17, 16, 15, 17, 18, 16, 15, 14, 16, 17, 16, 15, 14, 15, 16, 17, 16, 15, 14, 15, 14],
    12: [11, 12, 13, 14, 15, 14, 13, 14, 15, 16, 15, 14, 13, 15, 16, 14, 13, 12, 14, 15, 14, 13, 12, 13, 14, 15, 14, 13, 12, 13, 14],
  };

  // Pie 1: Backlog Distribution by Activities (FMCG Stages)
  readonly activitiesBacklogData = [
    { name: 'S1: Consumer Need & Opportunity', y: 21, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 17, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 30, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 24, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 20, color: '#f59e0b' },
    { name: 'Others', y: 55, color: '#94a3b8' },
  ];

  // Pie 2: Backlog Distribution by Tasks (FMCG Stages)
  readonly tasksBacklogData = [
    { name: 'S1: Consumer Need & Opportunity', y: 19, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 16, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 26, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 21, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 23, color: '#f59e0b' },
    { name: 'Others', y: 52, color: '#94a3b8' },
  ];

  // Pie 3: Backlog Distribution by Issues (FMCG Stages)
  readonly issuesBacklogData = [
    { name: 'S1: Consumer Need & Opportunity', y: 14, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 15, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 23, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 31, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 25, color: '#f59e0b' },
    { name: 'Others', y: 58, color: '#94a3b8' },
  ];

  // Pie 4: Backlog Distribution by To-Do (FMCG Stages)
  readonly todoBacklogData = [
    { name: 'S1: Consumer Need & Opportunity', y: 23, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 27, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 21, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 17, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 25, color: '#f59e0b' },
    { name: 'Others', y: 51, color: '#94a3b8' },
  ];

  // Pie 5: Backlog Distribution by Requirements (FMCG Stages)
  readonly requirementsBacklogData = [
    { name: 'S1: Consumer Need & Opportunity', y: 25, color: '#3b82f6' },
    { name: 'S2: Concept Validation', y: 29, color: '#06b6d4' },
    { name: 'S3: Ideation & Screening', y: 19, color: '#10b981' },
    { name: 'S4: Formulation & Optimization', y: 20, color: '#84cc16' },
    { name: 'S5: Formula Selection', y: 16, color: '#f59e0b' },
    { name: 'Others', y: 64, color: '#94a3b8' },
  ];

  // Table Card: Stage-wise Backlog Summary for S1 to S12 (FMCG)
  readonly stageBacklogList: StageBacklogSummary[] = [
    { stage: 'S1 - Consumer Need and Market Opportunity', stageCode: 'S1', stageName: 'Consumer Need and Market Opportunity', act: 21, task: 19, iss: 14, todo: 23, req: 25 },
    { stage: 'S2 - Market and Product Concept Validation', stageCode: 'S2', stageName: 'Market and Product Concept Validation', act: 17, task: 16, iss: 15, todo: 27, req: 29 },
    { stage: 'S3 - Product Ideation and Concept Screening', stageCode: 'S3', stageName: 'Product Ideation and Concept Screening', act: 30, task: 26, iss: 23, todo: 21, req: 19 },
    { stage: 'S4 - Product Formulation and Product Optimization', stageCode: 'S4', stageName: 'Product Formulation and Product Optimization', act: 24, task: 21, iss: 31, todo: 17, req: 20 },
    { stage: 'S5 - Product Concept and Formula Selection', stageCode: 'S5', stageName: 'Product Concept and Formula Selection', act: 20, task: 23, iss: 25, todo: 25, req: 16 },
    { stage: 'S6 - Product Formulation and Manufacturing Process Development', stageCode: 'S6', stageName: 'Product Formulation and Manufacturing Process Development', act: 18, task: 22, iss: 19, todo: 20, req: 15 },
    { stage: 'S7 - Prototype Testing and Product Safety Assessment', stageCode: 'S7', stageName: 'Prototype Testing and Product Safety Assessment', act: 25, task: 24, iss: 28, todo: 18, req: 22 },
    { stage: 'S8 - Product Concept Approval Filing', stageCode: 'S8', stageName: 'Product Concept Approval Filing', act: 16, task: 18, iss: 20, todo: 15, req: 14 },
    { stage: 'S9 - Concept and Feasibility Validation', stageCode: 'S9', stageName: 'Concept and Feasibility Validation', act: 22, task: 20, iss: 17, todo: 19, req: 18 },
    { stage: 'S10 - Pilot Production and Market Testing', stageCode: 'S10', stageName: 'Pilot Production and Market Testing', act: 28, task: 25, iss: 22, todo: 24, req: 21 },
    { stage: 'S11 - Commercial Scale-Up and Launch Preparation', stageCode: 'S11', stageName: 'Commercial Scale-Up and Launch Preparation', act: 19, task: 17, iss: 18, todo: 16, req: 17 },
    { stage: 'S12 - Regulatory Affairs & Commercial Product Launch', stageCode: 'S12', stageName: 'Regulatory Affairs & Compliance Approval and Commercial Product Launch', act: 15, task: 14, iss: 12, todo: 13, req: 11 },
  ];

  public getStageTotal(item: StageBacklogSummary): number {
    return item.act + item.task + item.iss + item.todo + item.req;
  }

  public get grandTotalBacklogs(): number {
    return this.stageBacklogList.reduce((acc, curr) => acc + this.getStageTotal(curr), 0);
  }

  // Activities which have maximum backlog (FMCG)
  readonly topActivitiesWithMaxBacklog: ActivityBacklog[] = [
    { activityName: 'Product efficacy and performance & quality test method validation (bulk product)', backlogCount: 48 },
    { activityName: 'Finished consumer product shelf-life stability testing', backlogCount: 42 },
    { activityName: 'GMP commercial validation batch manufacturing', backlogCount: 38 },
    { activityName: 'Comparative consumer and market study consumer recruitment', backlogCount: 35 },
    { activityName: 'Ingredient specification & raw material quarantine', backlogCount: 31 },
    { activityName: 'Container closure integrity & packaging testing', backlogCount: 28 },
    { activityName: 'Product and Manufacturing Transfer Dossier Compilation', backlogCount: 25 },
    { activityName: 'Mixing, blending vessel & packaging equipment qualification', backlogCount: 22 },
  ];

  private charts: Highcharts.Chart[] = [];

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

  public onApplyFilters(): void {
    setTimeout(() => {
      this.initAllCharts();
    }, 0);
  }

  public onYearChange(val: any): void {
    this.selectedYear = val;
    this.initAllCharts();
  }

  public onMonthChange(val: any): void {
    this.selectedMonth = val;
    this.initAllCharts();
  }

  public onActivityChange(val: any): void {
    this.selectedActivity = val;
    this.initAllCharts();
  }

  public onYearOrMonthChange(): void {
    this.initAllCharts();
  }

  private initAllCharts(): void {
    this.charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = [];

    this.createStageStackedBarChart('stageBacklogStackedBarContainer');

    this.createDonutChart('activitiesBacklogChartContainer', this.activitiesBacklogData);
    this.createDonutChart('tasksBacklogChartContainer', this.tasksBacklogData);
    this.createDonutChart('issuesBacklogChartContainer', this.issuesBacklogData);
    this.createDonutChart('todoBacklogChartContainer', this.todoBacklogData);
    this.createDonutChart('requirementsBacklogChartContainer', this.requirementsBacklogData);
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
          name: 'Backlogs',
          type: 'pie',
          data: seriesData,
        },
      ],
    } as any);

    this.charts.push(chart);
  }

  private createStageStackedBarChart(containerId: string): void {
    const el = document.getElementById(containerId);
    if (!el) return;

    const categories = this.stageBacklogList.map((s) => s.stageCode || s.stage);

    const chart = Highcharts.chart(containerId, {
      chart: {
        type: 'column',
        backgroundColor: '#ffffff',
        spacingTop: 15,
        spacingBottom: 15,
        spacingLeft: 10,
        spacingRight: 15,
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: false },
      xAxis: {
        categories: categories,
        crosshair: {
          width: 1,
          color: '#cbd5e1',
          dashStyle: 'Dash',
        },
        labels: {
          rotation: -25,
          style: {
            color: '#334155',
            fontSize: '11px',
            fontWeight: '600',
          },
        },
        lineColor: '#cbd5e1',
        tickColor: '#cbd5e1',
      },
      yAxis: {
        min: 0,
        title: {
          text: 'No of Backlogs',
          style: {
            color: '#64748b',
            fontSize: '12px',
            fontWeight: '600',
          },
        },
        gridLineColor: '#f1f5f9',
        gridLineDashStyle: 'Dash',
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: '#1e293b',
            fontSize: '11px',
            textOutline: 'none',
          },
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<div style="font-size:12px;font-weight:700;color:#1e293b;padding-bottom:4px;border-bottom:1px solid #e2e8f0;margin-bottom:4px;">{point.key}</div>',
        pointFormat:
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px;padding:2px 0;">' +
          '<span style="color:{series.color};font-weight:600;">● {series.name}:</span> ' +
          '<b style="color:#0f172a;">{point.y}</b>' +
          '</div>',
        footerFormat:
          '<div style="border-top:1px solid #e2e8f0;margin-top:4px;padding-top:4px;font-size:11px;font-weight:700;display:flex;justify-content:space-between;color:#0f172a;">' +
          '<span>Total Backlogs:</span><b>{point.total}</b></div>',
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        borderRadius: 8,
        shadow: false,
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemDistance: 20,
        itemStyle: {
          fontSize: '12px',
          color: '#334155',
          fontWeight: '600',
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          borderRadius: 2,
          borderWidth: 0,
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: 'Activities',
          type: 'column',
          color: '#3b82f6',
          data: this.stageBacklogList.map((s) => s.act),
        },
        {
          name: 'Tasks',
          type: 'column',
          color: '#06b6d4',
          data: this.stageBacklogList.map((s) => s.task),
        },
        {
          name: 'Issues',
          type: 'column',
          color: '#f59e0b',
          data: this.stageBacklogList.map((s) => s.iss),
        },
        {
          name: 'To-Do',
          type: 'column',
          color: '#8b5cf6',
          data: this.stageBacklogList.map((s) => s.todo),
        },
        {
          name: 'Requirements',
          type: 'column',
          color: '#10b981',
          data: this.stageBacklogList.map((s) => s.req),
        },
      ],
    } as any);

    this.charts.push(chart);
  }
}
