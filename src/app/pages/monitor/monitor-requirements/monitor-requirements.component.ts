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
import { ProjectWbsRequirementsComponent } from '../../projects/project-dashboard/project-stages/project-wbs/project-wbs-requirements/project-wbs-requirements.component';

export interface MonitorRequirementItem {
  id: number;
  IsActive: boolean;
  Done: boolean;
  ProjectCode: string;
  RequirementName: string;
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
  selector: 'app-monitor-requirements',
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
  templateUrl: './monitor-requirements.component.html',
  styleUrl: './monitor-requirements.component.scss'
})
export class MonitorRequirementsComponent implements OnInit, OnDestroy {
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
  rawRequirements: MonitorRequirementItem[] = [];
  paginatedRequirements: MonitorRequirementItem[] = [];

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
  currentEditItem: MonitorRequirementItem | null = null;
  editForm: FormGroup = this.fb.group({
    ProjectCode: [''],
    RequirementName: [''],
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
    'Regulatory Affairs',
    'Sensory & Consumer Science',
    'Packaging Development',
    'Quality Assurance & Food Safety',
    'Sourcing & Procurement',
    'Pilot Plant Operations'
  ];

  roleOptions: string[] = [
    'Lead Formulation Scientist',
    'QA Food Safety Specialist',
    'Regulatory Affairs Specialist',
    'Sensory Science Lead',
    'Packaging Engineering Lead',
    'Analytical Scientist QC',
    'Ingredient Sourcing Specialist',
    'Pilot Plant Process Engineer'
  ];

  ngOnInit(): void {
    this.initMockRequirements();
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

    initMockRequirements(): void {
    this.rawRequirements = [
      {
        id: 1,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/001',
        RequirementName: 'Brix Tolerance (11.5 ± 0.3°Bx) & Titratable Acidity (0.45% citric acid eq)',
        ProjectName: 'Vitamin-Enriched Fruit Beverage 250ml',
        Department: 'R&D & Product Innovation',
        Role: 'Lead Formulation Scientist',
        DueDate: '2026-02-15',
        CompletedDate: '2026-02-14',
        Remarks: 'Benchtop Brix, refractive index and pH specifications met across trial batches.',
        isDateExceeded: false
      },
      {
        id: 2,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/001',
        RequirementName: 'Vitamin C Retention (>= 100% of RDA at Day 180 under 30°C/70% RH)',
        ProjectName: 'Vitamin-Enriched Fruit Beverage 250ml',
        Department: 'Quality Assurance & Food Safety',
        Role: 'QA Food Safety Specialist',
        DueDate: '2026-02-28',
        CompletedDate: '',
        Remarks: 'Accelerated stability chamber testing in progress; 60-day pull pending HPLC assay.',
        isDateExceeded: true,
        delayReason: 'Accelerated Stability Chamber Slot'
      },
      {
        id: 3,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/002',
        RequirementName: 'Viable Probiotic Count (>= 1.0 x 10^7 CFU/g at Expiry) & Clean Acid Profile',
        ProjectName: 'Probiotic Greek Yogurt 150g',
        Department: 'Quality Assurance & Food Safety',
        Role: 'QA Food Safety Specialist',
        DueDate: '2026-01-20',
        CompletedDate: '2026-01-19',
        Remarks: 'Colony forming unit counts and lactic acid ratio validated on pilot fermentation batches.',
        isDateExceeded: false
      },
      {
        id: 4,
        IsActive: false,
        Done: false,
        ProjectCode: '2026/FMCG/002',
        RequirementName: 'Texture Profile & Viscosity Stability (Firmness >= 45g, Syneresis < 2%)',
        ProjectName: 'Probiotic Greek Yogurt 150g',
        Department: 'Sensory & Consumer Science',
        Role: 'Sensory Science Lead',
        DueDate: '2026-03-05',
        CompletedDate: '',
        Remarks: 'Texture analyzer probe calibration in progress for set yogurt cup penetration test.',
        isDateExceeded: false,
        delayReason: 'Texture Analyzer Probe Calibration Delay'
      },
      {
        id: 5,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/003',
        RequirementName: 'Oxygen Transmission Rate (OTR < 0.5 cc/m²/day @ 23°C, 0% RH) for Recyclable Film',
        ProjectName: 'Sustainable Barrier Snack Pouch 50g',
        Department: 'Packaging Development',
        Role: 'Packaging Engineering Lead',
        DueDate: '2026-03-12',
        CompletedDate: '',
        Remarks: 'Mocon barrier test instrument queued for mono-material high-barrier laminate.',
        isDateExceeded: false
      },
      {
        id: 6,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/003',
        RequirementName: 'Pouch Heat Seal Strength (>= 22 N/15mm at 140°C Sealing Jaw Temperature)',
        ProjectName: 'Sustainable Barrier Snack Pouch 50g',
        Department: 'Packaging Development',
        Role: 'Packaging Engineering Lead',
        DueDate: '2026-02-10',
        CompletedDate: '2026-02-09',
        Remarks: 'Tensile seal strength test passed with consistent hermetic seal integrity.',
        isDateExceeded: false
      },
      {
        id: 7,
        IsActive: false,
        Done: false,
        ProjectCode: '2026/FMCG/004',
        RequirementName: 'Microbial Limits: Commercial Sterility (Absence of Spoilage Organisms & Pathogens)',
        ProjectName: 'Plant-Based Protein Shake 330ml',
        Department: 'Quality Assurance & Food Safety',
        Role: 'QA Food Safety Specialist',
        DueDate: '2026-03-25',
        CompletedDate: '',
        Remarks: 'B. stearothermophilus spore kill validation and 55°C incubation scheduled.',
        isDateExceeded: false,
        delayReason: 'Microbiology Incubation Facility Backlog'
      },
      {
        id: 8,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/004',
        RequirementName: 'Sensory Hedonic Overall Liking Score (>= 7.5 on 9-Point Scale vs Competitor)',
        ProjectName: 'Plant-Based Protein Shake 330ml',
        Department: 'Sensory & Consumer Science',
        Role: 'Sensory Science Lead',
        DueDate: '2026-02-05',
        CompletedDate: '2026-02-18',
        Remarks: 'Consumer sensory blind panel completed after initial date due to panelist re-scheduling.',
        isDateExceeded: true,
        delayReason: 'Consumer Taste Panel Scheduling Delay'
      },
      {
        id: 9,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/FMCG/005',
        RequirementName: 'FSSAI / Legal Metrology Regulatory Label & Front-of-Pack Nutritional Claim Sign-off',
        ProjectName: 'Clean-Label Dishwash Gel Concentrate 500ml',
        Department: 'Regulatory Affairs',
        Role: 'Regulatory Affairs Specialist',
        DueDate: '2026-04-02',
        CompletedDate: '',
        Remarks: 'Legal Metrology net quantity and Ecolabel claim dossier submitted for review.',
        isDateExceeded: false
      },
      {
        id: 10,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/FMCG/005',
        RequirementName: 'Biodegradability & Natural Surfactant Raw Material Supplier Qualification',
        ProjectName: 'Clean-Label Dishwash Gel Concentrate 500ml',
        Department: 'Sourcing & Procurement',
        Role: 'Ingredient Sourcing Specialist',
        DueDate: '2026-01-30',
        CompletedDate: '2026-01-29',
        Remarks: 'OECD 301B ready biodegradability test certificate verified from raw material supplier.',
        isDateExceeded: false
      }
    ];

    this.totalSize = this.rawRequirements.length;
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
    let filtered = [...this.rawRequirements];
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
        t.RequirementName.toLowerCase().includes(kw) ||
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
    this.paginatedRequirements = filtered.slice(start, start + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  // --- Row Actions ---

  onDoneChange(item: MonitorRequirementItem): void {
    if (item.Done && !item.CompletedDate) {
      item.CompletedDate = new Date().toISOString().split('T')[0];
    } else if (!item.Done) {
      item.CompletedDate = '';
    }
  }

  onEditRequirement(item: MonitorRequirementItem): void {
    const dialogRef = this.dialog.open(ProjectWbsRequirementsComponent, {
      width: '750px',
      maxWidth: '95vw',
      height: 'auto',
      data: {
        mode: 'edit',
        row: item,
        requirements: item.RequirementName
          ? [
              {
                name: item.RequirementName,
                dueDate: item.DueDate || '2026-02-15',
                completedDate: item.CompletedDate || '2026-02-14'
              }
            ]
          : undefined
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.requirements && result.requirements.length > 0) {
        const lastReq = result.requirements[result.requirements.length - 1];
        if (lastReq?.name) {
          item.RequirementName = lastReq.name;
        }
        if (lastReq?.dueDate) {
          item.DueDate = lastReq.dueDate;
        }
        if (lastReq?.completedDate) {
          item.CompletedDate = lastReq.completedDate;
        }
        this.applyFilter();
      }
    });
  }

  saveEditRequirement(): void {
    if (!this.currentEditItem) return;
    const formVals = this.editForm.value;
    Object.assign(this.currentEditItem, {
      ProjectCode: formVals.ProjectCode,
      RequirementName: formVals.RequirementName,
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

  onDeleteRequirement(item: MonitorRequirementItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawRequirements = this.rawRequirements.filter(t => t.id !== item.id);
        this.applyFilter();
      }
    });
  }

  openProject(item: MonitorRequirementItem): void {
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
  isDateExceeded(item: MonitorRequirementItem): boolean {
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
