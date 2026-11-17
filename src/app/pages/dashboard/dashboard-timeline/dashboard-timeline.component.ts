import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard-timeline.component.html',
  styleUrls: ['./dashboard-timeline.component.scss']
})
export class DashboardTimelineComponent implements OnInit, AfterViewInit {

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  canScrollLeft = false;
  canScrollRight = true;

  projects = [
    'New Beverage Product Development Program',
    'New Personal Care Product Formulation Development',
    'Multi-Variant Snack Product Development',
    'Ingredient Sourcing and Blend Optimization',
    'Shelf-Stable Powdered Beverage Product Formulation',
    'Vitamin-Enriched Fruit Beverage 250ml',
    'Premium Personal Care Lotion 200ml',
    'Ready-to-Eat Snack Range 100g',
    'Low-Sugar Dairy Beverage 200ml',
    'Plant-Based Protein Drink 300ml'
  ];

  mainStages = [
    { key: 'g1', label: 'Product Concept Selection (Gate 1)' },
    { key: 'g2', label: 'Product Concept and Formula Selection (Gate 2)' },
    { key: 'g3', label: 'Product Concept and Feasibility Approval (Gate 3)' },
    { key: 'g4', label: 'Consumer Validation and Product Performance Proof (Gate 4)' },
    { key: 'g5', label: 'Market Launch and Regulatory Affairs Readiness (Gate 5)' }
  ];

  selectedProject = 'New Beverage Product Development Program';
  selectedStageFilter = 'g1';

  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = [
    'All',
    'Beverages - BV',
    'Personal Care & Beauty - PC',
    'Packaged Foods & Snacks - FS',
    'Dairy & Nutrition - DN',
    'Home Care - HC'
  ];

  readonly locationsList: string[] = [
    'All',
    'Mumbai',
    'Bengaluru',
    'Delhi NCR',
    'Pune',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
    'Baddi'
  ];

  calendarDays: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

  ganttData: any[] = [];
  filteredGanttData: any[] = [];

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: any = null;

  ngOnInit() {
    this.initGanttData();
    this.applyGanttFilter();
  }

  initGanttData() {
    this.ganttData = [];
    this.projects.forEach(p => {
      const isBenchmark = p.includes('Fruit Beverage') || p.includes('Personal Care Lotion') || p.includes('Snack Range') || p.includes('Dairy Beverage');

      // Gate 1: Product Concept Selection
      if (isBenchmark) {
        this.ganttData.push(
          { task: '1. Competitor Product Benchmarking & Quality Characterization', start: Date.UTC(2026, 4, 1), end: Date.UTC(2026, 4, 8), completion: 100, gate: 'g1', project: p },
          { task: '2. Ingredient, Supplier & Processing Technology Evaluation', start: Date.UTC(2026, 4, 5), end: Date.UTC(2026, 4, 14), completion: 100, gate: 'g1', project: p },
          { task: '3. Critical-to-Quality (CTQ) Product Attributes Profiling', start: Date.UTC(2026, 4, 9), end: Date.UTC(2026, 4, 18), completion: 100, gate: 'g1', project: p },
          { task: '4. Quality Test Feasibility & Product Benchmarking Plan', start: Date.UTC(2026, 4, 12), end: Date.UTC(2026, 4, 22), completion: 100, gate: 'g1', project: p },
          { task: '5. Preliminary Cost of Goods Sold (COGS) & Manufacturing Feasibility', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 25), completion: 100, gate: 'g1', project: p },
          { task: '6. FMCG Product Feasibility Go/No-Go Gate 1 Approval', start: Date.UTC(2026, 4, 20), end: Date.UTC(2026, 4, 28), completion: 100, gate: 'g1', project: p }
        );
      } else {
        this.ganttData.push(
          { task: '1. Market Landscape, Consumer Trends & Competitor Review', start: Date.UTC(2026, 4, 1), end: Date.UTC(2026, 4, 8), completion: 100, gate: 'g1', project: p },
          { task: '2. Consumer Insights & Product Need Assessment', start: Date.UTC(2026, 4, 5), end: Date.UTC(2026, 4, 14), completion: 100, gate: 'g1', project: p },
          { task: '3. Ingredient Functionality & Product Feasibility Assessment', start: Date.UTC(2026, 4, 9), end: Date.UTC(2026, 4, 18), completion: 100, gate: 'g1', project: p },
          { task: '4. Quality Test Development & Hit-Screening Feasibility', start: Date.UTC(2026, 4, 12), end: Date.UTC(2026, 4, 22), completion: 100, gate: 'g1', project: p },
          { task: '5. Preliminary Cost of Goods Sold (COGS) & Product Feasibility Assessment', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 25), completion: 100, gate: 'g1', project: p },
          { task: '6. Product Concept Selection Go/No-Go Gate 1 Approval', start: Date.UTC(2026, 4, 20), end: Date.UTC(2026, 4, 28), completion: 100, gate: 'g1', project: p }
        );
      }

      // Gate 2: Product Concept and Formula Selection
      this.ganttData.push(
        { task: '1. Formula Design & Excipient/Ingredient Screening', start: Date.UTC(2026, 4, 2), end: Date.UTC(2026, 4, 10), completion: 90, gate: 'g2', project: p },
        { task: '2. Prototype Formulation & Sensory Evaluation', start: Date.UTC(2026, 4, 7), end: Date.UTC(2026, 4, 16), completion: 85, gate: 'g2', project: p },
        { task: '3. Bench-scale Process Feasibility & Stability Testing', start: Date.UTC(2026, 4, 11), end: Date.UTC(2026, 4, 20), completion: 80, gate: 'g2', project: p },
        { task: '4. Packaging Compatibility & Material Evaluation', start: Date.UTC(2026, 4, 15), end: Date.UTC(2026, 4, 24), completion: 70, gate: 'g2', project: p },
        { task: '5. Regulatory & Food Safety Compliance Review', start: Date.UTC(2026, 4, 19), end: Date.UTC(2026, 4, 27), completion: 60, gate: 'g2', project: p },
        { task: '6. Formula Selection Gate 2 Approval', start: Date.UTC(2026, 4, 23), end: Date.UTC(2026, 4, 29), completion: 50, gate: 'g2', project: p }
      );

      // Gate 3: Product Concept and Feasibility Approval
      this.ganttData.push(
        { task: '1. Pilot Formulation Optimization & Shelf-Life Study', start: Date.UTC(2026, 4, 3), end: Date.UTC(2026, 4, 14), completion: 75, gate: 'g3', project: p },
        { task: '2. Nutritional Profiling & Analytical Method Verification', start: Date.UTC(2026, 4, 9), end: Date.UTC(2026, 4, 20), completion: 60, gate: 'g3', project: p },
        { task: '3. Pilot Plant Equipment Clearance & Safety Review', start: Date.UTC(2026, 4, 14), end: Date.UTC(2026, 4, 25), completion: 45, gate: 'g3', project: p },
        { task: '4. Pilot Batch Procurement & Quality Specifications', start: Date.UTC(2026, 4, 19), end: Date.UTC(2026, 4, 29), completion: 30, gate: 'g3', project: p },
        { task: '5. Feasibility Approval Gate 3 Authorization', start: Date.UTC(2026, 4, 24), end: Date.UTC(2026, 4, 30), completion: 15, gate: 'g3', project: p }
      );

      // Gate 4: Consumer Validation and Product Performance Proof
      this.ganttData.push(
        { task: '1. Pilot-Scale Multi-Batch Campaign Execution', start: Date.UTC(2026, 4, 4), end: Date.UTC(2026, 4, 14), completion: 40, gate: 'g4', project: p },
        { task: '2. Consumer Sensory Panel Validation & Feedback', start: Date.UTC(2026, 4, 11), end: Date.UTC(2026, 4, 21), completion: 25, gate: 'g4', project: p },
        { task: '3. Demonstration-Scale Blending & Packaging Line Trial', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 27), completion: 15, gate: 'g4', project: p },
        { task: '4. Process Performance Qualification (PPQ) Run', start: Date.UTC(2026, 4, 20), end: Date.UTC(2026, 4, 30), completion: 10, gate: 'g4', project: p }
      );

