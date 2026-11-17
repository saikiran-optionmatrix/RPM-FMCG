import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as HighchartsNamespace from 'highcharts';
import exportingModule from 'highcharts/modules/exporting';

const Highcharts: any = (HighchartsNamespace as any).default || HighchartsNamespace;

// Safely initialize Highcharts modules
try {
  const exp = (exportingModule as any)?.default || exportingModule;
  if (typeof exp === 'function' && Highcharts) {
    exp(Highcharts);
  }
} catch (e) {
  console.warn('Could not initialize Highcharts exporting module', e);
}

interface Task {
  name: string;
  assignee: string;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  slipDays: string;
}

interface GanttTaskItem {
  id: number;
  label: string;
  fullName: string;
  duration: string;
  isOverdue: boolean;
  leftPercent: number;
  widthPercent: number;
}

@Component({
  selector: 'app-project-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './project-analytics.component.html',
  styleUrl: './project-analytics.component.scss',
})
export class ProjectAnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sprintBufferRef') sprintBufferRef?: ElementRef;
  @ViewChild('stageBufferRef') stageBufferRef?: ElementRef;
  @ViewChild('costPlanRef') costPlanRef?: ElementRef;
  @ViewChild('projectHoursRef') projectHoursRef?: ElementRef;

  private charts: any[] = [];

  projectName: string = 'Vitamin-Enriched Fruit Beverage 250ml';
  projectCode: string = '2026/FMCG/006';
  dynamicBreadcrumb: string = 'Vitamin-Enriched Fruit Beverage 250ml - 2026/FMCG/006';

  // --- Task Data ---
  overdueTasks: Task[] = [
    { name: 'Formula and Product Consistency Study', assignee: 'Dr. Priya R.', status: 'CRITICAL', slipDays: '+6d' },
    { name: 'Upstream yield and Product Formulation optimization', assignee: 'Rahul K.', status: 'CRITICAL', slipDays: '+5d' },
    { name: 'Pilot mixing and blending vessel Batch Run', assignee: 'Meena S.', status: 'HIGH', slipDays: '+4d' },
    { name: 'Product efficacy and performance test Validation', assignee: 'Anil P.', status: 'HIGH', slipDays: '+3d' },
    { name: 'Bulk product Shelf-Life Stability Assessment', assignee: 'Kavya R.', status: 'HIGH', slipDays: '+3d' },
    { name: 'Blending, Finishing and Quality Control Process Documentation', assignee: 'Suresh N.', status: 'MEDIUM', slipDays: '+2d' },
  ];

  // --- Gantt Timeline Data ---
  ganttMonths: string[] = ['Jun', 'Jul', 'Aug', 'Sep'];

  ganttTasks: GanttTaskItem[] = [
    {
      id: 1,
      label: '1. Reference Product Chara...',
      fullName: '1. Reference Product Analytical Characterization — 12d',
      duration: '12d',
      isOverdue: false,
      leftPercent: 1.5,
      widthPercent: 12
    },
    {
      id: 2,
      label: '2. Product Formulation Dev...',
      fullName: '2. Product Formulation Development & Clone Selection — 18d',
      duration: '18d',
      isOverdue: false,
      leftPercent: 9.5,
      widthPercent: 18
    },
    {
      id: 3,
      label: '3. Ingredient Processing D...',
      fullName: '3. Ingredient Processing Development — 24d',
      duration: '24d',
      isOverdue: false,
      leftPercent: 24.5,
      widthPercent: 24
    },
    {
      id: 4,
      label: '4. Blending & Finishing De...',
      fullName: '4. Blending, Finishing and Quality Control Development — 14d',
      duration: '14d',
      isOverdue: true,
      leftPercent: 44.5,
      widthPercent: 14
    },
    {
      id: 5,
      label: '5. Finished Product Optimi...',
      fullName: '5. Finished Product Formulation Optimization — 20d',
      duration: '20d',
      isOverdue: true,
      leftPercent: 55.0,
      widthPercent: 20
    },
    {
      id: 6,
      label: '6. Bulk Shelf-Life Initiat...',
      fullName: '6. Bulk Product Shelf-Life Stability Study Initiation — 30d',
      duration: '30d',
      isOverdue: true,
      leftPercent: 71.0,
      widthPercent: 29
    }
  ];

  // Tooltip tracking
  hoveredGanttTask: GanttTaskItem | null = null;
  tooltipPos = { x: 0, y: 0 };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    const pName = this.route.snapshot.queryParamMap.get('projectName') || this.route.snapshot.queryParamMap.get('name');
    const pCode = this.route.snapshot.queryParamMap.get('projectCode') || this.route.snapshot.queryParamMap.get('code');
    if (pName) {
      this.projectName = pName;
    }
    if (pCode) {
      this.projectCode = pCode;
    }
    this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderCharts();
    }, 60);
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => {
      if (c && typeof c.destroy === 'function') {
        c.destroy();
      }
    });
    this.charts = [];
  }

  goBack(): void {
    this.router.navigateByUrl('/projects');
  }

  onGanttBarHover(event: MouseEvent, task: GanttTaskItem): void {
    this.hoveredGanttTask = task;
    this.tooltipPos = {
      x: event.clientX + 12,
      y: event.clientY + 12
    };
  }

  onGanttBarMove(event: MouseEvent): void {
    if (this.hoveredGanttTask) {
      this.tooltipPos = {
        x: event.clientX + 12,
        y: event.clientY + 12
      };
    }
  }

  onGanttBarLeave(): void {
    this.hoveredGanttTask = null;
  }

  private renderCharts(): void {
    if (this.sprintBufferRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.sprintBufferRef.nativeElement, this.getSprintBufferChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering sprintBuffer chart', e);
      }
    }
    if (this.stageBufferRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.stageBufferRef.nativeElement, this.getStageBufferChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering stageBuffer chart', e);
      }
    }
    if (this.costPlanRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.costPlanRef.nativeElement, this.getCostPlanChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering costPlan chart', e);
      }
    }
    if (this.projectHoursRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.projectHoursRef.nativeElement, this.getProjectHoursChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering projectHours chart', e);
      }
    }
  }

  private getSprintBufferChartOptions(): any {
    const stageNames: Record<string, string> = {
      'S1': 'S1 - Consumer Need and Market Opportunity',
      'S2': 'S2 - Market and Product Concept Validation',
      'S3': 'S3 - Product Ideation and Concept Screening',
      'S4': 'S4 - Product Formulation and Product Optimization',
      'S5': 'S5 - Product Concept and Formula Selection',
      'S6': 'S6 - Product Formulation and Manufacturing Process Development'
    };

    return {
      chart: {
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
        title: {
          text: '% completion',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 8,
        tickInterval: 2,
        gridLineColor: '#f1f5f9',
        title: {
          text: 'Buffer Time Used (days)',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          const fullName = stageNames[this.x] || this.x;
          let s = `<div style="font-size: 11px; padding: 2px;"><b>${fullName}</b>`;
          this.points?.forEach((point: any) => {
            s += `<br/><span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y} days</b>`;
          });
          s += '</div>';
          return s;
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Buffer',
          color: '#a7f3d0',
          borderRadius: 2,
          pointWidth: 36,
          dataLabels: {
            enabled: true,
            inside: false,
            style: {
              color: '#94a3b8',
              fontSize: '10px',
              fontWeight: 'normal',
              textOutline: 'none'
            }
          },
          data: [
            { y: 0.8, color: '#a7f3d0' },
            { y: 2.5, color: '#fca5a5' },
            { y: 2.2, color: '#a7f3d0' },
            { y: 4.8, color: '#fca5a5' },
            { y: 4.0, color: '#a7f3d0' },
            { y: 6.5, color: '#fca5a5' }
          ]
        },
        {
          type: 'line',
          name: 'Cumulative Completion',
          color: '#2563eb',
          dashStyle: 'Dash',
          lineWidth: 2,
          marker: {
            enabled: true,
            radius: 3,
            fillColor: '#2563eb'
          },
          data: [0.8, 1.8, 2.8, 3.8, 4.8, 6.0]
        }
      ]
    };
  }

  private getStageBufferChartOptions(): any {
    const gateNames: Record<string, string> = {
      'Gate 1': 'Gate 1 - Product Concept Selection',
      'Gate 2': 'Gate 2 - Product Concept and Formula Selection',
      'Gate 3': 'Gate 3 - Product Concept and Feasibility Approval',
      'Gate 4': 'Gate 4 - Consumer Validation and Product Performance Proof',
      'Gate 5': 'Gate 5 - Market Launch and Regulatory Readiness'
    };

    return {
      chart: {
        type: 'column',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5'],
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 4,
        tickInterval: 1,
        gridLineColor: '#f1f5f9',
        title: {
          text: 'Buffer Variance (days)',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          const fullGate = gateNames[this.x] || this.x;
          return `<div style="font-size: 11px; padding: 2px;"><b>${fullGate}</b><br/>${this.series.name}: <b>${this.y} days</b></div>`;
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Buffer Variance',
          color: '#059669',
          borderRadius: 2,
          pointWidth: 40,
          data: [3, 1, 3, 0, 0]
        }
      ]
    };
  }

  private getCostPlanChartOptions(): any {
    return {
      chart: {
        type: 'column',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['S1', 'S2', 'S3', 'S4', 'S5'],
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 500,
        tickInterval: 250,
        gridLineColor: '#f1f5f9',
        title: { text: undefined },
        labels: {
          format: '{value}K',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>${point.y}K</b>'
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      plotOptions: {
        column: {
          borderRadius: 2,
          pointPadding: 0.1,
          groupPadding: 0.2
        }
      },
      series: [
        {
          type: 'column',
          name: 'Actual Cost',
          color: '#a855f7',
          data: [140, 220, 275, 230, 310]
        },
        {
          type: 'column',
          name: 'Budgeted Cost',
          color: '#3b82f6',
          data: [125, 250, 320, 260, 350]
        }
      ]
    };
  }

  private getProjectHoursChartOptions(): any {
    return {
      chart: {
        type: 'pie',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y}h)'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f}%',
            connectorColor: '#cbd5e1',
            style: {
              color: '#334155',
              fontSize: '11px',
              fontWeight: '500',
              textOutline: 'none'
            }
          }
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Effort allocation',
          data: [
            {
              name: 'BioManufacturing Process Development Scientists',
              y: 76.9,
              color: '#3b82f6'
            },
            {
              name: 'Quality Testing & QC',
              y: 15.7,
              color: '#10b981'
            },
            {
              name: 'Facility & Equipment Setup',
              y: 7.4,
              color: '#f59e0b'
            }
          ]
        }
      ]
    };
  }
}