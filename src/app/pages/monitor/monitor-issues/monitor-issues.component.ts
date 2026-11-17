import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { MonitorStateService } from '../monitor-state.service';

import { AddIssueComponent } from '../../projects/project-dashboard/project-issues/add-issue/add-issue.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

export type Status = 'Pending' | 'Allocated' | 'Progress' | 'Hold' | 'Cancelled' | 'Completed';

export interface IssueCard {
  id: number;
  subject: string;
  issueDescription: string;
  remarks: string;
  status: string;
  targetDate: string;
  image: string;
  document: string;
  responsibility: string;
  projectName: string;
  projectCode: string;
  closed?: boolean;
  dueDate?: string;
  completedDate?: string;
  // Kanban specific
  LawFirm?: string;
  createdBy?: string;
  assignedTo?: string;
  createdDate?: string;
  expedite?: boolean;
  notes?: { text: string; author: string; date: string }[];
  expanded?: boolean;
  delayReason?: string;
}

@Component({
  selector: 'app-monitor-issues',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    DragDropModule,
    MatCardModule,
    MatCheckboxModule
  ],
  templateUrl: './monitor-issues.component.html',
  styleUrls: ['./monitor-issues.component.scss']
})
export class MonitorIssuesComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('kanbanContainer') kanbanContainer!: ElementRef<HTMLDivElement>;

  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  // View & Modal States
  showFilter: boolean = false;
  isKanbanView: boolean = false;
  showTimelineModal: boolean = false;
  selectedTimelineTask: IssueCard | null = null;
  maskClosed: boolean = false;
  isOverdueOnly: boolean = false;

  // Pagination & Filtering
  totalSize: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  filterForm: FormGroup = this.fb.group({
    Keyword: [''],
    Status: ['']
  });

  // Data Arrays
  originalTableList: IssueCard[] = [];
  tableList: IssueCard[] = [];
  filteredIssues: IssueCard[] = [];

  // Kanban Data
  readonly kanbanLists: Status[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];
  kanbanCards: Record<Status, IssueCard[]> = {
    Pending: [], Allocated: [], Progress: [],
    Hold: [], Cancelled: [], Completed: []
  };

  ngOnInit(): void {
    this.loadMockData();
    this.applyFilters();
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

    private loadMockData(): void {
    this.originalTableList = [
      {
        id: 1,
        subject: 'Emulsion Phase Separation during Thermal Treatment',
        issueDescription: 'Micro-fluidizer pressure and gum stabilizer ratio under review; accelerated centrifugation test ongoing.',
        targetDate: '2026-03-15',
        dueDate: '2026-03-15',
        completedDate: '',
        closed: false,
        remarks: 'Micro-fluidizer pressure and gum stabilizer ratio under review; accelerated centrifugation test ongoing.',
        status: 'Pending',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        responsibility: 'R&D & Product Innovation',
        projectName: 'Vitamin-Enriched Fruit Beverage 250ml',
        projectCode: '2026/FMCG/001',
        delayReason: 'Stabilizer Blend Interaction Delay'
      },
      {
        id: 2,
        subject: 'Post-Acidification and Syneresis in Shelf-Life Study',
        issueDescription: 'pH drop from 4.5 to 4.1 observed at day 21; buffer capacity and cooling curve optimization in progress.',
        targetDate: '2026-03-20',
        dueDate: '2026-03-20',
        completedDate: '',
        closed: false,
        remarks: 'pH drop from 4.5 to 4.1 observed at day 21; buffer capacity and cooling curve optimization in progress.',
        status: 'Progress',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        responsibility: 'Sensory & Quality Assurance',
        projectName: 'Probiotic Greek Yogurt 150g',
        projectCode: '2026/FMCG/002',
        delayReason: 'Starter Culture Strain Interaction Drift'
      },
      {
        id: 3,
        subject: 'Barrier Film Delamination at High Packaging Seal Speed',
        issueDescription: 'OTR exceeds 0.5 cc/m²/day at rotary jaw temp > 140°C; seal dwell time and corona treatment under adjustment.',
        targetDate: '2026-03-10',
        dueDate: '2026-03-10',
        completedDate: '',
        closed: false,
        remarks: 'OTR exceeds 0.5 cc/m²/day at rotary jaw temp > 140°C; seal dwell time and corona treatment under adjustment.',
        status: 'Hold',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        responsibility: 'Packaging Development',
        projectName: 'Sustainable Barrier Snack Pouch 50g',
        projectCode: '2026/FMCG/003',
        delayReason: 'Polymer Coating Adhesion Backlog'
      },
      {
        id: 4,
        subject: 'Protein Grittiness and Sedimentation in Pilot HTST Run',
        issueDescription: 'Two-stage homogenization pressure raised to 250/50 bar; particle size d90 reduced below 5 microns, verification passed.',
        targetDate: '2026-02-25',
        dueDate: '2026-02-25',
        completedDate: '2026-02-24',
        closed: true,
        remarks: 'Two-stage homogenization pressure raised to 250/50 bar; particle size d90 reduced below 5 microns, verification passed.',
        status: 'Closed',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        responsibility: 'Pilot Plant & Manufacturing',
        projectName: 'Plant-Based Protein Shake 330ml',
        projectCode: '2026/FMCG/004',
        delayReason: '-'
      },
      {
        id: 5,
        subject: 'Cloud Point Instability at Elevated Ambient Temperature',
        issueDescription: 'Gel clarity turns hazy above 35°C; non-ionic surfactant ratio and natural preservative compatibility under review.',
        targetDate: '2026-03-18',
        dueDate: '2026-03-18',
        completedDate: '',
        closed: false,
        remarks: 'Gel clarity turns hazy above 35°C; non-ionic surfactant ratio and natural preservative compatibility under review.',
        status: 'Pending',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        responsibility: 'R&D & Product Innovation',
        projectName: 'Clean-Label Dishwash Gel Concentrate 500ml',
        projectCode: '2026/FMCG/005',
        delayReason: 'Bio-Surfactant Supplier Report Delay'
      },
      {
        id: 6,
        subject: 'Oxygen Absorber Scavenging Rate Variance in Nitrogen Flush',
        issueDescription: 'Headspace residual oxygen exceeds 0.8%; modified atmosphere packaging nozzle position under optimization.',
        targetDate: '2026-03-28',
        dueDate: '2026-03-28',
        completedDate: '',
        closed: false,
        remarks: 'Headspace residual oxygen exceeds 0.8%; modified atmosphere packaging nozzle position under optimization.',
        status: 'Pending',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        responsibility: 'Packaging Development',
        projectName: 'Sustainable Barrier Snack Pouch 50g',
        projectCode: '2026/FMCG/003',
        delayReason: 'Packaging Substrate Lot Variability'
      }
    ];
  }

  // --- Filtering & Pagination ---

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onClear(): void {
    this.filterForm.reset();
    this.maskClosed = false;
    this.isOverdueOnly = false;
    this.currentPage = 0;
    this.applyFilters();
  }

  onClosedChange(item: IssueCard, checked: boolean): void {
    item.closed = checked;
    if (checked) {
      item.status = 'Closed';
      if (!item.completedDate) {
        item.completedDate = new Date().toISOString().split('T')[0];
      }
    } else {
      if (item.status === 'Closed') {
        item.status = 'Pending';
      }
      item.completedDate = '';
    }
    const orig = this.originalTableList.find(t => t.id === item.id);
    if (orig) {
      orig.closed = item.closed;
      orig.status = item.status;
      orig.completedDate = item.completedDate;
    }
    this.applyFilters();
  }

  isDateExceeded(item: IssueCard): boolean {
    const isClosed = item.closed || item.status === 'Closed';
    if (isClosed) return false;
    const d = item.dueDate || item.targetDate;
    if (!d) return false;
    const today = new Date().toISOString().split('T')[0];
    return d < today;
  }

  onOverdueChange(): void {
    this.currentPage = 0;
    this.monitorStateService.setOverdue(this.isOverdueOnly);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { overdue: this.isOverdueOnly ? 'true' : null },
      queryParamsHandling: 'merge'
    });
    this.applyFilters();
  }

  applyFilters(): void {
    const { Keyword, Status } = this.filterForm.value;
    const keywordStr = (Keyword || '').toLowerCase().trim();
    const today = new Date().toISOString().split('T')[0];

    this.filteredIssues = this.originalTableList.filter(item => {
      if (this.maskClosed && (item.closed || item.status === 'Closed')) {
        return false;
      }
      if (this.isOverdueOnly) {
        const d = item.dueDate || item.targetDate;
        const isClosed = item.closed || item.status === 'Closed';
        if (isClosed || !d || d >= today) {
          return false;
        }
      }
      let matchesKeyword = true;
      if (keywordStr) {
        matchesKeyword = (item.subject || '').toLowerCase().includes(keywordStr) ||
                         (item.issueDescription || '').toLowerCase().includes(keywordStr) ||
                         (item.remarks || '').toLowerCase().includes(keywordStr) ||
                         (item.projectCode || '').toLowerCase().includes(keywordStr) ||
                         (item.projectName || '').toLowerCase().includes(keywordStr);
      }
      let matchesStatus = true;
      if (Status) {
        matchesStatus = item.status === Status;
      }
      return matchesKeyword && matchesStatus;
    });

    this.totalSize = this.filteredIssues.length;
    const start = this.currentPage * this.pageSize;
    this.tableList = this.filteredIssues.slice(start, start + this.pageSize);
    this.initializeKanbanData();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  // --- Kanban Logic ---

  public getKanbanStatus(gridStatus: string): Status {
    if (gridStatus === 'Process') return 'Progress';
    if (gridStatus === 'Closed') return 'Completed';
    if (gridStatus === 'Hold') return 'Hold';
    if (gridStatus === 'Allocated') return 'Allocated';
    if (gridStatus === 'Cancelled') return 'Cancelled';
    return 'Pending';
  }

  private getGridStatus(kanbanStatus: Status): string {
    if (kanbanStatus === 'Progress') return 'Process';
    if (kanbanStatus === 'Completed') return 'Closed';
    return kanbanStatus;
  }

  private initializeKanbanData(): void {
    const grouped: Record<Status, IssueCard[]> = {
      Pending: [], Allocated: [], Progress: [],
      Hold: [], Cancelled: [], Completed: []
    };

    this.filteredIssues.forEach(item => {
      const kStatus = this.getKanbanStatus(item.status);
      grouped[kStatus].push({
        ...item,
        LawFirm: item.remarks || '',
        createdBy: 'Admin',
        assignedTo: item.responsibility,
        dueDate: item.targetDate,
        expedite: false,
        notes: [],
        expanded: false,
        status: kStatus
      });
    });
    this.kanbanCards = grouped;
  }

  onDrop(event: CdkDragDrop<IssueCard[]>, targetList: Status): void {
    const previousList = event.previousContainer.id as Status;
    const currentList = event.container.id as Status;

    if (previousList !== currentList) {
      transferArrayItem(
        this.kanbanCards[previousList],
        this.kanbanCards[currentList],
        event.previousIndex,
        event.currentIndex
      );

      const movedCard = this.kanbanCards[currentList][event.currentIndex];
      movedCard.status = currentList;

      // Sync with master table list
      const issue = this.originalTableList.find(item => item.id === movedCard.id);
      if (issue) issue.status = this.getGridStatus(currentList);

      const displayedIssue = this.tableList.find(item => item.id === movedCard.id);
      if (displayedIssue) displayedIssue.status = this.getGridStatus(currentList);
    } else {
      moveItemInArray(this.kanbanCards[targetList], event.previousIndex, event.currentIndex);
    }
  }

  toggleCard(card: IssueCard): void {
    card.expanded = !card.expanded;
  }

  getKanbanColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending': '#e24b4a',
      'Allocated': '#ef9f27',
      'Progress': '#378add',
      'Hold': '#f0995b',
      'Cancelled': '#888780',
      'Completed': '#639922'
    };
    return colors[status] ?? '#888780';
  }

  getCardClass(status: string): string {
    return status.toLowerCase() + '-card';
  }

  onEditIssue(item: IssueCard): void {
    const dialogRef = this.dialog.open(AddIssueComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { ...item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, result);
        const orig = this.originalTableList.find(t => t.id === item.id);
        if (orig) {
          Object.assign(orig, result);
        }
        this.applyFilters();
      }
    });
  }

  onDeleteIssue(item: IssueCard): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.originalTableList = this.originalTableList.filter(t => t.id !== item.id);
        this.applyFilters();
      }
    });
  }

  // openGridView(): void {
  //   this.dialog.open(IssuesGridColumnsComponent, { width: '800px', height: 'auto', data: {} });
  // }

  openProject(item: IssueCard): void {
    this.router.navigate(['/projects/dashboard/issues'], {
      queryParams: {
        code: item.projectCode,
        projectCode: item.projectCode,
        name: item.projectName,
        projectName: item.projectName
      }
    });
  }

  openTimelineModal(task: IssueCard): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }
  // --- Scrolling logic ---
  scrollLeft(): void {
    const container = this.isKanbanView ? this.kanbanContainer?.nativeElement : this.tableContainer?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const container = this.isKanbanView ? this.kanbanContainer?.nativeElement : this.tableContainer?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollKanban(direction: 'left' | 'right', amount: number = 340): void {
    if (!this.kanbanContainer?.nativeElement) return;
    const container = this.kanbanContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  public updateScrollButtons(): void {
    if (!this.kanbanContainer?.nativeElement) return;
    const el = this.kanbanContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
