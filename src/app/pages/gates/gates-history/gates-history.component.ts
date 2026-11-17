import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface GateHistoryRecord {
  id?: number | string;
  status: boolean;
  gateCode: string;
  name: string;
  division: string;
  description: string;
  stageCode: string;
  workflow: string;
  count: number;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-gates-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './gates-history.component.html',
  styleUrl: './gates-history.component.scss',
})
export class GatesHistoryComponent implements OnInit {
  gateCode: string = '';
  gateName: string = '';
  stageCode: string = '';
  division: string = '';
  description: string = '';
  workflow: string = '';
  count: number = 0;
  status: boolean = true;
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: GateHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['gateName']) this.gateName = params['gateName'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['division']) this.division = params['division'];
      if (params['description']) this.description = params['description'];
      if (params['workflow']) this.workflow = params['workflow'];
      if (params['count']) this.count = Number(params['count']) || 0;
      if (params['status'] !== undefined) this.status = params['status'] === 'true' || params['status'] === true;
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curCode = this.gateCode || 'Gate 1';
    const curName = this.gateName || 'Product Concept Selection';
    const curStage = this.stageCode || 'S2';
    const curDiv = this.division || 'Beverages - BV, Personal Care & Beauty - PC';
    const curDesc = this.description || 'Formal decision gate to evaluate target consumer segment, occasion, unmet need, competitive positioning, preliminary packaging and formulation feasibility, and program charter.';
    const curWorkflow = this.workflow || '3/5';
    const curCount = this.count || 7;
    const curStatus = this.status !== undefined ? this.status : true;
    const count = this.historyCount || 3;

    const baseDates = [
      '2026-02-15 14:30',
      '2026-01-20 11:15',
      '2025-12-10 09:45',
      '2025-11-05 16:20',
      '2025-10-12 10:10'
    ];

    const users = [
      'Ananya Rao',
      'Dr. Priya Raman',
      'Vikram Singh',
      'Anita Desai',
      'Rajesh Kumar'
    ];

    const descVariations = [
      curDesc,
      `${curDesc} - Revised Checklist & Workflow Scope`,
      `${curDesc} - Initial Specification Baseline`,
      `${curDesc} - Concept Review Draft`
    ];

    const workflowVariations = [
      curWorkflow,
      '2/5',
      '3/5',
      '1/5',
      '4/5'
    ];

    const countVariations = [
      curCount,
      Math.max(1, curCount - 1),
      Math.max(1, curCount - 2),
      Math.max(1, curCount + 1)
    ];

    const selectedRevisions: GateHistoryRecord[] = [];

    for (let i = 0; i < count; i++) {
      selectedRevisions.push({
        id: i + 1,
        status: i === 0 ? curStatus : true,
        gateCode: curCode,
        name: curName,
        division: curDiv,
        description: i === 0 ? curDesc : descVariations[i % descVariations.length],
        stageCode: curStage,
        workflow: i === 0 ? curWorkflow : workflowVariations[i % workflowVariations.length],
        count: i === 0 ? curCount : countVariations[i % countVariations.length],
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Catalog gates for rich history reference
    const catalogGates: GateHistoryRecord[] = [
    {
        "id": 101,
        "status": true,
        "gateCode": "Gate 1",
        "name": "Product Concept Selection",
        "division": "Beverages - BV, Packaged Foods & Snacks - FS",
        "description": "Formal decision gate to evaluate target consumer segment, occasion, unmet need, competitive positioning, preliminary packaging and formulation feasibility, and program charter.",
        "stageCode": "S2",
        "workflow": "3/5",
        "count": 7,
        "changedDate": "2026-11-13 14:30",
        "changedBy": "Ananya Rao"
    },
    {
        "id": 102,
        "status": true,
        "gateCode": "Gate 2",
        "name": "Product Concept & Formula Selection",
        "division": "Beverages - BV, Personal Care & Beauty - PC",
        "description": "Lock preferred prototype formula, target ingredient specifications, preliminary sensory scores, target shelf life, and packaging compatibility.",
        "stageCode": "S5",
        "workflow": "2/5",
        "count": 6,
        "changedDate": "2026-11-10 10:20",
        "changedBy": "Dr. Priya Raman"
    },
    {
        "id": 103,
        "status": true,
        "gateCode": "Gate 3",
        "name": "Product Concept & Feasibility Approval",
        "division": "Personal Care & Beauty - PC, Dairy & Nutrition - DN",
        "description": "Approve consumer sensory acceptance, preliminary stability, packaging integrity, food/cosmetic safety assessment, and unit economics feasibility.",
        "stageCode": "S7",
        "workflow": "4/5",
        "count": 8,
        "changedDate": "2026-11-05 16:00",
        "changedBy": "Vikram Singh"
    },
    {
        "id": 104,
        "status": true,
        "gateCode": "Gate 4",
        "name": "Consumer Validation & Product Performance Proof",
        "division": "Beverages - BV, Home Care - HC",
        "description": "Validate pilot run yields, sensory equivalence at scale, packaging line machinability, extended shelf-life confirmation, and blind consumer test hurdles.",
        "stageCode": "S10",
        "workflow": "5/5",
        "count": 7,
        "changedDate": "2026-10-28 11:35",
        "changedBy": "Anita Desai"
    },
    {
        "id": 105,
        "status": true,
        "gateCode": "Gate 5",
        "name": "Market Launch & Regulatory Compliance Readiness",
        "division": "Beverages - BV, Personal Care & Beauty - PC, Packaged Foods & Snacks - FS",
        "description": "Verify commercial plant qualification, statutory regulatory filings, certified packaging artwork, supply chain inventory, and commercial launch clearance.",
        "stageCode": "S11",
        "workflow": "5/5",
        "count": 9,
        "changedDate": "2026-10-15 15:40",
        "changedBy": "Rajesh Kumar"
    }
];

    const filteredCatalog = catalogGates.filter(
      g => g.gateCode.toLowerCase() !== curCode.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): GateHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/gates']);
  }
}
