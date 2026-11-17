import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface GateColumnHeader {
  key: string;
  label: string;
  subtitle: string;
  programCount?: number;
}

export interface GateRow {
  [key: string]: string;
}

@Component({
  selector: 'app-dashboard-gates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard-gates.component.html',
  styleUrl: './dashboard-gates.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardGatesComponent implements OnInit {
  gatesSearchTerm: string = '';

  readonly gateHeaders: GateColumnHeader[] = [
    { key: 'g1', label: 'Gate 1', subtitle: 'Product Concept Selection', programCount: 10 },
    { key: 'g2', label: 'Gate 2', subtitle: 'Product Concept and Formula Selection', programCount: 10 },
    { key: 'g3', label: 'Gate 3', subtitle: 'Product Concept and Feasibility Approval', programCount: 8 },
    { key: 'g4', label: 'Gate 4', subtitle: 'Consumer Validation and Product Performance Proof', programCount: 7 },
    { key: 'g5', label: 'Gate 5', subtitle: 'Market Launch and Regulatory Affairs & Compliance Readiness', programCount: 6 }
  ];

  readonly g1List: string[] = [
    "New Beverage Product Development Program",
    "Vitamin-Enriched Fruit Beverage 250ml",
    "New Personal Care Product Formulation Development",
    "Premium Personal Care Lotion 200ml",
    "Multi-Variant Snack Product Development",
    "Ready-to-Eat Snack Range 100g",
    "Ingredient Sourcing and Blend Optimization",
    "Low-Sugar Dairy Beverage 200ml",
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Plant-Based Protein Drink 300ml"
  ];

  readonly g2List: string[] = [
    "New Personal Care Product Formulation Development",
    "Premium Personal Care Lotion 200ml",
    "Multi-Variant Snack Product Development",
    "Ready-to-Eat Snack Range 100g",
    "Ingredient Sourcing and Blend Optimization",
    "Low-Sugar Dairy Beverage 200ml",
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Plant-Based Protein Drink 300ml",
    "New Beverage Product Development Program",
    "Vitamin-Enriched Fruit Beverage 250ml"
  ];

  readonly g3List: string[] = [
    "Multi-Variant Snack Product Development",
    "Ready-to-Eat Snack Range 100g",
    "Ingredient Sourcing and Blend Optimization",
    "Low-Sugar Dairy Beverage 200ml",
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Plant-Based Protein Drink 300ml",
    "New Beverage Product Development Program",
    "Vitamin-Enriched Fruit Beverage 250ml"
  ];

  readonly g4List: string[] = [
    "Ingredient Sourcing and Blend Optimization",
    "Low-Sugar Dairy Beverage 200ml",
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Plant-Based Protein Drink 300ml",
    "New Beverage Product Development Program",
    "Vitamin-Enriched Fruit Beverage 250ml",
    "New Personal Care Product Formulation Development"
  ];

  readonly g5List: string[] = [
    "Shelf-Stable Powdered Beverage Product Formulation",
    "Plant-Based Protein Drink 300ml",
    "New Beverage Product Development Program",
    "Vitamin-Enriched Fruit Beverage 250ml",
    "New Personal Care Product Formulation Development",
    "Premium Personal Care Lotion 200ml"
  ];

  gateRows: GateRow[] = [];

  constructor() { }

  ngOnInit(): void {
    const maxLength = Math.max(
      this.g1List.length,
      this.g2List.length,
      this.g3List.length,
      this.g4List.length,
      this.g5List.length
    );

    this.gateRows = Array.from({ length: maxLength }, (_, i) => ({
      g1: this.g1List[i] || '',
      g2: this.g2List[i] || '',
      g3: this.g3List[i] || '',
      g4: this.g4List[i] || '',
      g5: this.g5List[i] || ''
    }));
  }

  isMatching(val: string): boolean {
    if (!this.gatesSearchTerm?.trim() || !val) return false;
    return val.toLowerCase().includes(this.gatesSearchTerm.toLowerCase());
  }

  highlight(text: string): string {
    if (!this.gatesSearchTerm?.trim() || !text) {
      return text;
    }
    const pattern = this.gatesSearchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${pattern})`, 'gi');
    return text.replace(regex, '<span class="highlight-text">$1</span>');
  }
}
