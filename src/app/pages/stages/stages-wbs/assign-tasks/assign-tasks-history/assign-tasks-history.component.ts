import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface AssignTaskHistoryItem {
  id?: number | string;
  taskName: string;
  taskCode: string;
  jobCode: string;
  revision?: string;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-assign-tasks-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './assign-tasks-history.component.html',
  styleUrl: './assign-tasks-history.component.scss',
})
export class AssignTasksHistoryComponent implements OnInit {
  taskName: string = '';
  taskCode: string = '';
  jobCode: string = '';

  activityName: string = '';
  activityCode: string = '';
  stageCode: string = '';
  stageName: string = '';
  gateCode: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: AssignTaskHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['taskName']) this.taskName = params['taskName'];
      if (params['taskCode']) this.taskCode = params['taskCode'];
      if (params['jobCode']) this.jobCode = params['jobCode'];

      if (params['activityName']) this.activityName = params['activityName'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curTaskName = this.taskName || 'Identify consumer trends, unmet pain points and category white-space opportunities';
    const curTaskCode = this.taskCode || 'TSK-1001';
    const curJobCode = this.jobCode || 'CINS-04';
    const count = this.historyCount || 3;

    const baseDates = [
      '2024-05-18 14:30',
      '2024-05-02 11:15',
      '2024-04-19 09:45',
      '2024-04-05 16:20',
      '2024-03-22 10:10',
      '2024-03-10 13:00'
    ];

    const users = [
      'Ananya Rao',
      'Dr. Priya Raman',
      'Vikram Singh',
      'Anita Desai',
      'Rajesh Kumar'
    ];

    const taskNameVariations = [
      curTaskName,
      `${curTaskName} - Initial Formulation Draft`,
      `${curTaskName} - Preliminary Specification Scope`,
      `${curTaskName} - Feasibility Outline`,
      `${curTaskName} - Baseline Proposal`
    ];

    const jobCodeVariations = [
      curJobCode,
      curJobCode === 'RND-01' ? 'RND-02' : 'RND-01',
      curJobCode === 'QA-01' ? 'RND-01' : 'QA-01',
      'BC01',
      'ACT1'
    ];

    const selectedRevisions: AssignTaskHistoryItem[] = [];

    for (let i = 0; i < count; i++) {
      const revNum = count - i;
      selectedRevisions.push({
        id: i + 1,
        taskName: i === 0 ? curTaskName : taskNameVariations[i % taskNameVariations.length],
        taskCode: curTaskCode,
        jobCode: i === 0 ? curJobCode : jobCodeVariations[i % jobCodeVariations.length],
        revision: `Rev ${revNum}`,
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Additional catalog tasks history records for reference and completeness
    const otherTasksCatalog: AssignTaskHistoryItem[] = [
      {
        id: 101,
        taskName: 'Identify consumer trends, unmet pain points and category white-space opportunities',
        taskCode: 'TSK-1001',
        jobCode: 'CINS-04',
        revision: 'Rev 3',
        changedDate: '2026-11-13 14:30',
        changedBy: 'Ananya Rao'
      },
      {
        id: 102,
        taskName: 'Analyze competitive landscape, brand share and price-pack architecture',
        taskCode: 'TSK-1002',
        jobCode: 'MKTG-02',
        revision: 'Rev 2',
        changedDate: '2026-11-10 11:15',
        changedBy: 'Rajesh Kumar'
      },
      {
        id: 103,
        taskName: 'Conduct focus group interviews and ethnographic shopper observation',
        taskCode: 'TSK-1003',
        jobCode: 'CINS-04',
        revision: 'Rev 3',
        changedDate: '2026-11-08 09:45',
        changedBy: 'Dr. Priya Raman'
      },
      {
        id: 104,
        taskName: 'Map sensory preferences, taste/texture profiles and benefit expectations',
        taskCode: 'TSK-1004',
        jobCode: 'SENS-01',
        revision: 'Rev 2',
        changedDate: '2026-11-05 16:20',
        changedBy: 'Anita Desai'
      },
      {
        id: 105,
        taskName: 'Formulate Target Product Profile (TPP) and product positioning charter',
        taskCode: 'TSK-1005',
        jobCode: 'CINS-04',
        revision: 'Rev 1',
        changedDate: '2026-10-28 10:10',
        changedBy: 'Vikram Singh'
      },
      {
        id: 106,
        taskName: 'Define target packaging format, sustainability targets and shelf impact goals',
        taskCode: 'TSK-1006',
        jobCode: 'PKG-01',
        revision: 'Rev 2',
        changedDate: '2026-10-20 15:30',
        changedBy: 'Vikram Singh'
      },
      {
        id: 107,
        taskName: 'Review regulatory classifications, permissible food/cosmetic ingredients and mandatory warnings',
        taskCode: 'TSK-1007',
        jobCode: 'REG-01',
        revision: 'Rev 1',
        changedDate: '2026-10-15 13:45',
        changedBy: 'Rajesh Kumar'
      },
      {
        id: 108,
        taskName: 'Model initial financial business case, Target COGS and retail margin expectations',
        taskCode: 'TSK-1008',
        jobCode: 'FIN-01',
        revision: 'Rev 1',
        changedDate: '2026-10-10 17:00',
        changedBy: 'Amit Patel'
      }
    ];

    const filteredCatalog = otherTasksCatalog.filter(
      t => t.taskCode.toLowerCase() !== curTaskCode.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): AssignTaskHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    if (this.stageCode || this.stageName) {
      this.router.navigate(['/stages/wbs'], {
        queryParams: {
          stageCode: this.stageCode || 'S1',
          stageName: this.stageName || 'Business Case',
          gateCode: this.gateCode || 'Gate 1'
        }
      });
    } else {
      this.location.back();
    }
  }
}
