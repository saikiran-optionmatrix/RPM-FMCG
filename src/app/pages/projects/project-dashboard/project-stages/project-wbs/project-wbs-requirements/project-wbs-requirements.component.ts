import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { WbsActivityItem } from '../project-wbs.component';
import { AddWbsRequirementComponent } from './add-wbs-requirement/add-wbs-requirement.component';
import { DocumentsPopComponent } from '../../../../../../common/shared/documents-pop/documents-pop.component';

export interface RequirementItem {
  id?: string | number;
  active: boolean;
  done: boolean;
  requirementName: string;
  department: string;
  role: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<RequirementItem>;
}

@Component({
  selector: 'app-project-wbs-requirements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './project-wbs-requirements.component.html',
  styleUrl: './project-wbs-requirements.component.scss',
})
export class ProjectWbsRequirementsComponent implements OnInit {
  @Input() activity?: WbsActivityItem | null;
  @Input() stageName?: string;
  @Input() stageCode?: string;
  @Input() gateName?: string;
  @Input() gateCode?: string;
  @Input() projectName?: string;
  @Input() projectCode?: string;
  @Output() back = new EventEmitter<any>();

  title: string = 'Assign Requirements';
  pageIndex = 0;
  pageSize = 5;
  source?: string;

  requirementsList: RequirementItem[] = [];

