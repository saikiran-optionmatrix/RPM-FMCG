import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { MonitorStateService } from '../monitor-state.service';

import { AddProjActivityComponent } from '../../projects/project-dashboard/project-activities/add-proj-activity/add-proj-activity.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface ActivityTask {
  IsActive: boolean;
  ProjectName: string;
  ProjectCode: string;
  Stage?: string;       // <--- Added for Stage column
  Module?: string;      // <--- Added for Deliverable column
  PercentCompletion: number;
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
  delayReason?: string;
}

export interface CalendarCard {
  hour: string;
  user: string;
  dayPlacement: number;
  taskName: string;
  projectName: string;
  status: string;
  planStart: string;
  color: string;
  pInitials: string;
}

@Component({
  selector: 'app-monitor-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule
],
  templateUrl: './monitor-activities.component.html',
  styleUrls: ['./monitor-activities.component.scss']
})
export class MonitorActivitiesComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  // View & Toggle States
  showFilter: boolean = false;
  isCalendarView: boolean = false;
  showWeekend: boolean = false;
  excludeCompleted: boolean = false;
  isOverdueOnly: boolean = false;
  displayDays: number[] = [1, 2, 3, 4, 5]; // Default: Mon-Fri

  // Modal States
  showTimelineModal: boolean = false;
  selectedTimelineTask: ActivityTask | null = null;

  // Data Arrays
  rawProjects: ActivityTask[] = [];
  allProjects: ActivityTask[] = [];
  calendarCards: CalendarCard[] = [];

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;

  // Permissions
  readonly canUpdate: boolean = true;
  readonly canDelete: boolean = true;

  // Clock
  currentTime: string = '';
  private timeInterval: any;

  // Filter Form
  filterForm: FormGroup = this.fb.group({
    Keyword: [null],
    ProjectName: [null],
    DateType: [null],
    FromDate: [null],
    ToDate: [null],
    Status: [null],
    Priority: [null],
    Complexity: [null],
    ActiveOnly: [false]
  });

  // Master Lists
  readonly hoursList: string[] = ["1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

  ngOnInit(): void {
    this.getAllProjects();
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 60000);

    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.overdueSub?.unsubscribe();
  }

