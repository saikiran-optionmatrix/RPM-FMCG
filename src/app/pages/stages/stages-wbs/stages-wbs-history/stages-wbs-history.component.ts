import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface WbsActivityHistoryRecord {
  id?: number | string;
  slNo: string;
  activity: string;
  activityCode: string;
  tasks: string;
  requirements: string;
  predecessor: string;
  duration: string;
  effort: string;
  cost: string;
  applicability: string;
  description: string;
  revision?: string;
  changedDate?: string;
}

@Component({
  selector: 'app-stages-wbs-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './stages-wbs-history.component.html',
  styleUrl: './stages-wbs-history.component.scss',
})
export class StagesWbsHistoryComponent implements OnInit {
  slNo: string = '';
  activityName: string = '';
  activityCode: string = '';
  tasks: string = '';
  requirements: string = '';
  predecessor: string = '';
  duration: string = '';
  effort: string = '';
  cost: string = '';
  applicability: string = '';
  description: string = '';

  stageCode: string = '';
  stageName: string = '';
  gateCode: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: WbsActivityHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['slNo']) this.slNo = params['slNo'];
      if (params['task']) this.activityName = params['task'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['tasks']) this.tasks = params['tasks'];
      if (params['requirements']) this.requirements = params['requirements'];
      if (params['predecessor']) this.predecessor = params['predecessor'];
      if (params['duration']) this.duration = params['duration'];
      if (params['effort']) this.effort = params['effort'];
      if (params['cost']) this.cost = params['cost'];
      if (params['applicability']) this.applicability = params['applicability'];
      if (params['description']) this.description = params['description'];

      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curSlNo = this.slNo || '1.1.1';
    const curActivity = this.activityName || 'Map consumption occasions and unmet consumer jobs';
    const curCode = this.activityCode || 'FMCG-A-0001';
    const curTasks = this.tasks || '4';
    const curReqs = this.requirements || '2';
    const curPred = this.predecessor || '—';
    const curDuration = this.duration || '0';
    const curEffort = this.effort || '0';
    const rawCost = this.cost || '1200000';
    const curCost = rawCost.startsWith('$') ? rawCost : `$${Number(rawCost).toLocaleString()}`;
    const curApplicability = this.applicability || 'All FMCG Products';
    const curDescription = this.description || 'Execute consumer occasion mapping and identify category unmet needs.';

    // Historical revisions for the selected activity
    const selectedRevisions: WbsActivityHistoryRecord[] = [
      {
        id: 1,
        slNo: curSlNo,
        activity: curActivity,
        activityCode: curCode,
        tasks: curTasks,
        requirements: curReqs,
        predecessor: curPred,
        duration: curDuration,
        effort: curEffort,
        cost: curCost,
        applicability: curApplicability,
        description: curDescription,
        revision: 'Rev 3 (Current)',
        changedDate: '2026-02-15'
      },
      {
        id: 2,
        slNo: curSlNo,
        activity: curActivity,
        activityCode: curCode,
        tasks: '6',
        requirements: '5',
        predecessor: '—',
        duration: '3',
        effort: '24',
        cost: '$2,400',
        applicability: curApplicability,
        description: 'Adjusted consumer cohort size for regional market segmentation.',
        revision: 'Rev 2',
        changedDate: '2026-01-20'
      },
      {
        id: 3,
        slNo: curSlNo,
        activity: curActivity,
        activityCode: curCode,
        tasks: '4',
        requirements: '4',
        predecessor: '—',
        duration: '4',
        effort: '32',
        cost: '$3,200',
        applicability: curApplicability,
        description: 'Initial activity draft and workflow baseline.',
        revision: 'Rev 1',
        changedDate: '2026-01-05'
      }
    ];

    // Other activity records from the catalog
    const otherActivities: WbsActivityHistoryRecord[] = [
      {
        id: 4,
        slNo: '1.1.1',
        activity: 'Map consumption occasions and unmet consumer jobs',
        activityCode: 'FMCG-A-0001',
        tasks: '4',
        requirements: '2',
        predecessor: '—',
        duration: '21',
        effort: '70',
        cost: '$978',
        applicability: 'All FMCG Products',
        description: 'Occasion-by-segment opportunity map with demand evidence',
        revision: 'Rev 2'
      },
      {
        id: 5,
        slNo: '1.1.2',
        activity: 'Benchmark competitor portfolio and pack-price architecture',
        activityCode: 'FMCG-A-0002',
        tasks: '4',
        requirements: '4',
        predecessor: '1.1.1 (FS)',
        duration: '15',
        effort: '85',
        cost: '$1,214',
        applicability: 'All FMCG Products',
        description: 'Competitor SKU, unit-price and pack-size benchmark',
        revision: 'Rev 1'
      },
      {
        id: 6,
        slNo: '1.2.1',
        activity: 'Synthesize category trends, macro drivers and channel shifts',
        activityCode: 'FMCG-A-0003',
        tasks: '3',
        requirements: '3',
        predecessor: '1.1.2 (FS)',
        duration: '14',
        effort: '60',
        cost: '$850',
        applicability: 'All FMCG Products',
        description: 'Category growth forecasts, channel split and emerging consumer behaviors',
        revision: 'Rev 1'
      },
      {
        id: 7,
        slNo: '2.1.1',
        activity: 'Draft preliminary Target Product Profile (TPP) and concept boards',
        activityCode: 'FMCG-A-0011',
        tasks: '4',
        requirements: '3',
        predecessor: '—',
        duration: '18',
        effort: '95',
        cost: '$1,500',
        applicability: 'All FMCG Products',
        description: 'Consumer concept statements, benefit hierarchy and pack claims',
        revision: 'Rev 2'
      },
      {
        id: 8,
        slNo: '2.1.2',
        activity: 'Screen concept propositions with consumer panel (Top 2 Box >= 75%)',
        activityCode: 'FMCG-A-0012',
        tasks: '5',
        requirements: '4',
        predecessor: '2.1.1 (FS)',
        duration: '20',
        effort: '110',
        cost: '$2,200',
        applicability: 'All FMCG Products',
        description: 'Quantitative consumer testing results and purchase intent validation',
        revision: 'Rev 1'
      },
      {
        id: 9,
        slNo: '4.1.1',
        activity: 'Compound bench-scale formulation variants across sweetness and flavor levels',
        activityCode: 'FMCG-A-0031',
        tasks: '5',
        requirements: '3',
        predecessor: '—',
        duration: '25',
        effort: '140',
        cost: '$3,800',
        applicability: 'All FMCG Products',
        description: 'Formulation recipe optimization and sensory hedonic scorecards',
        revision: 'Rev 1'
      }
    ];

    const filteredOther = otherActivities.filter(
      a => a.activity.toLowerCase() !== curActivity.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredOther];
  }

  get paginatedRecords(): WbsActivityHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/stages/wbs'], {
      queryParams: {
        stageCode: this.stageCode || 'S1',
        stageName: this.stageName || 'Business Case',
        gateCode: this.gateCode || 'Gate 1'
      }
    });
  }
}
