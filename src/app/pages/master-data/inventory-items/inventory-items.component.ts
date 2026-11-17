import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddItemComponent } from './add-item/add-item.component';

interface Asset {
  name: string;
  code: string;
  category: string;
  subCategory: string;
  quantity: string;
  unitRate: string;
  description: string;
  status: 'Active' | 'Inactive';
}
@Component({
  selector: 'app-inventory-items',
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
  templateUrl: './inventory-items.component.html',
  styleUrl: './inventory-items.component.scss',
})
export class InventoryItemsComponent {
  constructor(private dialog: MatDialog) {}
  readonly assets: Asset[] = [
    {
        "name": "Organic Stevia & Natural Sweetener Extract",
        "code": "ING-001",
        "category": "Raw Ingredients",
        "subCategory": "Sweeteners & Flavors",
        "quantity": "50 kg",
        "unitRate": "₹3,200/kg",
        "description": "High-purity steviol glycoside for low-calorie beverage formulation",
        "status": "Active"
    },
    {
        "name": "Natural Citrus Terpene & Aroma Emulsion",
        "code": "ING-002",
        "category": "Raw Ingredients",
        "subCategory": "Aromas & Fragrances",
        "quantity": "20 L",
        "unitRate": "₹4,500/L",
        "description": "Cold-pressed food-grade natural citrus essential oil",
        "status": "Active"
    },
    {
        "name": "Microcrystalline Cellulose & Xanthan Gum Stabilizer",
        "code": "ING-003",
        "category": "Raw Ingredients",
        "subCategory": "Hydrocolloids & Texturizers",
        "quantity": "150 kg",
        "unitRate": "₹650/kg",
        "description": "Rheology modifier and suspension aid for liquid nutritionals",
        "status": "Active"
    },
    {
        "name": "Sustainable Recycled PET (rPET) Resin Flakes",
        "code": "PKG-001",
        "category": "Packaging Materials",
        "subCategory": "Rigid Plastics",
        "quantity": "500 kg",
        "unitRate": "₹140/kg",
        "description": "100% PCR food-contact approved bottle preform resin",
        "status": "Active"
    },
    {
        "name": "Multi-Layer High-Barrier Pouches (Al-Free)",
        "code": "PKG-002",
        "category": "Packaging Materials",
        "subCategory": "Flexible Films",
        "quantity": "10,000 pcs",
        "unitRate": "₹4.50/pc",
        "description": "EVOH oxygen-barrier moisture-proof recyclable pouches",
        "status": "Active"
    },
    {
        "name": "Biodegradable Dispensing Caps & Pumps",
        "code": "PKG-003",
        "category": "Packaging Materials",
        "subCategory": "Closures & Dispensers",
        "quantity": "5,000 pcs",
        "unitRate": "₹8.20/pc",
        "description": "Mono-material polyolefin lotion dispenser pumps",
        "status": "Active"
    },
    {
        "name": "Analytical Chromatographic Reference Standards",
        "code": "LAB-001",
        "category": "Laboratory Consumables",
        "subCategory": "Analytical Standards",
        "quantity": "15 vials",
        "unitRate": "₹2,800/vial",
        "description": "Certified vitamin and preservative reference standards",
        "status": "Active"
    },
    {
        "name": "Sensory Panel Tasting Cups & Blind Coding Sets",
        "code": "LAB-002",
        "category": "Laboratory Consumables",
        "subCategory": "Sensory Supplies",
        "quantity": "2,000 sets",
        "unitRate": "₹2.50/set",
        "description": "Food-grade odorless 3-digit randomized evaluation cups",
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

  get filteredAssets(): Asset[] {
    return this.assets.filter((asset) => {
      const keywordMatches =
        !this.searchKeyword ||
        asset.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        asset.code.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || asset.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedAssets(): Asset[] {
    const startIndex = this.pageIndex * this.pageSize;

    return this.filteredAssets.slice(startIndex, startIndex + this.pageSize);
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
    this.dialog.open(AddItemComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;
  }

  onEdit(asset: Asset): void {
    this.dialog.open(AddItemComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        ItemName: asset.name,
        ItemCode: asset.code,
        Category: asset.category,
        SubCategory: asset.subCategory,
        Quantity: asset.quantity,
        UnitRate: asset.unitRate,
        Description: asset.description,
      },
    });
  }
  onDelete(asset: Asset): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: asset });
  }

  onStatusChange(asset: Asset): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        asset.status = asset.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