      // Gate 5: Market Launch and Regulatory Affairs Readiness
      this.ganttData.push(
        { task: '1. Commercial Facility Commissioning & Ramp-Up Trial', start: Date.UTC(2026, 4, 2), end: Date.UTC(2026, 4, 15), completion: 35, gate: 'g5', project: p },
        { task: '2. Food Safety & Regulatory Clearance (FSSAI/FDA Compliance)', start: Date.UTC(2026, 4, 10), end: Date.UTC(2026, 4, 23), completion: 20, gate: 'g5', project: p },
        { task: '3. Master Production Record & QC Release Protocols', start: Date.UTC(2026, 4, 18), end: Date.UTC(2026, 4, 29), completion: 10, gate: 'g5', project: p },
        { task: '4. Commercial Launch Inventory & Distribution Setup', start: Date.UTC(2026, 4, 22), end: Date.UTC(2026, 4, 30), completion: 5, gate: 'g5', project: p }
      );
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.checkScrollBounds(), 100);
  }

  applyGanttFilter() {
    this.filteredGanttData = this.ganttData.filter(d => {
      const matchProj = !this.selectedProject || d.project === this.selectedProject;
      const matchStage = d.gate === this.selectedStageFilter;
      return matchProj && matchStage;
    });
  }

  onTableScroll() {
    this.checkScrollBounds();
  }

  checkScrollBounds() {
    if (!this.tableContainer) return;
    const el = this.tableContainer.nativeElement;
    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1;
  }

  scrollLeft(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollTable(direction: 'left' | 'right') {
    if (!this.tableContainer) return;
    const el = this.tableContainer.nativeElement;
    const scrollAmount = 350;

    if (direction === 'left') {
      el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  isDayInRange(item: any, day: number): boolean {
    const startDay = new Date(item.start).getUTCDate();
    const endDay = new Date(item.end).getUTCDate();
    return day >= startDay && day <= endDay;
  }

  isDayStart(item: any, day: number): boolean {
    return new Date(item.start).getUTCDate() === day;
  }

  isDayEnd(item: any, day: number): boolean {
    return new Date(item.end).getUTCDate() === day;
  }

  getDarkBarColor(completion: number): string {
    if (completion >= 75) return '#28a745';
    if (completion > 0) return '#f4a300';
    return '#adb5bd';
  }

  showTooltip(event: MouseEvent, item: any) {
    this.tooltipData = item;
    this.tooltipVisible = true;
    this.updateTooltipPosition(event);
  }

  moveTooltip(event: MouseEvent) {
    this.updateTooltipPosition(event);
  }

  hideTooltip() {
    this.tooltipVisible = false;
    this.tooltipData = null;
  }

  private updateTooltipPosition(event: MouseEvent) {
    this.tooltipX = event.clientX + 15;
    this.tooltipY = event.clientY + 15;
  }
}
