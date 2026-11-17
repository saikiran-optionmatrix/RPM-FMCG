import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  code: string;
  remarks: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-departments',
  imports: [
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
})
export class DepartmentsComponent {
  constructor(private dialog: MatDialog) {}
  readonly items: MasterItem[] = [
    {
        "name": "Consumer Insights & Strategy",
        "code": "CINS",
        "remarks": "Consumer occasion mapping, trends and category unmet needs",
        "status": "Active"
    },
    {
        "name": "Consumer Research",
        "code": "CRE",
        "remarks": "Focus groups, ethnographic research and quantitative validation",
        "status": "Active"
    },
    {
        "name": "Category Management",
        "code": "CAT",
        "remarks": "Category strategy, pricing architecture and channel assortment",
        "status": "Active"
    },
    {
        "name": "R&D & Product Innovation",
        "code": "RDI",
        "remarks": "Formulation design, recipe development and ingredient blending",
        "status": "Active"
    },
    {
        "name": "Packaging Development",
        "code": "PKG",
        "remarks": "Primary and secondary packaging structural design and barrier testing",
        "status": "Active"
    },
    {
        "name": "Sensory & Consumer Science",
        "code": "SENS",
        "remarks": "Sensory profiling, hedonic evaluations and descriptive analysis",
        "status": "Active"
    },
    {
        "name": "Quality Assurance",
        "code": "QA",
        "remarks": "HACCP, FSSC 22000, supplier audits and quality system governance",
        "status": "Active"
    },
    {
        "name": "Quality Control",
        "code": "QC",
        "remarks": "Analytical release testing, microbiology and physical property verification",
        "status": "Active"
    },
    {
        "name": "Regulatory Affairs & Compliance",
        "code": "REG",
        "remarks": "FSSAI/FDA/EU regulations, label compliances and mandatory disclosures",
        "status": "Active"
    },
    {
        "name": "Pilot & Commercial Manufacturing",
        "code": "MFG",
        "remarks": "Pilot line trials, batch scale-up and commercial plant packaging operations",
        "status": "Active"
    },
    {
        "name": "Supply Chain & Sourcing",
        "code": "SCM",
        "remarks": "Raw ingredient procurement, packaging supplier qualification and logistics",
        "status": "Active"
    },
    {
        "name": "Brand Marketing & Commercialization",
        "code": "MKTG",
        "remarks": "Go-to-market execution, brand positioning and trade launch activation",
        "status": "Active"
    },
    {
        "name": "Finance & Commercialization",
        "code": "FIN",
        "remarks": "Target cost modeling, COGS analysis and financial ROI projections",
        "status": "Active"
    },
    {
        "name": "Environmental Health & Safety",
        "code": "EHS",
        "remarks": "Workplace safety, factory hygiene and environmental sustainability",
        "status": "Active"
    },
    {
        "name": "Legal & Intellectual Property",
        "code": "LEGAL",
        "remarks": "Trademark registration, brand IP protection and contract governance",
        "status": "Active"
    },
    {
        "name": "Program Management Office",
        "code": "PMO",
        "remarks": "Stage-Gate governance, milestone tracking and cross-functional orchestration",
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

  get filteredItems(): MasterItem[] {
    return this.items.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.code.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.remarks.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedItems(): MasterItem[] {
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
    this.dialog.open(AddDepartmentComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: MasterItem): void {
    this.dialog.open(AddDepartmentComponent, {
      width: '800px',
      data: { mode: 'edit', ...item },
    });
  }

  onDelete(item: MasterItem): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: item });
  }

  onStatusChange(item: MasterItem): void {
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