  readonly historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];
  readonly documentsSequence: number[] = [2, 4, 1, 3, 5, 2, 3, 1, 4, 2, 5, 3];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  get paginatedRequirements(): RequirementItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.requirementsList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<ProjectWbsRequirementsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
    @Optional() private route?: ActivatedRoute,
    @Optional() private router?: Router,
    @Optional() private location?: Location
  ) {}

  ngOnInit(): void {
    this.route?.queryParams.subscribe(params => {
      if (params['activityName'] && !this.activity) {
        this.activity = {
          id: 0,
          activityName: params['activityName'],
          jobCode: params['jobCode'] || '',
          department: params['department'] || '',
          responsibility: '',
          priority: 'High',
          status: true,
          requirements: params['requirements']
        };
      }
      if (params['stageName'] && !this.stageName) this.stageName = params['stageName'];
      if (params['stageCode'] && !this.stageCode) this.stageCode = params['stageCode'];
      if (params['gateName'] && !this.gateName) this.gateName = params['gateName'];
      if (params['gateCode'] && !this.gateCode) this.gateCode = params['gateCode'];
      if (params['projectName'] && !this.projectName) this.projectName = params['projectName'];
      if (params['projectCode'] && !this.projectCode) this.projectCode = params['projectCode'];
      if (params['code'] && !this.projectCode) this.projectCode = params['code'];
      if (params['source']) this.source = params['source'];
    });

    if (this.data?.row && !this.activity) {
      this.activity = this.data.row;
    }

    if (this.activity?.activityName) {
      this.title = `Requirements — ${this.activity.activityName}`;
    } else if (this.data?.title) {
      this.title = this.data.title;
    } else {
      this.title = 'Assign Requirements';
    }

    this.initRequirementsList();
  }

  private initRequirementsList(): void {
    if (this.activity?.requirementsData && Array.isArray(this.activity.requirementsData)) {
      this.requirementsList = this.activity.requirementsData.map((item: any, index: number) => ({
        ...item,
        historyCount: item.historyCount || this.getHistoryCount(index),
        documentsCount: item.documentsCount || this.getDocumentsCount(index),
        isEditing: false
      }));
      return;
    }

    if (this.data?.row?.requirementsData && Array.isArray(this.data.row.requirementsData)) {
      this.requirementsList = this.data.row.requirementsData.map((item: any, index: number) => ({
        ...item,
        historyCount: item.historyCount || this.getHistoryCount(index),
        documentsCount: item.documentsCount || this.getDocumentsCount(index),
        isEditing: false
      }));
      return;
    }

    let targetCount = 6;
    if (this.activity?.requirements) {
      const parsed = parseInt(String(this.activity.requirements).split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) targetCount = parsed;
    }

    const baseCatalog: RequirementItem[] = [
      {
            "active": true,
            "done": true,
            "requirementName": "Sensory Benchmarking: Overall hedonic liking >= 7.5 on 9-point scale against market leader",
            "department": "Sensory & Consumer Science",
            "role": "Sensory Panel Lead",
            "dueDate": "2026-05-15",
            "completedDate": "2026-05-14",
            "remarks": "Consumer blind taste test confirmed target parity and preference in key taste attributes",
            "isEditing": false
      },
      {
            "active": true,
            "done": true,
            "requirementName": "Brix, Acidity & pH Formulation Stability Specification (pH 3.6 - 3.8, Brix 11.2 - 11.5)",
            "department": "R&D & Product Innovation",
            "role": "Lead Formulation Scientist",
            "dueDate": "2026-06-01",
            "completedDate": "2026-05-31",
            "remarks": "Benchtop prototype physicochemical stability verified under 30-day thermal stress",
            "isEditing": false
      },
      {
            "active": true,
            "done": true,
            "requirementName": "FSSAI Food Additive Permissibility & Positive List Dosage Verification",
            "department": "Regulatory Affairs & Compliance",
            "role": "Food Safety & FSSAI Specialist",
            "dueDate": "2026-05-20",
            "completedDate": "2026-05-19",
            "remarks": "Nutrient premix and acidity regulators fully aligned with FSSAI proprietary food standards",
            "isEditing": false
      },
      {
            "active": true,
            "done": true,
            "requirementName": "Food-Grade Aseptic Barrier Packaging: Oxygen & Moisture Transmission Rate (OTR < 0.5 cc/m2/day)",
            "department": "Packaging Development",
            "role": "Packaging Engineering Lead",
            "dueDate": "2026-05-10",
            "completedDate": "2026-05-09",
            "remarks": "Multi-layer PET bottle and barrier closure validated for 12-month ambient shelf life",
            "isEditing": false
      },
      {
            "active": true,
            "done": true,
            "requirementName": "Microbial Quality Acceptance Criteria: Total Plate Count < 10 CFU/ml, Zero Yeast & Mold",
            "department": "Quality Assurance",
            "role": "Microbial Quality Specialist",
            "dueDate": "2026-05-12",
            "completedDate": "2026-05-11",
            "remarks": "Aseptic incubation challenge tests passed with zero pathogen growth at 37°C",
            "isEditing": false
      },
      {
            "active": true,
            "done": false,
            "requirementName": "Nutritional Claims & Front-of-Pack Labeling (FOPL) Compliance Review",
            "department": "Regulatory Affairs & Compliance",
            "role": "Labeling Claims Officer",
            "dueDate": "2026-06-05",
            "completedDate": "",
            "remarks": "Vitamin enrichment claims dossier pending final legal and regulatory sign-off",
            "isEditing": false
      },
      {
            "active": true,
            "done": true,
            "requirementName": "Supply Chain Cold-Chain Integrity: Maximum 4°C - 8°C Transit Temperature Logger Protocol",
            "department": "Supply Chain & Sourcing",
            "role": "Cold-Chain Logistics Specialist",
            "dueDate": "2026-05-25",
            "completedDate": "2026-05-24",
            "remarks": "Reefer vehicle qualification and data logger placement guidelines baselined",
            "isEditing": false
      },
      {
            "active": true,
            "done": false,
            "requirementName": "ISTA 3A Transit Vibration & 1.2m Case Drop Test Clearance (Zero Bottle Leakage)",
            "department": "Packaging Development",
            "role": "Packaging Line Engineer",
            "dueDate": "2026-06-15",
            "completedDate": "",
            "remarks": "Pallet shake and drop testing underway at packaging testing laboratory",
            "isEditing": false
      },
      {
            "active": true,
            "done": true,
            "requirementName": "HTST Continuous Pasteurization Lethality (F0 >= 5.0, 95°C for 30s) Verification",
            "department": "Pilot & Commercial Manufacturing",
            "role": "Pilot Process Engineer",
            "dueDate": "2026-05-18",
            "completedDate": "2026-05-18",
            "remarks": "Plate heat exchanger thermal lethality verified with RTD sensor datalogging",
            "isEditing": false
      },
      {
            "active": true,
            "done": false,
            "requirementName": "Clean-In-Place (CIP) 3-Stage Caustic/Acid Sanitation Protocol Clearance",
            "department": "Quality Assurance",
            "role": "Hygiene & Food Safety Lead",
            "dueDate": "2026-06-20",
            "completedDate": "",
            "remarks": "CIP swab testing and ATP bioluminescence hygiene validation scheduled for commercial line",
            "isEditing": false
      }
];

    this.requirementsList = Array.from({ length: targetCount }, (_, i) => {
      const template = baseCatalog[i % baseCatalog.length];
      return {
        id: Date.now() + i,
        active: template.active ?? true,
        done: template.done ?? (i < 3),
        requirementName: template.requirementName || `Requirement ${i + 1}`,
        department: template.department || 'Analytical',
        role: template.role || 'Scientist',
        dueDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        completedDate: template.completedDate || (i < 3 ? `2026-02-${String(9 + (i % 18)).padStart(2, '0')}` : ''),
        remarks: template.remarks || 'Standard requirement',
        historyCount: this.getHistoryCount(i),
        documentsCount: this.getDocumentsCount(i),
        updatedDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        updatedBy: this.activity?.responsibility || 'Dr. Sarah Jenkins',
        isEditing: false
      };
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  


  addRequirement(): void {
    const dialogRef = this.dialog.open(AddWbsRequirementComponent, {
      width: '700px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newReq: RequirementItem = {
          id: Date.now(),
          active: true,
          done: false,
          requirementName: result.requirementName ?? '',
          department: result.department ?? 'Analytical',
          role: result.role ?? 'Scientist',
          dueDate: result.dueDate ?? '',
          completedDate: result.completedDate ?? '',
          remarks: result.remarks ?? '',
          historyCount: 1,
          updatedDate: new Date().toISOString().split('T')[0],
          updatedBy: this.activity?.responsibility || 'Dr. Sarah Jenkins',
          isEditing: false
        };
        this.requirementsList.unshift(newReq);
        this.pageIndex = 0;
      }
    });
  }

  startEdit(row: RequirementItem): void {
    row._backup = { ...row };
    row.isEditing = true;
  }

  saveRow(row: RequirementItem): void {
    row.isEditing = false;
    row.isNew = false;
    row.updatedDate = new Date().toISOString().split('T')[0];
    row.updatedBy = row.updatedBy || this.activity?.responsibility || 'Dr. Sarah Jenkins';
    delete row._backup;
  }

  cancelEdit(row: RequirementItem): void {
    if (row.isNew) {
      const idx = this.requirementsList.indexOf(row);
      if (idx !== -1) {
        this.requirementsList.splice(idx, 1);
      }
    } else if (row._backup) {
      Object.assign(row, row._backup);
      row.isEditing = false;
      delete row._backup;
    } else {
      row.isEditing = false;
    }
  }

  deleteRequirement(row: RequirementItem): void {
    const idx = this.requirementsList.indexOf(row);
    if (idx !== -1) {
      this.requirementsList.splice(idx, 1);
      const totalPages = Math.max(1, Math.ceil(this.requirementsList.length / this.pageSize));
      if (this.pageIndex >= totalPages) {
        this.pageIndex = Math.max(0, totalPages - 1);
      }
    }
  }

  save(): void {
    for (const r of this.requirementsList) {
      if (r.isEditing) {
        this.saveRow(r);
      }
    }

    const result = {
      requirements: this.requirementsList,
      count: this.requirementsList.length
    };

    if (this.activity) {
      this.activity.requirementsData = this.requirementsList;
    }

    if (this.dialogRef) {
      this.dialogRef.close(result);
    } else if (this.back.observed) {
      this.back.emit(result);
    } else {
      this.location?.back();
    }
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else if (this.back.observed) {
      this.back.emit();
    } else if (this.source === 'gates' || this.gateCode) {
      this.router?.navigate(['/projects/dashboard/gates/activities'], {
        queryParams: {
          gateCode: this.gateCode || this.route?.snapshot.queryParamMap.get('gateCode'),
          gateName: this.gateName || this.route?.snapshot.queryParamMap.get('gateName'),
          projectName: this.projectName || this.route?.snapshot.queryParamMap.get('projectName'),
          code: this.projectCode || this.route?.snapshot.queryParamMap.get('code') || this.route?.snapshot.queryParamMap.get('projectCode')
        }
      });
    } else if (this.source === 'activities') {
      this.router?.navigate(['/projects/dashboard/activities'], {
        queryParams: {
          projectName: this.projectName || this.route?.snapshot.queryParamMap.get('projectName'),
          code: this.projectCode || this.route?.snapshot.queryParamMap.get('code') || this.route?.snapshot.queryParamMap.get('projectCode')
        }
      });
    } else {
      this.location?.back();
    }
  }

  goBack(): void {
    this.close();
  }

  openHistory(row: RequirementItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    const currentUrl = this.router?.url || '';
    let targetPath = 'requirements/history';
    if (currentUrl.includes('/stages/wbs')) {
      targetPath = '/projects/dashboard/stages/wbs/requirements/history';
    } else if (currentUrl.includes('/wbs')) {
      targetPath = '/projects/dashboard/wbs/requirements/history';
    } else {
      targetPath = '/projects/dashboard/stages/wbs/requirements/history';
    }

    this.router?.navigate([targetPath], {
      queryParams: {
        requirementName: row.requirementName,
        active: row.active,
        done: row.done,
        department: row.department,
        role: row.role,
        dueDate: row.dueDate,
        completedDate: row.completedDate,
        remarks: row.remarks,
        activityName: this.activity?.activityName || '',
        jobCodeParam: this.activity?.jobCode || '',
        stageName: this.stageName || '',
        stageCode: this.stageCode || '',
        gateName: this.gateName || '',
        gateCode: this.gateCode || '',
        projectName: this.projectName || '',
        projectCode: this.projectCode || '',
        updatedDate: row.updatedDate || '',
        updatedBy: row.updatedBy || '',
        historyCount: historyCount
      },
      queryParamsHandling: 'merge'
    });
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
