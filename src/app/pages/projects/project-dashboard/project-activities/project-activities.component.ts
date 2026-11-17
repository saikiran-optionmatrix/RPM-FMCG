import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { AddProjActivityComponent } from './add-proj-activity/add-proj-activity.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { HoursTimesheetComponent } from '../project-hours/hours-timesheet/hours-timesheet.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';


export interface ProjectActivityItem {
  id?: string | number;
  IsActive: boolean;
  ProjectName: string;
  ProjectCode: string;
  Stage?: string;
  stage?: string;
  PercentCompletion: number;
  Deliverable: string;
  TaskName: string;
  TaskType: string;
  Responsibility: string;
  Duration: string;
  Effort: string;
  Description: string;
  PlanStart: string;
  PlanEnd: string;
  ActualStart: string;
  ActualEnd: string;
  ETA: string;
  Status: string;
  Priority: string;
  Complexity: string;
  Template: string;
  Done?: boolean;
  Tasks?: string | number;
  Requirements?: string | number;
  tasks?: string | number;
  requirements?: string | number;
  activities?: string;
  delayReason?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './project-activities.component.html',
  styleUrl: './project-activities.component.scss'
})
export class ProjectActivitiesComponent implements OnInit {

  projectName: string = 'Vitamin-Enriched Fruit Beverage 250ml';
  projectCode: string = '2026/FMCG/006';
  dynamicBreadcrumb: string = 'Activities';

  showFilter: boolean = false;
  showTimelineModal: boolean = false;
  selectedTimelineTask: ProjectActivityItem | null = null;
  excludeCompleted: boolean = false;

  // Add / Edit Modal State
  showActivityModal: boolean = false;
  isEditMode: boolean = false;
  editingItem: ProjectActivityItem | null = null;
  activityFormData: Partial<ProjectActivityItem> = {};

  // Timesheet Modal State
  showTimesheetModal: boolean = false;
  timesheetTask: ProjectActivityItem | null = null;

