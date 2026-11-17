import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AddResourceComponent } from './add-resource/add-resource.component';
import { DeleteConfirmationComponent } from '../../common/shared/delete-confirmation/delete-confirmation.component';

export interface ResourceScheduleItem {
  resource: string;
  initials: string;
  stage: string;
  module: string;
  task: string;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  planDuration: string;
  actualDuration: string;
  status: string;
  dayPlacement: string;
  color: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent implements OnInit, AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  // View States
  isCalendarView = signal<boolean>(false);
  showWeekend = signal<boolean>(false);
  showTimelineModal = signal<boolean>(false);
  selectedScheduleItem = signal<ResourceScheduleItem | null>(null);

  // Scroll States
  canScrollLeft = signal<boolean>(false);
  canScrollRight = signal<boolean>(true);

  // Project Info
  projectName = signal<string>('Vitamin-Enriched Fruit Beverage 250ml');
  projectCode = signal<string>('2026/FMCG/001');



  displayDays = computed(() => {
    return this.showWeekend()
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  });

  // Data
  schedules = signal<ResourceScheduleItem[]>([]);

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  paginatedSchedules = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.schedules().slice(start, end);
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['name'] && params['code']) {
        this.projectName.set(params['name']);
        this.projectCode.set(params['code']);
      }
    });

    this.initializeData();
  }

  ngAfterViewInit(): void {
    // Check initial scroll state after view renders
    setTimeout(() => this.checkScroll(), 0);
  }

    private initializeData(): void {
    this.schedules.set([
      {
        resource: 'LC-MS System A', initials: 'LC', stage: 'S1 - Business Case', module: 'Reference Product & Market Analysis',
        task: 'Reference Product Analytical Characterization', fromDate: '2026-06-01', fromTime: '09:00 AM', toDate: '2026-06-05',
        toTime: '05:00 PM', planDuration: '5 days', actualDuration: '5 days',
        status: 'Completed', dayPlacement: 'Monday', color: '#dcfce7', updatedBy: 'Priya Reddy'
      },
      {
        resource: 'Anita Desai', initials: 'AD', stage: 'S3 - Food-Grade Ingredient Procurement', module: 'Product Formulation Development & Sourcing',
        task: 'Natural Flavor Screening & Trial Batches', fromDate: '2026-06-08', fromTime: '09:00 AM', toDate: '2026-06-21',
        toTime: '05:00 PM', planDuration: '14 days', actualDuration: '12 days',
        status: 'Completed', dayPlacement: 'Tuesday', color: '#dcfce7', updatedBy: 'Anita Desai'
      },
      {
        resource: 'Benchtop Mixing & Blending Vessel B (5 L)', initials: 'BV', stage: 'S4 - POC Expression & Ingredient Refining', module: 'Pilot Blending & Process Optimization',
        task: 'Upstream Yield & Formulation Optimization', fromDate: '2026-06-22', fromTime: '09:00 AM', toDate: '2026-07-02',
        toTime: '05:00 PM', planDuration: '10 days', actualDuration: '8 days',
        status: 'Active', dayPlacement: 'Wednesday', color: '#e0f2fe', updatedBy: 'Rajesh Kumar'
      },
      {
        resource: 'Amit Patel', initials: 'AP', stage: 'S4 - POC Expression & Ingredient Refining', module: 'Analytical QA & Quality Test Development',
        task: 'Product Efficacy & Quality Testing', fromDate: '2026-07-03', fromTime: '09:00 AM', toDate: '2026-07-13',
        toTime: '05:00 PM', planDuration: '10 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Thursday', color: '#ffedd5', updatedBy: 'Amit Patel'
      },
      {
        resource: 'HunterLab Colorimeter & Spectrophotometer', initials: 'HC', stage: 'S4 - POC Expression & Ingredient Refining', module: 'Sensory & Visual Quality Testing',
        task: 'Color Delta-E & Cloud Turbidity Measurement', fromDate: '2026-07-14', fromTime: '09:00 AM', toDate: '2026-07-24',
        toTime: '05:00 PM', planDuration: '10 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Friday', color: '#ffedd5', updatedBy: 'Priya Reddy'
      },
      {
        resource: 'Sensory Evaluation Booth Suite', initials: 'SB', stage: 'S3 - Food-Grade Ingredient Procurement', module: 'Sensory Evaluation',
        task: 'Hedonic 9-Point Consumer Taste Panel', fromDate: '2026-06-05', fromTime: '09:00 AM', toDate: '2026-06-15',
        toTime: '05:00 PM', planDuration: '10 days', actualDuration: '10 days',
        status: 'Completed', dayPlacement: 'Friday', color: '#dcfce7', updatedBy: 'Anita Desai'
      },
      {
        resource: 'Stability Climatic Chamber (40°C/75% RH)', initials: 'SC', stage: 'S5 - Prototype Validation & Stability', module: 'Accelerated Shelf-Life Testing',
        task: 'Accelerated Vitamin Retention Stability Run', fromDate: '2026-07-01', fromTime: '09:00 AM', toDate: '2026-07-10',
        toTime: '05:00 PM', planDuration: '9 days', actualDuration: '7 days',
        status: 'Active', dayPlacement: 'Wednesday', color: '#e0f2fe', updatedBy: 'Deepa Nair'
      },
      {
        resource: 'Jacketed Blending Vessel 50 L', initials: 'JV', stage: 'S6 - Pilot Manufacturing Run', module: 'Pilot Blending Batches',
        task: 'Pilot Plant Thermal Processing Trial', fromDate: '2026-07-15', fromTime: '09:00 AM', toDate: '2026-07-30',
        toTime: '05:00 PM', planDuration: '15 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Wednesday', color: '#ffedd5', updatedBy: 'Suresh Naidu'
      },
      {
        resource: 'Aseptic FFS Packaging Line', initials: 'AL', stage: 'S8 - Finished Consumer Product Validation', module: 'Aseptic Filling & Sealing',
        task: 'High-Speed Bottle Filling & Seal Validation', fromDate: '2026-08-01', fromTime: '09:00 AM', toDate: '2026-08-15',
        toTime: '05:00 PM', planDuration: '14 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Monday', color: '#ffedd5', updatedBy: 'Vikram Singh'
      }
    ]);
  }

  // --- UI Interactivity ---

  toggleWeekend(): void {
    this.showWeekend.update(val => !val);
  }

  showCalendarView(): void {
    this.isCalendarView.set(true);
  }

  showGridView(): void {
    this.isCalendarView.set(false);
    setTimeout(() => this.checkScroll(), 0); // Re-check scroll when switching back to grid
  }

  getSchedulesForDay(day: string): ResourceScheduleItem[] {
    return this.schedules().filter(s => s.dayPlacement === day);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    setTimeout(() => this.checkScroll(), 0); // Re-check scroll on page change
  }

  // --- Modal Logic ---

  openTimelineModal(item: ResourceScheduleItem): void {
    this.selectedScheduleItem.set(item);
    this.showTimelineModal.set(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal.set(false);
    this.selectedScheduleItem.set(null);
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  // --- Dialog Actions ---

  openAddResourceScheduleDialog(): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const resName = result.resource || result.resourceName || 'New Resource';
        const newItem: ResourceScheduleItem = {
          resource: resName,
          initials: resName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          stage: result.stage || 'Feasibility',
          module: result.module || 'Resource Allocation',
          task: result.task || 'Resource Assignment',
          fromDate: result.fromDate || '',
          fromTime: result.fromTime || '09:00 AM',
          toDate: result.toDate || '',
          toTime: result.toTime || '05:00 PM',
          planDuration: result.planDuration || '5 days',
          actualDuration: result.actualDuration || '5 days',
          status: 'Active',
          dayPlacement: 'Monday',
          color: '#e0f2fe'
        };
        this.schedules.update(items => [newItem, ...items]);
        setTimeout(() => this.checkScroll(), 0);
      }
    });
  }

  editSchedule(item: ResourceScheduleItem): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { ...item, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const resName = result.resource || result.resourceName || item.resource;
        this.schedules.update(items =>
          items.map(s => {
            if (s === item) {
              return {
                ...s,
                resource: resName,
                initials: resName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
                fromDate: result.fromDate !== undefined ? result.fromDate : s.fromDate,
                toDate: result.toDate !== undefined ? result.toDate : s.toDate,
                fromTime: result.fromTime !== undefined ? result.fromTime : s.fromTime,
                toTime: result.toTime !== undefined ? result.toTime : s.toTime
              };
            }
            return s;
          })
        );
      }
    });
  }

  deleteSchedule(item: ResourceScheduleItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.schedules.update(items => items.filter(s => s !== item));
      }
    });
  }

  // --- Scrolling ---

  checkScroll(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;

    // Check if scrolled away from the left edge
    this.canScrollLeft.set(el.scrollLeft > 0);

    // Check if scrolled all the way to the right (-2px buffer for browser precision issues)
    this.canScrollRight.set(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 2);
  }

  scrollTable(direction: 'left' | 'right'): void {
    if (this.tableContainer?.nativeElement) {
      const amount = 350;
      this.tableContainer.nativeElement.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  }
}
