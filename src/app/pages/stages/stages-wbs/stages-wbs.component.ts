import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { AddDeliverableComponent } from './add-deliverable/add-deliverable.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { AssignRequirementsComponent } from './assign-requirements/assign-requirements.component';
import { AssignTasksComponent } from './assign-tasks/assign-tasks.component';
import { StagesPredecessorComponent } from './stages-predecessor/stages-predecessor.component';
import { DescriptionDialogComponent } from '../../../common/shared/description-dialog/description-dialog.component';
import { STAGE_WBS_DATA } from './stages-wbs-data';

export interface WbsTask {
  deliverableSlNo: string;
  slNo: string;
  task: string;
  predecessor: string;
  department?: string;
  applicability: string;
  taskCode: string;
  jobCode: string;
  activityCode?: string;
  effort: string;
  duration: string;
  description: string;
  procedure: string;
  planned: string;
  assignedTo: string;
  assigned: string;
  actual: string;
  cost: string;
  worked: string;
  remaining: string;
  scheduled: string;
  date: string;
  status: string;
  submitted: string;
  requirements?: string;
  tasks?: string;
  requirementsData?: any[];
  tasksData?: any[];
  predecessorsData?: any[];
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

export interface SidebarMenu {
  slNo?: string;
  name: string;
  description?: string;
  count: number;
  isOpen: boolean;
  subItems?: string[];
}

export interface StageWbsConfig {
  sidebarMenus: SidebarMenu[];
  modulesData: WbsTask[][];
}

@Component({
  selector: 'app-stages-wbs',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DragDropModule
  ],
  templateUrl: './stages-wbs.component.html',
  styleUrls: ['./stages-wbs.component.scss']
})
export class StagesWbsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;

  // View State
  stageCode: string = 'S1';
  stageName: string = 'Consumer Need & Market Opportunity';
  gateCode: string = '-';

  sidebarMenus: SidebarMenu[] = [];
  modulesData: WbsTask[][] = [];
  selectedMenuIndex: number = 0;

  tableData: WbsTask[] = [];
  paginatedData: WbsTask[] = [];

  // Pagination properties
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  private stageWbsMap: { [key: string]: StageWbsConfig } = STAGE_WBS_DATA;
  private currentLoadedKey: string = '';

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      let changed = false;
      if (params['stageCode'] && params['stageCode'] !== this.stageCode) {
        this.stageCode = params['stageCode'];
        changed = true;
      }
      if (params['stageName'] && params['stageName'] !== this.stageName) {
        this.stageName = params['stageName'];
        changed = true;
      }
      if (params['gateCode'] !== undefined && params['gateCode'] !== this.gateCode) {
        this.gateCode = params['gateCode'];
        changed = true;
      }
      if (changed || !this.currentLoadedKey) {
        this.loadStageData();
      }
    });
  }

  ngOnInit(): void {
    if (!this.currentLoadedKey) {
      this.loadStageData();
    }
  }

  goBack(): void {
    this.location.back();
  }

  private loadStageData(): void {
    const stageKey = this.stageCode?.trim() || 'S1';
    this.currentLoadedKey = stageKey;

    const nameMap: Record<string, string> = {
      'Consumer Need & Market Opportunity': 'S1',
      'Consumer Need and Market Opportunity': 'S1',
      'Market & Product Concept Validation': 'S2',
      'Market and Product Concept Validation': 'S2',
      'Product Ideation & Concept Screening': 'S3',
      'Product Ideation and Concept Screening': 'S3',
      'Product Formulation & Optimization': 'S4',
      'Product Formulation and Product Optimization': 'S4',
      'Product Formulation and Optimization': 'S4',
      'Product Concept & Formula Selection': 'S5',
      'Product Concept and Formula Selection': 'S5',
      'Formulation & Manufacturing Process Development': 'S6',
      'Formulation and Manufacturing Process Development': 'S6',
      'Product Formulation and Manufacturing Process Development': 'S6',
      'Prototype Testing & Product Safety Assessment': 'S7',
      'Prototype Testing and Product Safety Assessment': 'S7',
      'Product Compliance Documentation & Label Filing': 'S8',
      'Product Compliance Documentation and Label Filing': 'S8',
      'Product Concept Approval Filing': 'S8',
      'Concept & Feasibility Validation': 'S9',
      'Concept and Feasibility Validation': 'S9',
      'Pilot Production & Market Testing': 'S10',
      'Pilot Production and Market Testing': 'S10',
      'Commercial Scale-Up & Launch Preparation': 'S11',
      'Commercial Scale-Up and Launch Preparation': 'S11',
      'Regulatory Compliance Release & Commercial Product Launch': 'S12',
      'Regulatory Compliance Release and Commercial Product Launch': 'S12',
      'Regulatory Approval and Commercial Product Launch': 'S12',

      'S1 – Consumer Need & Market Opportunity': 'S1',
      'S2 – Market & Product Concept Validation': 'S2',
      'S3 – Product Ideation & Concept Screening': 'S3',
      'S4 – Product Formulation & Optimization': 'S4',
      'S5 – Product Concept & Formula Selection': 'S5',
      'S6 – Formulation & Manufacturing Process Development': 'S6',
      'S7 – Prototype Testing & Product Safety Assessment': 'S7',
      'S8 – Product Compliance Documentation & Label Filing': 'S8',
      'S9 – Concept & Feasibility Validation': 'S9',
      'S10 – Pilot Production & Market Testing': 'S10',
      'S11 – Commercial Scale-Up & Launch Preparation': 'S11',
      'S12 – Commercial Launch & Ramp-Up': 'S12',
      'S12 – Regulatory Compliance Release & Commercial Product Launch': 'S12',
      'S0': 'S1'
    };

    const config = this.stageWbsMap[stageKey]
      || this.stageWbsMap[stageKey.toUpperCase()]
      || this.stageWbsMap[nameMap[stageKey]]
      || this.stageWbsMap[nameMap[this.stageName]]
      || this.stageWbsMap[this.stageName]
      || this.getFallbackStageConfig(this.stageName, this.stageCode);

    // Fast copy for clean state isolation
    this.sidebarMenus = config.sidebarMenus.map(m => ({ ...m }));
    this.modulesData = config.modulesData.map((mod, modIdx) =>
      mod.map((t, taskIdx) => ({
        ...t,
        historyCount: t.historyCount || this.getHistoryCount(taskIdx),
        updatedDate: t.updatedDate || '2026-11-13',
        updatedBy: t.updatedBy || t.assignedTo || 'Ananya Rao'
      }))
    );

    // Sync menu counts
    this.sidebarMenus.forEach((menu, i) => {
      menu.count = this.modulesData[i]?.length || 0;
    });

    this.selectedMenuIndex = 0;
    this.sidebarMenus.forEach((m, idx) => m.isOpen = idx === 0);
    this.tableData = this.modulesData[0] || [];
    this.totalItems = this.tableData.length;
    this.pageIndex = 0;
    this.updatePaginatedData();
  }

  private getFallbackStageConfig(name: string, code: string): StageWbsConfig {
    return {
      sidebarMenus: [
        { slNo: '1.1', name: `${name} Planning & Setup`, count: 0, isOpen: true }
      ],
      modulesData: [[]]
    };
  }

  selectMenu(index: number): void {
    if (this.selectedMenuIndex === index && this.sidebarMenus[index]?.isOpen) {
      return;
    }
    this.selectedMenuIndex = index;
    this.sidebarMenus.forEach((menu, i) => {
      menu.isOpen = (i === index);
    });
    this.tableData = this.modulesData[index] || [];
    this.pageIndex = 0;
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.tableData.slice(startIndex, startIndex + this.pageSize);
  }

  openAddDeliverableDialog(): void {
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: '1.2',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        const nextSlNo = result.stage || `${this.stageCode}.${this.sidebarMenus.length + 1}`;
        this.sidebarMenus.push({
          slNo: nextSlNo,
          name: result.deliverableName,
          count: 0,
          isOpen: false
        });
        this.modulesData.push([]);
      }
    });
  }

  onDeliverableDrop(event: CdkDragDrop<SidebarMenu[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const currentSelected = this.sidebarMenus[this.selectedMenuIndex];

    moveItemInArray(this.sidebarMenus, event.previousIndex, event.currentIndex);
    moveItemInArray(this.modulesData, event.previousIndex, event.currentIndex);

    if (currentSelected) {
      this.selectedMenuIndex = this.sidebarMenus.indexOf(currentSelected);
    }

    this.tableData = this.modulesData[this.selectedMenuIndex] || [];
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  editDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: menu.slNo,
        name: menu.name,
        deliverableName: menu.name,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        menu.name = result.deliverableName;
        if (result.stage) {
          menu.slNo = result.stage;
          if (this.modulesData[index]) {
            this.modulesData[index].forEach(task => {
              task.deliverableSlNo = result.stage;
            });
          }
        }
      }
    });
  }

  deleteDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: menu
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.sidebarMenus.splice(index, 1);
        this.modulesData.splice(index, 1);

        if (this.selectedMenuIndex >= this.sidebarMenus.length) {
          this.selectedMenuIndex = Math.max(0, this.sidebarMenus.length - 1);
        }

        if (this.sidebarMenus.length > 0) {
          this.sidebarMenus.forEach((m, i) => {
            m.isOpen = (i === this.selectedMenuIndex);
          });
          this.tableData = this.modulesData[this.selectedMenuIndex] || [];
        } else {
          this.tableData = [];
        }

        this.pageIndex = 0;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openAddActivityDialog(): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        department: 'R&D & Product Innovation',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.activityName) {
        const nextId = this.tableData.length + 1;
        const parentSl = this.sidebarMenus[this.selectedMenuIndex]?.slNo || `1.${this.selectedMenuIndex + 1}`;
        const taskSlNo = `${parentSl}.${nextId}`;

        const newTask: WbsTask = {
          deliverableSlNo: parentSl,
          slNo: taskSlNo,
          task: result.activityName,
          activityCode: result.activityCode || `ACT-${this.selectedMenuIndex + 1}0${nextId}`,
          department: result.department || 'R&D & Product Innovation',
          predecessor: result.predecessor || '—',
          predecessorsData: result.predecessors || result.predecessorsData,
          applicability: result.applicability || 'All FMCG',
          taskCode: `TC-${this.selectedMenuIndex + 1}0${nextId}`,
          jobCode: `JOB${nextId}`,
          effort: result.planEffort || '0',
          duration: result.planDuration || '0',
          description: result.description || '',
          procedure: 'Standard SOP',
          planned: '0.00',
          assignedTo: result.department || 'Consumer Insights & Strategy',
          assigned: '0.00',
          actual: '0.00',
          cost: result.materialBudget || '0.00',
          worked: '0.00',
          remaining: '0.00',
          scheduled: '-',
          date: '-',
          status: 'Active',
          submitted: '-',
          requirements: '2',
          tasks: '4'
        };

        this.tableData.push(newTask);
        this.modulesData[this.selectedMenuIndex] = this.tableData;
        this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openEditActivityDialog(row: WbsTask): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        activityName: row.task,
        activityCode: row.activityCode || row.taskCode,
        department: row.department || 'Consumer Insights & Strategy',
        applicability: row.applicability,
        description: row.description,
        planDuration: row.duration,
        planEffort: row.effort,
        materialBudget: row.cost,
        predecessor: row.predecessor !== '—' ? row.predecessor : '',
        predecessorsData: row.predecessorsData,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.activityName) row.task = result.activityName;
        if (result.activityCode !== undefined) row.activityCode = result.activityCode;
        if (result.department !== undefined) row.department = result.department;
        if (result.applicability !== undefined) row.applicability = result.applicability;
        if (result.description !== undefined) row.description = result.description;
        if (result.planEffort !== undefined) row.effort = result.planEffort;
        if (result.planDuration !== undefined) row.duration = result.planDuration;
        if (result.materialBudget !== undefined) row.cost = result.materialBudget;
        if (result.predecessor !== undefined) row.predecessor = result.predecessor || '—';
        if (result.predecessors !== undefined) row.predecessorsData = result.predecessors;
        this.updatePaginatedData();
      }
    });
  }

  deleteTask(row: WbsTask): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: row
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const index = this.tableData.indexOf(row);
        if (index > -1) {
          this.tableData.splice(index, 1);
          this.modulesData[this.selectedMenuIndex] = this.tableData;
          this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
          this.totalItems = this.tableData.length;
          this.updatePaginatedData();
        }
      }
    });
  }

  scrollLeft(): void {
    this.scrollTable('left');
  }

  scrollRight(): void {
    this.scrollTable('right');
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  onTableScroll(): void {
    this.updateScrollButtons();
  }

  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }

  private generateTasksForActivity(row: WbsTask): any[] {
    const taskCount = parseInt(row.tasks || '4', 10) || 4;
    const taskTemplates = [
      { name: `Define sampling and protocol: ${row.task}`, dept: row.department || 'Consumer Insights & Strategy', role: 'Lead Specialist', active: true, done: true },
      { name: `Compile specifications and benchmarking: ${row.task}`, dept: row.department || 'Consumer Insights & Strategy', role: 'Research Analyst', active: true, done: true },
      { name: `Execute testing and trial validation: ${row.task}`, dept: row.department || 'Consumer Insights & Strategy', role: 'Operations Lead', active: true, done: false },
      { name: `Synthesize findings and compliance sign-off: ${row.task}`, dept: row.department || 'Consumer Insights & Strategy', role: 'Quality Lead', active: true, done: false }
    ];
    const result = [];
    for (let i = 0; i < taskCount; i++) {
      const tmpl = taskTemplates[i % taskTemplates.length];
      result.push({
        active: tmpl.active,
        done: tmpl.done,
        taskName: i >= 4 ? `${tmpl.name} (Part ${i + 1})` : tmpl.name,
        taskCode: `FMCG-T-00${String(i + 1).padStart(3, '0')}`,
        jobCode: row.jobCode || 'CINS-04',
        department: tmpl.dept,
        role: tmpl.role,
        dueDate: '2026-06-30',
        completedDate: tmpl.done ? '2026-06-15' : '',
        remarks: `Execution parameter verified for ${row.task}`,
        isEditing: false
      });
    }
    return result;
  }

  private generateRequirementsForActivity(row: WbsTask): any[] {
    const reqCount = parseInt(row.requirements || '2', 10) || 2;
    const reqTemplates = [
      { name: `Specification and quality threshold criteria for ${row.task}`, dept: row.department || 'Quality Assurance & Food Safety', role: 'QA Specialist', active: true, done: true },
      { name: `Regulatory compliance and FSSAI standards alignment for ${row.task}`, dept: 'Regulatory Affairs', role: 'Regulatory Affairs Specialist', active: true, done: false }
    ];
    const result = [];
    for (let i = 0; i < reqCount; i++) {
      const tmpl = reqTemplates[i % reqTemplates.length];
      result.push({
        active: tmpl.active,
        done: tmpl.done,
        requirementName: i >= 2 ? `${tmpl.name} (Clause ${i + 1})` : tmpl.name,
        department: tmpl.dept,
        role: tmpl.role,
        dueDate: '2026-04-15',
        completedDate: tmpl.done ? '2026-04-01' : '',
        remarks: `Requirement criteria verified for ${row.task}`,
        isEditing: false
      });
    }
    return result;
  }

  assignrequirement(row?: WbsTask): void {
    if (row && (!row.requirementsData || row.requirementsData.length === 0)) {
      row.requirementsData = this.generateRequirementsForActivity(row);
    }
    const dialogRef = this.dialog.open(AssignRequirementsComponent, {
      width: '700px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        row.requirements = result.count !== undefined ? String(result.count) : row.requirements;
        if (result.requirements) {
          (row as any).requirementsData = result.requirements;
        }
        this.updatePaginatedData();
      }
    });
  }

  assigntasks(row?: WbsTask): void {
    if (row && (!row.tasksData || row.tasksData.length === 0)) {
      row.tasksData = this.generateTasksForActivity(row);
    }
    const dialogRef = this.dialog.open(AssignTasksComponent, {
      width: '850px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        row.tasks = result.count !== undefined ? String(result.count) : row.tasks;
        if (result.tasks) {
          row.tasksData = result.tasks;
        }
        this.updatePaginatedData();
      }
    });
  }

  openPredecessor(row?: WbsTask): void {
    const dialogRef = this.dialog.open(StagesPredecessorComponent, {
      width: '950px',
      maxWidth: '100vw',
      height: 'auto',
      data: { mode: 'edit', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        if (result.predecessors) {
          row.predecessorsData = result.predecessors;
        }
        if (result.predecessor !== undefined) {
          row.predecessor = String(result.predecessor);
        }
        this.updatePaginatedData();
      }
    });
  }

  openHistory(row: WbsTask, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/stages/wbs/history'], {
      queryParams: {
        slNo: row.slNo,
        task: row.task,
        activityCode: row.activityCode || row.taskCode || '',
        tasks: row.tasks || '',
        requirements: row.requirements || '',
        predecessor: row.predecessor || '',
        duration: row.duration || '',
        effort: row.effort || '',
        cost: row.cost || '',
        applicability: row.applicability || 'All FMCG',
        description: row.description || '',
        stageCode: this.stageCode,
        stageName: this.stageName,
        gateCode: this.gateCode,
        deliverableSlNo: row.deliverableSlNo,
        historyCount: historyCount
      },
      queryParamsHandling: 'merge'
    });
  }

  openfilepop(): void {
    // Viewer placeholder for procedure file
  }

  openDescription(row: WbsTask): void {
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: row.task,
        code: row.slNo,
        type: 'Activity',
        description: row.description
      }
    });
  }

  openDeliverableDescription(menu: SidebarMenu, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: menu.name,
        code: menu.slNo,
        type: 'Deliverable',
        description: menu.description || 'Deliverable description not available.'
      }
    });
  }
}