  rawProjects: ProjectActivityItem[] = [];
  allProjects: ProjectActivityItem[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;

  filterKeyword: string = '';
  filterProjectName: string = '';
  filterDateType: string = '';
  filterFromDate: string = '';
  filterToDate: string = '';
  filterStatus: string = '';
  filterPriority: string = '';
  filterComplexity: string = '';
  filterActive: boolean = false;

  teamMembers = ['Alice Johnson', 'Robert Smith', 'Clara Davis', 'Daniel Martinez', 'Evelyn Wright', 'Sophia Carter', 'Michael Johnson', 'Daniel Wilson', 'Emma Thompson', 'Olivia Martinez'];
  statuses = ['Pending', 'Allocation', 'Progress', 'In Progress', 'Testing', 'Review', 'Hold', 'Cancelled', 'Completed'];
  priorities = ['Critical', 'High', 'Medium', 'Low'];
  complexities = ['Very High', 'High', 'Medium', 'Low'];

  readonly delayReasonOptions: string[] = [
  "Reference Product Sourcing Delay",
  "product formulation, packaging substrate & food-grade ingredient / processing aid Shortage",
  "Vendor / CDMO Dispatch Delay",
  "Regulatory Affairs & Compliance / Biosafety Approval Pending",
  "Low Expression Titer / Aggregation Anomaly",
  "product performance and quality test / Method Validation Pending",
  "Equipment Downtime (mixing and blending vessel / ingredient separation and quality testing)",
  "third-party testing and research partner / consumer Recruitment Delay"
];

  readonly historySequence: number[] = [3, 5, 3, 2, 1, 6, 8, 3, 5, 2, 4, 7, 3, 6, 1, 5, 8, 2, 4, 3];
  readonly documentsSequence: number[] = [4, 1, 3, 5, 2, 4, 1, 3, 2, 5, 2, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    this.getAllProjects();
  }

  getSliderColor(percent: number): string {
    if (percent <= 30) return '#0000ff';
    if (percent > 30 && percent <= 80) return '#ffb300';
    if (percent === 100) return '#ff0000';
    return '#008000';
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  getAllProjects(): void {
    const mockData: ProjectActivityItem[] = [
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S1",
    "stage": "S1",
    "PercentCompletion": 100,
    "Deliverable": "Consumer Occasion & Demand Analysis",
    "TaskName": "Consumer occasion mapping & demand discovery",
    "TaskType": "Consumer Research",
    "Responsibility": "Ananya Rao",
    "Duration": "10 days",
    "Effort": "40",
    "Description": "Map consumption occasions, price elasticity and unmet functional needs across modern trade.",
    "PlanStart": "2026-01-05",
    "PlanEnd": "2026-01-15",
    "ActualStart": "2026-01-05",
    "ActualEnd": "2026-01-14",
    "ETA": "2026-01-15",
    "Status": "Completed",
    "Priority": "High",
    "Complexity": "Medium",
    "Template": "FMCG NPD Template v1",
    "Done": true,
    "Tasks": "4/4",
    "Requirements": "3/3"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S2",
    "stage": "S2",
    "PercentCompletion": 100,
    "Deliverable": "Target Product Profile & Feasibility",
    "TaskName": "Target Product Profile (TPP) baseline definition",
    "TaskType": "Formulation",
    "Responsibility": "Dr. Priya Raman",
    "Duration": "10 days",
    "Effort": "35",
    "Description": "Define sensory profile targets, brix, acidity, vitamin retention and packaging volume.",
    "PlanStart": "2026-01-16",
    "PlanEnd": "2026-01-26",
    "ActualStart": "2026-01-16",
    "ActualEnd": "2026-01-25",
    "ETA": "2026-01-26",
    "Status": "Completed",
    "Priority": "High",
    "Complexity": "Medium",
    "Template": "FMCG NPD Template v1",
    "Done": true,
    "Tasks": "3/3",
    "Requirements": "4/4"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S3",
    "stage": "S3",
    "PercentCompletion": 100,
    "Deliverable": "Food-Grade Ingredient Qualification",
    "TaskName": "Food-grade ingredient sourcing & COA qualification",
    "TaskType": "Procurement",
    "Responsibility": "Amit Patel",
    "Duration": "15 days",
    "Effort": "60",
    "Description": "Qualify natural flavor emulsions, stabilizers, acidulants and clean-label sweeteners.",
    "PlanStart": "2026-01-27",
    "PlanEnd": "2026-02-15",
    "ActualStart": "2026-01-27",
    "ActualEnd": "2026-02-14",
    "ETA": "2026-02-15",
    "Status": "Completed",
    "Priority": "High",
    "Complexity": "High",
    "Template": "FMCG NPD Template v1",
    "Done": true,
    "Tasks": "5/5",
    "Requirements": "3/3"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S4",
    "stage": "S4",
    "PercentCompletion": 75,
    "Deliverable": "Benchtop Formulation Optimization",
    "TaskName": "Flavor harmonization & sugar-acid ratio optimization",
    "TaskType": "R&D Benchtop",
    "Responsibility": "Dr. Priya Raman",
    "Duration": "20 days",
    "Effort": "80",
    "Description": "Optimize taste delivery, mouthfeel, pasteurization stability and natural color stability.",
    "PlanStart": "2026-02-16",
    "PlanEnd": "2026-03-10",
    "ActualStart": "2026-02-16",
    "ActualEnd": "",
    "ETA": "2026-03-10",
    "Status": "In Progress",
    "Priority": "High",
    "Complexity": "High",
    "Template": "FMCG NPD Template v1",
    "Done": false,
    "Tasks": "3/4",
    "Requirements": "2/3"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S5",
    "stage": "S5",
    "PercentCompletion": 60,
    "Deliverable": "Sustainable Barrier Packaging",
    "TaskName": "Barrier film OTR/WVTR & bottle structural prototyping",
    "TaskType": "Packaging Design",
    "Responsibility": "Vikram Singh",
    "Duration": "25 days",
    "Effort": "75",
    "Description": "Design 250ml lightweight PET bottle with oxygen scavenger cap for 12-month shelf life.",
    "PlanStart": "2026-03-11",
    "PlanEnd": "2026-04-05",
    "ActualStart": "2026-03-11",
    "ActualEnd": "",
    "ETA": "2026-04-05",
    "Status": "In Progress",
    "Priority": "Medium",
    "Complexity": "Medium",
    "Template": "FMCG NPD Template v1",
    "Done": false,
    "Tasks": "2/4",
    "Requirements": "3/4"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S6",
    "stage": "S6",
    "PercentCompletion": 45,
    "Deliverable": "Descriptive Sensory Profiling",
    "TaskName": "Trained panel QDA and central location test (CLT)",
    "TaskType": "Sensory Science",
    "Responsibility": "Anita Desai",
    "Duration": "18 days",
    "Effort": "55",
    "Description": "Conduct N=300 consumer central location test against category benchmark product.",
    "PlanStart": "2026-04-06",
    "PlanEnd": "2026-04-25",
    "ActualStart": "2026-04-06",
    "ActualEnd": "",
    "ETA": "2026-04-25",
    "Status": "In Progress",
    "Priority": "High",
    "Complexity": "Medium",
    "Template": "FMCG NPD Template v1",
    "Done": false,
    "Tasks": "2/5",
    "Requirements": "1/3"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S7",
    "stage": "S7",
    "PercentCompletion": 25,
    "Deliverable": "Pilot Batch Processing",
    "TaskName": "5,000L pilot trial & pasteurization lethality",
    "TaskType": "Manufacturing Trial",
    "Responsibility": "Amit Patel",
    "Duration": "20 days",
    "Effort": "85",
    "Description": "Execute 5,000L continuous pilot trial; establish thermal hold time and homogenization pressure.",
    "PlanStart": "2026-04-26",
    "PlanEnd": "2026-05-18",
    "ActualStart": "2026-04-26",
    "ActualEnd": "",
    "ETA": "2026-05-18",
    "Status": "In Progress",
    "Priority": "High",
    "Complexity": "High",
    "Template": "FMCG NPD Template v1",
    "Done": false,
    "Tasks": "1/4",
    "Requirements": "1/3"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S8",
    "stage": "S8",
    "PercentCompletion": 15,
    "Deliverable": "HACCP & FSMS Validation",
    "TaskName": "Microbial challenge testing & allergen zoning",
    "TaskType": "Quality Assurance",
    "Responsibility": "Anita Desai",
    "Duration": "15 days",
    "Effort": "45",
    "Description": "Validate critical control points (CCPs) and clean-in-place (CIP) sanitation protocol.",
    "PlanStart": "2026-05-19",
    "PlanEnd": "2026-06-05",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-06-05",
    "Status": "Pending",
    "Priority": "High",
    "Complexity": "Medium",
    "Template": "FMCG NPD Template v1",
    "Done": false,
    "Tasks": "0/3",
    "Requirements": "1/3"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S9",
    "stage": "S9",
    "PercentCompletion": 10,
    "Deliverable": "FSSAI Dossier & Label Endorsement",
    "TaskName": "Nutrition panel & front-of-pack claims substantiation",
    "TaskType": "Regulatory",
    "Responsibility": "Rajesh Kumar",
    "Duration": "15 days",
    "Effort": "40",
    "Description": "Submit FSSAI product licensing application and validate front-of-pack nutrition claims.",
    "PlanStart": "2026-06-06",
    "PlanEnd": "2026-06-25",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-06-25",
    "Status": "Pending",
    "Priority": "High",
    "Complexity": "Medium",
    "Template": "FMCG NPD Template v1",
    "Done": false,
    "Tasks": "0/3",
    "Requirements": "0/2"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S10",
    "stage": "S10",
    "PercentCompletion": 5,
    "Deliverable": "Commercial Packaging Line Commissioning",
    "TaskName": "400 bpm high-speed blow-fill-seal line trial",
    "TaskType": "Plant Scale-Up",
    "Responsibility": "Amit Patel",
    "Duration": "25 days",
    "Effort": "90",
    "Description": "Verify filling line line-efficiency (OEE > 85%), capping torque and secondary packing.",
    "PlanStart": "2026-06-26",
    "PlanEnd": "2026-07-25",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-07-25",
    "Status": "Pending",
    "Priority": "High",
    "Complexity": "High",
    "Template": "FMCG NPD Template v1",
    "Done": false,
    "Tasks": "0/4",
    "Requirements": "0/3"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S11",
    "stage": "S11",
    "PercentCompletion": 0,
    "Deliverable": "National Pipeline Stock Build",
    "TaskName": "Finished goods warehouse allocation & logistics",
    "TaskType": "Supply Chain",
    "Responsibility": "Amit Patel",
    "Duration": "15 days",
    "Effort": "50",
    "Description": "Establish distribution center inventory buffers and temperature logger cold-chain protocol.",
    "PlanStart": "2026-07-26",
    "PlanEnd": "2026-08-15",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-08-15",
    "Status": "Pending",
    "Priority": "Medium",
    "Complexity": "Medium",
    "Template": "FMCG NPD Template v1",
    "Done": false,
    "Tasks": "0/3",
    "Requirements": "0/2"
  },
  {
    "IsActive": true,
    "ProjectName": "New Beverage Product Development Program",
    "ProjectCode": "2026/FMCG/001",
    "Stage": "S12",
    "stage": "S12",
    "PercentCompletion": 0,
    "Deliverable": "Market Launch Execution",
    "TaskName": "360° marketing campaign & retail listing rollout",
    "TaskType": "Commercial Launch",
    "Responsibility": "Ananya Rao",
    "Duration": "20 days",
    "Effort": "60",
    "Description": "Activate nationwide supermarket, quick-commerce and distributor channels.",
    "PlanStart": "2026-08-16",
    "PlanEnd": "2026-09-05",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-09-05",
    "Status": "Pending",
    "Priority": "High",
    "Complexity": "High",
    "Template": "FMCG NPD Template v1",
    "Done": false,
    "Tasks": "0/4",
    "Requirements": "0/3"
  }
];

    const taskCounts = ['4/13', '1/13', '8/13', '6/13', '10/13', '7/13', '9/13', '11/13', '5/13', '2/13', '12/13', '3/13', '4/13', '8/13'];
    const reqCounts = ['5/9', '2/9', '7/9', '4/9', '6/9', '8/9', '3/9', '5/9', '1/9', '7/9', '4/9', '2/9', '6/9', '5/9'];
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
    const defaultDates = ['2026-02-15', '2026-03-01', '2026-03-12', '2026-04-05', '2026-05-20'];
    const delayReasons = this.delayReasonOptions;
    this.rawProjects = mockData.map((item, idx) => ({
      ...item,
      historyCount: this.getHistoryCount(idx),
      documentsCount: this.getDocumentsCount(idx),
      updatedDate: item.updatedDate ?? defaultDates[idx % defaultDates.length],
      updatedBy: item.updatedBy ?? item.Responsibility ?? defaultUpdaters[idx % defaultUpdaters.length],
      Tasks: item.Tasks ?? taskCounts[idx % taskCounts.length],
      Requirements: item.Requirements ?? reqCounts[idx % reqCounts.length],
      delayReason: item.delayReason ?? delayReasons[idx % delayReasons.length]
    }));
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = this.rawProjects;

    if (this.excludeCompleted) {
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100);
    }

    if (this.filterKeyword && this.filterKeyword.trim()) {
      const kw = this.filterKeyword.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.TaskName && p.TaskName.toLowerCase().includes(kw)) ||
        (p.Stage && p.Stage.toLowerCase().includes(kw)) ||
        (p.Deliverable && p.Deliverable.toLowerCase().includes(kw)) ||
        (p.ProjectName && p.ProjectName.toLowerCase().includes(kw)) ||
        (p.ProjectCode && p.ProjectCode.toLowerCase().includes(kw)) ||
        (p.Responsibility && p.Responsibility.toLowerCase().includes(kw)) ||
        (p.Description && p.Description.toLowerCase().includes(kw))
      );
    }

    if (this.filterProjectName && this.filterProjectName.trim()) {
      const pn = this.filterProjectName.toLowerCase().trim();
      filtered = filtered.filter(p => p.ProjectName && p.ProjectName.toLowerCase().includes(pn));
    }

    if (this.filterStatus) {
      filtered = filtered.filter(p => p.Status === this.filterStatus);
    }

    if (this.filterPriority) {
      filtered = filtered.filter(p => p.Priority === this.filterPriority);
    }

    if (this.filterComplexity) {
      filtered = filtered.filter(p => p.Complexity === this.filterComplexity);
    }

    if (this.filterActive) {
      filtered = filtered.filter(p => p.IsActive === true);
    }

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.allProjects = filtered.slice(start, end);
  }

  clearFilter(): void {
    this.filterKeyword = '';
    this.filterProjectName = '';
    this.filterDateType = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.filterStatus = '';
    this.filterPriority = '';
    this.filterComplexity = '';
    this.filterActive = false;
    this.currentPage = 0;
    this.applyFilter();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newItem: ProjectActivityItem = {
          IsActive: true,
          ProjectName: this.projectName,
          ProjectCode: this.projectCode,
          Stage: result.stage || result.Stage || 'S1',
          PercentCompletion: 0,
          Deliverable: result.Deliverable || 'Module1',
          TaskName: result.TaskName || '',
          TaskType: 'Development',
          Responsibility: 'Alice Johnson',
          Duration: result.planDuration || '5 days',
          Effort: result.planEffort || '20',
          Description: result.Description || '',
          PlanStart: result.PlanStart || new Date().toISOString().split('T')[0],
          PlanEnd: result.PlanEnd || '',
          ActualStart: result.ActualStart || '',
          ActualEnd: result.ActualEnd || '',
          ETA: '',
          Status: result.Status || 'In Progress',
          Priority: 'Medium',
          Complexity: 'Medium',
          Template: 'Dev Template'
        };
        this.rawProjects.unshift(newItem);
        this.applyFilter();
      }
    });
  }

  openEditDialog(item: ProjectActivityItem): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { ...item, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, {
          TaskName: result.TaskName || item.TaskName,
          Stage: result.stage || result.Stage || item.Stage || 'S1',
          Deliverable: result.Deliverable || item.Deliverable,
          Description: result.Description !== undefined ? result.Description : item.Description,
          Status: result.Status || item.Status,
          PlanStart: result.PlanStart || item.PlanStart,
          PlanEnd: result.PlanEnd || item.PlanEnd,
          ActualStart: result.ActualStart || item.ActualStart,
          ActualEnd: result.ActualEnd || item.ActualEnd,
          Duration: result.planDuration || item.Duration,
          Effort: result.planEffort || item.Effort
        });
        this.applyFilter();
      }
    });
  }

  closeActivityModal(): void {
    this.showActivityModal = false;
    this.editingItem = null;
    this.activityFormData = {};
  }

  deleteConfirmation(item: ProjectActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this activity record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rawProjects = this.rawProjects.filter(p => p !== item);
        this.applyFilter();
      }
    });
  }

  toggleActive(item: ProjectActivityItem): void {
    // Toggles state directly
  }

  openProject(item: ProjectActivityItem): void {
    this.router.navigate(['/app/testing/projects/dashboard/analytics'], {
      queryParams: { code: item.ProjectCode || this.projectCode, name: item.ProjectName || this.projectName }
    });
  }

  fnHandlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  openPdf(fileName: string): void {
    const pdfUrl = `assets/${fileName}`;
    window.open(pdfUrl, '_blank');
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  openTimelineModal(task: ProjectActivityItem): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }



  opentimesheet(): void {
    const dialogRef = this.dialog.open(HoursTimesheetComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: null
    });
  }



  closeTimesheetModal(): void {
    this.showTimesheetModal = false;
    this.timesheetTask = null;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/FMCG/006", name: this.projectName || "Vitamin-Enriched Fruit Beverage 250ml" }
    });
  }


  onTasksClick(item: ProjectActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/tasks'], {
      queryParams: {
        activityName: item.TaskName,
        jobCode: item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        projectName: this.projectName,
        projectCode: this.projectCode,
        tasks: item.Tasks ?? item.tasks ?? '0/13',
        source: 'activities'
      }
    });
  }

  onRequirementsClick(item: ProjectActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/requirements'], {
      queryParams: {
        activityName: item.TaskName,
        jobCode: item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        projectName: this.projectName,
        projectCode: this.projectCode,
        requirements: item.Requirements ?? item.requirements ?? item.activities ?? '0/9',
        source: 'activities'
      }
    });
  }



  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

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

  openHistory(item?: any): void {
    const act = typeof item === 'object' && item !== null ? item : { TaskName: item };
    this.router.navigate(['/projects/dashboard/activities/history'], {
      queryParams: {
        activityName: act.TaskName || act.activityName,
        delayReason: act.delayReason,
        stage: act.Stage || act.stage,
        deliverable: act.Deliverable || act.deliverable,
        responsibility: act.Responsibility || act.responsibility,
        startDate: act.PlanStart || act.startDate,
        duration: act.Duration || act.duration,
        effort: act.Effort || act.effort,
        status: act.Status || act.status,
        priority: act.Priority || act.priority,
        complexity: act.Complexity || act.complexity,
        projectName: this.projectName,
        projectCode: this.projectCode
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
