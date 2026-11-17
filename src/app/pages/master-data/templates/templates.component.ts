import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { RouterLink } from '@angular/router';

interface TemplateItem {
  name: string;
  description: string;
  division: string;
  projectType: string;
  stages: number;
  gates: number;
  deliverables: number;
  activities: number;
  sprint: number;
  buffer: number;
  planEffort?: string;
  planDuration?: string;
  period?: string;
  resources: number;
  budget: string;
  updatedDate: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-templates',
  imports: [
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent {
  constructor(private dialog: MatDialog) {}

  readonly items: TemplateItem[] = [
  {
    "name": "New Beverage Product Development Program",
    "description": "End-to-end beverage NPD covering consumer occasion mapping, benchtop formulation, flavor optimization, shelf-life validation, pilot trials and commercial bottling rollout.",
    "division": "Beverages - BV",
    "projectType": "New Product Development (NPD)",
    "stages": 12,
    "gates": 5,
    "deliverables": 38,
    "activities": 142,
    "sprint": 16,
    "buffer": 45,
    "planEffort": "3,450 hrs",
    "planDuration": "420 days",
    "period": "days",
    "resources": 24,
    "budget": "14,500,000",
    "updatedDate": "02-Sep-2026",
    "status": "Active"
  },
  {
    "name": "Personal Care & Beauty Formulation Platform",
    "description": "Dermatological efficacy testing, sensory skin feel mapping, active emulsion stability, preservative challenge testing and sustainable packaging qualification.",
    "division": "Personal Care & Beauty - PC",
    "projectType": "New Product Development (NPD)",
    "stages": 12,
    "gates": 5,
    "deliverables": 36,
    "activities": 135,
    "sprint": 14,
    "buffer": 40,
    "planEffort": "2,980 hrs",
    "planDuration": "380 days",
    "period": "days",
    "resources": 20,
    "budget": "11,200,000",
    "updatedDate": "28-Aug-2026",
    "status": "Active"
  },
  {
    "name": "Packaged Foods & Snacks Line Extension",
    "description": "Flavor profile extension, sodium/sugar reduction, texture crispness optimization, high-speed flow-wrap trial and FSSAI nutrition labeling compliance.",
    "division": "Packaged Foods & Snacks - FS",
    "projectType": "Line Extension & Variant Expansion",
    "stages": 12,
    "gates": 5,
    "deliverables": 32,
    "activities": 118,
    "sprint": 12,
    "buffer": 35,
    "planEffort": "2,420 hrs",
    "planDuration": "310 days",
    "period": "days",
    "resources": 18,
    "budget": "8,750,000",
    "updatedDate": "25-Aug-2026",
    "status": "Active"
  },
  {
    "name": "Dairy & Nutritional Beverage Program",
    "description": "High-protein dairy formulation, UHT aseptic thermal processing, vitamin fortification premix stability and cold-chain distribution validation.",
    "division": "Dairy & Nutrition - DN",
    "projectType": "New Product Development (NPD)",
    "stages": 12,
    "gates": 5,
    "deliverables": 35,
    "activities": 128,
    "sprint": 15,
    "buffer": 40,
    "planEffort": "3,200 hrs",
    "planDuration": "395 days",
    "period": "days",
    "resources": 22,
    "budget": "13,400,000",
    "updatedDate": "20-Aug-2026",
    "status": "Active"
  },
  {
    "name": "Home Care Eco-Concentrate & Refill Innovation",
    "description": "Bio-surfactant enzyme formulation, concentrated dilutable liquid system, 100% PCR pouch packaging and EPR plastics compliance.",
    "division": "Home Care - HC",
    "projectType": "Packaging Innovation & Sustainability",
    "stages": 12,
    "gates": 5,
    "deliverables": 30,
    "activities": 104,
    "sprint": 12,
    "buffer": 35,
    "planEffort": "2,150 hrs",
    "planDuration": "290 days",
    "period": "days",
    "resources": 16,
    "budget": "7,800,000",
    "updatedDate": "18-Aug-2026",
    "status": "Active"
  },
  {
    "name": "FMCG Product VAVE & Cost Optimization",
    "description": "Alternate ingredient vendor qualification, hydrocolloid replacement, bottle weight reduction and high-speed line changeover optimization.",
    "division": "FMCG Product Innovation - FI",
    "projectType": "Cost Optimization & Value Engineering (VAVE)",
    "stages": 12,
    "gates": 5,
    "deliverables": 26,
    "activities": 88,
    "sprint": 10,
    "buffer": 25,
    "planEffort": "1,650 hrs",
    "planDuration": "240 days",
    "period": "days",
    "resources": 14,
    "budget": "5,200,000",
    "updatedDate": "15-Aug-2026",
    "status": "Active"
  }
];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredItems(): TemplateItem[] {
    return this.items.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        (item.division && item.division.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
        item.projectType.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedItems(): TemplateItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchStatus = this.status;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.searchKeyword = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  onAdd(): void {
    console.log('Add template clicked');
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: TemplateItem): void {
    const dialogRef = this.dialog.open(EditTemplateComponent, {
      width: '600px',
      minWidth:'600px',
      maxHeight: '100vh',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        Object.assign(item, result);
      }
    });
  }

  onDelete(item: TemplateItem): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: item });
  }

  onStatusChange(item: TemplateItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        item.status = item.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
