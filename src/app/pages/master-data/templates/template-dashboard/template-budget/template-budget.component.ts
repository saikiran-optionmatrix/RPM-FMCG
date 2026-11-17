import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

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
  selector: 'app-template-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './template-budget.component.html',
  styleUrl: './template-budget.component.scss',
})
export class TemplateBudgetComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'New Beverage Product Development Program';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/FMCG/001';

  allRows: BudgetItem[] = [
  {
    "stage": "S1 - Consumer Need & Market Opportunity",
    "module": "Consumer & Market Analysis",
    "task": "Consumer occasions & unmet needs research",
    "allocation": "AR",
    "standardHours": 60,
    "actualHours": 58,
    "budgetINR": 65000,
    "usageINR": 62000,
    "completion": 100
  },
  {
    "stage": "S2 - Concept Screening & Feasibility",
    "module": "Product Concept Validation",
    "task": "Target Product Profile (TPP) baseline",
    "allocation": "PR",
    "standardHours": 80,
    "actualHours": 78,
    "budgetINR": 85000,
    "usageINR": 82000,
    "completion": 100
  },
  {
    "stage": "S3 - Product Formulation & Ingredient Sourcing",
    "module": "Benchtop Formulation",
    "task": "Food-grade ingredient vendor qualification",
    "allocation": "VS",
    "standardHours": 120,
    "actualHours": 115,
    "budgetINR": 140000,
    "usageINR": 135000,
    "completion": 100
  },
  {
    "stage": "S4 - POC Expression & Ingredient Refining",
    "module": "Recipe Optimization",
    "task": "Flavor profiling & sugar-acid balance",
    "allocation": "AD",
    "standardHours": 140,
    "actualHours": 95,
    "budgetINR": 160000,
    "usageINR": 110000,
    "completion": 68
  },
  {
    "stage": "S5 - Process Development & Lab Validation",
    "module": "Process & Homogenization",
    "task": "High-shear blending & thermal lethality",
    "allocation": "AP",
    "standardHours": 160,
    "actualHours": 90,
    "budgetINR": 190000,
    "usageINR": 105000,
    "completion": 55
  },
  {
    "stage": "S6 - Formulation Optimization",
    "module": "Sensory & Stability",
    "task": "Consumer sensory panel discrimination",
    "allocation": "AD",
    "standardHours": 110,
    "actualHours": 50,
    "budgetINR": 125000,
    "usageINR": 60000,
    "completion": 45
  },
  {
    "stage": "S7 - Pilot Plant Scale-up & Line Trials",
    "module": "Pilot Trials",
    "task": "5,000L pilot run & pasteurization check",
    "allocation": "AP",
    "standardHours": 200,
    "actualHours": 60,
    "budgetINR": 280000,
    "usageINR": 85000,
    "completion": 30
  },
  {
    "stage": "S8 - Packaging & Barrier Development",
    "module": "Structural Packaging",
    "task": "Barrier film OTR/WVTR and drop test",
    "allocation": "VS",
    "standardHours": 130,
    "actualHours": 35,
    "budgetINR": 150000,
    "usageINR": 42000,
    "completion": 25
  },
  {
    "stage": "S9 - Quality & Food Safety Clearance",
    "module": "FSMS & HACCP",
    "task": "Microbial challenge test & HACCP audit",
    "allocation": "AD",
    "standardHours": 90,
    "actualHours": 18,
    "budgetINR": 110000,
    "usageINR": 25000,
    "completion": 20
  },
  {
    "stage": "S10 - Regulatory Dossier & Labeling",
    "module": "FSSAI Compliance",
    "task": "Nutrition facts panel & claim validation",
    "allocation": "RK",
    "standardHours": 80,
    "actualHours": 12,
    "budgetINR": 95000,
    "usageINR": 15000,
    "completion": 15
  },
  {
    "stage": "S11 - Commercial Manufacturing Commissioning",
    "module": "Commercial Scale-Up",
    "task": "High-speed 400 bpm bottling run",
    "allocation": "AP",
    "standardHours": 220,
    "actualHours": 20,
    "budgetINR": 320000,
    "usageINR": 30000,
    "completion": 10
  },
  {
    "stage": "S12 - Launch & Market Rollout",
    "module": "Commercial Launch",
    "task": "Distributor pipeline fill & merchandising",
    "allocation": "AR",
    "standardHours": 150,
    "actualHours": 0,
    "budgetINR": 220000,
    "usageINR": 0,
    "completion": 0
  }
];

  displayedRows: BudgetItem[] = [];
  stages: string[] = [];
  modules: string[] = [];

  private subs = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    const sub = this.route.queryParams.subscribe((params) => {
      if (params['projectName'] || params['name'] || params['templateName']) {
        this.projectName = params['projectName'] || params['name'] || params['templateName'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
    });
    this.subs.add(sub);

    this.stages = [...new Set(this.allRows.map((r) => r.stage))];
    this.modules = [...new Set(this.allRows.map((r) => r.module))];
    this.displayedRows = [...this.allRows];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
    this.displayedRows = this.allRows.filter(
      (r) =>
        (!stage || stage === 'Any' || r.stage === stage) &&
        (!module || module === 'Any' || r.module === module),
    );
  }

  fmt(n: number): string {
    return new Intl.NumberFormat('en-IN').format(n);
  }

  getCompColor(val: number): string {
    if (val >= 50) return '#4caf50'; // Green
    if (val >= 35) return '#ff9800'; // Orange
    return '#f44336'; // Red
  }

  goBack(): void {
   this.router.navigate(['/master-data/templates']);
  }
}
