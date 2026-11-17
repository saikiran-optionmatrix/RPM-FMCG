import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router } from '@angular/router';

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

@Component({
  selector: 'app-dashboard-portfolio',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,
    MatSelectModule, MatInputModule, MatPaginatorModule, MatTooltipModule, RouterModule
  ],
  templateUrl: './dashboard-portfolio.component.html',
  styleUrls: ['./dashboard-portfolio.component.scss']
})
export class DashboardPortfolioComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  pageIndex = 0;
  pageSize = 10;
  selectedGate = 'Gate 1';

  portfolioGates = [
    { code: 'Gate 1', name: 'Product Concept Selection', label: 'Gate 1' },
    { code: 'Gate 2', name: 'Product Concept and Formula Selection', label: 'Gate 2' },
    { code: 'Gate 3', name: 'Product Concept and Feasibility Approval', label: 'Gate 3' },
    { code: 'Gate 4', name: 'Consumer Validation and Product Performance Proof', label: 'Gate 4' },
    { code: 'Gate 5', name: 'Market Launch and Regulatory Readiness', label: 'Gate 5' }
  ];

  getGateTitle(gateCode: string): string {
    const gateObj = this.portfolioGates.find(g => g.code === gateCode);
    return `${gateCode} - ${gateObj ? gateObj.name : 'Portfolio Summary'}`;
  }

  readonly stageNamesMap: Record<string, string> = {
    'S1': 'Consumer Need and Market Opportunity',
    'S2': 'Market and Product Concept Validation',
    'S3': 'Product Ideation and Concept Screening',
    'S4': 'Product Formulation and Product Optimization',
    'S5': 'Product Concept and Formula Selection',
    'S6': 'Product Formulation and Manufacturing Process Development',
    'S7': 'Prototype Testing and Product Safety Assessment',
    'S8': 'Product Concept Approval Filing',
    'S9': 'Concept and Feasibility Validation',
    'S10': 'Pilot Production and Market Testing',
    'S11': 'Commercial Scale-Up and Launch Preparation',
    'S12': 'Regulatory Affairs & Compliance Approval and Commercial Product Launch'
  };

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
    this.applyAllFilters();
  }

  portfolioActiveFilter: { type: 'bar'; stage: string; status: 'on-schedule' | 'delayed'; label: string } | null = null;

  allPortfolioProjects: any[] = [];
  filteredPortfolioProjects: any[] = [];
  paginatedProjects: any[] = [];

  chartCategories: string[] = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];
  chartOnTrackData: number[] = [8, 7, 6, 5, 5, 4, 3, 2, 1, 1, 1, 1];
  chartDueData: number[] = [2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0];

  gatePieDataMap: any = {
    'Gate 1': [
      { name: 'Go', y: 5, color: '#2ecc71' },
      { name: 'Evaluation', y: 2, color: '#3366cc' },
      { name: 'Rework', y: 1, color: '#f39c12' },
      { name: 'Pending', y: 1, color: '#7f8c8d' },
      { name: 'Redirect', y: 1, color: '#9b59b6' }
    ],
    'Gate 2': [
      { name: 'Go', y: 5, color: '#2ecc71' },
      { name: 'Evaluation', y: 2, color: '#3366cc' },
      { name: 'Rework', y: 1, color: '#f39c12' },
      { name: 'Pending', y: 1, color: '#7f8c8d' },
      { name: 'Redirect', y: 1, color: '#9b59b6' }
    ],
    'Gate 3': [
      { name: 'Go', y: 4, color: '#2ecc71' },
      { name: 'Evaluation', y: 2, color: '#3366cc' },
      { name: 'Rework', y: 1, color: '#f39c12' },
      { name: 'Pending', y: 1, color: '#7f8c8d' }
    ],
    'Gate 4': [
      { name: 'Go', y: 4, color: '#2ecc71' },
      { name: 'Evaluation', y: 1, color: '#3366cc' },
      { name: 'Rework', y: 1, color: '#f39c12' },
      { name: 'Redirect', y: 1, color: '#9b59b6' }
    ],
    'Gate 5': [
      { name: 'Go', y: 4, color: '#2ecc71' },
      { name: 'Evaluation', y: 1, color: '#3366cc' },
      { name: 'Pending', y: 1, color: '#7f8c8d' }
    ]
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initPortfolioData();
    this.applyAllFilters();
  }

  ngAfterViewInit(): void {
    this.renderPortfolioStatusChart();
    this.renderPortfolioSummaryChart();
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  navigateToStages(): void {
    this.router.navigate(['/dashboard/portfolio/stages-data-table']);
  }

  navigateToGates(): void {
    this.router.navigate(['/dashboard/portfolio/gates-data-table']);
  }

  initPortfolioData(): void {
    this.allPortfolioProjects = [
      {
        projectName: 'New Beverage Product Development Program',
        projectCode: '2026/FMCG/001',
        productFamily: 'Beverages',
        endUseIndustry: 'Modern Trade & E-Commerce',
        division: 'Beverages - BV',
        location: 'Mumbai',
        scheduleStatus: 'on-schedule',
        s1: '10/01/26', s2: '15/06/26', s3: '20/01/27', s4: '25/08/27',
        s5: '10/03/28', s6: '15/10/28', s7: '20/05/29', s8: '25/12/29',
        s9: '10/07/30', s10: '15/02/31', s11: '20/09/31', s12: '25/04/32',
        completionDate: '15/10/32'
      },
      {
        projectName: 'New Personal Care Product Formulation Development',
        projectCode: '2026/FMCG/002',
        productFamily: 'Personal Care & Beauty',
        endUseIndustry: 'Retail & Salons',
        division: 'Personal Care & Beauty - PC',
        location: 'Bengaluru',
        scheduleStatus: 'on-schedule',
        s1: '15/02/26', s2: '20/07/26', s3: '25/02/27', s4: '30/09/27',
        s5: '15/04/28', s6: '20/11/28', s7: '25/06/29', s8: '30/01/30',
        s9: '15/08/30', s10: '20/03/31', s11: '25/10/31', s12: '30/05/32',
        completionDate: '20/11/32'
      },
      {
        projectName: 'Multi-Variant Snack Product Development',
        projectCode: '2026/FMCG/003',
        productFamily: 'Packaged Foods & Snacks',
        endUseIndustry: 'General Trade & Q-Commerce',
        division: 'Packaged Foods & Snacks - FS',
        location: 'Delhi NCR',
        scheduleStatus: 'delayed',
        s1: '01/03/26', s2: '10/08/26', s3: '15/03/27', s4: '20/10/27',
        s5: '01/05/28', s6: '10/12/28', s7: '15/07/29', s8: '20/02/30',
        s9: '01/09/30', s10: '10/04/31', s11: '15/11/31', s12: '20/06/32',
        completionDate: '10/12/32'
      },
      {
        projectName: 'Ingredient Sourcing and Blend Optimization',
        projectCode: '2026/FMCG/004',
        productFamily: 'Nutrition & Ingredients',
        endUseIndustry: 'B2B & Food Service',
        division: 'Dairy & Nutrition - DN',
        location: 'Pune',
        scheduleStatus: 'on-schedule',
        s1: '12/01/26', s2: '18/06/26', s3: '22/01/27', s4: '28/08/27',
        s5: '12/03/28', s6: '18/10/28', s7: '22/05/29', s8: '28/12/29',
        s9: '12/07/30', s10: '18/02/31', s11: '22/09/31', s12: '28/04/32',
        completionDate: '18/10/32'
      },
      {
        projectName: 'Shelf-Stable Powdered Beverage Product Formulation',
        projectCode: '2026/FMCG/005',
        productFamily: 'Beverages',
        endUseIndustry: 'Direct to Consumer',
        division: 'Beverages - BV',
        location: 'Hyderabad',
        scheduleStatus: 'delayed',
        s1: '20/02/26', s2: '25/07/26', s3: '01/03/27', s4: '05/10/27',
        s5: '20/04/28', s6: '25/11/28', s7: '01/07/29', s8: '05/02/30',
        s9: '20/08/30', s10: '25/03/31', s11: '01/11/31', s12: '05/06/32',
        completionDate: '25/11/32'
      },
      {
        projectName: 'Vitamin-Enriched Fruit Beverage 250ml',
        projectCode: '2026/FMCG/006',
        productFamily: 'Beverages',
        endUseIndustry: 'Convenience & Modern Trade',
        division: 'Beverages - BV',
        location: 'Mumbai',
        scheduleStatus: 'on-schedule',
        s1: '15/01/26', s2: '20/06/26', s3: '25/01/27', s4: '30/08/27',
        s5: '15/03/28', s6: '20/10/28', s7: '25/05/29', s8: '30/12/29',
        s9: '15/07/30', s10: '20/02/31', s11: '25/09/31', s12: '30/04/32',
        completionDate: '20/10/32'
      },
      {
        projectName: 'Premium Personal Care Lotion 200ml',
        projectCode: '2026/FMCG/007',
        productFamily: 'Personal Care & Beauty',
        endUseIndustry: 'E-Commerce & Pharmacy',
        division: 'Personal Care & Beauty - PC',
        location: 'Chennai',
        scheduleStatus: 'on-schedule',
        s1: '05/02/26', s2: '12/07/26', s3: '18/02/27', s4: '22/09/27',
        s5: '05/04/28', s6: '12/11/28', s7: '18/06/29', s8: '22/01/30',
        s9: '05/08/30', s10: '12/03/31', s11: '18/10/31', s12: '22/05/32',
        completionDate: '12/11/32'
      },
      {
        projectName: 'Ready-to-Eat Snack Range 100g',
        projectCode: '2026/FMCG/008',
        productFamily: 'Packaged Foods & Snacks',
        endUseIndustry: 'Retail FMCG',
        division: 'Packaged Foods & Snacks - FS',
        location: 'Ahmedabad',
        scheduleStatus: 'delayed',
        s1: '10/02/26', s2: '15/07/26', s3: '20/02/27', s4: '25/09/27',
        s5: '10/04/28', s6: '15/11/28', s7: '20/06/29', s8: '25/01/30',
        s9: '10/08/30', s10: '15/03/31', s11: '20/10/31', s12: '25/05/32',
        completionDate: '15/11/32'
      },
      {
        projectName: 'Low-Sugar Dairy Beverage 200ml',
        projectCode: '2026/FMCG/009',
        productFamily: 'Dairy & Refrigerated',
        endUseIndustry: 'Modern Trade & Supermarkets',
        division: 'Dairy & Nutrition - DN',
        location: 'Baddi',
        scheduleStatus: 'on-schedule',
        s1: '18/01/26', s2: '22/06/26', s3: '28/01/27', s4: '04/09/27',
        s5: '18/03/28', s6: '22/10/28', s7: '28/05/29', s8: '04/01/30',
        s9: '18/07/30', s10: '22/02/31', s11: '28/09/31', s12: '04/05/32',
        completionDate: '22/10/32'
      },
      {
        projectName: 'Plant-Based Protein Drink 300ml',
        projectCode: '2026/FMCG/010',
        productFamily: 'Health & Wellness',
        endUseIndustry: 'Specialty Retail & Fitness',
        division: 'Dairy & Nutrition - DN',
        location: 'Bengaluru',
        scheduleStatus: 'on-schedule',
        s1: '25/01/26', s2: '30/06/26', s3: '05/02/27', s4: '12/09/27',
        s5: '25/03/28', s6: '30/10/28', s7: '05/06/29', s8: '12/01/30',
        s9: '25/07/30', s10: '30/02/31', s11: '05/10/31', s12: '12/05/32',
        completionDate: '30/10/32'
      }
    ];
  }

  applyAllFilters(): void {
    let list = [...this.allPortfolioProjects];

    if (this.selectedDivision && this.selectedDivision !== 'All') {
      list = list.filter(p => p.division === this.selectedDivision);
    }

    if (this.selectedLocation && this.selectedLocation !== 'All') {
      list = list.filter(p => p.location === this.selectedLocation);
    }

    if (this.portfolioActiveFilter) {
      const statusFilter = this.portfolioActiveFilter.status;
      list = list.filter(p => p.scheduleStatus === statusFilter);
    }

    this.filteredPortfolioProjects = list;
    this.pageIndex = 0;
    this.updatePagination();
  }

  onPortfolioChartBarClick(stage: string, status: 'on-schedule' | 'delayed'): void {
    const stageFullName = this.stageNamesMap[stage] || stage;
    const statusText = status === 'on-schedule' ? 'On Track' : 'Delayed';
    this.portfolioActiveFilter = {
      type: 'bar',
      stage,
      status,
      label: `${stage} (${stageFullName}) - ${statusText}`
    };
    this.applyAllFilters();
  }

  resetPortfolioFilter(): void {
    this.portfolioActiveFilter = null;
    this.applyAllFilters();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = this.pageIndex * this.pageSize;
    this.paginatedProjects = this.filteredPortfolioProjects.slice(start, start + this.pageSize);
  }

  setGateCategory(gate: string): void {
    this.selectedGate = gate;
    this.renderPortfolioSummaryChart();
    this.cdr.detectChanges();
  }

  renderPortfolioStatusChart(): void {
    const containerId = 'portfolioStatusChartContainer';
    if (!document.getElementById(containerId)) return;

    const self = this;

    Highcharts.chart(containerId, {
      chart: { type: 'column', backgroundColor: '#ffffff' },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: this.chartCategories,
        labels: { style: { fontWeight: 'bold' } }
      },
      yAxis: {
        min: 0,
        title: { text: 'No. of programs' }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          const stageCode = this.x;
          const fullName = self.stageNamesMap[stageCode] || stageCode;
          let s = `<span style="font-size: 13px; font-weight: bold; color: #1e293b;">${stageCode} - ${fullName}</span><br/>`;
          this.points.forEach((point: any) => {
            s += `<span style="color:${point.series.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b><br/>`;
          });
          return s;
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          cursor: 'pointer',
          dataLabels: { enabled: true },
          point: {
            events: {
              click: function (this: any) {
                const stage = this.category as string;
                const seriesName = this.series.name;
                const status = seriesName === 'Programs on track' ? 'on-schedule' : 'delayed';
                self.onPortfolioChartBarClick(stage, status);
              }
            }
          }
        }
      },
      series: [
        { name: 'Programs on track', color: '#00a859', type: 'column', data: this.chartOnTrackData },
        { name: 'Programs delayed', color: '#ed1c24', type: 'column', data: this.chartDueData }
      ]
    } as any);
  }

  renderPortfolioSummaryChart(): void {
    const containerId = 'portfolioSummaryPieChartContainer';
    if (!document.getElementById(containerId)) return;

    const pieData = this.gatePieDataMap[this.selectedGate] || [];

    Highcharts.chart(containerId, {
      chart: { type: 'pie', backgroundColor: '#ffffff' },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: true },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          return `<b>${this.key}</b>: ${this.y} Programs (${this.percentage.toFixed(1)}%)`;
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          innerSize: '0%',
          dataLabels: {
            enabled: true,
            distance: -35,
            useHTML: true,
            formatter: function (this: any) {
              return `<div style="text-align:center;color:white;font-weight:bold;font-size:12px;">${this.percentage.toFixed(0)}%</div>`;
            }
          }
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemMarginTop: 10,
        itemMarginBottom: 10,
        useHTML: true,
        itemStyle: { color: '#333333' },
        labelFormatter: function (this: any) {
          return `<span style="font-weight:normal; margin-right: 5px;">${this.name}</span> <span style="font-weight:bold">${this.y}</span>`;
        }
      },
      series: [{
        type: 'pie',
        name: 'Programs',
        data: pieData
      }]
    } as any);
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
