import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface BudgetItem {
  stage: string;
  module: string;
  task: string;
  allocation: string;
  standardHours: number;
  actualHours: number;
  budgetINR: number;
  usageINR: number;
  completion: number;
}

@Component({
  selector: 'app-project-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './project-budget.component.html',
  styleUrl: './project-budget.component.scss'
})
export class ProjectBudgetComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = this.route.snapshot.queryParamMap.get('projectName') || this.route.snapshot.queryParamMap.get('name') || 'Vitamin-Enriched Fruit Beverage 250ml';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/FMCG/006';

  allRows: BudgetItem[] = [
    { stage: 'S1 - Business Case', module: 'Feasibility', task: 'Reference Product and Market Assessment', allocation: 'PR', standardHours: 160, actualHours: 112, budgetINR: 140000, usageINR: 126000, completion: 70 },
    { stage: 'S3 - product formulation & food-grade ingredient / processing aid Procurement', module: 'product formulation Sourcing', task: 'Host product formulation and Vector Characterization', allocation: 'AR', standardHours: 240, actualHours: 156, budgetINR: 220000, usageINR: 205000, completion: 65 },
    { stage: 'S3 - product formulation & food-grade ingredient / processing aid Procurement', module: 'food-grade ingredient / processing aid Qualification', task: 'packaging substrate and Resin Compatibility Screening', allocation: 'SK', standardHours: 200, actualHours: 120, budgetINR: 180000, usageINR: 168000, completion: 60 },
    { stage: 'S4 - POC Expression & ingredient refining', module: 'Construct Design', task: 'Expression Vector and Clone Design', allocation: 'MK', standardHours: 320, actualHours: 176, budgetINR: 300000, usageINR: 274000, completion: 55 },
    { stage: 'S4 - POC Expression & ingredient refining', module: 'Clone Screening', task: 'Clone Screening and Selection (Titer)', allocation: 'RK', standardHours: 280, actualHours: 140, budgetINR: 260000, usageINR: 234000, completion: 50 },
    { stage: 'S4 - POC Expression & ingredient refining', module: 'Pilot Expression', task: 'Shake-Flask and Bench-Scale Expression Runs', allocation: 'PS', standardHours: 360, actualHours: 162, budgetINR: 340000, usageINR: 302000, completion: 45 },
    { stage: 'S4 - POC Expression & ingredient refining', module: 'Analytical Testing', task: 'Purity, Charge Variant and Glycan Profiling', allocation: 'VN', standardHours: 300, actualHours: 120, budgetINR: 280000, usageINR: 235000, completion: 40 },
    { stage: 'S4 - POC Expression & ingredient refining', module: 'product performance and quality test', task: 'product efficacy and performance product performance and quality test Development', allocation: 'SK', standardHours: 260, actualHours: 90, budgetINR: 240000, usageINR: 209000, completion: 35 },
    { stage: 'S4 - POC Expression & ingredient refining', module: 'Process Optimization', task: 'Upstream Titer and ingredient refining Yield Optimization', allocation: 'DR', standardHours: 340, actualHours: 102, budgetINR: 320000, usageINR: 240000, completion: 30 }
  ];

  displayedRows: BudgetItem[] = [];
  stages: string[] = [];
  modules: string[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
    });
    this.stages = [...new Set(this.allRows.map(r => r.stage))];
    this.modules = [...new Set(this.allRows.map(r => r.module))];
    this.displayedRows = [...this.allRows];
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  applyFilters(stage: string, module: string): void {
    this.displayedRows = this.allRows.filter(r =>
      (!stage || stage === 'Any' || r.stage === stage) &&
      (!module || module === 'Any' || r.module === module)
    );
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-US').format(n);
  }

  getCompColor(val: number): string {
    if (val >= 50) return '#4caf50'; // Green
    if (val >= 35) return '#ff9800'; // Orange
    return '#f44336'; // Red
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/FMCG/006", name: this.projectName || "Vitamin-Enriched Fruit Beverage 250ml" }
    });
  }
}