getAllProjects(): void {
    const mockData: ActivityTask[] = [
      {
        IsActive: true,
        ProjectName: 'Vitamin-Enriched Fruit Beverage 250ml',
        ProjectCode: '2026/FMCG/001',
        Stage: 'S1 - Consumer Need and Market Opportunity',
        Module: 'Market and segment analysis',
        PercentCompletion: 100,
        TaskName: 'Consumer beverage trend and competitor benchmarking',
        TaskType: 'Planning',
        Responsibility: 'Dr. Priya Raman',
        Duration: '10 days',
        Effort: '80',
        Description: 'Review market literature on vitamin-fortified fruit juices, sensory preferences and consumer convenience trends.',
        PlanStart: '2026-01-05',
        PlanEnd: '2026-01-15',
        ActualStart: '2026-01-05',
        ActualEnd: '2026-01-14',
        ETA: '2026-01-14',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'FMCG New Product Development Stage-Gate',
        delayReason: '-'
      },
      {
        IsActive: true,
        ProjectName: 'Vitamin-Enriched Fruit Beverage 250ml',
        ProjectCode: '2026/FMCG/001',
        Stage: 'S1 - Consumer Need and Market Opportunity',
        Module: 'Program economics and risk screening',
        PercentCompletion: 75,
        TaskName: 'Target nutritional claim and formulation feasibility screening',
        TaskType: 'R&D',
        Responsibility: 'Rajesh Kumar',
        Duration: '12 days',
        Effort: '96',
        Description: 'Evaluate vitamin C and B-complex stability, antioxidant synergy and cost of goods model.',
        PlanStart: '2026-01-16',
        PlanEnd: '2026-01-28',
        ActualStart: '2026-01-16',
        ActualEnd: '',
        ETA: '2026-01-30',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'FMCG New Product Development Stage-Gate',
        delayReason: 'Nutrient Premix Supplier Data Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Vitamin-Enriched Fruit Beverage 250ml',
        ProjectCode: '2026/FMCG/001',
        Stage: 'S3 - Product Ideation and Concept Screening',
        Module: 'Screening assay and flavor setup',
        PercentCompletion: 40,
        TaskName: 'Benchtop sensory screening and flavor evaluation',
        TaskType: 'Sensory',
        Responsibility: 'Anita Desai',
        Duration: '15 days',
        Effort: '120',
        Description: 'Screen natural fruit pulp blends, titratable acidity levels and sweetness masking profiles.',
        PlanStart: '2026-02-01',
        PlanEnd: '2026-02-15',
        ActualStart: '2026-02-01',
        ActualEnd: '',
        ETA: '2026-02-18',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Very High',
        Template: 'FMCG New Product Development Stage-Gate',
        delayReason: 'Flavor Ingredient Qualification Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Probiotic Greek Yogurt 150g',
        ProjectCode: '2026/FMCG/002',
        Stage: 'S2 - Market and Product Concept Validation',
        Module: 'Validation plan and success criteria',
        PercentCompletion: 100,
        TaskName: 'Market and consumer concept validation plan and success criteria',
        TaskType: 'Planning',
        Responsibility: 'Priya Reddy',
        Duration: '10 days',
        Effort: '60',
        Description: 'Define target sensory acceptance threshold (>=7.5 hedonic score), live probiotic CFU/g counts and price positioning.',
        PlanStart: '2026-01-10',
        PlanEnd: '2026-01-20',
        ActualStart: '2026-01-10',
        ActualEnd: '2026-01-19',
        ETA: '2026-01-19',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'FMCG New Product Development Stage-Gate',
        delayReason: '-'
      },
      {
        IsActive: true,
        ProjectName: 'Probiotic Greek Yogurt 150g',
        ProjectCode: '2026/FMCG/002',
        Stage: 'S2 - Market and Product Concept Validation',
        Module: 'Regulatory and claim strategy',
        PercentCompletion: 60,
        TaskName: 'Regulatory pathway and nutrition claim outline (FSSAI)',
        TaskType: 'Regulatory',
        Responsibility: 'Suresh Naidu',
        Duration: '8 days',
        Effort: '48',
        Description: 'Review FSSAI probiotic dairy guidelines, gut-health claim substantiation and labeling compliance.',
        PlanStart: '2026-01-22',
        PlanEnd: '2026-01-30',
        ActualStart: '2026-01-22',
        ActualEnd: '',
        ETA: '2026-02-05',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'FMCG New Product Development Stage-Gate',
        delayReason: 'Regulatory Advisory Meeting Slot Unavailable'
      },
      {
        IsActive: false,
        ProjectName: 'Probiotic Greek Yogurt 150g',
        ProjectCode: '2026/FMCG/002',
        Stage: 'S3 - Product Ideation and Concept Screening',
        Module: 'Primary culture screening campaign',
        PercentCompletion: 20,
        TaskName: 'Starter culture and strain screening trial',
        TaskType: 'R&D',
        Responsibility: 'Amit Patel',
        Duration: '14 days',
        Effort: '110',
        Description: 'Screen multi-strain probiotic combinations (L. acidophilus, B. lactis) for fermentation rate and post-acidification.',
        PlanStart: '2026-02-05',
        PlanEnd: '2026-02-19',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-02-22',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'Very High',
        Template: 'FMCG New Product Development Stage-Gate',
        delayReason: 'Culture Vendor Dispatch Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Sustainable Barrier Snack Pouch 50g',
        ProjectCode: '2026/FMCG/003',
        Stage: 'S3 - Product Ideation and Concept Screening',
        Module: 'Barrier packaging and material setup',
        PercentCompletion: 90,
        TaskName: 'Barrier film OTR/WVTR and shelf-life simulation',
        TaskType: 'Packaging',
        Responsibility: 'Dr. Priya Raman',
        Duration: '12 days',
        Effort: '90',
        Description: 'Evaluate oxygen and water vapor transmission rates of recyclable mono-material barrier laminate films.',
        PlanStart: '2026-01-15',
        PlanEnd: '2026-01-27',
        ActualStart: '2026-01-15',
        ActualEnd: '2026-01-26',
        ETA: '2026-01-26',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Sustainable Packaging Innovation',
        delayReason: 'Barrier Film Vendor Dispatch Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Sustainable Barrier Snack Pouch 50g',
        ProjectCode: '2026/FMCG/003',
        Stage: 'S3 - Product Ideation and Concept Screening',
        Module: 'Seal characterization',
        PercentCompletion: 70,
        TaskName: 'Pouch heat seal characterization and hermeticity verification',
        TaskType: 'Packaging',
        Responsibility: 'Rajesh Kumar',
        Duration: '14 days',
        Effort: '105',
        Description: 'Conduct hot-tack and seal strength trials across sealing jaw temperatures (120-160°C) on pilot FFS line.',
        PlanStart: '2026-02-01',
        PlanEnd: '2026-02-14',
        ActualStart: '2026-02-01',
        ActualEnd: '',
        ETA: '2026-02-18',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Sustainable Packaging Innovation',
        delayReason: 'Seal Integrity Test Reproducibility Verification'
      },
      {
        IsActive: true,
        ProjectName: 'Plant-Based Protein Shake 330ml',
        ProjectCode: '2026/FMCG/004',
        Stage: 'S2 - Market and Product Concept Validation',
        Module: 'Modality and platform strategy',
        PercentCompletion: 80,
        TaskName: 'Modality, protein isolate and stabilizer platform selection',
        TaskType: 'R&D',
        Responsibility: 'Anita Desai',
        Duration: '16 days',
        Effort: '120',
        Description: 'Select pea and oat protein isolates, hydrocolloid stabilizer systems and micro-emulsion emulsifiers.',
        PlanStart: '2026-01-20',
        PlanEnd: '2026-02-05',
        ActualStart: '2026-01-20',
        ActualEnd: '',
        ETA: '2026-02-05',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'FMCG New Product Development Stage-Gate',
        delayReason: '-'
      },
      {
        IsActive: true,
        ProjectName: 'Plant-Based Protein Shake 330ml',
        ProjectCode: '2026/FMCG/004',
        Stage: 'S4 - Product Formulation and Product Optimization',
        Module: 'Formulation and product optimization campaign',
        PercentCompletion: 50,
        TaskName: 'Pilot plant high-shear homogenization and thermal stability campaign',
        TaskType: 'Engineering',
        Responsibility: 'Priya Reddy',
        Duration: '16 days',
        Effort: '128',
        Description: 'Optimize high-pressure homogenization (200-250 bar) to eliminate chalky mouthfeel and prevent protein sedimentation.',
        PlanStart: '2026-02-10',
        PlanEnd: '2026-02-26',
        ActualStart: '2026-02-10',
        ActualEnd: '',
        ETA: '2026-03-01',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'FMCG New Product Development Stage-Gate',
        delayReason: 'Homogenizer Valve Turnaround Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Clean-Label Dishwash Gel Concentrate 500ml',
        ProjectCode: '2026/FMCG/005',
        Stage: 'S2 - Market and Product Concept Validation',
        Module: 'In vitro cleaning validation',
        PercentCompletion: 65,
        TaskName: 'Bio-surfactant cleaning efficacy validation (in vitro grease removal)',
        TaskType: 'Formulation',
        Responsibility: 'Amit Patel',
        Duration: '15 days',
        Effort: '100',
        Description: 'Evaluate plant-derived alkyl polyglucosides (APG) and rhamnolipids for grease cutting and soil suspension.',
        PlanStart: '2026-01-12',
        PlanEnd: '2026-01-27',
        ActualStart: '2026-01-12',
        ActualEnd: '',
        ETA: '2026-01-30',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'FMCG Home & Personal Care Stage-Gate',
        delayReason: 'Bio-Surfactant Supply Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Clean-Label Dishwash Gel Concentrate 500ml',
        ProjectCode: '2026/FMCG/005',
        Stage: 'S2 - Market and Product Concept Validation',
        Module: 'Rheology and stability validation',
        PercentCompletion: 35,
        TaskName: 'Rheology profile and natural thickener stability in cold storage',
        TaskType: 'Formulation',
        Responsibility: 'Suresh Naidu',
        Duration: '20 days',
        Effort: '160',
        Description: 'Benchmark xanthan gum and modified citrus pectin systems for yield stress, bottle pourability and freeze-thaw stability.',
        PlanStart: '2026-02-01',
        PlanEnd: '2026-02-21',
        ActualStart: '2026-02-01',
        ActualEnd: '',
        ETA: '2026-02-25',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'FMCG Home & Personal Care Stage-Gate',
        delayReason: 'Stability Chamber Slot Availability'
      }
    ];

    this.rawProjects = mockData;
    this.applyFilter();
  }

  getSliderColor(percent: number): string {
    if (percent <= 30) return '#2563eb'; // Blue
    if (percent > 30 && percent <= 80) return '#f59e0b'; // Amber
    if (percent === 100) return '#10b981'; // Green
    return '#3b82f6';
  }

  updateTime(): void {
    const now = new Date();
    const formattedHours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.currentTime = `${formattedHours}:${minutes} ${now.getHours() >= 12 ? "PM" : "AM"}`;
  }

  // --- Filtering & Pagination ---

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  onClear(): void {
    this.filterForm.reset();
    this.excludeCompleted = false;
    this.isOverdueOnly = false;
    this.currentPage = 0;
    this.applyFilter();
  }

  onExcludeCompletedChange(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  onOverdueChange(): void {
    this.currentPage = 0;
    this.monitorStateService.setOverdue(this.isOverdueOnly);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { overdue: this.isOverdueOnly ? 'true' : null },
      queryParamsHandling: 'merge'
    });
    this.applyFilter();
    this.cdr.markForCheck();
  }

  applyFilter(): void {
    let filtered = [...this.rawProjects];

    if (this.excludeCompleted) {
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100);
    }

    if (this.isOverdueOnly) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100 && !!p.PlanEnd && p.PlanEnd < today);
    }

    // Add additional logic here to filter using this.filterForm.value

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.allProjects = filtered.slice(start, start + this.pageSize);
    this.generateCalendarData();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  isDateExceeded(item: ActivityTask): boolean {
    if (item.Status === 'Completed' || item.PercentCompletion === 100) {
      return false;
    }
    if (!item.PlanEnd) {
      return false;
    }
    const today = new Date().toISOString().split('T')[0];
    return item.PlanEnd < today;
  }

  // --- View Toggles ---

  showCalendarView(): void { this.isCalendarView = true; }
  showGridView(): void { this.isCalendarView = false; }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  generateCalendarData(): void {
    const statusColors: Record<string, string> = {
      'Completed': '#a0e4ff',
      'Progress': '#ffea9f',
      'Hold': '#ffcdd2',
      'Pending': '#e3b2ff'
    };

    const daysToDistribute = this.showWeekend ? 7 : 5;

    this.calendarCards = this.allProjects.map((project, i) => ({
      hour: this.hoursList[i % this.hoursList.length],
      user: project.Responsibility,
      dayPlacement: (i % daysToDistribute) + 1,
      taskName: project.TaskName,
      projectName: project.ProjectName,
      status: project.Status,
      planStart: project.PlanStart,
      color: statusColors[project.Status] || '#d1fae5',
      pInitials: project.TaskName.substring(0, 2).toUpperCase()
    }));
  }

  // --- Actions ---

  // onAddTask(): void {
  //   this.dialog.open(AddProjActivityComponent, { width: '900px', maxWidth: '95vw', data: { isEditMode: false } });
  // }

  onEditTask(item: ActivityTask): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        ...item,
        Deliverable: item.Module || (item as any).Deliverable || 'Module1',
        Stage: item.Stage || 'Feasibility',
        isEditMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, {
          TaskName: result.TaskName || item.TaskName,
          Module: result.Deliverable || item.Module,
          Stage: result.stage || item.Stage,
          Description: result.Description !== undefined ? result.Description : item.Description,
          Status: result.Status || item.Status,
          PlanStart: result.PlanStart || item.PlanStart,
          PlanEnd: result.PlanEnd || item.PlanEnd,
          ActualStart: result.ActualStart || item.ActualStart,
          ActualEnd: result.ActualEnd || item.ActualEnd,
          Duration: result.planDuration || item.Duration,
          Effort: result.planEffort || item.Effort
        });
        this.generateCalendarData();
        this.applyFilter();
      }
    });
  }

  onDeleteTask(item: ActivityTask): void {
    if (!this.canDelete) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawProjects = this.rawProjects.filter(p => p !== item);
        this.applyFilter();
      }
    });
  }

  // onStatusToggle(item: ActivityTask): void {
  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: { title: 'Change Status', content: 'Are you sure you want to Change the Status?' }
  //   });
  //   dialogRef.afterClosed().subscribe(confirmed => {
  //     if (!confirmed) {
  //       item.IsActive = !item.IsActive; // Revert change
  //     }
  //     this.generateCalendarData();
  //   });
  // }

  // openGridView(): void {
  //   this.dialog.open(FreezepanesDialogComponent, { width: 'auto', height: 'auto' });
  // }

  openProject(item: ActivityTask): void {
    this.router.navigate(['/projects/dashboard/activities'], {
      queryParams: {
        code: item.ProjectCode,
        projectCode: item.ProjectCode,
        name: item.ProjectName,
        projectName: item.ProjectName
      }
    });
  }

  openPdf(fileName: string): void {
    window.open(`assets/${fileName}`, '_blank');
  }

  // --- Timeline Modal ---

  openTimelineModal(task: ActivityTask): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }

  scrollLeft(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }
  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
