import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
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

import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ProjectWbsTasksComponent } from '../../projects/project-dashboard/project-stages/project-wbs/project-wbs-tasks/project-wbs-tasks.component';

export interface MonitorTaskItem {
  id: number;
  IsActive: boolean;
  Done: boolean;
  ProjectCode: string;
  TaskName: string;
  ProjectName: string;
  Department: string;
  Role: string;
  DueDate: string;
  CompletedDate: string;
  Remarks?: string;
  isDateExceeded?: boolean;
  delayReason?: string;
}

@Component({
  selector: 'app-monitor-tasks',
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
  templateUrl: './monitor-tasks.component.html',
  styleUrl: './monitor-tasks.component.scss'
})
export class MonitorTasksComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  // View & Toggle States
  showFilter = false;
  excludeCompleted = false;
  isOverdueOnly = false;
  isFullKit = false;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalSize = 0;

  // Data
  rawTasks: MonitorTaskItem[] = [];
  paginatedTasks: MonitorTaskItem[] = [];

  // Filter Form
  filterForm: FormGroup = this.fb.group({
    Keyword: [null],
    ProjectCode: [null],
    Department: [null],
    Role: [null],
    FromDate: [null],
    ToDate: [null],
    ActiveOnly: [false]
  });

  // Edit Modal State
  showEditModal = false;
  currentEditItem: MonitorTaskItem | null = null;
  editForm: FormGroup = this.fb.group({
    ProjectCode: [''],
    TaskName: [''],
    ProjectName: [''],
    Department: [''],
    Role: [''],
    DueDate: [''],
    CompletedDate: [''],
    Remarks: [''],
    IsActive: [true],
    Done: [false]
  });

    departmentOptions: string[] = [
    'R&D & Product Innovation',
    'Finance & Program Management',
    'Regulatory Affairs',
    'Quality Assurance',
    'Sourcing & Procurement',
    'Program Strategy',
    'Sensory & Consumer Science',
    'Packaging Development',
    'Pilot Plant Operations'
  ];

  roleOptions: string[] = [
    'Lead Formulation Scientist',
    'Program Finance Lead',
    'Regulatory Affairs Specialist',
    'Vendor Quality Specialist',
    'Packaging Sourcing Specialist',
    'Program Strategy Manager',
    'Sensory Science Lead',
    'Packaging Engineering Lead',
    'Formulation Scientist',
    'QA Food Safety Specialist',
    'Pilot Plant Process Engineer'
  ];

  ngOnInit(): void {
    this.initMockTasks();
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

    initMockTasks(): void {
    this.rawTasks = [
      {
        id: 1,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/001',
        TaskName: 'Beverage formulation and nutritional stability review protocol',
        ProjectName: 'Vitamin-Enriched Fruit Beverage 250ml',
        Department: 'R&D & Product Innovation',
        Role: 'Lead Formulation Scientist',
        DueDate: '2026-02-15',
        CompletedDate: '2026-02-14',
        Remarks: 'Nutritional review and benchtop formulation protocol signed off.',
        isDateExceeded: false
      },
      {
        id: 2,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/001',
        TaskName: 'Preliminary cost of goods and program budget estimate',
        ProjectName: 'Vitamin-Enriched Fruit Beverage 250ml',
        Department: 'Finance & Program Management',
        Role: 'Program Finance Lead',
        DueDate: '2026-02-28',
        CompletedDate: '',
        Remarks: 'Vendor ingredient cost quotes pending for vitamin premix and cloudy citrus concentrate.',
        isDateExceeded: true,
        delayReason: 'CDMO Cost Quote Pending'
      },
      {
        id: 3,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/002',
        TaskName: 'Applicable guidelines and regulatory pathway matrix (FSSAI / Legal Metrology)',
        ProjectName: 'Probiotic Greek Yogurt 150g',
        Department: 'Regulatory Affairs',
        Role: 'Regulatory Affairs Specialist',
        DueDate: '2026-01-20',
        CompletedDate: '2026-01-19',
        Remarks: 'FSSAI probiotic dairy standards and live CFU claim guidelines mapped.',
        isDateExceeded: false
      },
      {
        id: 4,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/002',
        TaskName: 'Ingredient supplier and dairy farm capability audits',
        ProjectName: 'Probiotic Greek Yogurt 150g',
        Department: 'Quality Assurance',
        Role: 'Vendor Quality Specialist',
        DueDate: '2026-03-10',
        CompletedDate: '',
        Remarks: 'Audit CAPA items pending closure from milk processing co-packer.',
        isDateExceeded: false,
        delayReason: 'Supplier Audit Observation Closure Pending'
      },
      {
        id: 5,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/003',
        TaskName: 'Long-lead barrier resin and laminate identification and early vendor outreach',
        ProjectName: 'Sustainable Barrier Snack Pouch 50g',
        Department: 'Sourcing & Procurement',
        Role: 'Packaging Sourcing Specialist',
        DueDate: '2026-01-25',
        CompletedDate: '2026-01-24',
        Remarks: 'Recyclable mono-material PP supplier samples requested and verified.',
        isDateExceeded: false
      },
      {
        id: 6,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/003',
        TaskName: 'Target product profile (TPP) and consumer convenience drafting',
        ProjectName: 'Sustainable Barrier Snack Pouch 50g',
        Department: 'Program Strategy',
        Role: 'Program Strategy Manager',
        DueDate: '2026-02-10',
        CompletedDate: '2026-02-09',
        Remarks: 'Consumer tear-notch and resealable zipper specs confirmed.',
        isDateExceeded: false
      },
      {
        id: 7,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/004',
        TaskName: 'Plant protein dispersion and high-shear homogenization model design',
        ProjectName: 'Plant-Based Protein Shake 330ml',
        Department: 'R&D & Product Innovation',
        Role: 'Lead Formulation Scientist',
        DueDate: '2026-02-25',
        CompletedDate: '',
        Remarks: 'Pea protein solubility and emulsifier compatibility screening in progress.',
        isDateExceeded: true,
        delayReason: 'Emulsifier Lot Qualification Conflict'
      },
      {
        id: 8,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/004',
        TaskName: 'Target product profile and sensory benchmark success criteria cascade',
        ProjectName: 'Plant-Based Protein Shake 330ml',
        Department: 'Sensory & Consumer Science',
        Role: 'Sensory Science Lead',
        DueDate: '2026-03-05',
        CompletedDate: '',
        Remarks: '9-point hedonic acceptance criteria cascaded to product development team.',
        isDateExceeded: false,
        delayReason: 'Validation Criteria Review Revision'
      },
      {
        id: 9,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/005',
        TaskName: 'Target market segments and regulatory notification shortlist',
        ProjectName: 'Clean-Label Dishwash Gel Concentrate 500ml',
        Department: 'Program Strategy',
        Role: 'Program Strategy Manager',
        DueDate: '2026-01-30',
        CompletedDate: '2026-01-29',
        Remarks: 'Ecolabel certification requirements and target retail chains mapped.',
        isDateExceeded: false
      },
      {
        id: 10,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/005',
        TaskName: 'Contract manufacturing agreements and long-lead bottle mold tooling release',
        ProjectName: 'Clean-Label Dishwash Gel Concentrate 500ml',
        Department: 'Sourcing & Procurement',
        Role: 'Packaging Sourcing Specialist',
        DueDate: '2026-03-15',
        CompletedDate: '',
        Remarks: 'Injection blow molding tooling quotes under evaluation.',
        isDateExceeded: false
      },
      {
        id: 11,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/005',
        TaskName: 'Natural surfactant blend generation for dishwash cleaning efficacy',
        ProjectName: 'Clean-Label Dishwash Gel Concentrate 500ml',
        Department: 'R&D & Product Innovation',
        Role: 'Formulation Scientist',
        DueDate: '2026-03-20',
        CompletedDate: '',
        Remarks: 'Alkyl polyglucoside surfactant trial batches underway.',
        isDateExceeded: false,
        delayReason: 'Bio-Surfactant Raw Material Supply Delay'
      },
      {
        id: 12,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/005',
        TaskName: 'Preservative efficacy testing (PET) protocol and microbial challenge',
        ProjectName: 'Clean-Label Dishwash Gel Concentrate 500ml',
        Department: 'Quality Assurance',
        Role: 'QA Food Safety Specialist',
        DueDate: '2026-04-05',
        CompletedDate: '',
        Remarks: 'USP 51 challenge testing scheduled with external accredited laboratory.',
        isDateExceeded: false,
        delayReason: 'Microbiology Incubator Slot Availability'
      }
    ];

    this.totalSize = this.rawTasks.length;
    this.applyFilter();
  }

  // --- Filter & Pagination ---

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
    this.isFullKit = false;
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
    let filtered = [...this.rawTasks];
    const formVals = this.filterForm.value;

    if (this.excludeCompleted) {
      filtered = filtered.filter(t => !t.Done);
    }

    if (this.isOverdueOnly) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => !t.Done && t.DueDate && t.DueDate < today);
    }

    if (formVals.Keyword && formVals.Keyword.trim()) {
      const kw = formVals.Keyword.trim().toLowerCase();
      filtered = filtered.filter(t =>
        t.ProjectCode.toLowerCase().includes(kw) ||
        t.TaskName.toLowerCase().includes(kw) ||
        t.ProjectName.toLowerCase().includes(kw) ||
        t.Department.toLowerCase().includes(kw) ||
        t.Role.toLowerCase().includes(kw) ||
        (t.Remarks && t.Remarks.toLowerCase().includes(kw))
      );
    }

    if (formVals.ProjectCode && formVals.ProjectCode.trim()) {
      const pc = formVals.ProjectCode.trim().toLowerCase();
      filtered = filtered.filter(t => t.ProjectCode.toLowerCase().includes(pc));
    }

    if (formVals.Department) {
      filtered = filtered.filter(t => t.Department === formVals.Department);
    }

    if (formVals.Role) {
      filtered = filtered.filter(t => t.Role === formVals.Role);
    }

    if (formVals.FromDate) {
      filtered = filtered.filter(t => t.DueDate >= formVals.FromDate);
    }

    if (formVals.ToDate) {
      filtered = filtered.filter(t => t.DueDate <= formVals.ToDate);
    }

    if (formVals.ActiveOnly) {
      filtered = filtered.filter(t => t.IsActive);
    }

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.paginatedTasks = filtered.slice(start, start + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  // --- Row Actions ---

  onDoneChange(item: MonitorTaskItem): void {
    if (item.Done && !item.CompletedDate) {
      item.CompletedDate = new Date().toISOString().split('T')[0];
    } else if (!item.Done) {
      item.CompletedDate = '';
    }
  }

  onEditTask(item: MonitorTaskItem): void {
    const dialogRef = this.dialog.open(ProjectWbsTasksComponent, {
      width: '750px',
      maxWidth: '95vw',
      height: 'auto',
      data: {
        mode: 'edit',
        row: item,
        tasks: item.TaskName
          ? [
              {
                name: item.TaskName,
                dueDate: item.DueDate || '2026-02-15',
                completedDate: item.CompletedDate || '2026-02-14'
              }
            ]
          : undefined
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.tasks && result.tasks.length > 0) {
        const lastTask = result.tasks[result.tasks.length - 1];
        if (lastTask?.name) {
          item.TaskName = lastTask.name;
        }
        if (lastTask?.dueDate) {
          item.DueDate = lastTask.dueDate;
        }
        if (lastTask?.completedDate) {
          item.CompletedDate = lastTask.completedDate;
        }
        this.applyFilter();
      }
    });
  }

  saveEditTask(): void {
    if (!this.currentEditItem) return;
    const formVals = this.editForm.value;
    Object.assign(this.currentEditItem, {
      ProjectCode: formVals.ProjectCode,
      TaskName: formVals.TaskName,
      ProjectName: formVals.ProjectName,
      Department: formVals.Department,
      Role: formVals.Role,
      DueDate: formVals.DueDate,
      CompletedDate: formVals.CompletedDate,
      Remarks: formVals.Remarks,
      IsActive: formVals.IsActive,
      Done: formVals.Done
    });
    this.closeEditModal();
    this.applyFilter();
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentEditItem = null;
  }

  onDeleteTask(item: MonitorTaskItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawTasks = this.rawTasks.filter(t => t.id !== item.id);
        this.applyFilter();
      }
    });
  }

  openProject(item: MonitorTaskItem): void {
    this.router.navigate(['/projects/dashboard/activities'], {
      queryParams: {
        code: item.ProjectCode,
        projectCode: item.ProjectCode,
        name: item.ProjectName,
        projectName: item.ProjectName
      }
    });
  }

  // --- Date Exceeded Helper ---
  isDateExceeded(item: MonitorTaskItem): boolean {
    if (item.isDateExceeded !== undefined) {
      return item.isDateExceeded;
    }
    if (item.CompletedDate && item.DueDate) {
      return item.CompletedDate > item.DueDate;
    }
    if (!item.Done && item.DueDate) {
      const today = new Date().toISOString().split('T')[0];
      return item.DueDate < today;
    }
    return false;
  }

  // --- Scrolling logic ---
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
}
