import { Component, OnInit, ViewChild, ElementRef, TemplateRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HoursProjectPopComponent } from './hours-project-pop/hours-project-pop.component';
import { HoursTimesheetComponent } from '../projects/project-dashboard/project-hours/hours-timesheet/hours-timesheet.component';
import { DeleteConfirmationComponent } from '../../common/shared/delete-confirmation/delete-confirmation.component';

export interface HourMessage {
  sender: string;
  date: string;
  text: string;
}

export interface HourTaskDetail {
  module: string;
  task: string;
  hours: number;
  description: string;
}

export interface HourEntry {
  dateObj: Date;
  jobCode: string;
  name: string;
  role?: string;
  projectsCount?: number;
  tasksList: HourTaskDetail[];
  totalHours: number;
  approved: boolean;
  declined: boolean;
  pending: boolean;
  isOvertime?: boolean;
  overtimeHours?: number;
  messages?: HourMessage[];
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  claims: number;
}

@Component({
  selector: 'app-hours',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.scss']
})
export class HoursComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;
  @ViewChild('tasksDialog') tasksDialog!: TemplateRef<any>;

  readonly monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  readonly dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentDate: Date = new Date(2026, 5, 1); // June 2026
  selectedDate: Date | null = null;

  projectName: string = 'Vitamin-Enriched Fruit Beverage 250ml';
  projectCode: string = '2026/FMCG/001';
  dynamicBreadcrumb: string = 'Vitamin-Enriched Fruit Beverage 250ml - 2026/FMCG/001';

  // Data Arrays
  entries: HourEntry[] = [];
  filteredEntries: HourEntry[] = [];
  paginatedEntries: HourEntry[] = [];
  calendarDays: CalendarDay[] = [];

  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;
  totalSize: number = 0;

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      if (params['name'] || params['code']) {
        this.projectName = params['name'] || this.projectName;
        this.projectCode = params['code'] || this.projectCode;
        this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
      }
    });
  }

  ngOnInit(): void {
    this.loadMockData();
    this.buildCalendar();

    const targetDefault = new Date(2026, 5, 2);
    const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && this.isSameDay(d.date, targetDefault))
      ?? this.calendarDays.find(d => d.inCurrentMonth)!;

    this.filterByDate(defaultDay);
  }

  private loadMockData(): void {
        const fmcgTasksPool: { module: string; task: string; description: string }[] = [
      { module: 'Formulation Development', task: 'Brix & Acid Balancing Trial', description: 'Adjustment of soluble solids (11.5°Bx) and citric/malic acid ratio for optimal tartness' },
      { module: 'Formulation Development', task: 'Vitamin Fortification Emulsion', description: 'Micro-encapsulated vitamin C, B6, B12 and zinc premix dispersion in aqueous phase' },
      { module: 'Formulation Development', task: 'Natural Color & Flavor Blending', description: 'Screening beta-carotene, black carrot extract and natural passionfruit-mango aromatics' },
      { module: 'Formulation Development', task: 'Sweetener Masking Optimization', description: 'Stevia rebaudioside-M and monk fruit synergy to mask vitamin bitter lingering' },
      { module: 'Formulation Development', task: 'Hydrocolloid Stabilizer Hydration', description: 'High-shear dissolution of pectin and citrus fiber for cloud retention' },
      { module: 'Sensory Science', task: 'Hedonic Scale 9-Point Taste Panel', description: 'Untrained consumer panel (n=60) evaluating overall liking, aroma, sweetness and aftertaste' },
      { module: 'Sensory Science', task: 'Descriptive Sensory Profiling (QDA)', description: 'Trained descriptive panel evaluating 14 sensory attributes across 3 candidate formulations' },
      { module: 'Sensory Science', task: 'Triangle Discrimination Testing', description: 'ISO 4120 sensory difference test comparing ambient vs cold-stored shelf-life samples' },
      { module: 'Analytical & QA', task: 'HPLC Vitamin C & B-Complex Assay', description: 'Reverse-phase HPLC determination of ascorbic acid and thiamine retention' },
      { module: 'Analytical & QA', task: 'Total Plate Count & Yeast/Mold Testing', description: 'Pour plate microbial load evaluation (limit: < 10 CFU/ml total aerobic count)' },
      { module: 'Analytical & QA', task: 'Headspace Gas Analysis (O2/CO2)', description: 'PBI Dansensor headspace oxygen verification targeting < 0.5% residual headspace oxygen' },
      { module: 'Analytical & QA', task: 'Brix & Refractometer Calibration', description: 'Digital temperature-compensated refractometer calibration against certified sucrose standard' },
      { module: 'Packaging Development', task: 'Barrier PET Bottle OTR & WVTR Testing', description: 'Mocon permeability measurement of multi-layer PET bottle with passive oxygen scavenger' },
      { module: 'Packaging Development', task: 'Hot-Fill Cap Torque & Leakage Audit', description: 'Secure-Pak digital torque meter testing of 38mm tamper-evident closure seal' },
      { module: 'Packaging Development', task: 'Drop & Secondary Packaging Compression', description: 'ISTA 3A case drop and pallet stacking compression strength simulation' },
      { module: 'Pilot Plant Operations', task: 'Jacketed Blending Vessel Trial (100 L)', description: 'Batch thermal mixing (65°C) and high-shear agitator vortex control' },
      { module: 'Pilot Plant Operations', task: 'High-Shear Emulsification Homogenization', description: 'Two-stage GEA homogenizer run at 200/50 bar for sub-micron emulsion droplets' },
      { module: 'Pilot Plant Operations', task: 'HTST Aseptic Pasteurization (95°C / 30s)', description: 'Tubular heat exchanger thermal processing and holding tube validation' },
      { module: 'Pilot Plant Operations', task: 'Aseptic Filling & Capping Run', description: 'HEPA laminar flow ISO Class 5 sterile filling line operation' },
      { module: 'Regulatory & Quality', task: 'FSSAI Label & Nutritional Panel Compliance', description: 'Verification of RDA % claim substantiation, ingredient declarations and allergen callouts' },
      { module: 'Regulatory & Quality', task: 'Shelf-Life Accelerated Stability Protocol', description: 'Climatic chamber protocol design for 40°C/75% RH (6-month accelerated study)' }
    ];

    const teamMembers: { name: string; code: string; role: string }[] = [
      { name: 'Rajesh Kumar', code: 'JB-301', role: 'Bioprocess Engineer' },
      { name: 'Anita Desai', code: 'JB-302', role: 'QA & Sensory Science Lead' },
      { name: 'Priya Reddy', code: 'JB-303', role: 'Regulatory Affairs Specialist' },
      { name: 'Amit Patel', code: 'JB-304', role: 'Analytical Scientist, QC' },
      { name: 'Suresh Naidu', code: 'JB-305', role: 'Product Formulation Specialist' },
      { name: 'Arun Joseph', code: 'JB-306', role: 'Formulation Chemist' },
      { name: 'Lakshmi Devi', code: 'JB-307', role: 'QA Food Safety Lead' },
      { name: 'Deepa Nair', code: 'JB-308', role: 'Packaging Technologist' },
      { name: 'Vikram Singh', code: 'JB-309', role: 'Packaging Engineering Lead' },
      { name: 'Sneha Sharma', code: 'JB-310', role: 'Sensory & Consumer Insights Specialist' }
    ];

    const daySchedules: { day: number; targetTasks: number; empCount: number }[] = [
      { day: 1, targetTasks: 40, empCount: 6 },
      { day: 2, targetTasks: 55, empCount: 8 },
      { day: 3, targetTasks: 60, empCount: 8 },
      { day: 4, targetTasks: 40, empCount: 6 },
      { day: 5, targetTasks: 55, empCount: 8 },
      { day: 8, targetTasks: 60, empCount: 8 },
      { day: 9, targetTasks: 40, empCount: 6 },
      { day: 10, targetTasks: 55, empCount: 8 },
      { day: 11, targetTasks: 60, empCount: 8 },
      { day: 12, targetTasks: 40, empCount: 6 },
      { day: 15, targetTasks: 55, empCount: 8 },
      { day: 16, targetTasks: 60, empCount: 8 },
      { day: 17, targetTasks: 40, empCount: 6 },
      { day: 18, targetTasks: 55, empCount: 8 },
      { day: 19, targetTasks: 60, empCount: 8 },
      { day: 22, targetTasks: 55, empCount: 8 },
      { day: 23, targetTasks: 60, empCount: 8 },
      { day: 24, targetTasks: 40, empCount: 6 },
      { day: 25, targetTasks: 55, empCount: 8 },
      { day: 26, targetTasks: 60, empCount: 8 },
      { day: 29, targetTasks: 40, empCount: 6 },
      { day: 30, targetTasks: 60, empCount: 8 }
    ];

    const entries: HourEntry[] = [];
    let taskPoolIdx = 0;

    daySchedules.forEach((schedule, schedIdx) => {
      const dateObj = new Date(2026, 5, schedule.day);
      const isDay2 = schedule.day === 2;
      const employees = teamMembers.slice(0, schedule.empCount);
      const totalTasks = schedule.targetTasks;

      const baseTasksPerEmp = Math.floor(totalTasks / employees.length);
      const remainder = totalTasks % employees.length;

      employees.forEach((emp, empIdx) => {
        let count = baseTasksPerEmp + (empIdx < remainder ? 1 : 0);
        let empTotalHours = 7.9;
        let approved = true;
        let declined = false;
        let pending = false;
        let isOvertime = false;
        let overtimeHours = 0;
        let msgList: HourMessage[] = [];

        if (isDay2) {
          // Exact specification for 06-02-26 from section 1. Sample rows
          switch (emp.name) {
            case 'Rajesh Kumar':
              count = 7;
              empTotalHours = 7.9;
              approved = true;
              declined = false;
              pending = false;
              msgList = [{ sender: 'Ananya Rao', date: '2026-06-02', text: 'Reviewed and approved beverage formulation trial hours.' }];
              break;
            case 'Anita Desai':
              count = 7;
              empTotalHours = 7.9;
              approved = true;
              declined = false;
              pending = false;
              break;
            case 'Priya Reddy':
              count = 7;
              empTotalHours = 7.9;
              approved = true;
              declined = false;
              pending = false;
              break;
            case 'Amit Patel':
              count = 7;
              empTotalHours = 10.7;
              isOvertime = true;
              overtimeHours = 2.7;
              approved = true;
              declined = false;
              pending = false;
              break;
            case 'Suresh Naidu':
              count = 7;
              empTotalHours = 7.9;
              approved = false;
              declined = false;
              pending = true;
              break;
            case 'Arun Joseph':
              count = 7;
              empTotalHours = 7.9;
              approved = true;
              declined = false;
              pending = false;
              break;
            case 'Lakshmi Devi':
              count = 7;
              empTotalHours = 7.9;
              approved = false;
              declined = true;
              pending = false;
              break;
            case 'Deepa Nair':
              count = 6;
              empTotalHours = 10.5;
              isOvertime = true;
              overtimeHours = 2.5;
              approved = true;
              declined = false;
              pending = false;
              break;
          }
        } else {
          isOvertime = (schedIdx * 2 + empIdx) % 4 === 1;
          empTotalHours = isOvertime ? Number((10.0 + ((empIdx * 3) % 4) * 0.5).toFixed(1)) : 7.9;
          overtimeHours = isOvertime ? Number((empTotalHours - 7.9).toFixed(1)) : 0;
          approved = (schedIdx + empIdx) % 5 !== 0;
          pending = (schedIdx + empIdx) % 5 === 0;
        }

        const tasksList: HourTaskDetail[] = [];
        for (let t = 0; t < count; t++) {
          const taskTemplate = fmcgTasksPool[taskPoolIdx % fmcgTasksPool.length];
          taskPoolIdx++;
          const hourAlloc = Number(((empTotalHours / count) + (t % 2 === 0 ? 0.2 : -0.2)).toFixed(1));
          tasksList.push({
            module: taskTemplate.module,
            task: taskTemplate.task,
            hours: Math.max(0.5, hourAlloc),
            description: taskTemplate.description
          });
        }

        entries.push({
          dateObj,
          jobCode: emp.code,
          name: emp.name,
          role: emp.role,
          projectsCount: 3,
          tasksList,
          totalHours: empTotalHours,
          approved,
          declined,
          pending,
          isOvertime,
          overtimeHours,
          messages: msgList
        });
      });
    });

    this.entries = entries;
  }

  // --- Calendar Generation ---

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: CalendarDay[] = [];

    // Days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.createCalendarDay(d, false));
    }

    // Days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push(this.createCalendarDay(d, true));
    }

    // Days from next month
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      days.push(this.createCalendarDay(d, false));
    }

    this.calendarDays = days;
  }

  private createCalendarDay(d: Date, inCurrentMonth: boolean): CalendarDay {
    const today = new Date();
    const isToday = this.isSameDay(d, today);
    const isSelected = this.selectedDate ? this.isSameDay(d, this.selectedDate) : false;

    // Count claims for that day from our master entries
    const claims = this.entries.filter(e => this.isSameDay(e.dateObj, d)).length;

    return {
      date: d,
      dayNumber: d.getDate(),
      inCurrentMonth,
      isToday,
      isSelected,
      claims
    };
  }

  // --- Navigation & Date Filtering ---

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  get currentMonthLabel(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  get totalClaimsInRange(): number {
    return this.calendarDays
      .filter(d => d.inCurrentMonth)
      .reduce((sum, d) => sum + d.claims, 0);
  }

  filterByDate(day: CalendarDay): void {
    this.selectedDate = day.date;
    this.calendarDays.forEach(d => d.isSelected = this.isSameDay(d.date, day.date));

    this.filteredEntries = this.entries.filter(e => this.isSameDay(e.dateObj, day.date));
    this.totalSize = this.filteredEntries.length;
    this.currentPage = 1;
    this.updatePagination();
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  formatDate(d: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
  }

  // --- Pagination ---

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedEntries = this.filteredEntries.slice(startIndex, startIndex + this.pageSize);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  // --- Actions ---

  toggleStatus(entry: HourEntry, statusType: 'approved' | 'declined' | 'pending'): void {
    entry.approved = false;
    entry.declined = false;
    entry.pending = false;
    entry[statusType] = true;
  }

  toggleRowStatus(entry: HourEntry, statusType: 'approved' | 'declined' | 'pending'): void {
    this.toggleStatus(entry, statusType);
  }

  openMessages(entry: HourEntry): void {
    this.dialog.open(this.messageDialog, {
      width: '500px',
      data: {
        entry,
        messages: entry.messages || []
      }
    });
  }

  openMessagesDialog(entry: HourEntry): void {
    this.openMessages(entry);
  }

  addMessage(data: any, text: string): void {
    if (!text || !text.trim()) return;
    if (data && data.entry) {
      if (!data.entry.messages) {
        data.entry.messages = [];
      }
      const newMsg: HourMessage = {
        sender: 'Current User',
        date: this.formatDate(new Date()),
        text: text.trim()
      };
      data.entry.messages.push(newMsg);
      if (data.messages && data.messages !== data.entry.messages) {
        data.messages.push(newMsg);
      }
    }
  }

  openTasksDialog(entry: HourEntry): void {
    this.dialog.open(this.tasksDialog, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        entry,
        tasks: entry.tasksList || []
      }
    });
  }

  editEntry(entry: HourEntry): void {
    const dialogRef = this.dialog.open(HoursTimesheetComponent, {
      width: '850px',
      maxWidth: '95vw',
      data: {
        entry: {
          ...entry,
          tasksList: [...entry.tasksList]
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.tasksList) {
          entry.tasksList = [...result.tasksList];
          entry.totalHours = entry.tasksList.reduce((sum, t) => sum + t.hours, 0);
          entry.isOvertime = entry.totalHours > 8.0;
          entry.overtimeHours = entry.isOvertime ? Number((entry.totalHours - 8.0).toFixed(1)) : 0;
        }
        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  deleteEntry(entry: HourEntry): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: entry
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.entries = this.entries.filter(e => e !== entry);
        this.buildCalendar();
        if (this.selectedDate) {
          this.filterByDate(this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!))!);
        }
      }
    });
  }

  openProjectsDialog(entry: HourEntry): void {
    this.dialog.open(HoursProjectPopComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: { entry }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
