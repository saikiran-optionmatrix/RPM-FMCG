import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface GateCriteriaHistoryRecord {
  id?: number | string;
  subject: string;
  description: string;
  guidelines?: string;
  priority: string | boolean;
  mandatory: boolean;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-gate-criteria-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './gate-criteria-history.component.html',
  styleUrl: './gate-criteria-history.component.scss',
})
export class GateCriteriaHistoryComponent implements OnInit {
  subject: string = '';
  description: string = '';
  priority: string | boolean = 'High';
  mandatory: boolean = true;
  gateContext: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: GateCriteriaHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['subject']) this.subject = params['subject'];
      if (params['description']) this.description = params['description'];
      if (params['priority'] !== undefined) {
        this.priority = params['priority'];
      }
      if (params['mandatory'] !== undefined) {
        this.mandatory = params['mandatory'] === 'true' || params['mandatory'] === true;
      }
      if (params['context']) this.gateContext = params['context'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  isPriority(val: any): boolean {
    return val === 'High' || val === true || val === 'true';
  }

  initHistoryRecords(): void {
    const curSubject = this.subject || 'Target segment, consumption occasion and unmet need supported by traceable consumer research';
    const curDesc = this.description || 'Target segment, consumption occasion and unmet need supported by traceable consumer research.';
    const curPriority = this.priority !== undefined ? this.priority : 'High';
    const curMandatory = this.mandatory !== undefined ? this.mandatory : true;
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
      `${curDesc} - Revised Guidelines & Compliance Scope`,
      `${curDesc} - Preliminary Specification Scope`,
      `${curDesc} - Baseline Assessment Outline`
    ];

    const selectedRevisions: GateCriteriaHistoryRecord[] = [];

    for (let i = 0; i < count; i++) {
      selectedRevisions.push({
        id: i + 1,
        subject: curSubject,
        description: i === 0 ? curDesc : descVariations[i % descVariations.length],
        guidelines: 'Guidelines.pdf',
        priority: i === 0 ? curPriority : (i % 2 === 0 ? 'High' : 'Medium'),
        mandatory: i === 0 ? curMandatory : (i % 2 === 0 ? true : false),
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Catalog gate criteria for complete reference
    const catalogCriteria: GateCriteriaHistoryRecord[] = [
    {
        "id": 101,
        "subject": "Target segment, consumption occasion and unmet need supported by traceable consumer research",
        "description": "Target segment, consumption occasion and unmet need supported by traceable consumer research",
        "guidelines": "Consumer_Research_Protocol.pdf",
        "priority": "High",
        "mandatory": true,
        "changedDate": "2026-11-13 14:30",
        "changedBy": "Ananya Rao"
    },
    {
        "id": 102,
        "subject": "Category size, competitive benchmarks and product price position documented",
        "description": "Category size, competitive benchmarks and product price position documented",
        "guidelines": "Market_Benchmark_Report.pdf",
        "priority": "High",
        "mandatory": true,
        "changedDate": "2026-11-10 10:20",
        "changedBy": "Rajesh Kumar"
    },
    {
        "id": 103,
        "subject": "Preferred formula selected against sensory, functional and commercial targets",
        "description": "Preferred formula selected against sensory, functional and commercial targets",
        "guidelines": "Sensory_Target_Scorecard.pdf",
        "priority": "High",
        "mandatory": true,
        "changedDate": "2026-11-05 16:00",
        "changedBy": "Dr. Priya Raman"
    },
    {
        "id": 104,
        "subject": "Prototype formulation complies with food/cosmetic safety standards and target shelf-life evidence",
        "description": "Prototype formulation complies with food/cosmetic safety standards and target shelf-life evidence",
        "guidelines": "Safety_Stability_Protocol.pdf",
        "priority": "High",
        "mandatory": true,
        "changedDate": "2026-10-28 11:35",
        "changedBy": "Anita Desai"
    },
    {
        "id": 105,
        "subject": "Consumer sensory and home-use test confirms benchmark parity or superiority",
        "description": "Consumer sensory and home-use test confirms benchmark parity or superiority",
        "guidelines": "Consumer_Sensory_Test_Summary.pdf",
        "priority": "High",
        "mandatory": true,
        "changedDate": "2026-10-20 09:50",
        "changedBy": "Vikram Singh"
    },
    {
        "id": 106,
        "subject": "Commercial quality specifications, release tests and lot genealogy approved",
        "description": "Commercial quality specifications, release tests and lot genealogy approved",
        "guidelines": "Commercial_QA_Specifications.pdf",
        "priority": "High",
        "mandatory": true,
        "changedDate": "2026-10-15 15:40",
        "changedBy": "Anita Desai"
    }
];

    const filteredCatalog = catalogCriteria.filter(
      c => c.subject.toLowerCase() !== curSubject.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): GateCriteriaHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onDownloadGuidelines(item: GateCriteriaHistoryRecord): void {
    console.log('Downloading guidelines for:', item.subject);
  }

  goBack(): void {
    if (this.gateContext) {
      this.router.navigate(['/gates', this.gateContext]);
    } else {
      this.location.back();
    }
  }
}
