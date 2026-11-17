import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface StageColumnHeader {
  key: string;
  label: string;
  stageCode: string;
  stageNumber: number;
  subtitle: string;
  fullName: string;
  projectCount: number;
}

@Component({
  selector: 'app-stages-data-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './stages-data-table.component.html',
  styleUrl: './stages-data-table.component.scss',
})
export class StagesDataTableComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;

  gatesSearchTerm: string = '';
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;

  // 12 FMCG Stages from FMCG_Stage_Gate_Data_Table.xlsx
  readonly stageHeaders: StageColumnHeader[] = [
    { key: 's1', label: 'Stage 1', stageCode: 'S1', stageNumber: 1, subtitle: 'Consumer Need and Market Opportunity', fullName: 'Consumer Need and Market Opportunity', projectCount: 10 },
    { key: 's2', label: 'Stage 2', stageCode: 'S2', stageNumber: 2, subtitle: 'Market and Product Concept Validation', fullName: 'Market and Product Concept Validation', projectCount: 9 },
    { key: 's3', label: 'Stage 3', stageCode: 'S3', stageNumber: 3, subtitle: 'Product Ideation and Concept Screening', fullName: 'Product Ideation and Concept Screening', projectCount: 8 },
    { key: 's4', label: 'Stage 4', stageCode: 'S4', stageNumber: 4, subtitle: 'Product Formulation and Product Optimization', fullName: 'Product Formulation and Product Optimization', projectCount: 7 },
    { key: 's5', label: 'Stage 5', stageCode: 'S5', stageNumber: 5, subtitle: 'Product Concept and Formula Selection', fullName: 'Product Concept and Formula Selection', projectCount: 6 },
    { key: 's6', label: 'Stage 6', stageCode: 'S6', stageNumber: 6, subtitle: 'Product Formulation and Process Development', fullName: 'Product Formulation and Manufacturing Process Development', projectCount: 5 },
    { key: 's7', label: 'Stage 7', stageCode: 'S7', stageNumber: 7, subtitle: 'Prototype Testing and Safety Assessment', fullName: 'Prototype Testing and Product Safety Assessment', projectCount: 4 },
    { key: 's8', label: 'Stage 8', stageCode: 'S8', stageNumber: 8, subtitle: 'Product Concept Approval Filing', fullName: 'Product Concept Approval Filing', projectCount: 3 },
    { key: 's9', label: 'Stage 9', stageCode: 'S9', stageNumber: 9, subtitle: 'Concept and Feasibility Validation', fullName: 'Concept and Feasibility Validation', projectCount: 2 },
    { key: 's10', label: 'Stage 10', stageCode: 'S10', stageNumber: 10, subtitle: 'Pilot Production and Market Testing', fullName: 'Pilot Production and Market Testing', projectCount: 1 },
    { key: 's11', label: 'Stage 11', stageCode: 'S11', stageNumber: 11, subtitle: 'Commercial Scale-Up and Launch Preparation', fullName: 'Commercial Scale-Up and Launch Preparation', projectCount: 1 },
    { key: 's12', label: 'Stage 12', stageCode: 'S12', stageNumber: 12, subtitle: 'Regulatory Affairs & Commercial Product Launch', fullName: 'Regulatory Affairs & Compliance Approval and Commercial Product Launch', projectCount: 1 }
  ];

  // FMCG Programs lists from FMCG_Stage_Gate_Data_Table.xlsx
  readonly s1List = [
    "New Beverage Product Development Program",
    "New Personal Care Product Formulation Development",
    "Multi-Variant Snack Product Development",
    "Ingredient Sourcing and Blend Optimization",
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Vitamin-Enriched Fruit Beverage 250ml",
    "Premium Personal Care Lotion 200ml",
    "Ready-to-Eat Snack Range 100g",
    "Low-Sugar Dairy Beverage 200ml",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s2List = [
    "New Personal Care Product Formulation Development",
    "Multi-Variant Snack Product Development",
    "Ingredient Sourcing and Blend Optimization",
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Vitamin-Enriched Fruit Beverage 250ml",
    "Premium Personal Care Lotion 200ml",
    "Ready-to-Eat Snack Range 100g",
    "Low-Sugar Dairy Beverage 200ml",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s3List = [
    "Multi-Variant Snack Product Development",
    "Ingredient Sourcing and Blend Optimization",
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Vitamin-Enriched Fruit Beverage 250ml",
    "Premium Personal Care Lotion 200ml",
    "Ready-to-Eat Snack Range 100g",
    "Low-Sugar Dairy Beverage 200ml",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s4List = [
    "Ingredient Sourcing and Blend Optimization",
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Vitamin-Enriched Fruit Beverage 250ml",
    "Premium Personal Care Lotion 200ml",
    "Ready-to-Eat Snack Range 100g",
    "Low-Sugar Dairy Beverage 200ml",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s5List = [
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Vitamin-Enriched Fruit Beverage 250ml",
    "Premium Personal Care Lotion 200ml",
    "Ready-to-Eat Snack Range 100g",
    "Low-Sugar Dairy Beverage 200ml",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s6List = [
    "Vitamin-Enriched Fruit Beverage 250ml",
    "Premium Personal Care Lotion 200ml",
    "Ready-to-Eat Snack Range 100g",
    "Low-Sugar Dairy Beverage 200ml",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s7List = [
    "Premium Personal Care Lotion 200ml",
    "Ready-to-Eat Snack Range 100g",
    "Low-Sugar Dairy Beverage 200ml",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s8List = [
    "Ready-to-Eat Snack Range 100g",
    "Low-Sugar Dairy Beverage 200ml",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s9List = [
    "Low-Sugar Dairy Beverage 200ml",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s10List = [
    "Plant-Based Protein Drink 300ml"
  ];

  readonly s11List = [
    "New Beverage Product Development Program"
  ];

  readonly s12List = [
    "New Personal Care Product Formulation Development"
  ];

  stageRows: any[] = [];

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/dashboard/portfolio']);
  }

  ngOnInit(): void {
    const maxLength = Math.max(
      this.s1List.length, this.s2List.length, this.s3List.length, this.s4List.length,
      this.s5List.length, this.s6List.length, this.s7List.length, this.s8List.length,
      this.s9List.length, this.s10List.length, this.s11List.length, this.s12List.length
    );

    for (let i = 0; i < maxLength; i++) {
      this.stageRows.push({
        s1: this.s1List[i] || '', s2: this.s2List[i] || '', s3: this.s3List[i] || '', s4: this.s4List[i] || '',
        s5: this.s5List[i] || '', s6: this.s6List[i] || '', s7: this.s7List[i] || '', s8: this.s8List[i] || '',
        s9: this.s9List[i] || '', s10: this.s10List[i] || '', s11: this.s11List[i] || '', s12: this.s12List[i] || ''
      });
    }
  }

  ngAfterViewInit(): void {
    this.updateScrollButtons();
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

  isRed(key: string, rowIndex: number): boolean {
    if (key === 's1' || key === 's2') return false;

    const redIndexesMap: { [key: string]: number[] } = {
      s3: [2, 5], s4: [1, 4], s5: [2], s6: [1, 3],
      s7: [1], s8: [1], s9: [0], s10: [0],
      s11: [0], s12: [0]
    };
    return redIndexesMap[key]?.includes(rowIndex) || false;
  }

  isMatching(val: string): boolean {
    if (!this.gatesSearchTerm?.trim() || !val) return false;
    return val.toLowerCase().includes(this.gatesSearchTerm.toLowerCase());
  }

  highlight(text: string): string {
    if (!this.gatesSearchTerm?.trim() || !text) return text;
    const pattern = this.gatesSearchTerm.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    const regex = new RegExp(`(${pattern})`, 'gi');
    return text.replace(regex, '<span class="highlight-text">$1</span>');
  }
}
