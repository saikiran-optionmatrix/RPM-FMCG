import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddSectionComponent } from './add-section/add-section.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  code: string;
  department: string;
  remarks: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-sections',
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
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.scss',
})
export class SectionsComponent {
  constructor(private dialog: MatDialog) {}

  readonly departments: string[] = [
    "Consumer Insights & Strategy",
    "Consumer Research",
    "Category Management",
    "R&D & Product Innovation",
    "Packaging Development",
    "Sensory & Consumer Science",
    "Quality Assurance",
    "Quality Control",
    "Regulatory Affairs & Compliance",
    "Pilot & Commercial Manufacturing",
    "Supply Chain & Sourcing",
    "Brand Marketing & Commercialization",
    "Finance & Commercialization",
    "Program Management Office"
];

  readonly items: MasterItem[] = [
    {
        "name": "Consumer Research & Analytics",
        "code": "CRA",
        "department": "Consumer Insights & Strategy",
        "remarks": "Occasion mapping, category white-spaces and consumer behavioral profiling",
        "status": "Active"
    },
    {
        "name": "Formulation & Recipe Development",
        "code": "FRD",
        "department": "R&D & Product Innovation",
        "remarks": "Bench compounding, sensory screening and clean-label ingredient formulation",
        "status": "Active"
    },
    {
        "name": "Packaging Engineering & Materials",
        "code": "PEM",
        "department": "Packaging Development",
        "remarks": "Barrier materials, sustainable substrates, shelf impact and line machinability",
        "status": "Active"
    },
    {
        "name": "Sensory Evaluation & Hedonic Testing",
        "code": "SEHT",
        "department": "Sensory & Consumer Science",
        "remarks": "Blind consumer panels, descriptive sensory profiling and organoleptic testing",
        "status": "Active"
    },
    {
        "name": "Analytical & Microbiology Quality Control",
        "code": "AMQC",
        "department": "Quality Control",
        "remarks": "Chemical assay, preservative efficacy, microbiology and finished goods release",
        "status": "Active"
    },
    {
        "name": "Food Safety & Quality Governance",
        "code": "FSQG",
        "department": "Quality Assurance",
        "remarks": "HACCP, FSSC 22000 compliance, supplier audits and GMP batch records",
        "status": "Active"
    },
    {
        "name": "Pilot Manufacturing & Line Scale-Up",
        "code": "PMLS",
        "department": "Pilot & Commercial Manufacturing",
        "remarks": "Pilot plant trials, filling line qualification and commercial process validation",
        "status": "Active"
    },
    {
        "name": "Regulatory Compliance & Label Claims",
        "code": "RCLC",
        "department": "Regulatory Affairs & Compliance",
        "remarks": "FSSAI/FDA/EU filings, ingredient clearances and packaging artwork substantiation",
        "status": "Active"
    },
    {
        "name": "Strategic Sourcing & Supplier Quality",
        "code": "SSSQ",
        "department": "Supply Chain & Sourcing",
        "remarks": "Raw ingredient vendor qualification, contract packaging and risk mitigation",
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
        (item.department && item.department.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
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
    const dialogRef = this.dialog.open(AddSectionComponent, {
      width: '800px',
      data: { mode: 'add', departments: this.departments },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.SectionName) {
        this.items.unshift({
          name: res.SectionName,
          code: res.SectionCode,
          department: res.Department || this.departments[0],
          remarks: res.Remarks || '',
          status: 'Active',
        });
      }
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: MasterItem): void {
    const dialogRef = this.dialog.open(AddSectionComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        SectionName: item.name,
        SectionCode: item.code,
        Department: item.department,
        Remarks: item.remarks,
        departments: this.departments,
        ...item,
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.SectionName) {
        item.name = res.SectionName;
        item.code = res.SectionCode;
        if (res.Department) {
          item.department = res.Department;
        }
        item.remarks = res.Remarks;
      }
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
