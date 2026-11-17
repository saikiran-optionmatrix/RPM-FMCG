import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../../common/shared/documents-pop/documents-pop.component';

export interface GateActivityItem {
  id: number;
  activityName: string;
  jobCode: string;
  department: string;
  responsibility: string;
  priority: 'High' | 'Medium' | 'Low';
  status: boolean;
  done?: boolean;
  tasks?: string | number;
  activitiesCount?: string | number;
  activities?: string;
  requirements?: string;
  delayReason?: string;
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  planEffort?: string;
  actualDuration?: string;
  actualEffort?: string;
  buffer?: string;
  remarks?: string;
  description?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-proj-gates-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './proj-gates-activities.component.html',
  styleUrl: './proj-gates-activities.component.scss',
})
export class ProjGatesActivitiesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'New Beverage Product Development Program';
  projectCode: string = '2026/FMCG/001';
  gateCode: string = 'Gate 1';
  gateName: string = 'Business Case';

  isFilterVisible: boolean = false;
  filterDepartment: string = '';
  filterPriority: string = '';
  filterStatus: string = '';

  departments: string[] = [
    'Consumer Insights & Strategy',
    'R&D & Product Innovation',
    'Packaging Development',
    'Sensory & Consumer Science',
    'Quality Assurance',
    'Regulatory Affairs & Compliance',
    'Pilot & Commercial Manufacturing',
    'Supply Chain & Sourcing',
    'Category Management',
    'Finance & Commercialization'
  ];
  priorities: string[] = ['High', 'Medium', 'Low'];
  responsibilities: string[] = [
    'Ananya Rao',
    'Dr. Priya Raman',
    'Vikram Singh',
    'Anita Desai',
    'Rajesh Kumar',
    'Amit Patel',
    'Deepa Nair',
    'Suresh Naidu'
  ];

  readonly delayReasonOptions: string[] = [
    'Consumer concept test inconclusive',
    'Ingredient supplier qualification delay',
    'Packaging barrier / seal integrity failure',
    'Sensory score below acceptance threshold',
    'Accelerated shelf-life microbial drift',
    'FSSAI / legal compliance query'
  ];

  activities: GateActivityItem[] = [];
  filteredActivities: GateActivityItem[] = [];
  pagedActivities: GateActivityItem[] = [];

  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 0;

  // Timeline Modal
  showTimelineModal: boolean = false;
  selectedTimelineItem: any = null;

  readonly historySequence: number[] = [4, 2, 5, 2, 4, 7, 8, 3, 5, 2, 6, 4, 8, 2, 5, 7, 3, 6, 4, 2];
  readonly documentsSequence: number[] = [2, 5, 1, 4, 3, 2, 6, 1, 4, 2, 5, 3];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  // Add / Edit Activity Modal
  showActivityModal: boolean = false;
  activityModalStep = 1;
  isEditActivityMode: boolean = false;
  activityModalData: Partial<GateActivityItem> = {};
  activityModalIndex = -1;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['name'] || params['projectName']) {
        this.projectName = params['name'] || params['projectName'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
      if (params['gateCode']) {
        this.gateCode = params['gateCode'];
      }
      if (params['gateName']) {
        this.gateName = params['gateName'];
      }
      this.initActivitiesForGate();
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

    initActivitiesForGate(): void {
    if (this.gateCode === 'Gate 1') {
      this.activities = [
        { id: 1, activityName: 'Consumer Need & Occasion Space Validation', jobCode: 'CINS-01', department: 'Consumer Insights & Strategy', responsibility: 'Ananya Rao', priority: 'High', status: true, done: true, tasks: '4/13', activitiesCount: '5/9', delayReason: 'Consumer concept test inconclusive', planStart: '2026-01-05', planEnd: '2026-01-15', actualStart: '2026-01-05', actualEnd: '2026-01-14', eta: '2026-01-15', planDuration: '10 days', actualDuration: '9 days', planEffort: '40 hrs', actualEffort: '36 hrs', buffer: '1 day', remarks: 'Consumer occasion mapping validated with 84% purchase intent' },
        { id: 2, activityName: 'Category Size & Competitive Benchmarking', jobCode: 'CAT-01', department: 'Category Management', responsibility: 'Dr. Priya Raman', priority: 'High', status: true, done: true, tasks: '1/13', activitiesCount: '2/9', delayReason: 'Ingredient supplier qualification delay', planStart: '2026-01-10', planEnd: '2026-01-25', actualStart: '2026-01-10', actualEnd: '2026-01-24', eta: '2026-01-25', planDuration: '15 days', actualDuration: '14 days', planEffort: '30 hrs', actualEffort: '30 hrs', buffer: '1 day', remarks: 'Competitive pricing and volume benchmarks established' },
        { id: 3, activityName: 'Target Product Profile (TPP) Formulation Scoping', jobCode: 'RDI-01', department: 'R&D & Product Innovation', responsibility: 'Dr. Priya Raman', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '7/9', delayReason: 'Packaging barrier / seal integrity failure', planStart: '2026-01-15', planEnd: '2026-02-05', actualStart: '2026-01-15', actualEnd: '2026-02-04', eta: '2026-02-05', planDuration: '20 days', actualDuration: '20 days', planEffort: '45 hrs', actualEffort: '45 hrs', buffer: '2 days', remarks: 'Sensory attributes, nutritional targets and shelf life requirements baselined' },
        { id: 4, activityName: 'Regulatory Category & FSSAI Standards Mapping', jobCode: 'REG-01', department: 'Regulatory Affairs & Compliance', responsibility: 'Rajesh Kumar', priority: 'High', status: true, done: true, tasks: '6/13', activitiesCount: '4/9', planStart: '2026-01-20', planEnd: '2026-02-08', actualStart: '2026-01-20', actualEnd: '2026-02-07', eta: '2026-02-08', planDuration: '18 days', actualDuration: '18 days', planEffort: '25 hrs', actualEffort: '25 hrs', buffer: '1 day', remarks: 'Proprietary food category standards and additive limits confirmed' },
        { id: 5, activityName: 'Preliminary Packaging Format & Shelf Life Scoping', jobCode: 'PKG-01', department: 'Packaging Development', responsibility: 'Vikram Singh', priority: 'Medium', status: true, done: true, tasks: '10/13', activitiesCount: '3/9', planStart: '2026-01-25', planEnd: '2026-02-10', actualStart: '2026-01-25', actualEnd: '2026-02-09', eta: '2026-02-10', planDuration: '16 days', actualDuration: '15 days', planEffort: '20 hrs', actualEffort: '20 hrs', buffer: '1 day', remarks: 'Aseptic PET / carton packaging formats evaluated' },
        { id: 6, activityName: 'Cost of Goods Sold (COGS) & Target Margin Model', jobCode: 'FIN-01', department: 'Finance & Commercialization', responsibility: 'Ananya Rao', priority: 'Medium', status: true, done: true, tasks: '7/13', activitiesCount: '6/9', planStart: '2026-01-28', planEnd: '2026-02-12', actualStart: '2026-01-28', actualEnd: '2026-02-12', eta: '2026-02-12', planDuration: '15 days', actualDuration: '15 days', planEffort: '18 hrs', actualEffort: '18 hrs', buffer: '0 days', remarks: 'Unit COGS within 38% target gross margin threshold' },
        { id: 7, activityName: 'Project Charter & Stage-Gate Funding Sign-off', jobCode: 'PMO-01', department: 'Consumer Insights & Strategy', responsibility: 'Ananya Rao', priority: 'High', status: true, done: true, tasks: '9/13', activitiesCount: '5/9', planStart: '2026-02-01', planEnd: '2026-02-15', actualStart: '2026-02-01', actualEnd: '2026-02-14', eta: '2026-02-15', planDuration: '14 days', actualDuration: '13 days', planEffort: '22 hrs', actualEffort: '22 hrs', buffer: '1 day', remarks: 'Executive sponsor charter approval and Gate 1 authorization' }
      ];
    } else if (this.gateCode === 'Gate 2') {
      this.activities = [
        { id: 1, activityName: 'Benchtop Recipe Formulation & Taste Optimization', jobCode: 'RDI-02', department: 'R&D & Product Innovation', responsibility: 'Dr. Priya Raman', priority: 'High', status: true, done: true, tasks: '9/13', activitiesCount: '7/9', planStart: '2026-02-16', planEnd: '2026-03-30', actualStart: '2026-02-16', actualEnd: '2026-03-28', eta: '2026-03-30', planDuration: '42 days', actualDuration: '40 days', planEffort: '80 hrs', actualEffort: '75 hrs', buffer: '2 days', remarks: '3 candidate formulations achieved hedonic sensory score > 7.5/9' },
        { id: 2, activityName: 'Sensory Discrimination & Expert Panel Profiling', jobCode: 'SENS-01', department: 'Sensory & Consumer Science', responsibility: 'Anita Desai', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2026-03-15', planEnd: '2026-04-20', actualStart: '2026-03-15', actualEnd: '2026-04-18', eta: '2026-04-20', planDuration: '36 days', actualDuration: '34 days', planEffort: '60 hrs', actualEffort: '58 hrs', buffer: '2 days', remarks: 'QDA radar charts match target brand profile' },
        { id: 3, activityName: 'Food-Grade Ingredient Vendor Sourcing & COA Qualification', jobCode: 'SUP-01', department: 'Supply Chain & Sourcing', responsibility: 'Amit Patel', priority: 'High', status: true, done: true, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-04-01', planEnd: '2026-05-10', actualStart: '2026-04-01', actualEnd: '2026-05-08', eta: '2026-05-10', planDuration: '39 days', actualDuration: '37 days', planEffort: '40 hrs', actualEffort: '40 hrs', buffer: '2 days', remarks: 'Dual supplier sourcing completed with audited allergen certificates' },
        { id: 4, activityName: 'Accelerated Microbial & Shelf-Life Protocol Initiation', jobCode: 'QA-01', department: 'Quality Assurance', responsibility: 'Anita Desai', priority: 'High', status: true, done: true, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-04-15', planEnd: '2026-05-25', actualStart: '2026-04-15', actualEnd: '2026-05-23', eta: '2026-05-25', planDuration: '40 days', actualDuration: '38 days', planEffort: '50 hrs', actualEffort: '48 hrs', buffer: '2 days', remarks: 'Incubation at 37°C/75% RH showing zero spoilage at 30-day mark' },
        { id: 5, activityName: 'Pilot Thermal Processing & Pasteurization Trials', jobCode: 'MFG-01', department: 'Pilot & Commercial Manufacturing', responsibility: 'Amit Patel', priority: 'Medium', status: true, done: true, tasks: '4/13', activitiesCount: '3/9', planStart: '2026-05-01', planEnd: '2026-06-15', actualStart: '2026-05-01', actualEnd: '2026-06-14', eta: '2026-06-15', planDuration: '45 days', actualDuration: '44 days', planEffort: '45 hrs', actualEffort: '44 hrs', buffer: '1 day', remarks: 'HTST pasteurization lethality (F0 > 5) achieved with zero vitamin degradation' },
        { id: 6, activityName: 'Packaging Material Compatibility & Barrier Testing', jobCode: 'PKG-02', department: 'Packaging Development', responsibility: 'Vikram Singh', priority: 'High', status: true, done: true, tasks: '11/13', activitiesCount: '8/9', planStart: '2026-05-15', planEnd: '2026-06-30', actualStart: '2026-05-15', actualEnd: '2026-06-28', eta: '2026-06-30', planDuration: '46 days', actualDuration: '44 days', planEffort: '55 hrs', actualEffort: '52 hrs', buffer: '2 days', remarks: 'Oxygen and moisture transmission rates comply with 12-month ambient shelf life' }
      ];
    } else if (this.gateCode === 'Gate 3') {
      this.activities = [
        { id: 1, activityName: 'Central Location Consumer Sensory Testing (CLT)', jobCode: 'CRE-01', department: 'Consumer Research', responsibility: 'Dr. Priya Raman', priority: 'High', status: true, done: true, tasks: '10/13', activitiesCount: '8/9', planStart: '2026-07-01', planEnd: '2026-08-15', actualStart: '2026-07-01', actualEnd: '2026-08-14', eta: '2026-08-15', planDuration: '45 days', actualDuration: '44 days', planEffort: '70 hrs', actualEffort: '68 hrs', buffer: '2 days', remarks: 'N=300 consumer CLT completed with 78% top-2-box overall liking' },
        { id: 2, activityName: 'Pilot Plant Demonstration Batch & Yield Qualification', jobCode: 'MFG-02', department: 'Pilot & Commercial Manufacturing', responsibility: 'Amit Patel', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2026-08-01', planEnd: '2026-09-10', actualStart: '2026-08-01', actualEnd: '2026-09-08', eta: '2026-09-10', planDuration: '40 days', actualDuration: '38 days', planEffort: '65 hrs', actualEffort: '62 hrs', buffer: '2 days', remarks: '5,000L pilot run confirmed batch homogeneity and 98.4% yield' },
        { id: 3, activityName: 'Transit Simulation & Packaging Drop Testing', jobCode: 'PKG-03', department: 'Packaging Development', responsibility: 'Vikram Singh', priority: 'High', status: true, done: true, tasks: '6/13', activitiesCount: '5/9', planStart: '2026-08-15', planEnd: '2026-09-25', actualStart: '2026-08-15', actualEnd: '2026-09-24', eta: '2026-09-25', planDuration: '41 days', actualDuration: '40 days', planEffort: '50 hrs', actualEffort: '48 hrs', buffer: '1 day', remarks: 'ISTA 3A transit vibration and drop testing passed without leakage' },
        { id: 4, activityName: 'Updated Commercial Business Case & Capex Clearance', jobCode: 'FIN-02', department: 'Finance & Commercialization', responsibility: 'Ananya Rao', priority: 'Medium', status: true, done: true, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-09-01', planEnd: '2026-09-30', actualStart: '2026-09-01', actualEnd: '2026-09-29', eta: '2026-09-30', planDuration: '30 days', actualDuration: '28 days', planEffort: '35 hrs', actualEffort: '34 hrs', buffer: '2 days', remarks: 'Payback period under 2.4 years with IRR of 28.5%' }
      ];
    } else if (this.gateCode === 'Gate 4') {
      this.activities = [
        { id: 1, activityName: 'Commercial Plant Trial Run & High-Speed Packaging Trial', jobCode: 'MFG-03', department: 'Pilot & Commercial Manufacturing', responsibility: 'Amit Patel', priority: 'High', status: true, done: false, tasks: '6/13', activitiesCount: '5/9', planStart: '2026-10-01', planEnd: '2026-11-15', actualStart: '2026-10-01', actualEnd: '', eta: '2026-11-15', planDuration: '45 days', actualDuration: '25 days', planEffort: '80 hrs', actualEffort: '45 hrs', buffer: '3 days', remarks: 'High-speed 400 bpm bottling line integration in progress' },
        { id: 2, activityName: 'FSSAI Product Registration & Nutritional Label Approval', jobCode: 'REG-02', department: 'Regulatory Affairs & Compliance', responsibility: 'Rajesh Kumar', priority: 'High', status: true, done: false, tasks: '4/13', activitiesCount: '3/9', planStart: '2026-10-10', planEnd: '2026-11-25', actualStart: '2026-10-10', actualEnd: '', eta: '2026-11-25', planDuration: '46 days', actualDuration: '20 days', planEffort: '40 hrs', actualEffort: '20 hrs', buffer: '2 days', remarks: 'Dossier submitted to FSSAI portal; endorsement awaited' },
        { id: 3, activityName: 'Shelf-Life Real-Time Organoleptic & Chemical Verification', jobCode: 'QA-02', department: 'Quality Assurance', responsibility: 'Anita Desai', priority: 'High', status: true, done: false, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-10-15', planEnd: '2026-12-05', actualStart: '2026-10-15', actualEnd: '', eta: '2026-12-05', planDuration: '51 days', actualDuration: '15 days', planEffort: '45 hrs', actualEffort: '15 hrs', buffer: '4 days', remarks: '6-month ambient checkpoint clear; pH, brix, acidity on target' }
      ];
    } else {
      this.activities = [
        { id: 1, activityName: 'Commercial First Production Batch Manufacturing & Release', jobCode: 'MFG-04', department: 'Pilot & Commercial Manufacturing', responsibility: 'Amit Patel', priority: 'High', status: true, done: false, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-12-01', planEnd: '2026-12-31', actualStart: '', actualEnd: '', eta: '2026-12-31', planDuration: '30 days', actualDuration: '', planEffort: '70 hrs', actualEffort: '', buffer: '5 days', remarks: 'Scheduled for December commercial production run' },
        { id: 2, activityName: 'National Distributor Pipeline Stock Build & Dispatch', jobCode: 'SCM-02', department: 'Supply Chain & Sourcing', responsibility: 'Amit Patel', priority: 'High', status: true, done: false, tasks: '3/13', activitiesCount: '2/9', planStart: '2027-01-02', planEnd: '2027-01-20', actualStart: '', actualEnd: '', eta: '2027-01-20', planDuration: '18 days', actualDuration: '', planEffort: '40 hrs', actualEffort: '', buffer: '3 days', remarks: 'Regional warehouse stock allocation planned' },
        { id: 3, activityName: '360° Brand Marketing Campaign & Retail Launch Execution', jobCode: 'MKT-01', department: 'Consumer Insights & Strategy', responsibility: 'Ananya Rao', priority: 'High', status: true, done: false, tasks: '2/13', activitiesCount: '1/9', planStart: '2027-01-15', planEnd: '2027-02-15', actualStart: '', actualEnd: '', eta: '2027-02-15', planDuration: '31 days', actualDuration: '', planEffort: '60 hrs', actualEffort: '', buffer: '4 days', remarks: 'TVC, digital influencer activations and modern trade promo ready' }
      ];
    }

    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
    const defaultDates = ['2026-02-15', '2026-03-01', '2026-03-12', '2026-04-05', '2026-05-20'];
    this.activities.forEach((a, idx) => {
      a.historyCount = (this as any).historySequence ? (this as any).historySequence[idx % (this as any).historySequence.length] : 2;
      a.documentsCount = (this as any).documentsSequence ? (this as any).documentsSequence[idx % (this as any).documentsSequence.length] : 2;
      if (!a.updatedDate) {
        a.updatedDate = defaultDates[idx % defaultDates.length];
      }
      if (!a.updatedBy) {
        a.updatedBy = a.responsibility || defaultUpdaters[idx % defaultUpdaters.length];
      }
    });
  }

  applyFilter(): void {
    this.filteredActivities = this.activities.filter(a => {
      const matchDept = !this.filterDepartment || a.department === this.filterDepartment;
      const matchPrio = !this.filterPriority || a.priority === this.filterPriority;
      const matchStatus = !this.filterStatus || (this.filterStatus === 'Active' ? a.status : !a.status);
      return matchDept && matchPrio && matchStatus;
    });
    this.currentPage = 0;
    this.updatePagedActivities();
  }

  resetFilter(): void {
    this.filterDepartment = '';
    this.filterPriority = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  updatePagedActivities(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedActivities = this.filteredActivities.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedActivities();
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

  goBack(): void {
    this.router.navigate(['/projects/dashboard/gates'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode
      }
    });
  }

  toggleStatus(activity: GateActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: `Are you sure you want to ${activity.status ? 'deactivate' : 'activate'} this activity?`
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        activity.status = !activity.status;
      }
    });
  }

  deleteActivity(activity: GateActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Activity',
        content: 'Are you sure you want to delete this activity record?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.activities = this.activities.filter(a => a !== activity);
        this.applyFilter();
      }
    });
  }

  openTimelineModal(activity: GateActivityItem): void {
    this.selectedTimelineItem = { ...activity, name: activity.activityName };
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  openAddActivity(): void {
    this.activityModalStep = 1;
    this.activityModalData = {
      activityName: '',
      jobCode: 'JB-' + (100 + this.activities.length + 1),
      department: this.departments[0],
      responsibility: this.responsibilities[0],
      priority: 'High',
      status: true,
      done: false,
      tasks: '0/13',
      activitiesCount: '0/9',
      planStart: '',
      planEnd: '',
      actualStart: '',
      actualEnd: '',
      eta: '',
      planDuration: '',
      planEffort: '',
      actualDuration: '',
      actualEffort: '',
      buffer: '',
      remarks: '',
      description: ''
    };
    this.isEditActivityMode = false;
    this.showActivityModal = true;
    this.setBodyScrollLock(true);
  }

  openEditActivity(activity: GateActivityItem, index: number): void {
    const actualIndex = this.activities.findIndex(a => a === activity);
    this.activityModalStep = 1;
    this.activityModalData = { ...activity };
    this.isEditActivityMode = true;
    this.activityModalIndex = actualIndex >= 0 ? actualIndex : index;
    this.showActivityModal = true;
    this.setBodyScrollLock(true);
  }

  closeActivityModal(): void {
    this.showActivityModal = false;
    this.setBodyScrollLock(false);
  }

  saveActivity(): void {
    if (!this.activityModalData.activityName) return;

    if (this.isEditActivityMode && this.activityModalIndex > -1) {
      this.activities[this.activityModalIndex] = {
        ...this.activities[this.activityModalIndex],
        ...this.activityModalData
      } as GateActivityItem;
    } else {
      const newAct: GateActivityItem = {
        ...(this.activityModalData as GateActivityItem),
        id: Date.now()
      };
      this.activities.push(newAct);
    }
    this.applyFilter();
    this.closeActivityModal();
  }

  onTasksClick(item: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/tasks'], {
      queryParams: {
        activityName: item.activityName,
        jobCode: item.jobCode,
        department: item.department,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        tasks: item.tasks,
        source: 'gates'
      }
    });
  }

  onActivitiesClick(item: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/requirements'], {
      queryParams: {
        activityName: item.activityName,
        jobCode: item.jobCode,
        department: item.department,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        requirements: item.activitiesCount || item.activities,
        source: 'gates'
      }
    });
  }

  openHistory(activity: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/gates/activities/history'], {
      queryParams: {
        activityName: activity.activityName,
        jobCode: activity.jobCode,
        department: activity.department,
        responsibility: activity.responsibility,
        delayReason: activity.delayReason,
        priority: activity.priority,
        tasks: activity.tasks,
        requirements: activity.activitiesCount || activity.activities || activity.requirements,
        planDuration: activity.planDuration,
        planEffort: activity.planEffort,
        actualDuration: activity.actualDuration,
        actualEffort: activity.actualEffort,
        remarks: activity.remarks,
        gateName: this.gateName,
        gateCode: this.gateCode,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  private setBodyScrollLock(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
