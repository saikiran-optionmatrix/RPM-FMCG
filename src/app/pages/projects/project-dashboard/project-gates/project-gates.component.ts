import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { ChecklistPopComponent, ChecklistItem } from './checklist-pop/checklist-pop.component';
import { ProjectGatesWorkflowComponent, GateWorkflowSignee } from './project-gates-workflow/project-gates-workflow.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';

export interface GateItem {
  id?: number;
  gateCode: string;
  gateName: string;
  status: 'Approved' | 'Pending' | 'On Hold' | 'Rejected' | 'Redirect pending' | 'Redirect';
  remarks: string;
  checklistCount: number;
  activitiesCount?: number;
  workflow?: string;
  signees?: GateWorkflowSignee[];
  checklistItems?: ChecklistItem[];
  updatedDate?: string;
  updatedBy?: string;
  timelineDate: string;
  planStart: string;
  planEnd: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  actualDuration?: string;
  planEffort?: string;
  actualEffort?: string;
  buffer?: string;
  description?: string;
  decision: 'Go' | 'Hold' | 'Kill' | 'Rework' | 'Redirect' | null;
  redirectToStage?: string;
  isReadonly?: boolean;
  historyCount?: number;
  documentsCount?: number;
}

@Component({
  selector: 'app-project-gates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './project-gates.component.html',
  styleUrl: './project-gates.component.scss',
})
export class ProjectGatesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  readonly projectName = this.route.snapshot.queryParamMap.get('projectName') || this.route.snapshot.queryParamMap.get('name') || 'Vitamin-Enriched Fruit Beverage 250ml';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/FMCG/006';

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

  redirectStageOptions: string[] = [
  "S1 - Consumer Need and Market Opportunity",
  "S2 - Market and Product Concept Validation",
  "S3 - Product Ideation and Concept Screening",
  "S4 - Product Formulation and Product Optimization",
  "S5 - Product Concept and Formula Selection",
  "S6 - Product Formulation and Manufacturing Process Development",
  "S7 - Prototype Testing and Product Safety Assessment",
  "S8 - Product Concept Approval Filing",
  "S9 - Concept and Feasibility Validation",
  "S10 - Pilot Production and Market Testing",
  "S11 - Commercial Scale-Up and Launch Preparation",
  "S12 - Regulatory Approval and Commercial Product Launch"
];

  gates: GateItem[] = [
  {
    "gateCode": "Gate 1",
    "gateName": "Product Concept Selection",
    "status": "Approved",
    "remarks": "Business case and program charter approved",
    "checklistCount": 7,
    "activitiesCount": 7,
    "workflow": "5/5",
    "decision": "Go",
    "documentsCount": 3,
    "updatedDate": "12-Mar-2026",
    "updatedBy": "Rajesh Kumar",
    "historyCount": 5,
    "timelineDate": "2026-03-12",
    "planStart": "2026-01-05",
    "planEnd": "2026-03-12",
    "checklistItems": [
      {
        "id": 1,
        "text": "Reference product and market assessment complete",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "Completed and verified by commercial team"
      },
      {
        "id": 2,
        "text": "FMCG market and competitor landscape and IP / FTO review",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "No patent infringements detected"
      },
      {
        "id": 3,
        "text": "Regulatory Affairs & Compliance pathway shortlist",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "FSSAI, CDSCO, and ASEAN target pathways documented"
      },
      {
        "id": 4,
        "text": "Business case and NPV approved",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "NPV meets hurdle rate of >15%"
      },
      {
        "id": 5,
        "text": "Budget and resource plan",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "Budget of $12.5M allocated"
      },
      {
        "id": 6,
        "text": "Risk register baselined",
        "mandatory": false,
        "status": "Yes",
        "done": true,
        "remarks": "Risk mitigations documented"
      },
      {
        "id": 7,
        "text": "Program charter signed",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "Steering committee sign-off obtained"
      }
    ]
  },
  {
    "gateCode": "Gate 2",
    "gateName": "Product Concept and Formula Selection",
    "status": "Pending",
    "remarks": "Product Concept and Formula Selection review pending completion of S5",
    "checklistCount": 4,
    "activitiesCount": 6,
    "workflow": "2/5",
    "decision": null,
    "documentsCount": 1,
    "updatedDate": "05-Oct-2026",
    "updatedBy": "Priya Reddy",
    "historyCount": 2,
    "timelineDate": "2026-08-15",
    "planStart": "2026-03-01",
    "planEnd": "2026-08-15",
    "checklistItems": [
      {
        "id": 1,
        "text": "Clone productivity and shelf-life Stability data",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "Sensory and nutrient stability baselines verified"
      },
      {
        "id": 2,
        "text": "Candidate process titer and quality attributes",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "Homogenization and viscosity parameters verified"
      },
      {
        "id": 3,
        "text": "Preliminary analytical similarity data",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "Nutritional profile matches leading benchmark"
      },
      {
        "id": 4,
        "text": "Master ingredient specification (MCB) plan",
        "mandatory": true,
        "status": "Yes",
        "done": true,
        "remarks": "Raw material and packaging specifications documented"
      },
      {
        "id": 5,
        "text": "Developability and Cost of Goods Sold (COGS) update",
        "mandatory": false,
        "status": "No",
        "done": false,
        "remarks": "In progress under S5"
      },
      {
        "id": 6,
        "text": "Product Concept and Formula Selection review",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": "Scheduled upon S5 completion"
      }
    ]
  },
  {
    "gateCode": "Gate 3",
    "gateName": "Product Concept and Feasibility Approval",
    "status": "Pending",
    "remarks": "Product Concept and Feasibility Approval review",
    "checklistCount": 0,
    "activitiesCount": 8,
    "workflow": "0/5",
    "decision": null,
    "documentsCount": 0,
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "timelineDate": "2026-09-30",
    "planStart": "2026-08-11",
    "planEnd": "2026-09-30",
    "checklistItems": [
      {
        "id": 1,
        "text": "Upstream and blending and finishing locked",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 2,
        "text": "Analytical similarity package complete",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 3,
        "text": "Product efficacy and performance test methods validated",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 4,
        "text": "Bulk product and finished consumer product validated",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 5,
        "text": "Shelf-life Stability data",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 6,
        "text": "Comparability to reference product",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 7,
        "text": "Product and Manufacturing Transfer readiness",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 8,
        "text": "QA review",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      }
    ]
  },
  {
    "gateCode": "Gate 4",
    "gateName": "Consumer Validation and Product Performance Proof",
    "status": "Pending",
    "remarks": "Consumer Validation and Product Performance Proof review",
    "checklistCount": 0,
    "activitiesCount": 7,
    "workflow": "0/5",
    "decision": null,
    "documentsCount": 0,
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "timelineDate": "2027-02-20",
    "planStart": "2026-12-21",
    "planEnd": "2027-02-20",
    "checklistItems": [
      {
        "id": 1,
        "text": "Non-consumer and market package",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 2,
        "text": "GMP consumer and market batch released",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 3,
        "text": "Consumer and market protocol finalized",
        "mandatory": false,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 4,
        "text": "Third-party testing and research partner and site qualification",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 5,
        "text": "Product Concept Approval dossier ready",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 6,
        "text": "Regulatory Affairs & Compliance scientific advice incorporated",
        "mandatory": false,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 7,
        "text": "Safety monitoring plan approved",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      }
    ]
  },
  {
    "gateCode": "Gate 5",
    "gateName": "Market Launch and Regulatory Readiness",
    "status": "Pending",
    "remarks": "Market Launch and Regulatory Affairs & Compliance Readiness review",
    "checklistCount": 0,
    "activitiesCount": 9,
    "workflow": "0/5",
    "decision": null,
    "documentsCount": 0,
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "timelineDate": "2027-06-30",
    "planStart": "2027-02-21",
    "planEnd": "2027-06-30",
    "checklistItems": [
      {
        "id": 1,
        "text": "Pivotal study report",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 2,
        "text": "Statistical and immunogenicity analysis",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 3,
        "text": "CMC module complete",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 4,
        "text": "Process validation (PPQ) data",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 5,
        "text": "Shelf-life Stability data",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 6,
        "text": "Labeling and device information",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 7,
        "text": "Pharmacovigilance plan",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 8,
        "text": "Market Launch / Regulatory Approval submission review",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      },
      {
        "id": 9,
        "text": "Final approval to file",
        "mandatory": true,
        "status": "No",
        "done": false,
        "remarks": ""
      }
    ]
  }
];

  // Pagination
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 0;
  pagedGatesList: GateItem[] = [];

  // Timeline Modal Popup State
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  // Add / Edit Gate Modal State
  showGateModal = false;
  gateModalStep = 1;
  isEditGateMode = false;
  gateModalData: Partial<GateItem> = {};
  gateModalIndex = -1;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  readonly historySequence: number[] = [5, 2, 3, 4, 5, 1, 6, 2, 4, 3, 5, 2, 6, 1, 4];
  readonly documentsSequence: number[] = [3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 5, 3];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.projectCode = params['code'];
      }
    });
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
    this.gates.forEach((g, idx) => {
      g.historyCount = this.historySequence[idx % this.historySequence.length];
      g.documentsCount = this.documentsSequence[idx % this.documentsSequence.length];
      if (!g.updatedBy) {
        g.updatedBy = defaultUpdaters[idx % defaultUpdaters.length];
      }
    });
    this.updatePagedGates();
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/FMCG/006", name: this.projectName || "Vitamin-Enriched Fruit Beverage 250ml" }
    });
  }

  // --- Pagination Logic ---
  updatePagedGates(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedGatesList = this.gates.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedGates();
  }

  get pagedGates(): GateItem[] {
    return this.pagedGatesList;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.gates.length / this.pageSize));
  }

  isGateZero(gate: GateItem): boolean {
    if (!gate) return false;
    return (
      (gate.gateName && gate.gateName.toLowerCase().includes('gate 0')) ||
      gate.gateCode === 'Gate 0' ||
      gate.gateCode === 'GT000'
    );
  }

  isGateReadonly(gate: GateItem): boolean {
    if (!gate) return false;
    if (gate.isReadonly !== undefined) return gate.isReadonly;
    return gate.gateCode === 'Gate 3' || gate.gateCode === 'Gate 4' || gate.gateCode === 'Gate 5';
  }

  getChecklistFraction(gate: GateItem): string {
    if (!gate) return '0/0';
    if (!gate.checklistItems || gate.checklistItems.length === 0) {
      return gate.checklistCount ? `${gate.checklistCount}/${gate.checklistCount}` : '0/0';
    }
    const completed = gate.checklistItems.filter(item => item.done).length;
    const total = gate.checklistItems.length;
    return `${completed}/${total}`;
  }

  getActivitiesCount(gate: GateItem): number {
    if (!gate) return 0;
    if (gate.activitiesCount !== undefined) return gate.activitiesCount;
    if (gate.checklistItems && gate.checklistItems.length > 0) return gate.checklistItems.length;
    return gate.checklistCount || 6;
  }

  navigateToActivities(gate: GateItem): void {
    this.router.navigate(['/projects/dashboard/gates/activities'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode || '2026/GEN/001',
        gateCode: gate.gateCode,
        gateName: gate.gateName
      }
    });
  }

  // --- Decision Checkbox Toggle (Go / Hold / Kill / Rework / Redirect) ---
  onDecisionChange(gate: GateItem, decisionType: 'Go' | 'Hold' | 'Kill' | 'Rework' | 'Redirect', checked: boolean): void {
    if (checked) {
      gate.decision = decisionType;
      gate.updatedDate = new Date().toISOString().split('T')[0];

      if (decisionType === 'Go') {
        gate.status = 'Approved';
      } else if (decisionType === 'Kill') {
        gate.status = 'Rejected';
      } else if (decisionType === 'Hold') {
        gate.status = 'On Hold';
      } else if (decisionType === 'Rework') {
        gate.status = 'Pending';
      } else if (decisionType === 'Redirect') {
        gate.status = 'Redirect pending';
      }
    } else {
      gate.decision = null;
      gate.status = 'Pending';
      gate.redirectToStage = undefined;
      gate.updatedDate = new Date().toISOString().split('T')[0];
    }
    this.cdr.detectChanges();
  }

  // --- Timeline Modal Actions ---
  openTimelineModal(item: GateItem): void {
    this.selectedTimelineItem = {
      ...item,
      name: item.gateName
    };
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  // --- Checklist Modal Actions (Opens ChecklistPopComponent Dialog) ---
  openChecklistModal(gate: GateItem): void {
    const dialogRef = this.dialog.open(ChecklistPopComponent, {
      width: '600px',
      data: {
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        checklistItems: gate.checklistItems || [],
        isReadonly: this.isGateReadonly(gate)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.checklistItems) {
        gate.checklistItems = result.checklistItems;
        gate.checklistCount = result.checklistItems.length;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Workflow Modal Actions (Opens ProjectGatesWorkflowComponent Dialog) ---
  openWorkflowModal(gate: GateItem): void {
    const dialogRef = this.dialog.open(ProjectGatesWorkflowComponent, {
      width: '650px',
      data: {
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        workflow: gate.workflow || '3/5',
        signees: gate.signees
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.workflow) {
          gate.workflow = result.workflow;
        }
        if (result.signees) {
          gate.signees = result.signees;
        }
        this.cdr.detectChanges();
      }
    });
  }

  // --- Add / Edit Gate Modal Actions ---
  openAddGate(): void {
    this.gateModalStep = 1;
    const nextNum = String(this.gates.length + 1).padStart(2, '0');
    this.gateModalData = {
      gateCode: 'Gate-' + nextNum,
      gateName: '',
      status: 'Pending',
      remarks: '',
      checklistCount: 0,
      workflow: '0/5',
      updatedDate: new Date().toISOString().split('T')[0],
      timelineDate: '',
      planStart: '',
      planEnd: '',
      actualStart: '',
      actualEnd: '',
      eta: '',
      planDuration: '',
      actualDuration: '',
      planEffort: '',
      actualEffort: '',
      buffer: '',
      description: '',
      decision: null,
      checklistItems: []
    };
    this.isEditGateMode = false;
    this.showGateModal = true;
    this.setBodyScrollLock(true);
  }

  openEditGate(gate: GateItem, index: number): void {
    const actualIndex = this.gates.findIndex(g => g === gate);
    this.gateModalStep = 1;
    this.gateModalData = { ...gate };
    this.isEditGateMode = true;
    this.gateModalIndex = actualIndex >= 0 ? actualIndex : index;
    this.showGateModal = true;
    this.setBodyScrollLock(true);
  }

  closeGateModal(): void {
    this.showGateModal = false;
    this.setBodyScrollLock(false);
  }

  saveGate(): void {
    if (!this.gateModalData.gateName || !this.gateModalData.gateCode) return;

    if (this.isEditGateMode && this.gateModalIndex > -1) {
      this.gates[this.gateModalIndex] = {
        ...this.gates[this.gateModalIndex],
        ...this.gateModalData
      } as GateItem;
    } else {
      this.gates.push(this.gateModalData as GateItem);
    }
    this.updatePagedGates();
    this.closeGateModal();
  }

  deleteGate(gate: GateItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this gate record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gates = this.gates.filter(g => g !== gate);
        if (this.currentPage >= this.pageCount) {
          this.currentPage = Math.max(0, this.pageCount - 1);
        }
        this.updatePagedGates();
      }
    });
  }

  private setBodyScrollLock(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }

  openHistory(gate?: any): void {
    const gateCode = (typeof gate === 'object' && gate !== null) ? gate.gateCode : '';
    const gateName = (typeof gate === 'object' && gate !== null) ? gate.gateName : (typeof gate === 'string' ? gate : 'Gate');

    this.router.navigate(['gates/history'], {
      relativeTo: this.route.parent,
      queryParams: {
        gateCode: gateCode,
        gateName: gateName
      },
      queryParamsHandling: 'merge'
    });
  }

   openFeasibilityReport(): void {
    window.open('/Feasibility%20Report.pdf', '_blank');
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
