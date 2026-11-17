import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
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

interface FMCGProgramDef {
  name: string;
  code: string;
  division: string;
  location: string;
  mult: number;
}

@Component({
  selector: 'app-dashboard-variance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard-variance.component.html',
  styleUrls: ['./dashboard-variance.component.scss']
})
export class DashboardVarianceComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly fmcgPrograms: FMCGProgramDef[] = [
    { name: 'New Beverage Product Development Program', code: '2026/FMCG/001', division: 'Beverages - BV', location: 'Mumbai', mult: 1.0 },
    { name: 'New Personal Care Product Formulation Development', code: '2026/FMCG/002', division: 'Personal Care & Beauty - PC', location: 'Bengaluru', mult: 1.15 },
    { name: 'Multi-Variant Snack Product Development', code: '2026/FMCG/003', division: 'Packaged Foods & Snacks - FS', location: 'Delhi NCR', mult: 0.95 },
    { name: 'Ingredient Sourcing and Blend Optimization', code: '2026/FMCG/004', division: 'Dairy & Nutrition - DN', location: 'Pune', mult: 0.85 },
    { name: 'Shelf-Stable Powdered Beverage Product Formulation', code: '2026/FMCG/005', division: 'Beverages - BV', location: 'Hyderabad', mult: 1.10 },
    { name: 'Vitamin-Enriched Fruit Beverage 250ml', code: '2026/FMCG/006', division: 'Beverages - BV', location: 'Mumbai', mult: 1.05 },
    { name: 'Premium Personal Care Lotion 200ml', code: '2026/FMCG/007', division: 'Personal Care & Beauty - PC', location: 'Chennai', mult: 0.90 },
    { name: 'Ready-to-Eat Snack Range 100g', code: '2026/FMCG/008', division: 'Packaged Foods & Snacks - FS', location: 'Ahmedabad', mult: 1.20 },
    { name: 'Low-Sugar Dairy Beverage 200ml', code: '2026/FMCG/009', division: 'Dairy & Nutrition - DN', location: 'Baddi', mult: 0.80 },
    { name: 'Plant-Based Protein Drink 300ml', code: '2026/FMCG/010', division: 'Dairy & Nutrition - DN', location: 'Bengaluru', mult: 1.0 }
  ];

  projects: string[] = [];

  readonly varianceStages = [
    { key: 'Stage 0', label: 'Stage 0', fullName: 'Product Concept Selection & Business Case', phase: 'Phase 1 (S1-S2)' },
    { key: 'Stage 1', label: 'Stage 1', fullName: 'Lead Generation & Candidate Optimization', phase: 'Phase 2 (S3-S4)' },
    { key: 'Stage 2', label: 'Stage 2', fullName: 'Product Formulation & Lab-Scale Process Development', phase: 'Phase 3 (S5-S8)' },
    { key: 'Stage 3', label: 'Stage 3', fullName: 'Preclinical & Product Approval-Enabling Studies', phase: 'Phase 4 (S9-S10)' },
    { key: 'Stage 4', label: 'Stage 4', fullName: 'Clinical Development & Market Launch / Regulatory Approval Filing', phase: 'Phase 5 (S11-S12)' }
  ];

  selectedBudgetProject = 'All Programs';
  selectedVarianceStage = 'Stage 0';

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

  readonly moduleShortForms: Record<string, string> = {
    // Stage 0
    'Consumer Need & Market Opportunity Assessment': 'Consumer Need & Market',
    'Product Testing Method & Concept Screening Feasibility': 'Testing & Feasibility',
    'Product Feasibility & Commercial Business Case': 'Commercial Business Case',
    // Stage 1
    'Product Ideation & Concept Generation': 'Ideation & Concept',
    'Formula Refinement & Product Optimization': 'Formula Optimization',
    'Final Formula Lock & Product Variant Selection Studies': 'Formula Lock & Variant',
    // Stage 2
    'Ingredient Processing and Manufacturing Development': 'Process Development',
    'Product Quality & Performance Test Development': 'Quality & Testing',
    'Manufacturing Process Characterization & Scale-Up Transfer': 'Process Characterization',
    // Stage 3
    'Regulatory Affairs & Food Safety Dossier Filing': 'Regulatory & Dossier',
    'Pilot Production & Plant Campaign Execution': 'Pilot Production & Plant',
    'Demonstration-Scale Blending & Packaging Trial': 'Demo Blending & Packaging',
    // Stage 4
    'Commercial Facility Commissioning & Ramp-Up Trial': 'Facility Commissioning',
    'Master Production Record & QC Release Protocols': 'Master Production & QC',
    'Commercial Launch Inventory & Supply Chain Setup': 'Launch & Supply Chain'
  };

  readonly stageTemplates = [
    {
      stage: 'Product Concept Selection & Business Case',
      stageCode: 'Stage 0',
      modules: [
        { module: 'Consumer Need & Market Opportunity Assessment', allocated: 45000, spent: 42000 },
        { module: 'Product Testing Method & Concept Screening Feasibility', allocated: 55000, spent: 51000 },
        { module: 'Product Feasibility & Commercial Business Case', allocated: 40000, spent: 38000 }
      ]
    },
    {
      stage: 'Lead Generation & Candidate Optimization',
      stageCode: 'Stage 1',
      modules: [
        { module: 'Product Ideation & Concept Generation', allocated: 75000, spent: 71000 },
        { module: 'Formula Refinement & Product Optimization', allocated: 60000, spent: 58000 },
        { module: 'Final Formula Lock & Product Variant Selection Studies', allocated: 65000, spent: 62000 }
      ]
    },
    {
      stage: 'Product Formulation & Lab-Scale Process Development',
      stageCode: 'Stage 2',
      modules: [
        { module: 'Ingredient Processing and Manufacturing Development', allocated: 95000, spent: 88000 },
        { module: 'Product Quality & Performance Test Development', allocated: 70000, spent: 65000 },
        { module: 'Manufacturing Process Characterization & Scale-Up Transfer', allocated: 45000, spent: 41000 }
      ]
    },
    {
      stage: 'Preclinical & Product Approval-Enabling Studies',
      stageCode: 'Stage 3',
      modules: [
        { module: 'Regulatory Affairs & Food Safety Dossier Filing', allocated: 80000, spent: 74000 },
        { module: 'Pilot Production & Plant Campaign Execution', allocated: 110000, spent: 102000 },
        { module: 'Demonstration-Scale Blending & Packaging Trial', allocated: 95000, spent: 89000 }
      ]
    },
    {
      stage: 'Clinical Development & Market Launch / Regulatory Approval Filing',
      stageCode: 'Stage 4',
      modules: [
        { module: 'Commercial Facility Commissioning & Ramp-Up Trial', allocated: 150000, spent: 142000 },
        { module: 'Master Production Record & QC Release Protocols', allocated: 60000, spent: 57000 },
        { module: 'Commercial Launch Inventory & Supply Chain Setup', allocated: 90000, spent: 84000 }
      ]
    }
  ];

  budgetGanttData: any[] = [];
  filteredBudgetGanttData: any[] = [];
  varianceChart: Highcharts.Chart | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.projects = this.fmcgPrograms.map(p => p.name);
    this.initBudgetGanttData();
    this.applyBudgetFilter();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderVariancePieChart();
    }, 150);
  }

  ngOnDestroy() {
    if (this.varianceChart) {
      this.varianceChart.destroy();
      this.varianceChart = null;
    }
  }

  initBudgetGanttData() {
    const list: any[] = [];

    this.fmcgPrograms.forEach(prog => {
      this.stageTemplates.forEach(st => {
        st.modules.forEach(m => {
          const mult = prog.mult || 1.0;
          const allocated = Math.round((m.allocated * mult) / 100) * 100;
          const spent = Math.round((m.spent * mult) / 100) * 100;
          list.push({
            stage: st.stage,
            stageCode: st.stageCode,
            module: m.module,
            allocated,
            spent,
            variance: allocated - spent,
            completion: Math.round((spent / (allocated || 1)) * 100),
            project: prog.name,
            projectCode: prog.code,
            division: prog.division,
            location: prog.location
          });
        });
      });
    });

    this.budgetGanttData = list;
  }

  applyBudgetFilter() {
    let dataset = this.budgetGanttData;

    if (this.selectedDivision !== 'All') {
      dataset = dataset.filter(d => d.division === this.selectedDivision);
    }
    if (this.selectedLocation !== 'All') {
      dataset = dataset.filter(d => d.location === this.selectedLocation);
    }

    if (this.selectedBudgetProject !== 'All Programs') {
      this.filteredBudgetGanttData = dataset
        .filter(d => d.project === this.selectedBudgetProject)
        .map(d => ({ ...d }));
    } else {
      const aggMap = new Map<string, any>();
      dataset.forEach(item => {
        const key = `${item.stageCode}_${item.module}`;
        if (!aggMap.has(key)) {
          aggMap.set(key, {
            stage: item.stage,
            stageCode: item.stageCode,
            module: item.module,
            allocated: 0,
            spent: 0,
            project: 'All Programs'
          });
        }
        const existing = aggMap.get(key);
        existing.allocated += item.allocated;
        existing.spent += item.spent;
      });

      this.filteredBudgetGanttData = Array.from(aggMap.values()).map(item => ({
        ...item,
        variance: item.allocated - item.spent,
        completion: Math.round((item.spent / (item.allocated || 1)) * 100)
      }));
    }
  }

  onDivisionChange(): void {
    this.updateProjectOptions();
  }

  onLocationChange(): void {
    this.updateProjectOptions();
  }

  updateProjectOptions(): void {
    let matching = this.fmcgPrograms;
    if (this.selectedDivision !== 'All') {
      matching = matching.filter(p => p.division === this.selectedDivision);
    }
    if (this.selectedLocation !== 'All') {
      matching = matching.filter(p => p.location === this.selectedLocation);
    }
    this.projects = matching.map(p => p.name);
    if (this.selectedBudgetProject !== 'All Programs' && !this.projects.includes(this.selectedBudgetProject)) {
      this.selectedBudgetProject = 'All Programs';
    }
    this.applyBudgetFilter();
    this.renderVariancePieChart();
  }

  onApplyFilters(): void {
    this.applyBudgetFilter();
    this.renderVariancePieChart();
  }

  onBudgetProjectChange() {
    this.applyBudgetFilter();
    this.renderVariancePieChart();
  }

  setVarianceStage(stage: string) {
    this.selectedVarianceStage = stage;
    this.renderVariancePieChart();
    this.scrollToStage(stage);
  }

  scrollToStage(stage: string): void {
    setTimeout(() => {
      const el = document.getElementById(`stage-row-${stage}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }

  get totalAllocated(): number {
    return this.filteredBudgetGanttData.reduce((sum, item) => sum + (item.allocated || 0), 0);
  }

  get totalSpent(): number {
    return this.filteredBudgetGanttData.reduce((sum, item) => sum + (item.spent || 0), 0);
  }

  get totalVariance(): number {
    return this.totalAllocated - this.totalSpent;
  }

  get groupedBudgetTableData(): Array<{ stage: string; stageCode: string; totalAllocated: number; totalSpent: number; modules: any[] }> {
    const groups: Array<{ stage: string; stageCode: string; totalAllocated: number; totalSpent: number; modules: any[] }> = [];
    const map = new Map<string, { stage: string; stageCode: string; totalAllocated: number; totalSpent: number; modules: any[] }>();

    this.filteredBudgetGanttData.forEach(item => {
      const key = item.stageCode;
      if (!map.has(key)) {
        const group = {
          stage: item.stage,
          stageCode: item.stageCode,
          totalAllocated: 0,
          totalSpent: 0,
          modules: []
        };
        map.set(key, group);
        groups.push(group);
      }
      const group = map.get(key)!;
      group.modules.push(item);
      group.totalAllocated += item.allocated;
      group.totalSpent += item.spent;
    });

    return groups;
  }

  renderVariancePieChart() {
    const containerId = 'variancePieChartContainer';
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.varianceChart) {
      this.varianceChart.destroy();
      this.varianceChart = null;
    }

    const stageItems = this.filteredBudgetGanttData.filter(d =>
      d.stageCode?.toUpperCase() === this.selectedVarianceStage?.toUpperCase()
    );

    const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

    const pieData = stageItems.map((item, idx) => ({
      name: this.moduleShortForms[item.module] || item.module,
      fullName: item.module,
      y: item.allocated,
      spent: item.spent,
      variance: item.allocated - item.spent,
      completion: item.completion,
      color: colors[idx % colors.length]
    }));

    const stageObj = this.varianceStages.find(s => s.key === this.selectedVarianceStage);
    const stageFullName = stageObj ? stageObj.fullName : '';

    this.varianceChart = Highcharts.chart(containerId, {
      chart: {
        type: 'pie',
        height: 480,
        backgroundColor: '#ffffff'
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadCSV',
              'downloadXLS',
              'viewData'
            ]
          }
        }
      },
      title: {
        text: `${this.selectedVarianceStage} - Budget Summary`,
        align: 'left',
        style: { fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }
      },
      subtitle: {
        text: `Budget distribution across deliverables (${this.selectedBudgetProject})`,
        align: 'left',
        style: { color: '#64748b', fontSize: '13px' }
      },
      credits: { enabled: false },
      tooltip: {
        useHTML: true,
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        borderRadius: 8,
        shadow: true,
        formatter: function (this: any) {
          const p = this.point as any;
          return `<div style="padding: 6px; font-family: inherit;">
                    <div style="font-weight: 700; font-size: 13px; color: #1e293b; margin-bottom: 4px;">${p.fullName || this.key}</div>
                    <div style="font-size: 12px; color: #475569; line-height: 1.6;">
                      <div>Allocated: <b style="color: #1e293b;">$${Highcharts.numberFormat(this.y, 0)}</b> (${this.percentage.toFixed(1)}%)</div>
                      <div>Actual Spent: <b style="color: #2563eb;">$${Highcharts.numberFormat(p.spent, 0)}</b> (${p.completion}% used)</div>
                      <div>Variance: <b style="color: ${p.variance >= 0 ? '#10b981' : '#ef4444'};">$${Highcharts.numberFormat(p.variance, 0)}</b></div>
                    </div>
                  </div>`;
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            distance: -30,
            useHTML: true,
            formatter: function (this: any) {
              return `<div style="text-align: center; color: #ffffff; font-weight: bold; font-size: 11px; text-shadow: 0 1px 2px rgba(0,0,0,0.6);">${this.percentage.toFixed(0)}%</div>`;
            }
          }
        }
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemMarginTop: 8,
        itemMarginBottom: 8,
        useHTML: true,
        itemStyle: { color: '#334155', fontSize: '12px', fontWeight: '500' },
        labelFormatter: function (this: any) {
          const p = this as any;
          const shortName = p.name || '';
          return `<div style="display: flex; align-items: center; justify-content: space-between; width: 190px;" title="${p.fullName || shortName}">
                    <span style="max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block;">${shortName}</span>
                    <span style="font-weight: 700; color: #1e293b; margin-left: 8px;">$${Highcharts.numberFormat(p.y, 0)}</span>
                  </div>`;
        }
      },
      series: [{
        type: 'pie',
        name: 'Allocated Budget',
        innerSize: '0%',
        data: pieData
      }]
    } as any);
  }
}
