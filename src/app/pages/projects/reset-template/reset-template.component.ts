import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-template',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './reset-template.component.html',
  styleUrl: './reset-template.component.scss',
})
export class ResetTemplateComponent implements OnInit {
  projectName = '';
  selectedTemplate = '';

  readonly templatesList: string[] = [
    'Functional Beverage Development',
    'Personal Care & Cosmetics Platform',
    'Multi-Variant Snack Product Development',
    'Ingredient Sourcing & Blend Optimization',
    'Shelf-Stable Powdered Beverage Formulation',
    'Vitamin-Enriched Fruit Beverage 250ml'
  ];

  constructor(
    private dialogRef: MatDialogRef<ResetTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.projectName =
        this.data.projectName ||
        this.data.project?.productName ||
        this.data.project?.projectCode ||
        'Selected Program';
      this.selectedTemplate =
        this.data.currentTemplate ||
        this.data.project?.template ||
        'Functional Beverage Development';
    } else {
      this.selectedTemplate = 'Functional Beverage Development';
    }
  }

  save(): void {
    this.dialogRef.close({
      confirmed: true,
      selectedTemplate: this.selectedTemplate,
      project: this.data?.project,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
